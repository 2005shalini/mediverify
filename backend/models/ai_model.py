import json
from config import get_db_connection


def format_record(record):
    """
    Helper function to format date, time, Decimal objects, and JSON strings
    into clean Python types for serialization.
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
        elif k in ('detected_diseases', 'detected_medicines', 'abnormal_values'):
            if isinstance(v, (str, bytes, bytearray)):
                try:
                    record[k] = json.loads(v)
                except (ValueError, TypeError):
                    pass
    return record


def format_records(records):
    """
    Helper function to format a list of records.
    """
    if not records:
        return []
    return [format_record(r) for r in records]


def save_analysis(report_id, patient_id, summary, diseases, medicines, abnormal_values, risk_level, recommendation, status="Completed"):
    """
    Save AI report analysis into the database and update medical_reports status.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO report_analysis (
            report_id,
            patient_id,
            report_summary,
            detected_diseases,
            detected_medicines,
            abnormal_values,
            risk_level,
            recommendation,
            analysis_status
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        diseases_json = json.dumps(diseases if isinstance(diseases, list) else [diseases])
        medicines_json = json.dumps(medicines if isinstance(medicines, list) else [medicines])
        abnormal_json = json.dumps(abnormal_values if isinstance(abnormal_values, list) else [abnormal_values])

        cursor.execute(query, (
            report_id,
            patient_id,
            summary,
            diseases_json,
            medicines_json,
            abnormal_json,
            risk_level,
            recommendation,
            status
        ))
        new_id = cursor.lastrowid

        # Update medical_reports analysis_status
        cursor.execute("UPDATE medical_reports SET analysis_status = %s WHERE id = %s", (status, report_id))

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


def get_analysis(report_id=None, analysis_id=None):
    """
    Retrieve AI analysis by report_id or analysis_id.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        if report_id is not None:
            cursor.execute("SELECT * FROM report_analysis WHERE report_id = %s ORDER BY id DESC LIMIT 1", (report_id,))
        elif analysis_id is not None:
            cursor.execute("SELECT * FROM report_analysis WHERE id = %s", (analysis_id,))
        else:
            return None
        record = cursor.fetchone()
        return format_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_patient_analysis_history(patient_id):
    """
    Retrieve all analyzed reports for a specific patient, enriched with report metadata.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        query = """
        SELECT 
            a.*,
            r.report_title,
            r.report_type,
            r.file_name,
            r.uploaded_at
        FROM report_analysis a
        LEFT JOIN medical_reports r ON a.report_id = r.id
        WHERE a.patient_id = %s
        ORDER BY a.created_at DESC, a.id DESC
        """
        cursor.execute(query, (patient_id,))
        records = cursor.fetchall()
        return format_records(records)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
