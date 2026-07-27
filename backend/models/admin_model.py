import os
import bcrypt
from config import get_db_connection


# =====================================================================
# PART 1: ADMIN AUTHENTICATION MODELS
# =====================================================================

def ensure_admins_table():
    """
    Create admins table only if it does not already exist.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'Super Admin',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        cursor.execute(query)
        connection.commit()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def create_default_admin():
    """
    Create one default admin if admins table is empty.
    Name: System Administrator
    Email: admin@mediverify.com
    Password: Admin@123 (hashed using bcrypt)
    Role: Super Admin
    """
    ensure_admins_table()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) AS cnt FROM admins")
        res = cursor.fetchone()
        if res and res["cnt"] == 0:
            hpw = bcrypt.hashpw(b"Admin@123", bcrypt.gensalt()).decode("utf-8")
            insert_query = """
            INSERT INTO admins (full_name, email, password, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, ("System Administrator", "admin@mediverify.com", hpw, "Super Admin", 1))
            connection.commit()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def admin_login(email, password):
    """
    Verify admin credentials.
    Returns (admin_dict, error_message).
    """
    create_default_admin()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM admins WHERE email = %s", (email,))
        admin = cursor.fetchone()
        if not admin:
            return None, "Invalid email or password."

        if not admin.get("is_active", True):
            return None, "Admin account is inactive."

        stored_pw = admin["password"]
        if not bcrypt.checkpw(password.encode("utf-8"), stored_pw.encode("utf-8")):
            return None, "Invalid email or password."

        return admin, None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_admin(admin_id):
    """
    Retrieve admin profile details by ID (excluding password).
    """
    create_default_admin()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, role, is_active, created_at, updated_at FROM admins WHERE id = %s", (admin_id,))
        admin = cursor.fetchone()
        return admin
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =====================================================================
# PART 2: USER MANAGEMENT MODELS
# =====================================================================

def ensure_users_active_column():
    """Ensure users table has is_active column."""
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER is_verified")
        connection.commit()
    except Exception:
        pass
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def format_user_record(record):
    if not record:
        return None
    return {
        "id": record["id"],
        "name": record["full_name"],
        "email": record["email"],
        "role": record["role"],
        "phone": record.get("phone") or "",
        "profile_image": record.get("profile_image") or "",
        "is_verified": bool(record.get("is_verified", False)),
        "is_active": bool(record.get("is_active", True)),
        "created_at": str(record.get("created_at", "")),
        "updated_at": str(record.get("updated_at", ""))
    }


def get_all_users():
    """Retrieve all registered users (excluding password)."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, role, phone, profile_image, is_verified, is_active, created_at, updated_at FROM users ORDER BY id DESC")
        records = cursor.fetchall()
        return [format_user_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_user(user_id):
    """Retrieve complete details of a single user by ID."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, role, phone, profile_image, is_verified, is_active, created_at, updated_at FROM users WHERE id = %s", (user_id,))
        record = cursor.fetchone()
        return format_user_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def search_users(name=None, email=None):
    """Search registered users by name and/or email."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, full_name, email, role, phone, profile_image, is_verified, is_active, created_at, updated_at FROM users WHERE 1=1"
        params = []
        if name and str(name).strip():
            query += " AND full_name LIKE %s"
            params.append(f"%{str(name).strip()}%")
        if email and str(email).strip():
            query += " AND email LIKE %s"
            params.append(f"%{str(email).strip()}%")
        query += " ORDER BY id DESC"
        cursor.execute(query, tuple(params))
        records = cursor.fetchall()
        return [format_user_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def block_user(user_id):
    """Block a user by setting is_active to False."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET is_active = False WHERE id = %s", (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def unblock_user(user_id):
    """Unblock a user by setting is_active to True."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET is_active = True WHERE id = %s", (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def delete_user(user_id):
    """Delete a user from the database."""
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =====================================================================
# PART 3: DOCTOR VERIFICATION MODELS
# =====================================================================

def ensure_doctor_verification_columns():
    """Ensure doctor_profiles table has verification tracking columns and flexible VARCHAR status."""
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        try:
            cursor.execute("ALTER TABLE doctor_profiles MODIFY COLUMN verification_status VARCHAR(20) DEFAULT 'Pending'")
        except Exception:
            pass
        for col, defn in [
            ('verified_at', 'DATETIME NULL AFTER verification_status'),
            ('verified_by', 'INT NULL AFTER verified_at'),
            ('rejection_reason', 'TEXT NULL AFTER verified_by')
        ]:
            try:
                cursor.execute(f'ALTER TABLE doctor_profiles ADD COLUMN {col} {defn}')
            except Exception:
                pass
        connection.commit()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def format_doctor_record(record):
    if not record:
        return None
    for k, v in record.items():
        if hasattr(v, 'isoformat'):
            record[k] = str(v)
        elif hasattr(v, 'seconds'):
            record[k] = str(v)
        elif type(v).__name__ == 'Decimal':
            record[k] = float(v)
    return record


def get_pending_doctors():
    """Retrieve all doctors with verification_status = 'Pending'."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctor_profiles WHERE verification_status = 'Pending' ORDER BY id DESC")
        records = cursor.fetchall()
        return [format_doctor_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_verified_doctors():
    """Retrieve all doctors with verification_status = 'Verified' (or 'Approved')."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctor_profiles WHERE verification_status IN ('Verified', 'Approved') ORDER BY id DESC")
        records = cursor.fetchall()
        return [format_doctor_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_rejected_doctors():
    """Retrieve all doctors with verification_status = 'Rejected'."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctor_profiles WHERE verification_status = 'Rejected' ORDER BY id DESC")
        records = cursor.fetchall()
        return [format_doctor_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_doctor(doctor_id):
    """Retrieve complete doctor profile by ID or user_id."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctor_profiles WHERE id = %s OR user_id = %s", (doctor_id, doctor_id))
        record = cursor.fetchone()
        return format_doctor_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def verify_doctor(doctor_id, admin_id=None):
    """Approve a doctor by setting verification_status to 'Verified'."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        UPDATE doctor_profiles 
        SET verification_status = 'Verified', verified_at = CURRENT_TIMESTAMP, verified_by = %s, rejection_reason = NULL
        WHERE id = %s OR user_id = %s
        """
        cursor.execute(query, (admin_id, doctor_id, doctor_id))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def reject_doctor(doctor_id, admin_id=None, reason=None):
    """Reject a doctor by setting verification_status to 'Rejected' and storing reason."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        UPDATE doctor_profiles 
        SET verification_status = 'Rejected', verified_at = CURRENT_TIMESTAMP, verified_by = %s, rejection_reason = %s
        WHERE id = %s OR user_id = %s
        """
        cursor.execute(query, (admin_id, reason, doctor_id, doctor_id))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def search_doctors(name=None, specialization=None, verification_status=None):
    """Search doctor profiles by name, specialization, and/or status."""
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM doctor_profiles WHERE 1=1"
        params = []
        if name and str(name).strip():
            query += " AND full_name LIKE %s"
            params.append(f"%{str(name).strip()}%")
        if specialization and str(specialization).strip():
            query += " AND specialization LIKE %s"
            params.append(f"%{str(specialization).strip()}%")
        if verification_status and str(verification_status).strip():
            query += " AND verification_status LIKE %s"
            params.append(f"%{str(verification_status).strip()}%")
        query += " ORDER BY id DESC"
        cursor.execute(query, tuple(params))
        records = cursor.fetchall()
        return [format_doctor_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =====================================================================
# PART 4: ADMIN DASHBOARD & ANALYTICS MODELS
# =====================================================================

def dashboard():
    """
    Retrieve comprehensive aggregate system statistics.
    """
    ensure_users_active_column()
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM users WHERE LOWER(role) = 'patient') AS total_patients,
            (SELECT COUNT(*) FROM doctor_profiles) AS total_doctors,
            (SELECT COUNT(*) FROM doctor_profiles WHERE verification_status IN ('Verified', 'Approved')) AS verified_doctors,
            (SELECT COUNT(*) FROM doctor_profiles WHERE verification_status = 'Pending') AS pending_doctors,
            (SELECT COUNT(*) FROM consultations) AS total_consultations,
            (SELECT COUNT(*) FROM consultations WHERE LOWER(status) = 'completed') AS completed_consultations,
            (SELECT COUNT(*) FROM medical_reports) AS total_reports,
            (SELECT COUNT(*) FROM medical_reports WHERE LOWER(analysis_status) IN ('completed', 'analyzed', 'success')) AS reports_analyzed,
            (SELECT COUNT(*) FROM payments) AS total_payments,
            (SELECT COUNT(*) FROM payments WHERE LOWER(payment_status) IN ('success', 'paid', 'completed')) AS successful_payments,
            (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE LOWER(payment_status) IN ('success', 'paid', 'completed')) AS total_revenue
        """
        cursor.execute(query)
        res = cursor.fetchone() or {}
        rev = float(res.get("total_revenue", 0))
        rev_formatted = int(rev) if rev.is_integer() else rev

        return {
            "statistics": {
                "total_users": int(res.get("total_users", 0)),
                "total_patients": int(res.get("total_patients", 0)),
                "total_doctors": int(res.get("total_doctors", 0)),
                "verified_doctors": int(res.get("verified_doctors", 0)),
                "pending_doctors": int(res.get("pending_doctors", 0)),
                "total_consultations": int(res.get("total_consultations", 0)),
                "completed_consultations": int(res.get("completed_consultations", 0)),
                "total_reports": int(res.get("total_reports", 0)),
                "reports_analyzed": int(res.get("reports_analyzed", 0)),
                "total_payments": int(res.get("total_payments", 0)),
                "successful_payments": int(res.get("successful_payments", 0)),
                "total_revenue": rev_formatted
            }
        }
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def monthly_revenue():
    """
    Retrieve monthly revenue breakdown for successful payments.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT 
            DATE_FORMAT(COALESCE(payment_completed_at, created_at), '%M') AS month_name,
            DATE_FORMAT(COALESCE(payment_completed_at, created_at), '%m') AS month_num,
            SUM(amount) AS total_rev
        FROM payments
        WHERE LOWER(payment_status) IN ('success', 'paid', 'completed')
        GROUP BY month_name, month_num
        ORDER BY month_num ASC
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        result = []
        for r in rows:
            rev = float(r["total_rev"]) if r["total_rev"] is not None else 0.0
            rev_formatted = int(rev) if rev.is_integer() else rev
            result.append({
                "month": r["month_name"] or "Unknown",
                "revenue": rev_formatted
            })
        return result
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def consultation_statistics():
    """
    Retrieve counts of consultations grouped by status.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT status, COUNT(*) AS count FROM consultations GROUP BY status")
        rows = cursor.fetchall()
        stats = {
            "Pending": 0,
            "Accepted": 0,
            "Completed": 0,
            "Cancelled": 0
        }
        for r in rows:
            st = str(r["status"]).strip().title()
            stats[st] = int(r["count"])
        return stats
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def report_statistics():
    """
    Retrieve counts of uploaded, analyzed, and pending reports.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                COUNT(*) AS total_uploaded,
                SUM(CASE WHEN LOWER(analysis_status) IN ('completed', 'analyzed', 'success') THEN 1 ELSE 0 END) AS total_analyzed
            FROM medical_reports
        """)
        res = cursor.fetchone() or {}
        uploaded = int(res.get("total_uploaded", 0))
        analyzed = int(res.get("total_analyzed", 0))
        pending = max(0, uploaded - analyzed)
        return {
            "Uploaded Reports": uploaded,
            "Analyzed Reports": analyzed,
            "Pending Reports": pending
        }
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def recent_activities():
    """
    Retrieve a consolidated list of the latest system activities across modules.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        activities = []

        # 1. New Users
        cursor.execute("SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5")
        for r in cursor.fetchall():
            activities.append({
                "id": f"usr_{r['id']}",
                "type": "New User Registered",
                "description": f"User {r['full_name']} ({r['email']}) registered as {r['role']}.",
                "timestamp": str(r.get("created_at") or ""),
                "reference_id": r["id"]
            })

        # 2. Doctors Verified
        cursor.execute("SELECT id, full_name, specialization, verified_at, created_at FROM doctor_profiles WHERE verification_status IN ('Verified', 'Approved') ORDER BY COALESCE(verified_at, created_at) DESC LIMIT 5")
        for r in cursor.fetchall():
            ts = str(r.get("verified_at") or r.get("created_at") or "")
            activities.append({
                "id": f"doc_{r['id']}",
                "type": "Doctor Verified",
                "description": f"Dr. {r['full_name']} ({r['specialization']}) was verified.",
                "timestamp": ts,
                "reference_id": r["id"]
            })

        # 3. Payment Success / Transactions
        cursor.execute("SELECT id, amount, payment_status, created_at FROM payments ORDER BY created_at DESC LIMIT 5")
        for r in cursor.fetchall():
            st = str(r.get("payment_status", "")).strip().title()
            act_type = "Payment Success" if st in ("Success", "Paid", "Completed") else f"Payment {st}"
            amt = float(r["amount"]) if r.get("amount") is not None else 0
            amt_fmt = int(amt) if amt.is_integer() else amt
            activities.append({
                "id": f"pay_{r['id']}",
                "type": act_type,
                "description": f"Payment #{r['id']} ({st}) of ₹{amt_fmt}.",
                "timestamp": str(r.get("created_at") or ""),
                "reference_id": r["id"]
            })

        # 4. Report Uploads
        cursor.execute("SELECT id, report_title, patient_id, uploaded_at, created_at FROM medical_reports ORDER BY COALESCE(uploaded_at, created_at) DESC LIMIT 5")
        for r in cursor.fetchall():
            title = r.get("report_title") or f"Report #{r['id']}"
            ts = str(r.get("uploaded_at") or r.get("created_at") or "")
            activities.append({
                "id": f"rep_{r['id']}",
                "type": "Report Uploaded",
                "description": f"Medical report '{title}' uploaded by patient ID {r['patient_id']}.",
                "timestamp": ts,
                "reference_id": r["id"]
            })

        # 5. Consultations Booked
        cursor.execute("SELECT id, patient_id, doctor_id, status, created_at FROM consultations ORDER BY created_at DESC LIMIT 5")
        for r in cursor.fetchall():
            st = str(r.get("status", "")).strip().title()
            activities.append({
                "id": f"cns_{r['id']}",
                "type": "Consultation Booked",
                "description": f"Consultation #{r['id']} ({st}) booked between patient ID {r['patient_id']} and doctor ID {r['doctor_id']}.",
                "timestamp": str(r.get("created_at") or ""),
                "reference_id": r["id"]
            })

        # Sort by timestamp descending
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        return activities[:15]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def system_summary():
    """
    Retrieve real-time system summary counts including today's activity.
    """
    ensure_users_active_column()
    ensure_doctor_verification_columns()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT
            (SELECT COUNT(*) FROM users WHERE is_active = 1 OR is_active IS NULL) AS active_users,
            (SELECT COUNT(*) FROM users WHERE is_active = 0) AS inactive_users,
            (SELECT COUNT(*) FROM doctor_profiles WHERE verification_status IN ('Verified', 'Approved')) AS verified_doctors,
            (SELECT COUNT(*) FROM doctor_profiles WHERE verification_status = 'Pending') AS pending_verification,
            (SELECT COUNT(*) FROM consultations WHERE DATE(created_at) = CURDATE() OR DATE(appointment_date) = CURDATE()) AS today_consultations,
            (SELECT COUNT(*) FROM payments WHERE DATE(created_at) = CURDATE() OR DATE(payment_completed_at) = CURDATE()) AS today_payments,
            (SELECT COUNT(*) FROM medical_reports WHERE DATE(uploaded_at) = CURDATE() OR DATE(created_at) = CURDATE()) AS today_reports
        """
        cursor.execute(query)
        res = cursor.fetchone() or {}
        return {
            "active_users": int(res.get("active_users", 0)),
            "inactive_users": int(res.get("inactive_users", 0)),
            "verified_doctors": int(res.get("verified_doctors", 0)),
            "pending_verification": int(res.get("pending_verification", 0)),
            "today_consultations": int(res.get("today_consultations", 0)),
            "today_payments": int(res.get("today_payments", 0)),
            "today_reports": int(res.get("today_reports", 0))
        }
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
