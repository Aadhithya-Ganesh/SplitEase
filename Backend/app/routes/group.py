from fastapi import APIRouter
from typing import Annotated, List
from app.models.users import Users
from app.models.groups import Group
from app.models.users_groups import UserGroup
from app.models.bills import Bill
from app.models.bill_split import BillSplit
from fastapi import Depends, HTTPException
from app.routes.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.schemas.group import (
    GroupListItem,
    GroupResponse,
    GroupCreate,
    GroupDetailResponse,
    GroupJoinResponse,
)
from uuid import UUID
from sqlalchemy import func, case

router = APIRouter(prefix="/api/groups", tags=["groups"])


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

    groups = (
        db.query(
            Group.id.label("id"),
            Group.name.label("name"),
            Group.created_by.label("created_by"),
            members_subq.c.members_count,
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillSplit.user_id != user.id)
                            & (BillSplit.is_paid == False),
                            BillSplit.amount,
                        ),
                        (
                            (Bill.paid_by != user.id)
                            & (BillSplit.user_id == user.id)
                            & (BillSplit.is_paid == False),
                            -BillSplit.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("balance"),
        )
        .select_from(Group)
        # membership check (does NOT affect count)
        .join(UserGroup, UserGroup.group_id == Group.id)
        .join(members_subq, members_subq.c.group_id == Group.id)
        .outerjoin(Bill, Bill.group_id == Group.id)
        .outerjoin(BillSplit, BillSplit.bill_id == Bill.id)
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

    user_group = UserGroup(user_id=user.id, group_id=group.id, role="OWNER")

    db.add(user_group)
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

    existing = (
        db.query(UserGroup)
        .filter(
            UserGroup.user_id == user.id,
            UserGroup.group_id == group.id,
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=409, detail="Already a member")

    user_group = UserGroup(
        user_id=user.id,
        group_id=group.id,
        role="MEMBER",
    )

    db.add(user_group)
    db.commit()

    return {
        "group_id": group.id,
        "group_name": group.name,
        "role": user_group.role,
    }


@router.get("/{group_id}", response_model=GroupDetailResponse)
async def get_group_by_id(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    group_id: UUID,
):
    # -----------------------------
    # 1. Check access
    # -----------------------------
    group = (
        db.query(Group)
        .join(UserGroup, UserGroup.group_id == Group.id)
        .filter(
            Group.id == group_id,
            UserGroup.user_id == user.id,
        )
        .first()
    )

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # -----------------------------
    # 2. Members count
    # -----------------------------
    members_count = (
        db.query(func.count(UserGroup.user_id))
        .filter(UserGroup.group_id == group_id)
        .scalar()
    )

    # -----------------------------
    # 3. Bills count
    # -----------------------------
    bills_count = (
        db.query(func.count(Bill.id)).filter(Bill.group_id == group_id).scalar()
    )

    # -----------------------------
    # 4. Group balance (FIXED)
    # -----------------------------
    balance = (
        db.query(
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillSplit.user_id != user.id)
                            & (BillSplit.is_paid == False),
                            BillSplit.amount,
                        ),
                        (
                            (Bill.paid_by != user.id)
                            & (BillSplit.user_id == user.id)
                            & (BillSplit.is_paid == False),
                            -BillSplit.amount,
                        ),
                    )
                ),
                0,
            )
        )
        .select_from(Bill)  # 🔥 REQUIRED
        .join(BillSplit, BillSplit.bill_id == Bill.id)
        .filter(Bill.group_id == group_id)
        .scalar()
    )

    # -----------------------------
    # 5. Bills list
    # -----------------------------
    bills = (
        db.query(
            Bill.id,
            Bill.title,
            Bill.total_amount,
            Bill.created_at,
            Users.fullname.label("paid_by"),
            func.count(case((BillSplit.is_paid == False, 1))).label("pending_count"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillSplit.user_id != user.id)
                            & (BillSplit.is_paid == False),
                            BillSplit.amount,
                        ),
                        (
                            (Bill.paid_by != user.id)
                            & (BillSplit.user_id == user.id)
                            & (BillSplit.is_paid == False),
                            -BillSplit.amount,
                        ),
                    )
                ),
                0,
            ).label("user_balance"),
        )
        .select_from(Bill)  # 🔥 ALSO REQUIRED
        .join(Users, Users.id == Bill.paid_by)
        .join(BillSplit, BillSplit.bill_id == Bill.id)
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
        raise HTTPException(
            status_code=403,
            detail="Only group owner can update group name",
        )

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
        raise HTTPException(
            status_code=403,
            detail="Only group owner can delete group",
        )

    db.delete(group)
    db.commit()
