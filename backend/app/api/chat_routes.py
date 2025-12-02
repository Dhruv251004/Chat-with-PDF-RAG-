from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Chat, Conversation
from app.services.vector_service import create_vector_store
from app.services.rag_service import query_llm
chat_bp = Blueprint('chat', __name__)


@chat_bp.route("/create", methods=['POST'])
def create_chat():
    try:
        if len(request.files) == 0:
            raise Exception("No pdf found")
        pdf = request.files['chat_pdf']
        pdf_bytes = pdf.read()

        # 1. Create the Object
        new_chat = Chat(title=pdf.filename)
        db.session.add(new_chat)

        # 2. FLUSH: This generates the ID without finalizing the transaction
        db.session.flush()

        # Now 'new_chat.id' is valid (e.g., 55), so we can use it
        chat_id = new_chat.id

        # 3. Call Vector Service (The risky operation)
        # Pass the file stream and the ID
        create_vector_store(pdf_bytes, chat_id)

        # 4. Success? Now make it permanent
        db.session.commit()

        return jsonify({"message": "Chat created", "chat_id": chat_id}), 201

    except Exception as e:
        # 5. Rollback: If vector creation failed, undo the DB insert
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@chat_bp.route('/query/<chat_id>', methods=['POST'])
def handle_query(chat_id):
    try:
        data = request.get_json()
        query = data.get('query')

        if not query:
            return jsonify({"error": "Query is required"}), 400

        # --- STEP 1: SAVE USER MESSAGE IMMEDIATELY ---
        # We do this BEFORE calling the LLM.
        # If the LLM crashes, we still have the user's input saved in history.
        user_msg = Conversation(
            chat_id=chat_id,
            sender='user',
            content=query
        )
        db.session.add(user_msg)
        db.session.commit()  # Commit now to secure the data

        # --- STEP 2: CALL LLM (The Slow/Risky Part) ---
        response_text = query_llm(query=query, chat_id=chat_id)

        # --- STEP 3: SAVE AI RESPONSE ---
        ai_msg = Conversation(
            chat_id=chat_id,
            sender='assistant',
            content=response_text
        )
        db.session.add(ai_msg)
        db.session.commit()

        return jsonify({
            "response": response_text,
            "user_message_id": user_msg.id,
            "ai_message_id": ai_msg.id
        }), 200

    except Exception as e:
        # If LLM fails, we return a JSON error (not HTML 500 page)
        # The user's message is ALREADY saved, so the frontend can show "Retry" button
        return jsonify({"error": str(e)}), 500


@chat_bp.route('/<chat_id>', methods=['GET'])
def get_chat_history(chat_id):
    """ Fetches all chats """
    chat = Chat.query.filter_by(id=chat_id).first()

    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    conversations = chat.conversations
    sorted(conversations, key=lambda c: c.created_at)

    return jsonify(
        {
            "messages": [
                {
                    "id": conv.id,
                    "sender": conv.sender,
                    "content": conv.content,
                    "created_at": conv.created_at
                }
                for conv in conversations
            ]
        }
    )
