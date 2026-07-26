from flask import request, jsonify
from models.doctor_model import (
    create_doctor_profile,
    get_doctor_profile,
    update_doctor_profile,
    delete_doctor_profile,
    get_all_doctors,
    search_doctors,
    update_availability as update_availability_model,
    doctor_dashboard,
    doctor_history,
    submit_review,
    verify_doctor,
    top_doctors,
    get_doctor_details,
    check_user_exists,
    get_doctor_by_license
)


def create_profile():
    """
    Create a new doctor profile.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        user_id = data.get("user_id")
        full_name = data.get("full_name")
        specialization = data.get("specialization")
        qualification = data.get("qualification")
        experience = data.get("experience")
        hospital = data.get("hospital")
        consultation_fee = data.get("consultation_fee")
        city = data.get("city")
        state = data.get("state")
        languages = data.get("languages")
        bio = data.get("bio")
        profile_photo = data.get("profile_photo")
        license_number = data.get("license_number")

        if (
            not user_id or not full_name or not specialization or
            not qualification or experience is None or not hospital or
            consultation_fee is None or not license_number
        ):
            return jsonify({"message": "All required fields are required."}), 400

        try:
            user_id = int(user_id)
            experience = int(experience)
            consultation_fee = float(consultation_fee)
        except ValueError:
            return jsonify({"message": "Invalid numeric format for user_id, experience, or consultation_fee."}), 400

        if consultation_fee <= 0:
            return jsonify({"message": "consultation_fee must be > 0."}), 400
        if experience < 0:
            return jsonify({"message": "experience must be >= 0."}), 400

        user = check_user_exists(user_id)
        if not user:
            return jsonify({"message": "User not found."}), 404

        existing_profile = get_doctor_profile(user_id)
        if existing_profile:
            return jsonify({"message": "Doctor profile already exists for this user."}), 400

        existing_license = get_doctor_by_license(license_number)
        if existing_license:
            return jsonify({"message": "License number already registered."}), 400

        create_doctor_profile(
            user_id, full_name, specialization, qualification, experience,
            hospital, consultation_fee, city, state, languages, bio,
            profile_photo, license_number
        )
        return jsonify({"message": "Doctor profile created successfully."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_profile():
    """
    Retrieve a doctor profile by user_id.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format. Must be a valid integer."}), 400

        profile = get_doctor_profile(user_id)
        if not profile:
            return jsonify({"message": "Doctor profile not found."}), 404
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def update_profile():
    """
    Update an existing doctor profile.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        user_id = data.get("user_id") or request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        existing_profile = get_doctor_profile(user_id)
        if not existing_profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        if "consultation_fee" in data and data["consultation_fee"] is not None:
            try:
                if float(data["consultation_fee"]) <= 0:
                    return jsonify({"message": "consultation_fee must be > 0."}), 400
            except ValueError:
                return jsonify({"message": "Invalid consultation_fee format."}), 400
        if "experience" in data and data["experience"] is not None:
            try:
                if int(data["experience"]) < 0:
                    return jsonify({"message": "experience must be >= 0."}), 400
            except ValueError:
                return jsonify({"message": "Invalid experience format."}), 400

        update_doctor_profile(user_id, data)
        return jsonify({"message": "Doctor profile updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def delete_profile():
    """
    Delete a doctor profile.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id and request.is_json:
            user_id = request.get_json(force=True, silent=True).get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        existing_profile = get_doctor_profile(user_id)
        if not existing_profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        delete_doctor_profile(user_id)
        return jsonify({"message": "Doctor profile deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_doctors():
    """
    Retrieve all doctors with optional filtering and sorting.
    """
    try:
        sort_by = request.args.get("sort_by") or request.args.get("sort")
        doctors = get_all_doctors(filters=request.args, sort_by=sort_by)
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def search():
    """
    Search doctors using query parameters.
    """
    try:
        sort_by = request.args.get("sort_by") or request.args.get("sort")
        doctors = search_doctors(filters=request.args, sort_by=sort_by)
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def update_availability():
    """
    Update doctor availability status.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        user_id = data.get("user_id")
        availability = data.get("availability")
        if not user_id or not availability:
            return jsonify({"message": "user_id and availability are required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        existing_profile = get_doctor_profile(user_id)
        if not existing_profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        update_availability_model(user_id, availability)
        return jsonify({"message": "Availability updated."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def dashboard():
    """
    Retrieve doctor dashboard metrics and data.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        existing_profile = get_doctor_profile(user_id)
        if not existing_profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        data = doctor_dashboard(user_id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def cases():
    """
    Retrieve categorized consultations for a doctor.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        existing_profile = get_doctor_profile(user_id)
        if not existing_profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        data = doctor_history(user_id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def review():
    """
    Submit a doctor review for a patient report/consultation.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        consultation_id = data.get("consultation_id")
        recommendation = data.get("recommendation")
        notes = data.get("notes")
        medicines = data.get("medicines")
        follow_up_date = data.get("follow_up_date")
        status = data.get("status")

        if not consultation_id:
            return jsonify({"message": "consultation_id is required."}), 400
        try:
            consultation_id = int(consultation_id)
        except ValueError:
            return jsonify({"message": "Invalid consultation_id format."}), 400

        success = submit_review(consultation_id, recommendation, notes, medicines, follow_up_date, status)
        if not success:
            return jsonify({"message": "Consultation not found."}), 404

        return jsonify({"message": "Review submitted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def license_info():
    """
    Retrieve doctor license and verification status.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        profile = get_doctor_profile(user_id)
        if not profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        return jsonify({
            "license_number": profile.get("license_number"),
            "verification_status": profile.get("verification_status")
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def verify():
    """
    Admin endpoint to verify a doctor profile.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"message": "Invalid or missing JSON payload."}), 400

        doctor_id = data.get("doctor_id")
        status = data.get("status")
        if not doctor_id or not status:
            return jsonify({"message": "doctor_id and status are required."}), 400
        try:
            doctor_id = int(doctor_id)
        except ValueError:
            return jsonify({"message": "Invalid doctor_id format."}), 400

        if status not in ['Approved', 'Rejected', 'Pending']:
            return jsonify({"message": "Status must be Approved, Rejected, or Pending."}), 400

        success = verify_doctor(doctor_id, status)
        if not success:
            return jsonify({"message": "Doctor profile not found."}), 404

        return jsonify({"message": "Verification updated."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def top():
    """
    Retrieve top rated doctors.
    """
    try:
        doctors = top_doctors()
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def details():
    """
    Retrieve complete doctor profile including reviews.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        profile = get_doctor_details(user_id)
        if not profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        return jsonify(profile), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def history():
    """
    Retrieve consultation history for a doctor.
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "user_id parameter is required."}), 400
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"message": "Invalid user_id format."}), 400

        profile = get_doctor_profile(user_id)
        if not profile:
            return jsonify({"message": "Doctor profile not found."}), 404

        data = doctor_history(user_id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
