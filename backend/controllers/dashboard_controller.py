from flask import request, jsonify
from models.dashboard_model import (
    get_dashboard,
    get_reports,
    get_analysis,
    get_insights,
    get_consultations,
    get_summary
)
from models.report_model import check_user_exists


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


def validate_patient(patient_id_arg):
    """Validate patient ID integer and verify existence in database."""
    id_val = patient_id_arg or request.args.get("patient_id") or request.args.get("user_id", "")
    pid, err = parse_int(id_val, "patient_id")
    if err:
        return None, standard_error(err, 400)
    if not check_user_exists(pid):
        return None, standard_error("Patient (user) not found.", 404)
    return pid, None


def dashboard(patient_id=None):
    """
    Handle GET /dashboard/<patient_id>.
    Combine patient profile, statistics, latest report, analysis, insight, and consultation into one response.
    """
    try:
        pid, err_resp = validate_patient(patient_id)
        if err_resp:
            return err_resp

        data = get_dashboard(pid)
        return jsonify(data), 200

    except Exception as e:
        return standard_error("Internal server error while fetching patient AI dashboard.", 500, e)


def reports(patient_id=None):
    """
    Handle GET /dashboard/reports/<patient_id>.
    Return all uploaded reports for a patient, newest first.
    """
    try:
        pid, err_resp = validate_patient(patient_id)
        if err_resp:
            return err_resp

        records = get_reports(pid)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching dashboard reports.", 500, e)


def analysis(patient_id=None):
    """
    Handle GET /dashboard/analysis/<patient_id>.
    Return all report analyses for a patient, newest first.
    """
    try:
        pid, err_resp = validate_patient(patient_id)
        if err_resp:
            return err_resp

        records = get_analysis(pid)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching dashboard analysis history.", 500, e)


def insights(patient_id=None):
    """
    Handle GET /dashboard/insights/<patient_id>.
    Return all medical insights for a patient, newest first.
    """
    try:
        pid, err_resp = validate_patient(patient_id)
        if err_resp:
            return err_resp

        records = get_insights(pid)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching dashboard insights history.", 500, e)


def consultations(patient_id=None):
    """
    Handle GET /dashboard/consultations/<patient_id>.
    Return all consultations for a patient, newest first.
    """
    try:
        pid, err_resp = validate_patient(patient_id)
        if err_resp:
            return err_resp

        records = get_consultations(pid)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching dashboard consultations history.", 500, e)


def summary(patient_id=None):
    """
    Handle GET /dashboard/summary/<patient_id>.
    Return high-level health score, risk level, overall health, latest disease, doctor, follow-up, and recommendation.
    """
    try:
        pid, err_resp = validate_patient(patient_id)
        if err_resp:
            return err_resp

        data = get_summary(pid)
        return jsonify(data), 200

    except Exception as e:
        return standard_error("Internal server error while fetching patient health summary.", 500, e)
