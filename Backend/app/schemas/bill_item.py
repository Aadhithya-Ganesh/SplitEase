from typing_extensions import Literal
from pydantic import BaseModel
from uuid import UUID


class BillItemCreate(BaseModel):
    name: str
    price: float
    quantity: int = 1


class BillItemResponse(BaseModel):
    id: UUID
    bill_id: UUID
    name: str
    price: float
    quantity: int

    class Config:
        orm_mode = True


class PaidByResponse(BaseModel):
    id: UUID
    name: str


class ItemParticipantResponse(BaseModel):
    user_id: UUID
    percentage: float


class BillItemReviewResponse(BaseModel):
    id: UUID
    name: str
    quantity: int
    price: float
    total: float
    split_mode: str
    participants: list[ItemParticipantResponse]


class BillMemberReviewResponse(BaseModel):
    id: UUID
    name: str
    amount: float
    is_paid: bool
    role: Literal["payer", "member"]


class BillReviewResponse(BaseModel):
    id: UUID
    title: str
    paid_by: PaidByResponse
    items: list[BillItemReviewResponse]
    members: list[BillMemberReviewResponse]
