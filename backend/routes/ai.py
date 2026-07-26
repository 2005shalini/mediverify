from flask import Blueprint
from controllers.ai_controller import (
    analyze_report,
    get_analysis,
    history
)

ai_bp = Blueprint("ai", __name__)

# Register AI Analysis Engine endpoints exactly as specified
ai_bp.route("/ai/analyze/<report_id>", methods=["POST"])(analyze_report)
ai_bp.route("/ai/report/<report_id>", methods=["GET"])(get_analysis)
ai_bp.route("/ai/history/<patient_id>", methods=["GET"])(history)

# Register fallback routes for flexibility (e.g. query param or JSON body)
ai_bp.route("/ai/analyze", methods=["POST"])(analyze_report)
ai_bp.route("/ai/report", methods=["GET"])(get_analysis)
ai_bp.route("/ai/history", methods=["GET"])(history)
