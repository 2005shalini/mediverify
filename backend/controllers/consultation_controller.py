from flask import request, jsonify
from models.consultation_model import (
    create_consultation as create_consultation_model,
    get_consultation as get_consultation_model,
    update_consultation as update_consultation_model,
    delete_consultation as delete_consultation_model,
    check_user_exists,
    get_patient_consultations,
    get_doctor_consultations,
    accept_consultation,
    reject_consultation,
    complete_consultation
)


def create_consultation():
    """
    Create a new consultation request.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")
        symptoms = data.get("symptoms")
        problem_description = data.get("problem_description")
        preferred_date = data.get("preferred_date")
        preferred_time = data.get("preferred_time")
        status = data.get("status", "Pending")

        if not patient_id or not symptoms or not problem_description:
            return jsonify({"message": "patient_id, symptoms, and problem_description are required."}), 400

        try:
            patient_id = int(patient_id)
            if doctor_id is not None and doctor_id != "":
                doctor_id = int(doctor_id)
            else:
                doctor_id = None
        except ValueError:
            return jsonify({"message": "Invalid numeric format for patient_id or doctor_id."}), 400

        # Check if patient exists
        patient = check_user_exists(patient_id)
        if not patient:
            return jsonify({"message": "Patient (user) not found."}), 404

        # Check if doctor exists when provided
        if doctor_id:
            doctor = check_user_exists(doctor_id)
            if not doctor:
                return jsonify({"message": "Doctor (user) not found."}), 404

        new_id = create_consultation_model(
            patient_id=patient_id,
            doctor_id=doctor_id,
            symptoms=symptoms,
            problem_description=problem_description,
            preferred_date=preferred_date,
            preferred_time=preferred_time,
            status=status
        )

        return jsonify({
            "message": "Consultation created successfully.",
            "consultation_id": new_id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_consultation():
    """
    Retrieve consultation(s) by ID, patient_id, doctor_id, or status.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        patient_id = request.args.get("patient_id")
        doctor_id = request.args.get("doctor_id")
        status = request.args.get("status")

        if id_val is not None and id_val != "":
            try:
                consultation_id = int(id_val)
            except ValueError:
                return jsonify({"message": "Invalid consultation ID format. Must be a valid integer."}), 400

            record = get_consultation_model(consultation_id=consultation_id)
            if not record:
                return jsonify({"message": "Consultation not found."}), 404
            return jsonify(record), 200

        # Retrieve list of consultations
        p_id = None
        d_id = None
        if patient_id is not None and patient_id != "":
            try:
                p_id = int(patient_id)
            except ValueError:
                return jsonify({"message": "Invalid patient_id format."}), 400
        if doctor_id is not None and doctor_id != "":
            try:
                d_id = int(doctor_id)
            except ValueError:
                return jsonify({"message": "Invalid doctor_id format."}), 400

        records = get_consultation_model(patient_id=p_id, doctor_id=d_id, status=status)
        return jsonify(records), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def update_consultation():
    """
    Update an existing consultation.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        id_val = data.get("id") or data.get("consultation_id") or request.args.get("id") or request.args.get("consultation_id")
        if not id_val:
            return jsonify({"message": "Consultation ID (id) is required."}), 400

        try:
            consultation_id = int(id_val)
        except ValueError:
            return jsonify({"message": "Invalid consultation ID format."}), 400

        existing = get_consultation_model(consultation_id=consultation_id)
        if not existing:
            return jsonify({"message": "Consultation not found."}), 404

        if "status" in data and data["status"] is not None:
            valid_statuses = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled']
            if data["status"] not in valid_statuses:
                return jsonify({"message": f"Invalid status value. Allowed: {', '.join(valid_statuses)}"}), 400

        if "patient_id" in data and data["patient_id"] is not None:
            try:
                data["patient_id"] = int(data["patient_id"])
            except ValueError:
                return jsonify({"message": "Invalid numeric format for patient_id."}), 400
            if not check_user_exists(data["patient_id"]):
                return jsonify({"message": "Patient (user) not found."}), 404

        if "doctor_id" in data and data["doctor_id"] is not None and data["doctor_id"] != "":
            try:
                data["doctor_id"] = int(data["doctor_id"])
            except ValueError:
                return jsonify({"message": "Invalid numeric format for doctor_id."}), 400
            if not check_user_exists(data["doctor_id"]):
                return jsonify({"message": "Doctor (user) not found."}), 404

        update_consultation_model(consultation_id, data)
        return jsonify({"message": "Consultation updated successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def delete_consultation():
    """
    Delete a consultation by ID.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        if not id_val and request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = payload.get("id") or payload.get("consultation_id")

        if not id_val:
            return jsonify({"message": "Consultation ID (id) parameter is required."}), 400

        try:
            consultation_id = int(id_val)
        except ValueError:
            return jsonify({"message": "Invalid consultation ID format."}), 400

        existing = get_consultation_model(consultation_id=consultation_id)
        if not existing:
            return jsonify({"message": "Consultation not found."}), 404

        delete_consultation_model(consultation_id)
        return jsonify({"message": "Consultation deleted successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def patient_history():
    """
    Retrieve consultation history for a specific patient.
    """
    try:
        patient_id = request.args.get("patient_id") or request.args.get("user_id")
        if not patient_id:
            return jsonify({"message": "patient_id parameter is required."}), 400
        try:
            patient_id = int(patient_id)
        except ValueError:
            return jsonify({"message": "Invalid patient_id format. Must be a valid integer."}), 400

        user = check_user_exists(patient_id)
        if not user:
            return jsonify({"message": "Patient (user) not found."}), 404

        records = get_patient_consultations(patient_id)
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def doctor_history():
    """
    Retrieve consultation history for a specific doctor.
    """
    try:
        doctor_id = request.args.get("doctor_id") or request.args.get("user_id")
        if not doctor_id:
            return jsonify({"message": "doctor_id parameter is required."}), 400
        try:
            doctor_id = int(doctor_id)
        except ValueError:
            return jsonify({"message": "Invalid doctor_id format. Must be a valid integer."}), 400

        user = check_user_exists(doctor_id)
        if not user:
            return jsonify({"message": "Doctor (user) not found."}), 404

        records = get_doctor_consultations(doctor_id)
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def accept():
    """
    Update consultation status to Accepted.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        doctor_id = request.args.get("doctor_id")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")
                doctor_id = doctor_id or payload.get("doctor_id")

        if not id_val:
            return jsonify({"message": "Consultation ID (id) is required."}), 400
        try:
            consultation_id = int(id_val)
            if doctor_id is not None and doctor_id != "":
                doctor_id = int(doctor_id)
            else:
                doctor_id = None
        except ValueError:
            return jsonify({"message": "Invalid numeric format for consultation ID or doctor_id."}), 400

        existing = get_consultation_model(consultation_id=consultation_id)
        if not existing:
            return jsonify({"message": "Consultation not found."}), 404

        if doctor_id and not check_user_exists(doctor_id):
            return jsonify({"message": "Doctor (user) not found."}), 404

        accept_consultation(consultation_id, doctor_id=doctor_id)
        return jsonify({"message": "Consultation accepted successfully.", "status": "Accepted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def reject():
    """
    Update consultation status to Rejected.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")

        if not id_val:
            return jsonify({"message": "Consultation ID (id) is required."}), 400
        try:
            consultation_id = int(id_val)
        except ValueError:
            return jsonify({"message": "Invalid consultation ID format."}), 400

        existing = get_consultation_model(consultation_id=consultation_id)
        if not existing:
            return jsonify({"message": "Consultation not found."}), 404

        reject_consultation(consultation_id)
        return jsonify({"message": "Consultation rejected successfully.", "status": "Rejected"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def complete():
    """
    Update consultation status to Completed.
    """
    try:
        id_val = request.args.get("id") or request.args.get("consultation_id")
        if request.is_json:
            payload = request.get_json(force=True, silent=True)
            if payload:
                id_val = id_val or payload.get("id") or payload.get("consultation_id")

        if not id_val:
            return jsonify({"message": "Consultation ID (id) is required."}), 400
        try:
            consultation_id = int(id_val)
        except ValueError:
            return jsonify({"message": "Invalid consultation ID format."}), 400

        existing = get_consultation_model(consultation_id=consultation_id)
        if not existing:
            return jsonify({"message": "Consultation not found."}), 404

        complete_consultation(consultation_id)
        return jsonify({"message": "Consultation completed successfully.", "status": "Completed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
