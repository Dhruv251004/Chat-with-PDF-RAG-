from flask import Flask
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

app = Flask(__name__)
print(os.getenv("FLASK_ENV"))


@app.route("/")
def hello_world():
    return "<p>Hello,,, World!</p>"
