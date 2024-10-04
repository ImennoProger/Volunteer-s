from sqlalchemy.orm import Session
from models import ChatMessage

def save_message_to_db(sender_id, recipient_id, message, db: Session):
    new_message = ChatMessage(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=message,
        delivered=False
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

def get_undelivered_messages(user_id, db: Session):
    return db.query(ChatMessage).filter_by(recipient_id=user_id, delivered=False).all()
