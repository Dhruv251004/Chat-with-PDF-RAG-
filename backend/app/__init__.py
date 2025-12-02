from flask import Flask
from app.extensions import db, migrate, cors
from flask_cors import CORS


def init_flask_app():

    # Main Flask application
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydb.sqlite3'
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    # models
    from app.models import Chat, Conversation

    # chat routes
    from app.api.chat_routes import chat_bp

    app.register_blueprint(chat_bp, url_prefix='/api/chat')

    return app
