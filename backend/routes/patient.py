from flask import Blueprint
from controllers.patient_controller import (
    create_profile,
    get_profile,
    update_profile
)


patient_bp = Blueprint("patient", __name__)


patient_bp.route("/profile", methods=["POST"])(create_profile)
patient_bp.route("/profile", methods=["GET"])(get_profile)
patient_bp.route("/profile", methods=["PUT"])(update_profile)
