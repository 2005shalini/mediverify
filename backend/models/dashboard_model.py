import json
from config import get_db_connection

JSON_FIELDS = (
    'detected_diseases',
    'detected_medicines',
    'abnormal_values',
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


def get_reports(patient_id):
    """
    Retrieve all uploaded medical reports for a patient, newest first.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT * FROM medical_reports WHERE patient_id = %s ORDER BY uploaded_at DESC, id DESC", (patient_id,))
        records = cursor.fetchall()
        return format_records(records)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_analysis(patient_id):
    """
    Retrieve all report analyses for a patient, newest first.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        query = """
        SELECT a.*, r.report_title, r.report_type, r.file_name, r.uploaded_at
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


def get_insights(patient_id):
    """
    Retrieve all medical insights for a patient, newest first.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        query = """
        SELECT m.*, r.report_title, r.report_type, r.file_name, r.uploaded_at
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


def get_consultations(patient_id):
    """
    Retrieve all consultations for a patient, joined with doctor info, newest first.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        query = """
        SELECT c.*, d.full_name AS doctor_name, d.specialization AS doctor_specialization, d.hospital AS doctor_hospital
        FROM consultations c
        LEFT JOIN doctor_profiles d ON c.doctor_id = d.user_id
        WHERE c.patient_id = %s
        ORDER BY c.created_at DESC, c.id DESC
        """
        cursor.execute(query, (patient_id,))
        records = cursor.fetchall()
        return format_records(records)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_dashboard(patient_id):
    """
    Aggregate complete patient AI dashboard data.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        # Patient info
        cursor.execute("""
        SELECT u.id AS user_id, u.email, u.role, u.full_name, p.*
        FROM users u
        LEFT JOIN patient_profiles p ON u.id = p.user_id
        WHERE u.id = %s
        """, (patient_id,))
        patient_info = format_record(cursor.fetchone())

        # Statistics
        cursor.execute("SELECT COUNT(*) AS cnt FROM medical_reports WHERE patient_id = %s", (patient_id,))
        total_reports = cursor.fetchone().get("cnt", 0)

        cursor.execute("SELECT COUNT(*) AS cnt FROM consultations WHERE patient_id = %s", (patient_id,))
        total_consultations = cursor.fetchone().get("cnt", 0)

        cursor.execute("SELECT COUNT(*) AS cnt FROM report_analysis WHERE patient_id = %s", (patient_id,))
        reports_analyzed = cursor.fetchone().get("cnt", 0)

        reports_list = get_reports(patient_id)
        analysis_list = get_analysis(patient_id)
        insights_list = get_insights(patient_id)
        consultations_list = get_consultations(patient_id)

        return {
            "patient": patient_info or {},
            "statistics": {
                "total_reports": total_reports,
                "total_consultations": total_consultations,
                "reports_analyzed": reports_analyzed
            },
            "latest_report": reports_list[0] if reports_list else None,
            "latest_analysis": analysis_list[0] if analysis_list else None,
            "latest_insight": insights_list[0] if insights_list else None,
            "recent_consultation": consultations_list[0] if consultations_list else None
        }
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_summary(patient_id):
    """
    Derive high-level patient health summary from latest insights, analysis, and consultations.
    """
    insights_list = get_insights(patient_id)
    analysis_list = get_analysis(patient_id)
    consultations_list = get_consultations(patient_id)

    latest_insight = insights_list[0] if insights_list else None
    latest_analysis = analysis_list[0] if analysis_list else None
    recent_consultation = consultations_list[0] if consultations_list else None

    # Derive Health Score and Risk Level
    if latest_insight and "health_score" in latest_insight:
        health_score = latest_insight.get("health_score", 82)
        risk_level = latest_insight.get("risk_level", "Low")
    elif latest_analysis:
        risk_level = latest_analysis.get("risk_level", "Low")
        if str(risk_level).lower() == "high":
            health_score = 48
        elif str(risk_level).lower() == "medium":
            health_score = 68
        else:
            health_score = 82
    else:
        health_score = 82
        risk_level = "Low"

    # Derive Overall Health status string
    r_lower = str(risk_level).lower()
    if r_lower == "low":
        overall_health = "Stable"
    elif r_lower == "medium":
        overall_health = "Needs Attention"
    elif r_lower == "high":
        overall_health = "Critical"
    else:
        overall_health = "Stable"

    # Derive Latest Disease
    latest_disease = "None"
    if latest_insight and latest_insight.get("possible_conditions"):
        conds = latest_insight.get("possible_conditions")
        if isinstance(conds, list) and len(conds) > 0:
            latest_disease = str(conds[0])
        elif isinstance(conds, str) and conds:
            latest_disease = conds
    elif latest_analysis and latest_analysis.get("detected_diseases"):
        conds = latest_analysis.get("detected_diseases")
        if isinstance(conds, list) and len(conds) > 0:
            latest_disease = str(conds[0])
        elif isinstance(conds, str) and conds:
            latest_disease = conds

    # Derive Latest Doctor
    latest_doctor = "None"
    if recent_consultation:
        d_name = recent_consultation.get("doctor_name")
        if d_name and str(d_name).strip() != "":
            d_str = str(d_name).strip()
            if not d_str.lower().startswith("dr.") and not d_str.lower().startswith("dr "):
                latest_doctor = f"Dr. {d_str}"
            else:
                latest_doctor = d_str
        elif recent_consultation.get("doctor_id"):
            latest_doctor = f"Doctor ID #{recent_consultation.get('doctor_id')}"

    # Derive Follow up
    follow_up = "14 Days"
    if latest_insight and latest_insight.get("follow_up_days"):
        follow_up = f"{latest_insight.get('follow_up_days')} Days"

    # Derive Recommendation
    recommendation = "Maintain healthy diet and regular checkups"
    if latest_insight:
        l_rec = latest_insight.get("lifestyle_recommendations")
        d_rec = latest_insight.get("diet_recommendations")
        if isinstance(l_rec, list) and len(l_rec) > 0:
            recommendation = str(l_rec[0])
        elif isinstance(d_rec, list) and len(d_rec) > 0:
            recommendation = str(d_rec[0])
        elif latest_insight.get("health_summary"):
            recommendation = str(latest_insight.get("health_summary"))
    elif latest_analysis and latest_analysis.get("recommendation"):
        recommendation = str(latest_analysis.get("recommendation"))

    return {
        "health_score": health_score,
        "risk_level": risk_level,
        "overall_health": overall_health,
        "latest_disease": latest_disease,
        "latest_doctor": latest_doctor,
        "follow_up": follow_up,
        "recommendation": recommendation
    }
