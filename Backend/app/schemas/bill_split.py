from pydantic import BaseModel
from uuid import UUID

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
