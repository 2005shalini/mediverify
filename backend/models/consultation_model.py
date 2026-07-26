from config import get_db_connection


def format_record(record):
    """
    Helper function to format date, time, and Decimal objects into strings/floats
    for clean JSON serialization.
    """
    if not record:
        return record
    for k, v in record.items():
        if hasattr(v, 'isoformat'):
            record[k] = str(v)
        elif hasattr(v, 'seconds'):  # timedelta / time
            record[k] = str(v)
        elif type(v).__name__ == 'Decimal':
            record[k] = float(v)
    return record


def format_records(records):
    """
    Helper function to format a list of records.
    """
    if not records:
        return []
    return [format_record(r) for r in records]


def check_user_exists(user_id):
    """
    Check if a user exists in the users table.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    cursor.execute("SELECT id, role, email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return format_record(user)


def create_consultation(
    patient_id,
    doctor_id,
    symptoms,
    problem_description,
    preferred_date=None,
    preferred_time=None,
    status="Pending"
):
    """
    Create a new consultation in the database.
    Populates both new schema columns and existing alias columns for backward compatibility.
    """
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
    INSERT INTO consultations (
        patient_id,
        doctor_id,
        title,
        symptoms,
        problem_description,
        preferred_date,
        preferred_time,
        appointment_date,
        appointment_time,
        status
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    title_val = (problem_description[:200] if problem_description else symptoms[:200]) if (problem_description or symptoms) else "Medical Consultation"
    status_val = status or "Pending"

    values = (
        patient_id,
        doctor_id if doctor_id else None,
        title_val,
        symptoms,
        problem_description,
        preferred_date if preferred_date else None,
        preferred_time if preferred_time else None,
        preferred_date if preferred_date else None,
        preferred_time if preferred_time else None,
        status_val
    )

    cursor.execute(query, values)
    new_id = cursor.lastrowid
    connection.commit()
    cursor.close()
    connection.close()
    return new_id


def get_consultation(consultation_id=None, patient_id=None, doctor_id=None, status=None):
    """
    Retrieve consultation(s) from the database.
    If consultation_id is provided, returns a single dictionary (or None).
    Otherwise, returns a list of matching consultation dictionaries.
    Uses buffered=True to prevent MySQL unread result errors.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)

    if consultation_id is not None:
        query = "SELECT * FROM consultations WHERE id = %s"
        cursor.execute(query, (consultation_id,))
        record = cursor.fetchone()
        cursor.close()
        connection.close()
        return format_record(record)

    query = "SELECT * FROM consultations WHERE 1=1"
    params = []

    if patient_id is not None:
        query += " AND patient_id = %s"
        params.append(patient_id)
    if doctor_id is not None:
        query += " AND doctor_id = %s"
        params.append(doctor_id)
    if status is not None and status != "":
        query += " AND status = %s"
        params.append(status)

    query += " ORDER BY created_at DESC"
    cursor.execute(query, tuple(params))
    records = cursor.fetchall()
    cursor.close()
    connection.close()
    return format_records(records)


def update_consultation(consultation_id, updates):
    """
    Update fields of an existing consultation.
    Automatically syncs alias columns (title, appointment_date, appointment_time) if needed.
    """
    if not updates:
        return

    allowed_cols = {
        'patient_id', 'doctor_id', 'symptoms', 'problem_description',
        'preferred_date', 'preferred_time', 'status',
        'title', 'appointment_date', 'appointment_time'
    }

    # Sync alias columns if their counterparts are updated
    if "problem_description" in updates and "title" not in updates:
        updates["title"] = updates["problem_description"][:200] if updates["problem_description"] else "Medical Consultation"
    if "preferred_date" in updates and "appointment_date" not in updates:
        updates["appointment_date"] = updates["preferred_date"]
    if "preferred_time" in updates and "appointment_time" not in updates:
        updates["appointment_time"] = updates["preferred_time"]

    set_clauses = []
    values = []

    for col, val in updates.items():
        if col in allowed_cols:
            set_clauses.append(f"{col} = %s")
            values.append(val)

    if not set_clauses:
        return

    values.append(consultation_id)
    query = f"UPDATE consultations SET {', '.join(set_clauses)} WHERE id = %s"

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, tuple(values))
    connection.commit()
    cursor.close()
    connection.close()


def delete_consultation(consultation_id):
    """
    Delete a consultation from the database by ID.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM consultations WHERE id = %s", (consultation_id,))
    connection.commit()
    cursor.close()
    connection.close()


def get_patient_consultations(patient_id):
    """
    Retrieve all consultations for a specific patient.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = """
    SELECT c.*, u.email as doctor_email, d.full_name as doctor_name, d.specialization, d.hospital
    FROM consultations c
    LEFT JOIN users u ON c.doctor_id = u.id
    LEFT JOIN doctor_profiles d ON u.id = d.user_id
    WHERE c.patient_id = %s
    ORDER BY c.created_at DESC
    """
    cursor.execute(query, (patient_id,))
    records = cursor.fetchall()
    cursor.close()
    connection.close()
    return format_records(records)


def get_doctor_consultations(doctor_id):
    """
    Retrieve all consultations assigned to a specific doctor.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = """
    SELECT c.*, u.email as patient_email, u.full_name as patient_name, p.age, p.gender, p.blood_group
    FROM consultations c
    LEFT JOIN users u ON c.patient_id = u.id
    LEFT JOIN patient_profiles p ON u.id = p.user_id
    WHERE c.doctor_id = %s
    ORDER BY c.created_at DESC
    """
    cursor.execute(query, (doctor_id,))
    records = cursor.fetchall()
    cursor.close()
    connection.close()
    return format_records(records)


def accept_consultation(consultation_id, doctor_id=None):
    """
    Update consultation status to Accepted. Optionally assign/update doctor_id.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    if doctor_id:
        query = "UPDATE consultations SET status = 'Accepted', doctor_id = %s WHERE id = %s"
        cursor.execute(query, (doctor_id, consultation_id))
    else:
        query = "UPDATE consultations SET status = 'Accepted' WHERE id = %s"
        cursor.execute(query, (consultation_id,))
    affected = cursor.rowcount
    connection.commit()
    cursor.close()
    connection.close()
    return affected > 0


def reject_consultation(consultation_id):
    """
    Update consultation status to Rejected.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "UPDATE consultations SET status = 'Rejected' WHERE id = %s"
    cursor.execute(query, (consultation_id,))
    affected = cursor.rowcount
    connection.commit()
    cursor.close()
    connection.close()
    return affected > 0


def complete_consultation(consultation_id):
    """
    Update consultation status to Completed.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "UPDATE consultations SET status = 'Completed' WHERE id = %s"
    cursor.execute(query, (consultation_id,))
    affected = cursor.rowcount
    connection.commit()
    cursor.close()
    connection.close()
    return affected > 0
