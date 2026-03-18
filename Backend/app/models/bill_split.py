import uuid

from app.database import Base
from sqlalchemy import Column, ForeignKey, Numeric, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class BillSplit(Base):
    __tablename__ = "bill_splits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    bill_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bills.id", ondelete="CASCADE"),
        nullable=False,
    )

    item_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bill_items.id", ondelete="CASCADE"),
        nullable=True,  # important
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # percentage of THIS ITEM
    percentage = Column(Numeric(5, 2), nullable=False)

    bill = relationship("Bill", back_populates="splits")
    item = relationship("BillItem", back_populates="splits")
    user = relationship("Users")

    __table_args__ = (
        CheckConstraint(
            "percentage >= 0 AND percentage <= 100",
            name="percentage_range",
        ),
    )
