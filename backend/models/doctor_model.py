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


def get_doctor_by_license(license_number):
    """
    Check if a license number is already registered in doctor_profiles.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    cursor.execute("SELECT id, user_id FROM doctor_profiles WHERE license_number = %s", (license_number,))
    doc = cursor.fetchone()
    cursor.close()
    connection.close()
    return format_record(doc)


def create_doctor_profile(
    user_id,
    full_name,
    specialization,
    qualification,
    experience,
    hospital,
    consultation_fee,
    city,
    state,
    languages,
    bio,
    profile_photo,
    license_number
):
    """
    Create a new doctor profile in the database.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    query = """
    INSERT INTO doctor_profiles
    (
        user_id, full_name, specialization, qualification, experience,
        hospital, consultation_fee, city, state, languages, bio,
        profile_photo, license_number, verification_status, rating,
        total_reviews, availability
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'Pending', 0.00, 0, 'Available')
    """
    values = (
        user_id, full_name, specialization, qualification, experience,
        hospital, consultation_fee, city, state, languages, bio,
        profile_photo, license_number
    )
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()


def get_doctor_profile(user_id):
    """
    Retrieve a doctor profile by user_id. Uses buffered=True to prevent MySQL unread result errors.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = "SELECT * FROM doctor_profiles WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    doctor = cursor.fetchone()
    cursor.close()
    connection.close()
    return format_record(doctor)


def update_doctor_profile(user_id, updates):
    """
    Dynamically update fields of an existing doctor profile.
    """
    if not updates:
        return
    allowed_cols = {
        'full_name', 'specialization', 'qualification', 'experience',
        'hospital', 'consultation_fee', 'city', 'state', 'languages',
        'bio', 'profile_photo', 'license_number', 'availability',
        'rating', 'total_reviews', 'verification_status'
    }
    set_clauses = []
    values = []
    for col, val in updates.items():
        if col in allowed_cols:
            set_clauses.append(f"{col} = %s")
            values.append(val)
    if not set_clauses:
        return
    values.append(user_id)
    query = f"UPDATE doctor_profiles SET {', '.join(set_clauses)} WHERE user_id = %s"
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, tuple(values))
    connection.commit()
    cursor.close()
    connection.close()


def delete_doctor_profile(user_id):
    """
    Delete a doctor profile from the database by user_id.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM doctor_profiles WHERE user_id = %s", (user_id,))
    connection.commit()
    cursor.close()
    connection.close()


def get_all_doctors(filters=None, sort_by=None):
    """
    Retrieve all doctors with optional filtering and sorting.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = "SELECT * FROM doctor_profiles WHERE 1=1"
    params = []

    if filters:
        if filters.get("specialization"):
            query += " AND specialization LIKE %s"
            params.append(f"%{filters['specialization']}%")
        if filters.get("city"):
            query += " AND city LIKE %s"
            params.append(f"%{filters['city']}%")
        if filters.get("experience") is not None and filters.get("experience") != "":
            query += " AND experience >= %s"
            params.append(int(filters["experience"]))
        if filters.get("availability"):
            query += " AND availability = %s"
            params.append(filters["availability"])
        if filters.get("consultation_fee") is not None and filters.get("consultation_fee") != "":
            query += " AND consultation_fee <= %s"
            params.append(float(filters["consultation_fee"]))

    if sort_by == "highest_rating":
        query += " ORDER BY rating DESC, total_reviews DESC"
    elif sort_by == "lowest_fee":
        query += " ORDER BY consultation_fee ASC"
    elif sort_by == "highest_experience":
        query += " ORDER BY experience DESC"
    elif sort_by == "newest":
        query += " ORDER BY created_at DESC"
    else:
        query += " ORDER BY id DESC"

    cursor.execute(query, tuple(params))
    doctors = cursor.fetchall()
    cursor.close()
    connection.close()
    return format_records(doctors)


def search_doctors(filters=None, sort_by=None):
    """
    Search doctors using filtering and sorting criteria.
    """
    return get_all_doctors(filters, sort_by)


def update_availability(user_id, availability):
    """
    Update only the availability status of a doctor.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE doctor_profiles SET availability = %s WHERE user_id = %s", (availability, user_id))
    connection.commit()
    cursor.close()
    connection.close()


def doctor_dashboard(user_id):
    """
    Retrieve statistics and data for the doctor dashboard.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)

    # Today's Cases
    cursor.execute("SELECT COUNT(*) AS count FROM consultations WHERE doctor_id = %s AND appointment_date = CURDATE()", (user_id,))
    todays_cases = cursor.fetchone()["count"]

    # Pending Reviews
    cursor.execute(
        "SELECT COUNT(*) AS count FROM consultations c WHERE c.doctor_id = %s AND c.status IN ('Accepted', 'Completed') AND NOT EXISTS (SELECT 1 FROM doctor_reviews r WHERE r.consultation_id = c.id)",
        (user_id,)
    )
    pending_reviews = cursor.fetchone()["count"]

    # Completed Today
    cursor.execute("SELECT COUNT(*) AS count FROM consultations WHERE doctor_id = %s AND status = 'Completed' AND appointment_date = CURDATE()", (user_id,))
    completed_today = cursor.fetchone()["count"]

    # Monthly Earnings
    cursor.execute(
        "SELECT COALESCE(SUM(amount), 0) AS earnings FROM payments p JOIN consultations c ON p.consultation_id = c.id WHERE c.doctor_id = %s AND p.payment_status = 'Success' AND MONTH(p.created_at) = MONTH(CURDATE()) AND YEAR(p.created_at) = YEAR(CURDATE())",
        (user_id,)
    )
    monthly_earnings = float(cursor.fetchone()["earnings"])

    # Upcoming Consultations
    query_upcoming = """
    SELECT c.*, u.email as patient_email, u.full_name as patient_name
    FROM consultations c
    JOIN users u ON c.patient_id = u.id
    WHERE c.doctor_id = %s AND c.status IN ('Accepted', 'Pending') AND c.appointment_date >= CURDATE()
    ORDER BY c.appointment_date ASC, c.appointment_time ASC LIMIT 5
    """
    cursor.execute(query_upcoming, (user_id,))
    upcoming = format_records(cursor.fetchall())

    # Recent Messages
    query_messages = """
    SELECT m.*, u.email as sender_email, u.role as sender_role
    FROM messages m
    JOIN consultations c ON m.consultation_id = c.id
    JOIN users u ON m.sender_id = u.id
    WHERE c.doctor_id = %s
    ORDER BY m.sent_at DESC LIMIT 5
    """
    cursor.execute(query_messages, (user_id,))
    messages = format_records(cursor.fetchall())

    cursor.close()
    connection.close()

    return {
        "Today's Cases": todays_cases,
        "Pending Reviews": pending_reviews,
        "Completed Today": completed_today,
        "Monthly Earnings": monthly_earnings,
        "Upcoming Consultations": upcoming,
        "Recent Messages": messages
    }


def doctor_history(user_id):
    """
    Retrieve all consultations for a doctor and categorize them by status.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = """
    SELECT c.*, u.email as patient_email, u.full_name as patient_name
    FROM consultations c
    JOIN users u ON c.patient_id = u.id
    WHERE c.doctor_id = %s
    ORDER BY c.created_at DESC
    """
    cursor.execute(query, (user_id,))
    consultations = format_records(cursor.fetchall())
    cursor.close()
    connection.close()

    categorized = {
        "Completed": [],
        "Pending": [],
        "Cancelled": [],
        "Accepted": [],
        "Rejected": []
    }
    for c in consultations:
        status = c.get("status", "Pending")
        if status in categorized:
            categorized[status].append(c)
        else:
            categorized["Pending"].append(c)
    return categorized


def submit_review(consultation_id, recommendation, notes, medicines, follow_up_date, status=None):
    """
    Submit a doctor review and recommendation for a patient consultation.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    cursor.execute("SELECT id, doctor_id FROM consultations WHERE id = %s", (consultation_id,))
    consultation = cursor.fetchone()
    if not consultation:
        cursor.close()
        connection.close()
        return False

    doctor_id = consultation["doctor_id"] if consultation.get("doctor_id") else 0
    full_notes = f"{notes} | Follow-up: {follow_up_date}" if follow_up_date and notes else (notes or follow_up_date or "")

    # Insert into doctor_reviews
    query_review = """
    INSERT INTO doctor_reviews (consultation_id, doctor_id, diagnosis, prescription, notes)
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query_review, (consultation_id, doctor_id, recommendation or "N/A", medicines or "None", full_notes))

    # Insert into recommendations
    if recommendation:
        cursor.execute("INSERT INTO recommendations (consultation_id, recommendation) VALUES (%s, %s)", (consultation_id, recommendation))

    # Update consultation status if provided
    if status:
        cursor.execute("UPDATE consultations SET status = %s WHERE id = %s", (status, consultation_id))

    connection.commit()
    cursor.close()
    connection.close()
    return True


def verify_doctor(doctor_id, status):
    """
    Admin verification of a doctor profile (by user_id or profile id).
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "UPDATE doctor_profiles SET verification_status = %s WHERE id = %s OR user_id = %s"
    cursor.execute(query, (status, doctor_id, doctor_id))
    affected = cursor.rowcount
    connection.commit()
    cursor.close()
    connection.close()
    return affected > 0


def top_doctors():
    """
    Retrieve top rated doctors.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = "SELECT * FROM doctor_profiles ORDER BY verification_status = 'Approved' DESC, rating DESC, total_reviews DESC, experience DESC LIMIT 10"
    cursor.execute(query)
    doctors = format_records(cursor.fetchall())
    cursor.close()
    connection.close()
    return doctors


def get_doctor_details(user_id):
    """
    Retrieve complete doctor profile along with patient reviews.
    """
    profile = get_doctor_profile(user_id)
    if not profile:
        return None
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True, buffered=True)
    query = """
    SELECT r.*, u.email as patient_email, u.full_name as patient_name
    FROM doctor_reviews r
    JOIN consultations c ON r.consultation_id = c.id
    JOIN users u ON c.patient_id = u.id
    WHERE r.doctor_id = %s
    ORDER BY r.created_at DESC
    """
    cursor.execute(query, (user_id,))
    reviews = format_records(cursor.fetchall())
    cursor.close()
    connection.close()
    profile["reviews"] = reviews
    return profile
