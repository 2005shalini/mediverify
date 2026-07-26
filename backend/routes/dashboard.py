from flask import Blueprint
from controllers.dashboard_controller import (
    dashboard,
    reports,
    analysis,
    insights,
    consultations,
    summary
)

dashboard_bp = Blueprint("dashboard", __name__)

# Register specific sub-resource history and summary endpoints FIRST to avoid URL routing ambiguity with ID parameter
dashboard_bp.route("/dashboard/reports/<patient_id>", methods=["GET"])(reports)
dashboard_bp.route("/dashboard/reports", methods=["GET"])(reports)

dashboard_bp.route("/dashboard/analysis/<patient_id>", methods=["GET"])(analysis)
dashboard_bp.route("/dashboard/analysis", methods=["GET"])(analysis)

dashboard_bp.route("/dashboard/insights/<patient_id>", methods=["GET"])(insights)
dashboard_bp.route("/dashboard/insights", methods=["GET"])(insights)

dashboard_bp.route("/dashboard/consultations/<patient_id>", methods=["GET"])(consultations)
dashboard_bp.route("/dashboard/consultations", methods=["GET"])(consultations)

dashboard_bp.route("/dashboard/summary/<patient_id>", methods=["GET"])(summary)
dashboard_bp.route("/dashboard/summary", methods=["GET"])(summary)

# Register Main Dashboard API routes
dashboard_bp.route("/dashboard/<patient_id>", methods=["GET"])(dashboard)
dashboard_bp.route("/dashboard", methods=["GET"])(dashboard)
