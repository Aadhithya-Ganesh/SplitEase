from app.database import Base
from sqlalchemy import Column, ForeignKey, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class BillPayment(Base):
    __tablename__ = "bill_payments"

    bill_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bills.id", ondelete="CASCADE"),
        primary_key=True,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    is_paid = Column(Boolean, default=False, nullable=False)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    bill = relationship("Bill", back_populates="payments")
    user = relationship("Users")
