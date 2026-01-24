from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from sqlalchemy.orm import Session

from app.database import get_db
from app.routes.auth import get_current_user
from app.models.users import Users
from app.models.bills import Bill
from app.models.bill_item import BillItem
from app.models.users_groups import UserGroup
from app.models.bill_split import BillSplit

from app.schemas.items import ItemResponse, ItemCreate, ItemUpdate
from typing import Annotated

router = APIRouter(prefix="/api/items", tags=["items"])


@router.post("", response_model=ItemResponse)
async def add_item(
    payload: ItemCreate,
    current_user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    # -----------------------------
    # 1. Validate bill
    # -----------------------------
    bill = db.query(Bill).filter(Bill.id == payload.bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # -----------------------------
    # 2. Create item
    # -----------------------------
    item = BillItem(
        bill_id=payload.bill_id,
        name=payload.name,
        amount=payload.amount,
        quantity=payload.quantity,
    )

    db.add(item)
    db.flush()  # 🔥 get item.id WITHOUT committing yet

    # -----------------------------
    # 3. Get bill members
    # -----------------------------
    members = (
        db.query(Users.id)
        .join(UserGroup, UserGroup.user_id == Users.id)
        .filter(UserGroup.group_id == bill.group_id)
        .all()
    )

    if not members:
        raise HTTPException(status_code=400, detail="No members found for bill")

    # -----------------------------
    # 4. Equal split percentages
    # -----------------------------
    count = len(members)
    base_percentage = round(100 / count, 2)

    # fix floating remainder (e.g. 33.33 * 3 = 99.99)
    percentages = [base_percentage] * count
    percentages[-1] += round(100 - sum(percentages), 2)

    # -----------------------------
    # 5. Insert bill_splits
    # -----------------------------
    splits = []
    for (member,), pct in zip(members, percentages):
        splits.append(
            BillSplit(
                bill_id=bill.id,
                item_id=item.id,
                user_id=member,
                percentage=pct,
            )
        )

    db.add_all(splits)

    # -----------------------------
    # 6. Commit once
    # -----------------------------
    db.commit()
    db.refresh(item)

    return item


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: UUID,
    payload: ItemUpdate,
    current_user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    item = db.query(BillItem).filter(BillItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if payload.amount is not None:
        item.amount = payload.amount  # type: ignore
    if payload.quantity is not None:
        item.quantity = payload.quantity  # type: ignore

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: UUID,
    current_user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    item = db.query(BillItem).filter(BillItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
