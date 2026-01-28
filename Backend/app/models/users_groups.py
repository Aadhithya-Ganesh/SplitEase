from app.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime


class UserGroup(Base):
    __tablename__ = "users_groups"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), primary_key=True)

    role = Column(String(20), default="MEMBER", nullable=False)
    joined_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # relationships
    user = relationship("Users", back_populates="groups")
    group = relationship("Group", back_populates="members")
