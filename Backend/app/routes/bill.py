from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from app.models.users import Users
from app.routes.auth import get_current_user
from uuid import UUID
from app.models.bills import Bill
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.bill_item import BillItem
from app.models.bill_split import BillSplit

router = APIRouter(prefix="/api/bills", tags=["bill"])


@router.get("/{bill_id}")
async def get_bill_by_id(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    bill_id: UUID,
):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # 🔹 Items
    items = (
        db.query(
            BillItem.id,
            BillItem.name,
            BillItem.quantity,
            BillItem.amount.label("price"),
        )
        .filter(BillItem.bill_id == bill_id)
        .all()
    )

    # 🔹 Members & splits
    members = (
        db.query(
            Users.id,
            Users.fullname,
            BillSplit.amount,
            BillSplit.is_paid,
            Bill.paid_by,
        )
        .join(BillSplit, BillSplit.user_id == Users.id)
        .join(Bill, Bill.id == BillSplit.bill_id)
        .filter(Bill.id == bill_id)
        .all()
    )

    return {
        "id": str(bill.id),
        "title": bill.title,
        "total_amount": float(bill.total_amount),  # type: ignore
        "paid_by": {
            "id": str(bill.paid_by),
            "name": db.query(Users.fullname).filter(Users.id == bill.paid_by).scalar(),
        },
        "members": [
            {
                "id": str(m.id),
                "name": m.fullname,
                "amount": float(m.amount),
                "is_paid": m.is_paid,
                "role": "payer" if m.id == bill.paid_by else "member",
            }
            for m in members
        ],
        "items": [
            {
                "id": str(i.id),
                "name": i.name,
                "quantity": i.quantity,
                "price": float(i.price),
            }
            for i in items
        ],
    }
