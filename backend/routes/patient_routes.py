from flask import Blueprint, request, jsonify
from models.patient_model import (
    create_patient_profile,
    get_patient_profile,
    update_patient_profile
)

# Create a Flask Blueprint for patient routes
patient_bp = Blueprint("patient", __name__)

@patient_bp.route('/profile', methods=['POST'])
def create_profile():
    """
    Create a new patient profile.
    
    Expects a JSON payload with the following fields:
    - user_id (required)
    - age
    - gender
    - blood_group
    - date_of_birth
    - address
    - emergency_contact
    """
    try:
        # Parse the JSON payload from the request
        data = request.get_json()
        
        # Extract data from the request payload
        user_id = data.get('user_id')
        age = data.get('age')
        gender = data.get('gender')
        blood_group = data.get('blood_group')
        date_of_birth = data.get('date_of_birth')
        address = data.get('address')
        emergency_contact = data.get('emergency_contact')

        # Basic validation to ensure required fields are present
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        # Call the model function to create the profile in the database
        create_patient_profile(
            user_id=user_id,
            age=age,
            gender=gender,
            blood_group=blood_group,
            date_of_birth=date_of_birth,
            address=address,
            emergency_contact=emergency_contact
        )

        return jsonify({'message': 'Patient profile created successfully'}), 201

    except Exception as e:
        # Return a 500 Internal Server Error if something goes wrong
        return jsonify({'error': str(e)}), 500


@patient_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    """
    Get a patient profile by user ID.
    
    Returns the profile data as JSON if found.
    Returns a 404 status code if the profile does not exist.
    """
    try:
        # Call the model function to fetch the profile by user ID
        patient = get_patient_profile(user_id)

        # Check if the profile was found in the database
        if patient:
            return jsonify(patient), 200
        else:
            return jsonify({'message': 'Patient profile not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patient_bp.route('/profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    """
    Update an existing patient profile by user ID.
    
    Expects a JSON payload with the updated patient details.
    Returns a 404 status code if the profile to be updated does not exist.
    """
    try:
        # Parse the JSON payload from the request
        data = request.get_json()
        
        # Extract the updated data from the request payload
        age = data.get('age')
        gender = data.get('gender')
        blood_group = data.get('blood_group')
        date_of_birth = data.get('date_of_birth')
        address = data.get('address')
        emergency_contact = data.get('emergency_contact')

        # First, check if the profile exists before trying to update it
        existing_profile = get_patient_profile(user_id)
        
        if not existing_profile:
            return jsonify({'message': 'Patient profile not found'}), 404

        # Call the model function to update the profile in the database
        update_patient_profile(
            user_id=user_id,
            age=age,
            gender=gender,
            blood_group=blood_group,
            date_of_birth=date_of_birth,
            address=address,
            emergency_contact=emergency_contact
        )

        return jsonify({'message': 'Patient profile updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
