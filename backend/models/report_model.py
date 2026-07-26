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
        elif hasattr(v, 'seconds'):
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
    Check if a user exists in the database.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT id, role, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        return format_record(user)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def upload_report(patient_id, report_title, report_type, file_name, file_path, file_size):
    """
    Store medical report metadata in the database.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO medical_reports (
            patient_id,
            report_title,
            report_type,
            file_name,
            file_path,
            file_size,
            analysis_status
        ) VALUES (%s, %s, %s, %s, %s, %s, 'Pending')
        """
        cursor.execute(query, (patient_id, report_title, report_type, file_name, file_path, file_size))
        new_id = cursor.lastrowid
        connection.commit()
        return new_id
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_reports(patient_id=None):
    """
    Retrieve all medical reports, optionally filtered by patient_id, ordered newest first.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        if patient_id is not None:
            query = "SELECT * FROM medical_reports WHERE patient_id = %s ORDER BY uploaded_at DESC, id DESC"
            cursor.execute(query, (patient_id,))
        else:
            query = "SELECT * FROM medical_reports ORDER BY uploaded_at DESC, id DESC"
            cursor.execute(query)
        records = cursor.fetchall()
        return format_records(records)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_report(report_id):
    """
    Retrieve a single medical report by ID.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT * FROM medical_reports WHERE id = %s", (report_id,))
        record = cursor.fetchone()
        return format_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def delete_report(report_id):
    """
    Delete a medical report record from the database by ID.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM medical_reports WHERE id = %s", (report_id,))
        affected = cursor.rowcount
        connection.commit()
        return affected > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def download_report(report_id):
    """
    Retrieve report metadata for downloading.
    """
    return get_report(report_id)
