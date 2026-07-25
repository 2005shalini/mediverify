from flask import request, jsonify

from models.patient_model import (
    create_patient_profile,
    get_patient_profile,
    update_patient_profile

)

def create_profile():

    """

    Create a new patient profile.

    """

    data = request.get_json()

    # Extract request data

    user_id = data.get("user_id")
    age = data.get("age")
    gender = data.get("gender")
    blood_group = data.get("blood_group")
    date_of_birth = data.get("date_of_birth")
    address = data.get("address")
    emergency_contact = data.get("emergency_contact")

    # Validate required fields

    if (

        not user_id or
        not age or
        not gender or
        not blood_group or
        not date_of_birth or
        not address

    ):

        return jsonify({

            "message": "All required fields are required."

        }), 400

    # Save patient profile in database

    create_patient_profile(

        user_id,
        age,
        gender,
        blood_group,
        date_of_birth,
        address,
        emergency_contact

    )

    # Success response

    return jsonify({

        "message": "Patient profile created successfully."

    }), 201


def get_profile():
    """
    Retrieve a patient profile by user_id from query parameters.
    """
    user_id = request.args.get("user_id")

    # Validate user_id
    if not user_id:
        return jsonify({
            "message": "user_id parameter is required."
        }), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({
            "message": "Invalid user_id format. Must be a valid integer."
        }), 400

    # Retrieve patient profile from database
    patient = get_patient_profile(user_id)

    # Return 404 if profile doesn't exist
    if not patient:
        return jsonify({
            "message": "Patient profile not found."
        }), 404

    # Format date_of_birth as YYYY-MM-DD string for clean JSON output
    if patient and "date_of_birth" in patient and patient["date_of_birth"]:
        patient["date_of_birth"] = str(patient["date_of_birth"])

    # Return patient profile with status code 200
    return jsonify(patient), 200


def update_profile():
    """
    Update an existing patient profile.
    """
    data = request.get_json(force=True, silent=True)

    if not data:
        return jsonify({
            "message": "Invalid or missing JSON payload."
        }), 400

    user_id = data.get("user_id")
    age = data.get("age")
    gender = data.get("gender")
    blood_group = data.get("blood_group")
    date_of_birth = data.get("date_of_birth")
    address = data.get("address")
    emergency_contact = data.get("emergency_contact")

    # Validate required fields
    if (
        not user_id or
        not age or
        not gender or
        not blood_group or
        not date_of_birth or
        not address
    ):
        return jsonify({
            "message": "All required fields are required."
        }), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({
            "message": "Invalid user_id format. Must be a valid integer."
        }), 400

    # Check whether patient profile exists
    existing_profile = get_patient_profile(user_id)

    if not existing_profile:
        return jsonify({
            "message": "Patient profile not found."
        }), 404

    # Update patient profile in database
    update_patient_profile(
        user_id,
        age,
        gender,
        blood_group,
        date_of_birth,
        address,
        emergency_contact
    )

    # Success response
    return jsonify({
        "message": "Patient profile updated successfully."
    }), 200