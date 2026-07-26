from flask import request, jsonify
from models.ai_model import (
    save_analysis as save_analysis_model,
    get_analysis as get_analysis_model,
    get_patient_analysis_history,
    format_record
)
from models.report_model import (
    get_report as get_report_model,
    check_user_exists
)
from services.ai_service import analyze_report_mock


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


def analyze_report(report_id=None):
    """
    Handle POST /ai/analyze/<report_id>.
    Analyzes an uploaded medical report using AI Service and stores the results.
    Prevents duplicate analysis if already analyzed.
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

        # 1. Check report exists and cannot analyze deleted report
        report = get_report_model(rid)
        if not report:
            return standard_error("Report not found or has been deleted.", 404)

        # 2. Check patient exists
        patient_id = report.get("patient_id")
        if not check_user_exists(patient_id):
            return standard_error("Patient (user) not found.", 404)

        # 3. Check report belongs to specified patient if provided in request
        req_pid = request.args.get("patient_id") or request.args.get("user_id")
        if not req_pid and request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                req_pid = payload.get("patient_id") or payload.get("user_id")
        if req_pid is not None and str(req_pid).strip() != "":
            pid_val, err = parse_int(req_pid, "patient_id")
            if err:
                return standard_error(err, 400)
            if int(patient_id) != int(pid_val):
                return standard_error("Report does not belong to the specified patient.", 403)

        # 4. Check if already analyzed (return existing instead of creating duplicate)
        existing_analysis = get_analysis_model(report_id=rid)
        if existing_analysis:
            return jsonify({
                "status": "success",
                "message": "Report already analyzed.",
                "analysis": {
                    "summary": existing_analysis.get("report_summary", ""),
                    "diseases": existing_analysis.get("detected_diseases", []),
                    "medicines": existing_analysis.get("detected_medicines", []),
                    "abnormal_values": existing_analysis.get("abnormal_values", []),
                    "risk_level": existing_analysis.get("risk_level", "Low"),
                    "recommendation": existing_analysis.get("recommendation", ""),
                    "id": existing_analysis.get("id"),
                    "report_id": existing_analysis.get("report_id"),
                    "patient_id": existing_analysis.get("patient_id"),
                    "analysis_status": existing_analysis.get("analysis_status", "Completed")
                }
            }), 200

        # 5. Generate AI Analysis using clean mock service
        ai_res = analyze_report_mock(report)

        summary = ai_res.get("report_summary", "")
        diseases = ai_res.get("detected_diseases", [])
        medicines = ai_res.get("detected_medicines", [])
        abnormal = ai_res.get("abnormal_values", [])
        risk = ai_res.get("risk_level", "Low")
        rec = ai_res.get("recommendation", "")
        status = ai_res.get("analysis_status", "Completed")

        # 6. Save analysis in database
        save_analysis_model(
            report_id=rid,
            patient_id=patient_id,
            summary=summary,
            diseases=diseases,
            medicines=medicines,
            abnormal_values=abnormal,
            risk_level=risk,
            recommendation=rec,
            status=status
        )

        return jsonify({
            "status": "success",
            "message": "Report analyzed successfully."
        }), 200

    except Exception as e:
        return standard_error("Internal server error during report analysis.", 500, e)


def get_analysis(report_id=None):
    """
    Handle GET /ai/report/<report_id>.
    Return structured analysis results for a specific report.
    """
    try:
        id_val = report_id or request.args.get("id") or request.args.get("report_id")
        rid, err = parse_int(id_val, "report_id")
        if err:
            return standard_error(err, 400)

        record = get_analysis_model(report_id=rid)
        if not record:
            return standard_error("Analysis not found for this report.", 404)

        return jsonify({
            "summary": record.get("report_summary", ""),
            "diseases": record.get("detected_diseases", []),
            "medicines": record.get("detected_medicines", []),
            "abnormal_values": record.get("abnormal_values", []),
            "risk_level": record.get("risk_level", "Low"),
            "recommendation": record.get("recommendation", ""),
            "id": record.get("id"),
            "report_id": record.get("report_id"),
            "patient_id": record.get("patient_id"),
            "analysis_status": record.get("analysis_status", "Completed")
        }), 200

    except Exception as e:
        return standard_error("Internal server error while fetching report analysis.", 500, e)


def history(patient_id=None):
    """
    Handle GET /ai/history/<patient_id>.
    Return all analyzed reports for a specific patient.
    """
    try:
        id_val = patient_id or request.args.get("patient_id") or request.args.get("user_id")
        pid, err = parse_int(id_val, "patient_id")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(pid):
            return standard_error("Patient (user) not found.", 404)

        records = get_patient_analysis_history(pid)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching analysis history.", 500, e)
