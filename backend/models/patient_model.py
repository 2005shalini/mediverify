from config import get_db_connection

def create_patient_profile(

    user_id,
    age,
    gender,
    blood_group,
    date_of_birth,
    address,
    emergency_contact

):

    """

    Create a new patient profile in the database.

    Args:

        user_id (int): ID of the authenticated user.
        age (int): Patient's age.
        gender (str): Patient's gender.
        blood_group (str): Blood group of the patient.
        date_of_birth (date): Patient's date of birth.
        address (str): Residential address.
        emergency_contact (str): Emergency contact number.

    """

    connection = get_db_connection()

    cursor = connection.cursor()

    query = """

    INSERT INTO patient_profiles

    (

        user_id,

        age,

        gender,

        blood_group,

        date_of_birth,

        address,

        emergency_contact

    )

    VALUES (%s, %s, %s, %s, %s, %s, %s)

    """

    values = (

        user_id,

        age,

        gender,

        blood_group,

        date_of_birth,

        address,

        emergency_contact

    )

    cursor.execute(query, values)

    connection.commit()

    cursor.close()

    connection.close()

def get_patient_profile(user_id):

    """

    Retrieve the patient profile using the authenticated user's ID.
    Args:
        user_id (int): ID of the authenticated user.
    Returns:
        dict | None:
            Returns the patient profile if found,
            otherwise returns None.
    """

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    query = """

    SELECT *

    FROM patient_profiles

    WHERE user_id = %s

    """

    cursor.execute(query, (user_id,))

    patient = cursor.fetchone()

    cursor.close()

    connection.close()

    return patient

def update_patient_profile(
    user_id,
    age,
    gender,
    blood_group,
    date_of_birth,
    address,
    emergency_contact
):
    """
    Update an existing patient profile using the authenticated user's ID.

    Args:
        user_id (int): ID of the authenticated user.
        age (int): Patient's age.
        gender (str): Patient's gender.
        blood_group (str): Blood group of the patient.
        date_of_birth (date): Patient's date of birth.
        address (str): Residential address.
        emergency_contact (str): Emergency contact number.
    """

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
    UPDATE patient_profiles
    SET
        age = %s,
        gender = %s,
        blood_group = %s,
        date_of_birth = %s,
        address = %s,
        emergency_contact = %s
    WHERE user_id = %s
    """

    values = (
        age,
        gender,
        blood_group,
        date_of_birth,
        address,
        emergency_contact,
        user_id
    )

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()