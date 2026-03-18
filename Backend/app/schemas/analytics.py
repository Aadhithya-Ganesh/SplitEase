from pydantic import BaseModel
from typing import List


class MonthlySpending(BaseModel):
    month: int
    amount: float


class AnalyticsResponse(BaseModel):
    total_spend: float
    total_bills: int
    avg_per_bill: float
    monthly_spending: List[MonthlySpending]


class ChatMessage(BaseModel):
    role: str
    content: str


class AIChatQuestion(BaseModel):
    history: list[ChatMessage]
