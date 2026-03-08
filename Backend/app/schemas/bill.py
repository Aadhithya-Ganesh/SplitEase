from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List
from app.schemas.bill_item import BillItemResponse
from app.schemas.bill_split import UserBillResponse


class BillCreate(BaseModel):
    group_id: UUID
    paid_by: UUID
    total_amount: float


class BillResponse(BaseModel):
    id: UUID
    group_id: UUID
    paid_by: UUID
    total_amount: float
    created_at: datetime

    class Config:
        orm_mode = True


class BillDetailResponse(BillResponse):
    items: List[BillItemResponse]
    splits: List[UserBillResponse]


class ParticipantSplit(BaseModel):
    user_id: UUID
    percentage: float


class BillItemCreate(BaseModel):
    name: str
    amount: float
    quantity: int
    split_mode: str
    participants: List[ParticipantSplit]


class CreateBillRequest(BaseModel):
    group_id: UUID
    title: str
    items: List[BillItemCreate]
