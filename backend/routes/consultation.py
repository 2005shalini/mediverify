from flask import Blueprint
from controllers.consultation_controller import (
    create_consultation,
    get_consultation,
    update_consultation,
    delete_consultation
)

consultation_bp = Blueprint("consultation", __name__)

# Register Consultation CRUD endpoints exactly as specified
consultation_bp.route("/consultation/create", methods=["POST"])(create_consultation)
consultation_bp.route("/consultation", methods=["GET"])(get_consultation)
consultation_bp.route("/consultation", methods=["PUT"])(update_consultation)
consultation_bp.route("/consultation", methods=["DELETE"])(delete_consultation)
