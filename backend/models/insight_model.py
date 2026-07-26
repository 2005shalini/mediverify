import json
from config import get_db_connection

JSON_FIELDS = (
    'abnormal_parameters',
    'possible_conditions',
    'recommended_tests',
    'lifestyle_recommendations',
    'diet_recommendations',
    'exercise_recommendations',
    'medicine_reminders'
)


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
        elif k in JSON_FIELDS:
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


def save_insight(
    report_id,
    patient_id,
    health_score,
    risk_level,
    summary,
    abnormal,
    conditions,
    tests,
    specialist,
    lifestyle,
    diet,
    exercise,
    reminders,
    follow_up_days
):
    """
    Save generated medical insights into the database.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO medical_insights (
            report_id,
            patient_id,
            health_score,
            risk_level,
            health_summary,
            abnormal_parameters,
            possible_conditions,
            recommended_tests,
            recommended_specialist,
            lifestyle_recommendations,
            diet_recommendations,
            exercise_recommendations,
            medicine_reminders,
            follow_up_days
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            report_id,
            patient_id,
            health_score,
            risk_level,
            summary,
            json.dumps(abnormal if isinstance(abnormal, (list, dict)) else [abnormal]),
            json.dumps(conditions if isinstance(conditions, (list, dict)) else [conditions]),
            json.dumps(tests if isinstance(tests, (list, dict)) else [tests]),
            specialist,
            json.dumps(lifestyle if isinstance(lifestyle, (list, dict)) else [lifestyle]),
            json.dumps(diet if isinstance(diet, (list, dict)) else [diet]),
            json.dumps(exercise if isinstance(exercise, (list, dict)) else [exercise]),
            json.dumps(reminders if isinstance(reminders, (list, dict)) else [reminders]),
            follow_up_days
        ))
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


def get_insight(report_id=None, insight_id=None):
    """
    Retrieve medical insight by report_id or insight_id.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        if report_id is not None:
            cursor.execute("SELECT * FROM medical_insights WHERE report_id = %s ORDER BY id DESC LIMIT 1", (report_id,))
        elif insight_id is not None:
            cursor.execute("SELECT * FROM medical_insights WHERE id = %s", (insight_id,))
        else:
            return None
        record = cursor.fetchone()
        return format_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_patient_insights(patient_id):
    """
    Retrieve all generated medical insights for a specific patient, enriched with report metadata.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        query = """
        SELECT 
            m.*,
            r.report_title,
            r.report_type,
            r.file_name,
            r.uploaded_at
        FROM medical_insights m
        LEFT JOIN medical_reports r ON m.report_id = r.id
        WHERE m.patient_id = %s
        ORDER BY m.created_at DESC, m.id DESC
        """
        cursor.execute(query, (patient_id,))
        records = cursor.fetchall()
        return format_records(records)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
