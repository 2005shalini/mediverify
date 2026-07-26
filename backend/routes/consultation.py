from flask import Blueprint
from controllers.consultation_controller import (
    create_consultation,
    get_consultation,
    update_consultation,
    delete_consultation,
    patient_history,
    doctor_history,
    accept,
    reject,
    complete
)

consultation_bp = Blueprint("consultation", __name__)

# Register Consultation CRUD endpoints exactly as specified
consultation_bp.route("/consultation/create", methods=["POST"])(create_consultation)
consultation_bp.route("/consultation", methods=["GET"])(get_consultation)
consultation_bp.route("/consultation", methods=["PUT"])(update_consultation)
consultation_bp.route("/consultation", methods=["DELETE"])(delete_consultation)

# Register Consultation Workflow endpoints
consultation_bp.route("/consultation/patient", methods=["GET"])(patient_history)
consultation_bp.route("/consultation/doctor", methods=["GET"])(doctor_history)
consultation_bp.route("/consultation/accept", methods=["PUT"])(accept)
consultation_bp.route("/consultation/reject", methods=["PUT"])(reject)
consultation_bp.route("/consultation/complete", methods=["PUT"])(complete)
