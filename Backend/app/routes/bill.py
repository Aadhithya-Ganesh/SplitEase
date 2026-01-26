from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from datetime import datetime

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.schemas.bill_split import UpdateBillSplitsRequest
from app.schemas.bill_item import BillReviewResponse
from app.database import get_db
from app.routes.auth import get_current_user

from app.models.users import Users
from app.models.bills import Bill
from app.models.bill_item import BillItem
from app.models.bill_split import BillSplit
from app.models.bill_payments import BillPayment

router = APIRouter(prefix="/api/bills", tags=["bill"])


# --------------------------------------------------
# GET BILL REVIEW
# --------------------------------------------------
@router.get("/{bill_id}/review", response_model=BillReviewResponse)
async def get_bill_review(
    bill_id: UUID,
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    # ---------------- BILL ----------------
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # ---------------- ITEMS ----------------
    items = db.query(BillItem).filter(BillItem.bill_id == bill_id).all()

    # ---------------- SPLITS ----------------
    splits = db.query(BillSplit).filter(BillSplit.bill_id == bill_id).all()

    # group splits by item
    splits_by_item: dict[UUID, list[BillSplit]] = {}
    for s in splits:
        splits_by_item.setdefault(s.item_id, []).append(s)  # type: ignore

    # ---------------- ITEM TOTALS + PAYLOAD ----------------
    item_totals: dict[UUID, float] = {}

    items_payload = []

    for item in items:
        total = float(item.amount) * item.quantity  # type: ignore
        item_totals[item.id] = total  # type: ignore

        items_payload.append(
            {
                "id": str(item.id),
                "name": item.name,
                "quantity": item.quantity,
                "price": float(item.amount),  # type: ignore
                "total": round(total, 2),  # type: ignore
                "split_mode": item.split_mode,
                "participants": [
                    {
                        "user_id": str(s.user_id),
                        "percentage": float(s.percentage),
                    }
                    for s in splits_by_item.get(item.id, [])  # type: ignore
                ],
            }
        )

    # ---------------- MEMBER TOTALS ----------------
    member_totals: dict[UUID, float] = {}

    for s in splits:
        item_total = item_totals.get(s.item_id, 0)  # type: ignore
        share = item_total * (float(s.percentage) / 100)  # type: ignore

        member_totals[s.user_id] = member_totals.get(s.user_id, 0) + share  # type: ignore

    # ---------------- PAYMENTS ----------------
    payments = {
        p.user_id: p
        for p in db.query(BillPayment).filter(BillPayment.bill_id == bill_id).all()
    }

    # ---------------- USERS ----------------
    users = (
        db.query(Users)
        .join(BillSplit, BillSplit.user_id == Users.id)
        .filter(BillSplit.bill_id == bill_id)
        .distinct()
        .all()
    )

    members_payload = []
    for u in users:
        payment = payments.get(u.id)

        members_payload.append(
            {
                "id": str(u.id),
                "name": u.fullname,
                "amount": round(member_totals.get(u.id, 0), 2),  # type: ignore
                "is_paid": payment.is_paid if payment else False,
                "role": "payer" if u.id == bill.paid_by else "member",  # type: ignore
            }
        )

    # ---------------- RESPONSE ----------------
    return {
        "id": str(bill.id),
        "title": bill.title,
        "paid_by": {
            "id": str(bill.paid_by),
            "name": db.query(Users.fullname).filter(Users.id == bill.paid_by).scalar(),
        },
        "items": items_payload,
        "members": members_payload,
    }


# --------------------------------------------------
# TOGGLE BILL PAYMENT
# --------------------------------------------------
@router.put("/{bill_id}/payments/{user_id}")
async def toggle_bill_payment(
    bill_id: UUID,
    user_id: UUID,
    current_user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    payment = (
        db.query(BillPayment)
        .filter(
            BillPayment.bill_id == bill_id,
            BillPayment.user_id == user_id,
        )
        .first()
    )

    if not payment:
        payment = BillPayment(
            bill_id=bill_id,
            user_id=user_id,
            is_paid=True,
            paid_at=datetime.utcnow(),
        )
        db.add(payment)
    else:
        payment.is_paid = not payment.is_paid  # type: ignore
        payment.paid_at = datetime.utcnow() if payment.is_paid else None  # type: ignore

    db.commit()

    return {
        "bill_id": str(bill_id),
        "user_id": str(user_id),
        "is_paid": payment.is_paid,
    }


@router.post("/{bill_id}/splits/save")
async def update_bill_splits(
    bill_id: UUID,
    payload: UpdateBillSplitsRequest,
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    # ---------------- BILL ----------------
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # only payer can edit
    if bill.paid_by != user.id:  # type: ignore
        raise HTTPException(status_code=403, detail="Not allowed")

    # ---------------- PROCESS ITEMS ----------------
    for item in payload.items:
        db_item = (
            db.query(BillItem)
            .filter(
                BillItem.id == item.id,
                BillItem.bill_id == bill_id,
            )
            .first()
        )

        if not db_item:
            raise HTTPException(
                status_code=404,
                detail=f"Item {item.id} not found",
            )

        # ✅ UPDATE SPLIT MODE
        db_item.split_mode = item.split_mode  # type: ignore

        # ✅ VALIDATE PERCENTAGES
        total = round(sum(p.percentage for p in item.participants), 2)
        if total != 100:
            raise HTTPException(
                status_code=400,
                detail=f"Percentages for item {item.id} must total 100",
            )

        # ✅ CLEAR OLD SPLITS
        db.execute(
            delete(BillSplit).where(
                BillSplit.bill_id == bill_id,
                BillSplit.item_id == item.id,
            )
        )

        # ✅ INSERT NEW SPLITS
        for p in item.participants:
            db.add(
                BillSplit(
                    bill_id=bill_id,
                    item_id=item.id,
                    user_id=p.user_id,
                    percentage=p.percentage,
                )
            )

    db.commit()

    return {"status": "ok"}
