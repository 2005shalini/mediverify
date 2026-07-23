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
    
 