from flask import Blueprint
from controllers.report_controller import (
    upload,
    get_all,
    get_single,
    delete,
    download
)

report_bp = Blueprint("report", __name__)

# Register Medical Report Upload & Management endpoints exactly as specified
report_bp.route("/report/upload", methods=["POST"])(upload)
report_bp.route("/report/all", methods=["GET"])(get_all)

# Register ID path parameter routes and fallback query param routes for flexibility
report_bp.route("/report/<report_id>", methods=["GET"])(get_single)
report_bp.route("/report", methods=["GET"])(get_single)

report_bp.route("/report/delete/<report_id>", methods=["DELETE"])(delete)
report_bp.route("/report/delete", methods=["DELETE"])(delete)

report_bp.route("/report/download/<report_id>", methods=["GET"])(download)
report_bp.route("/report/download", methods=["GET"])(download)
