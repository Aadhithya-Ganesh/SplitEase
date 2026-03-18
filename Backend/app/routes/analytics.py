import asyncio

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import Numeric, case, extract, cast, func, or_, text
from decimal import Decimal
from openai import OpenAI
from typing import Annotated

from app.utils.openai_config import (
    get_explanation_system_prompt,
    get_query_system_prompt,
)
from app.database import get_db
from app.routes.auth import get_current_user

from app.models.users import Users
from app.models.bills import Bill
from app.models.bill_item import BillItem
from app.models.bill_split import BillSplit
from app.models.bill_payments import BillPayment
from app.models.users_groups import UserGroup
from datetime import datetime

from app.schemas.analytics import AnalyticsResponse, AIChatQuestion

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

openai = OpenAI()


def item_share_amount():
    return cast(
        case(
            (
                BillSplit.item_id.isnot(None),
                (BillItem.amount * BillItem.quantity) * BillSplit.percentage / 100,
            ),
            else_=(Bill.total_amount * BillSplit.percentage / 100),
        ),
        Numeric(10, 2),
    )


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
            Bill.total_amount,
            BillSplit.item_id,
        )
        .join(Bill, BillSplit.bill_id == Bill.id)
        .outerjoin(BillItem, BillItem.id == BillSplit.item_id)
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
        if r.item_id is None:
            # manual bill
            item_total = r.total_amount
        else:
            # scanned item
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
async def ai_chat(
    payload: AIChatQuestion,
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):

    # -----------------------------
    # 1️⃣ Generate SQL from question
    # -----------------------------
    sql_messages = [
        {
            "role": "system",
            "content": get_query_system_prompt(user.id, datetime.now()),
        }
    ]

    sql_messages.extend(
        {"role": msg.role, "content": msg.content} for msg in payload.history
    )

    sql_response = openai.chat.completions.create(
        model="gpt-5-mini",
        messages=sql_messages,
    )

    sql = sql_response.choices[0].message.content.strip()  # type: ignore

    # remove markdown if model returns ```sql
    sql = sql.replace("```sql", "").replace("```", "").strip()

    # basic safety check
    if not sql.lower().startswith("select"):
        raise HTTPException(status_code=400, detail="Only SELECT queries allowed")

    # -----------------------------
    # 2️⃣ Execute SQL
    # -----------------------------
    result = db.execute(text(sql))
    rows = result.fetchall()

    db_records = [dict(row._mapping) for row in rows]

    # -----------------------------
    # 3️⃣ Generate explanation
    # -----------------------------
    explanation_messages = [
        {
            "role": "system",
            "content": get_explanation_system_prompt(user.id, datetime.now()),
        },
        {
            "role": "user",
            "content": payload.history[-1].content,  # user's latest question
        },
        {
            "role": "assistant",
            "content": f"Database result: {db_records}",
        },
    ]

    stream = openai.chat.completions.create(
        model="gpt-5-mini",
        messages=explanation_messages,
        stream=True,
    )

    # -----------------------------
    # 4️⃣ Stream response to client
    # -----------------------------
    async def event_stream():
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
                await asyncio.sleep(0)

    return StreamingResponse(
        event_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/dashboard")
def get_dashboard_data(
    user: Annotated[Users, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    share = item_share_amount()

    # ---------------- YOU OWE / YOU ARE OWED ----------------
    balances = (
        db.query(
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillSplit.user_id != user.id)
                            & (BillPayment.is_paid == False),
                            share,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("owed_to_you"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by != user.id)
                            & (BillSplit.user_id == user.id)
                            & (BillPayment.is_paid == False),
                            share,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("you_owe"),
        )
        .select_from(Bill)
        .join(BillSplit, BillSplit.bill_id == Bill.id)
        .outerjoin(BillItem, BillItem.id == BillSplit.item_id)
        .outerjoin(
            BillPayment,
            (BillPayment.bill_id == Bill.id)
            & (BillPayment.user_id == BillSplit.user_id),
        )
        .first()
    )

    print("balances:", balances)

    you_are_owed = float(balances.owed_to_you)  # type: ignore
    you_owe = float(balances.you_owe)  # type: ignore

    net_balance = you_are_owed - you_owe

    # ---------------- PENDING SETTLEMENTS ----------------
    pending_settlements = (
        db.query(func.count())
        .select_from(BillPayment)
        .filter(BillPayment.user_id == user.id, BillPayment.is_paid == False)
        .scalar()
    )

    rows = (
        db.query(
            Bill.id,
            Bill.title,
            Bill.created_at,
            Bill.group_id,
            Bill.total_amount,
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Bill.paid_by == user.id)
                            & (BillSplit.user_id != user.id)
                            & (BillPayment.is_paid == False),
                            share,
                        ),
                        (
                            (Bill.paid_by != user.id)
                            & (BillSplit.user_id == user.id)
                            & (BillPayment.is_paid == False),
                            -share,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("balance"),
        )
        .select_from(Bill)
        .join(BillSplit, BillSplit.bill_id == Bill.id)
        .outerjoin(BillItem, BillItem.id == BillSplit.item_id)
        .outerjoin(
            BillPayment,
            (BillPayment.bill_id == Bill.id)
            & (BillPayment.user_id == BillSplit.user_id),
        )
        .filter(
            or_(
                Bill.paid_by == user.id,
                BillSplit.user_id == user.id,
            )
        )
        .group_by(Bill.id)
        .order_by(Bill.created_at.desc())
        .limit(3)
        .all()
    )

    recent_bills = [
        {
            "id": r.id,
            "title": r.title,
            "created_at": r.created_at,
            "total_amount": float(r.total_amount),
            "balance": float(r.balance),
            "group_id": r.group_id,
        }
        for r in rows
    ]

    # ---------------- QUICK STATS ----------------
    total_groups = (
        db.query(func.count(UserGroup.group_id))
        .filter(UserGroup.user_id == user.id)
        .scalar()
    )

    total_bills = (
        db.query(func.count(Bill.id))
        .join(UserGroup, UserGroup.group_id == Bill.group_id)
        .filter(UserGroup.user_id == user.id)
        .scalar()
    )

    total_spent = (
        db.query(
            func.coalesce(
                func.sum(item_share_amount()),
                0,
            )
        )
        .select_from(Bill)
        .join(BillSplit, BillSplit.bill_id == Bill.id)
        .outerjoin(BillItem, BillItem.id == BillSplit.item_id)
        .filter(BillSplit.user_id == user.id)
        .scalar()
    )

    return {
        "you_are_owed": you_are_owed,
        "you_owe": you_owe,
        "net_balance": net_balance,
        "pending_settlements": pending_settlements,
        "recent_bills": recent_bills,
        "quick_stats": {
            "total_groups": total_groups,
            "total_bills": total_bills,
            "total_spent": float(total_spent),
        },
    }
