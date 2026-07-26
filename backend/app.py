from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.patient import patient_bp
from routes.doctor import doctor_bp
from routes.consultation import consultation_bp
from routes.report import report_bp

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Register existing Blueprints
app.register_blueprint(auth_bp)

# Register the patient Blueprint with a URL prefix
app.register_blueprint(patient_bp, url_prefix='/patient')

# Register the doctor Blueprint
app.register_blueprint(doctor_bp)

# Register the consultation Blueprint
app.register_blueprint(consultation_bp)

# Register the report Blueprint
app.register_blueprint(report_bp)

@app.route("/")
def home():
    """
    Root route to check if the backend is running.
    """
    return jsonify({
        "message": "MediVerify Backend is Running"
    })

# Run the Flask app in debug mode
if __name__ == "__main__":
    app.run(debug=True, port=5001)
