from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated, List
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import func, case, cast, Numeric

from app.database import get_db
from app.routes.auth import get_current_user

from app.models.users import Users
from app.models.groups import Group
from app.models.users_groups import UserGroup
from app.models.bills import Bill
from app.models.bill_item import BillItem
from app.models.bill_split import BillSplit
from app.models.bill_payments import BillPayment

from app.schemas.group import (
    GroupListItem,
    GroupResponse,
    GroupCreate,
    GroupDetailResponse,
    GroupJoinResponse,
)

router = APIRouter(prefix="/api/groups", tags=["groups"])


def item_share_amount():
    return cast(
        (BillItem.amount * BillItem.quantity) * BillSplit.percentage / 100,
        Numeric(10, 2),
    )


@router.get("", response_model=List[GroupListItem])
async def get_groups_of_user(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    members_subq = (
        db.query(
            UserGroup.group_id,
            func.count(UserGroup.user_id).label("members_count"),
        )
        .group_by(UserGroup.group_id)
        .subquery()
    )

    share = item_share_amount()

    groups = (
        db.query(
            Group.id.label("id"),
            Group.name.label("name"),
            Group.created_by.label("created_by"),
            members_subq.c.members_count,
            func.coalesce(
                func.sum(
                    case(
                        # you paid → others unpaid → they owe you
                        (
                            (Bill.paid_by == user.id)
                            & (BillPayment.is_paid == False)
                            & (BillPayment.user_id != user.id),
                            share,
                        ),
                        # someone else paid → you unpaid → you owe them
                        (
                            (Bill.paid_by != user.id)
                            & (BillPayment.is_paid == False)
                            & (BillPayment.user_id == user.id),
                            -share,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("balance"),
        )
        .select_from(Group)
        .join(UserGroup, UserGroup.group_id == Group.id)
        .join(members_subq, members_subq.c.group_id == Group.id)
        .outerjoin(Bill, Bill.group_id == Group.id)
        .outerjoin(BillPayment, BillPayment.bill_id == Bill.id)
        .outerjoin(BillSplit, BillSplit.bill_id == Bill.id)
        .outerjoin(BillItem, BillItem.id == BillSplit.item_id)
        .filter(UserGroup.user_id == user.id)
        .group_by(
            Group.id,
            Group.name,
            Group.created_by,
            members_subq.c.members_count,
        )
    )

    return groups.all()


@router.post("/create_group", response_model=GroupResponse)
async def create_group(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    payload: GroupCreate,
):
    group = Group(name=payload.name, created_by=user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    db.add(UserGroup(user_id=user.id, group_id=group.id, role="OWNER"))
    db.commit()

    return group


@router.post("/join_group/{group_id}", response_model=GroupJoinResponse)
async def join_group(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    group_id: UUID,
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    exists = (
        db.query(UserGroup)
        .filter(UserGroup.user_id == user.id, UserGroup.group_id == group.id)
        .first()
    )

    if exists:
        raise HTTPException(status_code=409, detail="Already a member")

    db.add(UserGroup(user_id=user.id, group_id=group.id, role="MEMBER"))
    db.commit()

    return {
        "group_id": group.id,
        "group_name": group.name,
        "role": "MEMBER",
    }


@router.get("/{group_id}", response_model=GroupDetailResponse)
async def get_group_by_id(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    group_id: UUID,
):
    group = (
        db.query(Group)
        .join(UserGroup)
        .filter(Group.id == group_id, UserGroup.user_id == user.id)
        .first()
    )

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    members_count = (
        db.query(func.count(UserGroup.user_id))
        .filter(UserGroup.group_id == group_id)
        .scalar()
    )

    bills_count = (
        db.query(func.count(Bill.id)).filter(Bill.group_id == group_id).scalar()
    )

    share = item_share_amount()

    balance = (
        db.query(
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillPayment.is_paid == False)
                            & (BillPayment.user_id != user.id),
                            share,
                        ),
                        (
                            (Bill.paid_by != user.id)
                            & (BillPayment.is_paid == False)
                            & (BillPayment.user_id == user.id),
                            -share,
                        ),
                        else_=0,
                    )
                ),
                0,
            )
        )
        .select_from(Bill)
        .join(BillPayment, BillPayment.bill_id == Bill.id)
        .join(BillSplit, BillSplit.bill_id == Bill.id)
        .join(BillItem, BillItem.id == BillSplit.item_id)
        .filter(Bill.group_id == group_id)
        .scalar()
    )

    bills = (
        db.query(
            Bill.id,
            Bill.title,
            Bill.total_amount,
            Bill.created_at,
            Users.fullname.label("paid_by"),
            # ✅ FIXED pending count
            func.count(
                func.distinct(case((BillPayment.is_paid == False, BillPayment.user_id)))
            ).label("pending_count"),
            # user balance (still from splits)
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillPayment.is_paid == False)
                            & (BillPayment.user_id != user.id),
                            share,
                        ),
                        (
                            (Bill.paid_by != user.id)
                            & (BillPayment.is_paid == False)
                            & (BillPayment.user_id == user.id),
                            -share,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("user_balance"),
        )
        .select_from(Bill)
        .join(Users, Users.id == Bill.paid_by)
        .join(BillPayment, BillPayment.bill_id == Bill.id)
        .join(BillSplit, BillSplit.bill_id == Bill.id)
        .join(BillItem, BillItem.id == BillSplit.item_id)
        .filter(Bill.group_id == group_id)
        .group_by(Bill.id, Users.fullname)
        .all()
    )

    return {
        "id": group.id,
        "name": group.name,
        "members_count": members_count,
        "bills_count": bills_count,
        "balance": balance,
        "bills": bills,
    }


@router.put("/{group_id}", response_model=GroupResponse)
async def update_group_name(
    group_id: UUID,
    payload: GroupCreate,
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    group = (
        db.query(Group)
        .join(UserGroup)
        .filter(
            Group.id == group_id,
            UserGroup.user_id == user.id,
            UserGroup.role == "OWNER",
        )
        .first()
    )

    if not group:
        raise HTTPException(status_code=403, detail="Only owner can update group")

    group.name = payload.name  # type: ignore
    db.commit()
    db.refresh(group)

    return group


@router.delete("/{group_id}", status_code=204)
async def delete_group(
    group_id: UUID,
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    group = (
        db.query(Group)
        .join(UserGroup)
        .filter(
            Group.id == group_id,
            UserGroup.user_id == user.id,
            UserGroup.role == "OWNER",
        )
        .first()
    )

    if not group:
        raise HTTPException(status_code=403, detail="Only owner can delete group")

    db.delete(group)
    db.commit()
