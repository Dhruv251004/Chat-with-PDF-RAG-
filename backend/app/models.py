from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime
from sqlalchemy import func


class Chat(db.Model):
    __tablename__ = "chats"
    id: Mapped[str] = mapped_column(
        primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    title: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False
    )
    # one chat → many conversations
    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="chat",
        cascade="all, delete-orphan"
    )


class Conversation(db.Model):
    __tablename__ = "conversations"
    id: Mapped[str] = mapped_column(
        primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    chat_id: Mapped[str] = mapped_column(db.ForeignKey("chats.id"))

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False
    )

    sender: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    chat: Mapped["Chat"] = relationship(back_populates="conversations")
