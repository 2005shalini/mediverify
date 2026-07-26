import os
import uuid
from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from models.report_model import (
    upload_report as upload_report_model,
    get_reports as get_reports_model,
    get_report as get_report_model,
    delete_report as delete_report_model,
    download_report as download_report_model,
    check_user_exists
)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "reports")

# Automatically create folder if missing
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[-1].lower() in ALLOWED_EXTENSIONS


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


def upload():
    """
    Handle POST /report/upload (multipart/form-data).
    Validates patient, file type, file size, generates unique name, stores file and DB metadata.
    """
    try:
        if 'file' not in request.files:
            return standard_error("No file provided in request.", 400)

        file = request.files['file']
        if file.filename == '' or not file.filename:
            return standard_error("No file selected for upload.", 400)

        if not allowed_file(file.filename):
            return standard_error("Unsupported file type. Allowed types: PDF, PNG, JPG, JPEG.", 400)

        # Check file size (max 10 MB)
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        if file_size > MAX_FILE_SIZE:
            return standard_error("File size exceeds the 10 MB limit.", 400)
        if file_size == 0:
            return standard_error("Cannot upload an empty file.", 400)

        patient_id, err = parse_int(request.form.get("patient_id"), "patient_id")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(patient_id):
            return standard_error("Patient (user) not found.", 404)

        report_title = str(request.form.get("report_title", "")).strip()
        report_type = str(request.form.get("report_type", "")).strip()
        if not report_title or not report_type:
            return standard_error("report_title and report_type are required and cannot be empty.", 400)

        # Prevent duplicate filename collisions
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        secure_name = secure_filename(file.filename) if secure_filename(file.filename) else "report.pdf"
        unique_filename = f"{uuid.uuid4().hex[:8]}_{secure_name}"
        full_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        rel_path = f"uploads/reports/{unique_filename}"

        file.save(full_path)

        report_id = upload_report_model(
            patient_id=patient_id,
            report_title=report_title,
            report_type=report_type,
            file_name=unique_filename,
            file_path=rel_path,
            file_size=file_size
        )

        return jsonify({
            "status": "success",
            "message": "Report uploaded successfully.",
            "report_id": report_id
        }), 201

    except Exception as e:
        return standard_error("Internal server error during report upload.", 500, e)


def get_all():
    """
    Handle GET /report/all?patient_id=1.
    Return all reports ordered newest first.
    """
    try:
        patient_id_val = request.args.get("patient_id") or request.args.get("user_id")
        p_id = None
        if patient_id_val is not None and str(patient_id_val).strip() != "":
            p_id, err = parse_int(patient_id_val, "patient_id")
            if err:
                return standard_error(err, 400)
            if not check_user_exists(p_id):
                return standard_error("Patient (user) not found.", 404)

        reports = get_reports_model(patient_id=p_id)
        return jsonify(reports), 200
    except Exception as e:
        return standard_error("Internal server error while fetching reports.", 500, e)


def get_single(report_id=None):
    """
    Handle GET /report/<report_id>.
    Return single report details.
    """
    try:
        id_val = report_id or request.args.get("id") or request.args.get("report_id")
        rid, err = parse_int(id_val, "report_id")
        if err:
            return standard_error(err, 400)

        record = get_report_model(rid)
        if not record:
            return standard_error("Report not found.", 404)

        return jsonify(record), 200
    except Exception as e:
        return standard_error("Internal server error while fetching report details.", 500, e)


def delete(report_id=None):
    """
    Handle DELETE /report/delete/<report_id>.
    Delete database record and physical file.
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

        record = get_report_model(rid)
        if not record:
            return standard_error("Report not found.", 404)

        # Remove physical file if it exists
        possible_paths = [
            os.path.join(UPLOAD_FOLDER, record.get("file_name", "")),
            os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), record.get("file_path", "")))
        ]
        for path in possible_paths:
            if path and os.path.exists(path) and os.path.isfile(path):
                try:
                    os.remove(path)
                except OSError:
                    pass

        delete_report_model(rid)
        return jsonify({
            "status": "success",
            "message": "Report deleted successfully."
        }), 200
    except Exception as e:
        return standard_error("Internal server error while deleting report.", 500, e)


def download(report_id=None):
    """
    Handle GET /report/download/<report_id>.
    Return uploaded file using send_file.
    """
    try:
        id_val = report_id or request.args.get("id") or request.args.get("report_id")
        rid, err = parse_int(id_val, "report_id")
        if err:
            return standard_error(err, 400)

        record = download_report_model(rid)
        if not record:
            return standard_error("Report not found.", 404)

        file_name = record.get("file_name", "")
        file_path = record.get("file_path", "")

        # Try locating physical file
        target_path = os.path.join(UPLOAD_FOLDER, file_name)
        if not (os.path.exists(target_path) and os.path.isfile(target_path)):
            alt_path = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), file_path))
            if os.path.exists(alt_path) and os.path.isfile(alt_path):
                target_path = alt_path
            else:
                return standard_error("Physical report file not found on server.", 404)

        try:
            return send_file(
                target_path,
                as_attachment=True,
                download_name=file_name
            )
        except TypeError:
            # Fallback for older Flask versions where parameter is attachment_filename
            return send_file(
                target_path,
                as_attachment=True,
                attachment_filename=file_name
            )
    except Exception as e:
        return standard_error("Internal server error while downloading report.", 500, e)
