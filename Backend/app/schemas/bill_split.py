from pydantic import BaseModel
from uuid import UUID
from typing import List


class UserBillCreate(BaseModel):
    user_id: UUID
    amount: float


class UserBillResponse(BaseModel):
    user_id: UUID
    bill_id: UUID
    amount: float
    is_paid: bool

    class Config:
        orm_mode = True


class SplitParticipant(BaseModel):
    user_id: UUID
    percentage: float


class ItemSplitUpdate(BaseModel):
    id: UUID
    participants: List[SplitParticipant]
    split_mode: str  # e.g., "equal", "custom"


class UpdateBillSplitsRequest(BaseModel):
    items: List[ItemSplitUpdate]
