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
