from app import init_flask_app
from dotenv import load_dotenv

# Load env variables
load_dotenv()


# Start the application

app = init_flask_app()


@app.route('/')
def hello_world():
    return "<h1>Hello world</h1>"
