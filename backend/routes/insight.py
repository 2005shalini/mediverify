from flask import Blueprint
from controllers.insight_controller import (
    generate,
    get,
    history
)

insight_bp = Blueprint("insight", __name__)

# Register history endpoints first to avoid URL routing ambiguity with ID parameters
insight_bp.route("/insight/history/<patient_id>", methods=["GET"])(history)
insight_bp.route("/insight/history", methods=["GET"])(history)

# Register generate endpoints
insight_bp.route("/insight/generate/<report_id>", methods=["POST"])(generate)
insight_bp.route("/insight/generate", methods=["POST"])(generate)

# Register get single insight endpoints
insight_bp.route("/insight/<report_id>", methods=["GET"])(get)
insight_bp.route("/insight", methods=["GET"])(get)
