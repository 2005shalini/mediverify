from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.patient import patient_bp
from routes.doctor import doctor_bp
from routes.consultation import consultation_bp
from routes.report import report_bp
from routes.ai import ai_bp
from routes.insight import insight_bp
from routes.dashboard import dashboard_bp
from routes.payment import payment_bp

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

# Register the AI Analysis Blueprint
app.register_blueprint(ai_bp)

# Register the Medical Insights Blueprint
app.register_blueprint(insight_bp)

# Register the AI Dashboard Blueprint
app.register_blueprint(dashboard_bp)

# Register the Payment (Razorpay Order) Blueprint
app.register_blueprint(payment_bp)

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
