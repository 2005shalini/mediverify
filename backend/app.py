from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {
        "message": "Welcome to MediVerify Backend 🚀"
    }

if __name__ == "__main__":
   app.run(host="127.0.0.1", port=5001, debug=True)