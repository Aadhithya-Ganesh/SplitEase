from app.database import Base
from sqlalchemy import Column, ForeignKey, Numeric, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class BillSplit(Base):
    __tablename__ = "bill_splits"

    bill_id = Column(UUID(as_uuid=True), ForeignKey("bills.id"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)

    amount = Column(Numeric(10, 2), nullable=False)
    is_paid = Column(Boolean, default=False, nullable=False)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # relationships
    bill = relationship("Bill", back_populates="splits")
    user = relationship("Users")
