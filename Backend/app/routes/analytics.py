import asyncio

from fastapi import APIRouter, Depends
from typing import Annotated
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import extract
from decimal import Decimal
from openai import OpenAI

from app.database import get_db
from app.routes.auth import get_current_user

from app.models.users import Users
from app.models.bills import Bill
from app.models.bill_item import BillItem
from app.models.bill_split import BillSplit

from app.schemas.analytics import AnalyticsResponse, AIChatQuestion

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

openai = OpenAI()


@router.post("/info", response_model=AnalyticsResponse)
def get_info(
    month: int,
    group: str,
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):

    query = (
        db.query(
            BillItem.amount,
            BillItem.quantity,
            BillSplit.percentage,
            Bill.created_at,
            Bill.id.label("bill_id"),
        )
        .join(Bill, BillItem.bill_id == Bill.id)
        .join(BillSplit, BillSplit.item_id == BillItem.id)
        .filter(BillSplit.user_id == user.id)
    )

    # Filter by group if not "all"
    if group != "all":
        query = query.filter(Bill.group_id == group)

    # Filter by month if not 0
    if month != 0:
        query = query.filter(extract("month", Bill.created_at) == month)

    rows = query.all()

    total_spend = Decimal("0")
    monthly = {}
    bill_ids = set()

    for r in rows:
        item_total = r.amount * r.quantity
        user_share = item_total * (r.percentage / Decimal("100"))

        total_spend += user_share
        bill_ids.add(r.bill_id)

        m = r.created_at.month
        monthly[m] = monthly.get(m, Decimal("0")) + user_share

    total_bills = len(bill_ids)
    avg_per_bill = total_spend / total_bills if total_bills else Decimal("0")

    monthly_spending = [
        {"month": k, "amount": float(v)} for k, v in sorted(monthly.items())
    ]

    return {
        "total_spend": float(total_spend),
        "total_bills": total_bills,
        "avg_per_bill": float(avg_per_bill),
        "monthly_spending": monthly_spending,
    }


@router.post("/ai-chat")
async def ai_chat(question: AIChatQuestion):

    stream = openai.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": question.question}],
        stream=True,
    )

    async def event_stream():
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
                await asyncio.sleep(0)

    return StreamingResponse(
        event_stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
