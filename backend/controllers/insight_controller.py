from flask import request, jsonify
from models.insight_model import (
    save_insight as save_insight_model,
    get_insight as get_insight_model,
    get_patient_insights,
    format_record
)
from models.ai_model import get_analysis as get_analysis_model
from models.report_model import (
    get_report as get_report_model,
    check_user_exists
)
from services.insight_service import generate_medical_insights


def parse_int(val, field_name):
    """Parse positive integer, returning (int_val, error_msg)."""
    if val is None or str(val).strip() == "":
        return None, f"{field_name} is required."
    try:
        int_val = int(val)
        if int_val <= 0:
            return None, f"{field_name} must be a positive integer > 0."
        return int_val, None
    except ValueError:
        return None, f"{field_name} must be a valid integer."


def standard_error(message, status_code=400, details=None):
    """Return standardized JSON error response."""
    resp = {"status": "error", "message": message}
    if details:
        resp["details"] = str(details)
    return jsonify(resp), status_code


def generate(report_id=None):
    """
    Handle POST /insight/generate/<report_id>.
    Generates structured medical insights from an analyzed report.
    Prevents duplicate generation if insights already exist.
    """
    try:
        id_val = report_id or request.args.get("id") or request.args.get("report_id")
        if not id_val and request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = payload.get("id") or payload.get("report_id")

        rid, err = parse_int(id_val, "report_id")
        if err:
            return standard_error(err, 400)

        # 1. Check report exists
        report = get_report_model(rid)
        if not report:
            return standard_error("Report not found or has been deleted.", 404)

        # 2. Check patient exists
        patient_id = report.get("patient_id")
        if not check_user_exists(patient_id):
            return standard_error("Patient (user) not found.", 404)

        # 3. Check analysis exists (Phase 5 Part 2 must be completed first)
        analysis = get_analysis_model(report_id=rid)
        if not analysis:
            return standard_error("Report analysis not found. Please analyze the report first.", 404)

        # 4. Check if insights already generated (prevent duplicate)
        existing_insight = get_insight_model(report_id=rid)
        if existing_insight:
            return jsonify({
                "status": "success",
                "message": "Medical insights already generated.",
                "insight": existing_insight
            }), 200

        # 5. Generate structured medical insights using clean service
        insights_data = generate_medical_insights(analysis, report)

        # 6. Save in database
        save_insight_model(
            report_id=rid,
            patient_id=patient_id,
            health_score=insights_data["health_score"],
            risk_level=insights_data["risk_level"],
            summary=insights_data["health_summary"],
            abnormal=insights_data["abnormal_parameters"],
            conditions=insights_data["possible_conditions"],
            tests=insights_data["recommended_tests"],
            specialist=insights_data["recommended_specialist"],
            lifestyle=insights_data["lifestyle_recommendations"],
            diet=insights_data["diet_recommendations"],
            exercise=insights_data["exercise_recommendations"],
            reminders=insights_data["medicine_reminders"],
            follow_up_days=insights_data["follow_up_days"]
        )

        return jsonify({
            "status": "success",
            "message": "Medical insights generated successfully."
        }), 200

    except Exception as e:
        return standard_error("Internal server error during medical insight generation.", 500, e)


def get(report_id=None):
    """
    Handle GET /insight/<report_id>.
    Return complete medical insights for a specific report.
    """
    try:
        id_val = report_id or request.args.get("id") or request.args.get("report_id")
        rid, err = parse_int(id_val, "report_id")
        if err:
            return standard_error(err, 400)

        record = get_insight_model(report_id=rid)
        if not record:
            return standard_error("Medical insights not found for this report.", 404)

        return jsonify(record), 200

    except Exception as e:
        return standard_error("Internal server error while fetching medical insights.", 500, e)


def history(patient_id=None):
    """
    Handle GET /insight/history/<patient_id>.
    Return all generated insights for a specific patient.
    """
    try:
        id_val = patient_id or request.args.get("patient_id") or request.args.get("user_id")
        pid, err = parse_int(id_val, "patient_id")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(pid):
            return standard_error("Patient (user) not found.", 404)

        records = get_patient_insights(pid)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching medical insight history.", 500, e)
