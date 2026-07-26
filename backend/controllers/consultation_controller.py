from datetime import datetime
from flask import request, jsonify
from models.consultation_model import (
    create_consultation as create_consultation_model,
    get_consultation as get_consultation_model,
    update_consultation as update_consultation_model,
    delete_consultation as delete_consultation_model,
    check_user_exists,
    check_duplicate_consultation,
    get_patient_consultations,
    get_doctor_consultations,
    accept_consultation,
    reject_consultation,
    complete_consultation,
    update_doctor_notes,
    update_prescription,
    update_meeting_link,
    get_consultation_details
)


VALID_STATUSES = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled']


def validate_date(date_str):
    """Validate YYYY-MM-DD format."""
    try:
        datetime.strptime(str(date_str).strip(), "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False


def validate_time(time_str):
    """Validate HH:MM or HH:MM:SS format."""
    time_str = str(time_str).strip()
    for fmt in ("%H:%M", "%H:%M:%S"):
        try:
            datetime.strptime(time_str, fmt)
            return True
        except ValueError:
            continue
    return False


def validate_url(url_str):
    """Validate URL starts with http:// or https://."""
    if not url_str or not isinstance(url_str, str):
        return False
    url_str = url_str.strip().lower()
    return url_str.startswith("http://") or url_str.startswith("https://")


def parse_int(val, field_name):
    """Parse positive integer, returning (int_val, error_msg)."""
    if val is None or val == "":
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


def create_consultation():
    """
    Create a new consultation request with input validation and duplicate prevention.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return standard_error("Invalid or missing JSON payload.", 400)

        patient_id, err = parse_int(data.get("patient_id"), "patient_id")
        if err:
            return standard_error(err, 400)

        doctor_id = None
        if data.get("doctor_id") is not None and str(data.get("doctor_id")).strip() != "":
            doctor_id, err = parse_int(data.get("doctor_id"), "doctor_id")
            if err:
                return standard_error(err, 400)

        symptoms = str(data.get("symptoms", "")).strip()
        problem_desc = str(data.get("problem_description", "")).strip()
        preferred_date = data.get("preferred_date")
        preferred_time = data.get("preferred_time")
        status = data.get("status", "Pending")

        if not symptoms or not problem_desc:
            return standard_error("symptoms and problem_description are required and cannot be empty.", 400)

        if status not in VALID_STATUSES:
            return standard_error(f"Invalid status value. Allowed: {', '.join(VALID_STATUSES)}", 400)

        if preferred_date and not validate_date(preferred_date):
            return standard_error("Invalid preferred_date format. Expected YYYY-MM-DD.", 400)
        if preferred_time and not validate_time(preferred_time):
            return standard_error("Invalid preferred_time format. Expected HH:MM or HH:MM:SS.", 400)

        # Database safety and user existence verification
        if not check_user_exists(patient_id):
            return standard_error("Patient (user) not found.", 404)

        if doctor_id and not check_user_exists(doctor_id):
            return standard_error("Doctor (user) not found.", 404)

        # Duplicate consultation prevention
        if preferred_date and preferred_time:
            if check_duplicate_consultation(patient_id, doctor_id, preferred_date, preferred_time):
                return standard_error("An active consultation already exists for this patient and doctor at the specified date and time.", 409)

        new_id = create_consultation_model(
            patient_id=patient_id,
            doctor_id=doctor_id,
            symptoms=symptoms,
            problem_description=problem_desc,
            preferred_date=preferred_date,
            preferred_time=preferred_time,
            status=status
        )

        return jsonify({
            "status": "success",
            "message": "Consultation created successfully.",
            "consultation_id": new_id
        }), 201

    except Exception as e:
        return standard_error("Internal server error during consultation creation.", 500, e)


def get_consultation(consultation_id=None):
    """
    Retrieve consultation(s) by ID, patient_id, doctor_id, or status with 404 handling.
    """
    try:
        id_val = consultation_id or request.args.get("id") or request.args.get("consultation_id")
        patient_id = request.args.get("patient_id")
        doctor_id = request.args.get("doctor_id")
        status = request.args.get("status")

        if id_val is not None and str(id_val).strip() != "":
            cid, err = parse_int(id_val, "consultation_id")
            if err:
                return standard_error(err, 400)

            record = get_consultation_model(consultation_id=cid)
            if not record:
                return standard_error("Consultation not found.", 404)
            return jsonify(record), 200

        p_id = None
        d_id = None
        if patient_id is not None and str(patient_id).strip() != "":
            p_id, err = parse_int(patient_id, "patient_id")
            if err:
                return standard_error(err, 400)
        if doctor_id is not None and str(doctor_id).strip() != "":
            d_id, err = parse_int(doctor_id, "doctor_id")
            if err:
                return standard_error(err, 400)

        if status is not None and status != "" and status not in VALID_STATUSES:
            return standard_error(f"Invalid status filter. Allowed: {', '.join(VALID_STATUSES)}", 400)

        records = get_consultation_model(patient_id=p_id, doctor_id=d_id, status=status)
        return jsonify(records), 200

    except Exception as e:
        return standard_error("Internal server error while fetching consultations.", 500, e)


def update_consultation(consultation_id=None):
    """
    Update an existing consultation with status validation and duplicate checking.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return standard_error("Invalid or missing JSON payload.", 400)

        id_val = consultation_id or (data.get("id") if data else None) or (data.get("consultation_id") if data else None) or request.args.get("id") or request.args.get("consultation_id")
        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if "status" in data and data["status"] is not None:
            new_status = data["status"]
            if new_status not in VALID_STATUSES:
                return standard_error(f"Invalid status value. Allowed: {', '.join(VALID_STATUSES)}", 400)
            if existing.get("status") in ('Completed', 'Cancelled') and new_status != existing.get("status"):
                return standard_error(f"Cannot update status of a consultation that is already {existing['status']}.", 400)

        if "preferred_date" in data and data["preferred_date"] and not validate_date(data["preferred_date"]):
            return standard_error("Invalid preferred_date format. Expected YYYY-MM-DD.", 400)
        if "preferred_time" in data and data["preferred_time"] and not validate_time(data["preferred_time"]):
            return standard_error("Invalid preferred_time format. Expected HH:MM or HH:MM:SS.", 400)

        if "patient_id" in data and data["patient_id"] is not None:
            pid, err = parse_int(data["patient_id"], "patient_id")
            if err:
                return standard_error(err, 400)
            if not check_user_exists(pid):
                return standard_error("Patient (user) not found.", 404)
            data["patient_id"] = pid

        if "doctor_id" in data and data["doctor_id"] is not None and str(data["doctor_id"]).strip() != "":
            did, err = parse_int(data["doctor_id"], "doctor_id")
            if err:
                return standard_error(err, 400)
            if not check_user_exists(did):
                return standard_error("Doctor (user) not found.", 404)
            data["doctor_id"] = did

        # Check duplicate if date/time is changing
        target_date = data.get("preferred_date", existing.get("preferred_date"))
        target_time = data.get("preferred_time", existing.get("preferred_time"))
        target_pid = data.get("patient_id", existing.get("patient_id"))
        target_did = data.get("doctor_id", existing.get("doctor_id"))
        if target_date and target_time and ("preferred_date" in data or "preferred_time" in data):
            if check_duplicate_consultation(target_pid, target_did, target_date, target_time, exclude_id=cid):
                return standard_error("An active consultation already exists at the updated date and time.", 409)

        update_consultation_model(cid, data)
        return jsonify({
            "status": "success",
            "message": "Consultation updated successfully."
        }), 200

    except Exception as e:
        return standard_error("Internal server error during consultation update.", 500, e)


def delete_consultation(consultation_id=None):
    """
    Delete a consultation by ID with strict 404 handling.
    """
    try:
        id_val = consultation_id or request.args.get("id") or request.args.get("consultation_id")
        if not id_val and request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = payload.get("id") or payload.get("consultation_id")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        delete_consultation_model(cid)
        return jsonify({
            "status": "success",
            "message": "Consultation deleted successfully."
        }), 200

    except Exception as e:
        return standard_error("Internal server error during consultation deletion.", 500, e)


def patient_history():
    """
    Retrieve consultation history for a specific patient.
    """
    try:
        patient_id = request.args.get("patient_id") or request.args.get("user_id")
        pid, err = parse_int(patient_id, "patient_id")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(pid):
            return standard_error("Patient (user) not found.", 404)

        records = get_patient_consultations(pid)
        return jsonify(records), 200
    except Exception as e:
        return standard_error("Internal server error while fetching patient history.", 500, e)


def doctor_history():
    """
    Retrieve consultation history for a specific doctor.
    """
    try:
        doctor_id = request.args.get("doctor_id") or request.args.get("user_id")
        did, err = parse_int(doctor_id, "doctor_id")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(did):
            return standard_error("Doctor (user) not found.", 404)

        records = get_doctor_consultations(did)
        return jsonify(records), 200
    except Exception as e:
        return standard_error("Internal server error while fetching doctor history.", 500, e)


def accept():
    """
    Workflow API: Update consultation status to Accepted with transition validation.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        doctor_id = request.args.get("doctor_id")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")
                doctor_id = doctor_id or payload.get("doctor_id")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if existing.get("status") in ('Completed', 'Cancelled', 'Rejected'):
            return standard_error(f"Cannot accept a consultation that is already {existing['status']}.", 400)

        did = None
        if doctor_id is not None and str(doctor_id).strip() != "":
            did, err = parse_int(doctor_id, "doctor_id")
            if err:
                return standard_error(err, 400)
            if not check_user_exists(did):
                return standard_error("Doctor (user) not found.", 404)

        accept_consultation(cid, doctor_id=did)
        return jsonify({
            "status": "Accepted",
            "message": "Consultation accepted successfully."
        }), 200
    except Exception as e:
        return standard_error("Internal server error while accepting consultation.", 500, e)


def reject():
    """
    Workflow API: Update consultation status to Rejected with transition validation.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if existing.get("status") in ('Completed', 'Cancelled'):
            return standard_error(f"Cannot reject a consultation that is already {existing['status']}.", 400)

        reject_consultation(cid)
        return jsonify({
            "status": "Rejected",
            "message": "Consultation rejected successfully."
        }), 200
    except Exception as e:
        return standard_error("Internal server error while rejecting consultation.", 500, e)


def complete():
    """
    Workflow API: Update consultation status to Completed with transition validation.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if existing.get("status") in ('Completed', 'Cancelled', 'Rejected'):
            return standard_error(f"Cannot complete a consultation that is in '{existing['status']}' status.", 400)

        complete_consultation(cid)
        return jsonify({
            "status": "Completed",
            "message": "Consultation completed successfully."
        }), 200
    except Exception as e:
        return standard_error("Internal server error while completing consultation.", 500, e)


def doctor_notes():
    """
    Feature API: Update doctor notes with input and status validation.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        notes = request.args.get("doctor_notes") or request.args.get("notes")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")
                if "doctor_notes" in payload:
                    notes = payload.get("doctor_notes")
                elif "notes" in payload:
                    notes = payload.get("notes")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        if notes is None or str(notes).strip() == "":
            return standard_error("doctor_notes cannot be empty.", 400)
        notes = str(notes).strip()

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if existing.get("status") == 'Cancelled':
            return standard_error("Cannot add notes to a cancelled consultation.", 400)

        update_doctor_notes(cid, notes)
        return jsonify({
            "status": "success",
            "message": "Doctor notes updated successfully.",
            "doctor_notes": notes
        }), 200
    except Exception as e:
        return standard_error("Internal server error while updating doctor notes.", 500, e)


def prescription():
    """
    Feature API: Update prescription with input and status validation.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        prescription_text = request.args.get("prescription")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")
                if "prescription" in payload:
                    prescription_text = payload.get("prescription")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        if prescription_text is None or str(prescription_text).strip() == "":
            return standard_error("prescription cannot be empty.", 400)
        prescription_text = str(prescription_text).strip()

        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if existing.get("status") in ('Cancelled', 'Rejected'):
            return standard_error(f"Cannot add prescription to a {existing['status'].lower()} consultation.", 400)

        update_prescription(cid, prescription_text)
        return jsonify({
            "status": "success",
            "message": "Prescription updated successfully.",
            "prescription": prescription_text
        }), 200
    except Exception as e:
        return standard_error("Internal server error while updating prescription.", 500, e)


def meeting_link():
    """
    Feature API: Update meeting link with URL validation and status check.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        link = request.args.get("meeting_link") or request.args.get("link") or request.args.get("url")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")
                if "meeting_link" in payload:
                    link = payload.get("meeting_link")
                elif "link" in payload:
                    link = payload.get("link")
                elif "url" in payload:
                    link = payload.get("url")

        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        if link is None or str(link).strip() == "":
            return standard_error("meeting_link cannot be empty.", 400)

        if not validate_url(link):
            return standard_error("Invalid meeting_link URL. Must start with http:// or https://.", 400)

        link = str(link).strip()
        existing = get_consultation_model(consultation_id=cid)
        if not existing:
            return standard_error("Consultation not found.", 404)

        if existing.get("status") in ('Cancelled', 'Rejected', 'Completed'):
            return standard_error(f"Cannot add meeting link to a {existing['status'].lower()} consultation.", 400)

        update_meeting_link(cid, link)
        return jsonify({
            "status": "success",
            "message": "Meeting link updated successfully.",
            "meeting_link": link
        }), 200
    except Exception as e:
        return standard_error("Internal server error while updating meeting link.", 500, e)


def details():
    """
    Feature API: Retrieve complete enriched details of a consultation with strict 404 handling.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        cid, err = parse_int(id_val, "consultation_id")
        if err:
            return standard_error(err, 400)

        record = get_consultation_details(cid)
        if not record:
            return standard_error("Consultation not found.", 404)

        return jsonify(record), 200
    except Exception as e:
        return standard_error("Internal server error while fetching consultation details.", 500, e)
