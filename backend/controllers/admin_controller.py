import datetime
import jwt
from flask import request, jsonify
from config import SECRET_KEY
from models.admin_model import (
    admin_login,
    get_admin,
    get_all_users as get_all_users_model,
    get_user as get_user_model,
    search_users as search_users_model,
    block_user as block_user_model,
    unblock_user as unblock_user_model,
    delete_user as delete_user_model,
    get_pending_doctors as get_pending_doctors_model,
    get_verified_doctors as get_verified_doctors_model,
    get_rejected_doctors as get_rejected_doctors_model,
    get_doctor as get_doctor_model,
    verify_doctor as verify_doctor_model,
    reject_doctor as reject_doctor_model,
    search_doctors as search_doctors_model,
    dashboard as dashboard_model,
    monthly_revenue as monthly_revenue_model,
    consultation_statistics as consultation_statistics_model,
    report_statistics as report_statistics_model,
    recent_activities as recent_activities_model,
    system_summary as system_summary_model
)
from middleware.admin_auth import admin_required


def parse_int(val, field_name):
    """Parse positive integer, returning (int_val, error_msg)."""
    if val is None or str(val).strip() == "":
        return None, f"Invalid {field_name}: {field_name} is required."
    try:
        int_val = int(val)
        if int_val <= 0:
            return None, f"Invalid {field_name}: {field_name} must be a positive integer > 0."
        return int_val, None
    except ValueError:
        return None, f"Invalid {field_name}: {field_name} must be a valid integer."


def standard_error(message, status_code=400, details=None):
    """Return standardized JSON error response."""
    resp = {"status": "error", "message": message}
    if details:
        resp["details"] = str(details)
    return jsonify(resp), status_code


# =====================================================================
# PART 1: ADMIN AUTHENTICATION CONTROLLERS
# =====================================================================

def login():
    """
    Handle POST /admin/login.
    Validates admin credentials and returns JWT token (24h expiry) with admin details.
    """
    try:
        payload = {}
        if request.is_json:
            payload = request.get_json(force=True, silent=True) or {}
        if not payload:
            payload = request.form.to_dict() or request.args.to_dict()

        email = payload.get("email")
        password = payload.get("password")

        if not email or not str(email).strip() or not password or not str(password).strip():
            return jsonify({
                "status": "error",
                "message": "Invalid email or password."
            }), 400

        admin, err = admin_login(email.strip(), password)
        if not admin:
            return jsonify({
                "status": "error",
                "message": "Invalid email or password."
            }), 401

        # Generate 24-hour JWT token
        token = jwt.encode(
            {
                "admin_id": admin["id"],
                "email": admin["email"],
                "role": admin["role"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        if isinstance(token, bytes):
            token = token.decode("utf-8")

        return jsonify({
            "status": "success",
            "message": "Admin login successful.",
            "token": token,
            "admin": {
                "id": admin["id"],
                "name": admin["full_name"],
                "email": admin["email"],
                "role": admin["role"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Internal server error during admin login: {str(e)}"
        }), 500


@admin_required
def profile():
    """
    Handle GET /admin/profile.
    Protected route returning logged-in admin details.
    """
    try:
        admin = getattr(request, "admin", None)
        if not admin:
            return jsonify({
                "status": "error",
                "message": "Access denied: Admin information unavailable."
            }), 401

        return jsonify({
            "status": "success",
            "admin": {
                "id": admin["id"],
                "name": admin["full_name"],
                "email": admin["email"],
                "role": admin["role"],
                "is_active": bool(admin.get("is_active", True)),
                "created_at": str(admin.get("created_at", ""))
            }
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Internal server error while fetching admin profile: {str(e)}"
        }), 500


def logout():
    """
    Handle POST /admin/logout.
    Returns success message for frontend to clear token.
    """
    return jsonify({
        "status": "success",
        "message": "Logged out successfully."
    }), 200


# =====================================================================
# PART 2: USER MANAGEMENT CONTROLLERS
# =====================================================================

@admin_required
def users():
    """Handle GET /admin/users. Return all registered users."""
    try:
        all_users = get_all_users_model()
        return jsonify(all_users), 200
    except Exception as e:
        return standard_error("Database error while retrieving users.", 500, e)


@admin_required
def user(user_id=None):
    """Handle GET /admin/users/<user_id>. Return complete details of one user."""
    try:
        uid_val = user_id or request.args.get("user_id") or request.args.get("id")
        uid, err = parse_int(uid_val, "user_id")
        if err:
            return standard_error(err, 400)

        record = get_user_model(uid)
        if not record:
            return standard_error("Invalid user: User not found in database.", 404)
        return jsonify(record), 200
    except Exception as e:
        return standard_error("Database error while retrieving user details.", 500, e)


@admin_required
def search():
    """Handle GET /admin/users/search. Search users by name and/or email."""
    try:
        name = request.args.get("name")
        email = request.args.get("email")
        results = search_users_model(name=name, email=email)
        return jsonify(results), 200
    except Exception as e:
        return standard_error("Database error while searching users.", 500, e)


@admin_required
def block(user_id=None):
    """Handle PUT /admin/users/block/<user_id>. Block a user (is_active = False)."""
    try:
        uid_val = user_id or request.args.get("user_id") or request.args.get("id")
        if request.is_json and not uid_val:
            payload = request.get_json(force=True, silent=True) or {}
            uid_val = payload.get("user_id") or payload.get("id")

        uid, err = parse_int(uid_val, "user_id")
        if err:
            return standard_error(err, 400)

        record = get_user_model(uid)
        if not record:
            return standard_error("Invalid user: User not found in database.", 404)

        role_str = str(record.get("role", "")).strip().lower()
        if role_str in ("admin", "super admin", "administrator"):
            return standard_error("Action denied: Cannot block an administrator account.", 403)

        try:
            block_user_model(uid)
            return jsonify({
                "status": "success",
                "message": "User blocked successfully."
            }), 200
        except Exception as db_err:
            return standard_error("Database error while blocking user.", 500, db_err)
    except Exception as e:
        return standard_error("Internal server error while blocking user.", 500, e)


@admin_required
def unblock(user_id=None):
    """Handle PUT /admin/users/unblock/<user_id>. Activate blocked user (is_active = True)."""
    try:
        uid_val = user_id or request.args.get("user_id") or request.args.get("id")
        if request.is_json and not uid_val:
            payload = request.get_json(force=True, silent=True) or {}
            uid_val = payload.get("user_id") or payload.get("id")

        uid, err = parse_int(uid_val, "user_id")
        if err:
            return standard_error(err, 400)

        record = get_user_model(uid)
        if not record:
            return standard_error("Invalid user: User not found in database.", 404)

        try:
            unblock_user_model(uid)
            return jsonify({
                "status": "success",
                "message": "User unblocked successfully."
            }), 200
        except Exception as db_err:
            return standard_error("Database error while unblocking user.", 500, db_err)
    except Exception as e:
        return standard_error("Internal server error while unblocking user.", 500, e)


@admin_required
def delete(user_id=None):
    """Handle DELETE /admin/users/<user_id>. Delete a user."""
    try:
        uid_val = user_id or request.args.get("user_id") or request.args.get("id")
        if request.is_json and not uid_val:
            payload = request.get_json(force=True, silent=True) or {}
            uid_val = payload.get("user_id") or payload.get("id")

        uid, err = parse_int(uid_val, "user_id")
        if err:
            return standard_error(err, 400)

        record = get_user_model(uid)
        if not record:
            return standard_error("Invalid user: User not found in database.", 404)

        role_str = str(record.get("role", "")).strip().lower()
        if role_str in ("admin", "super admin", "administrator"):
            return standard_error("Action denied: Cannot delete an administrator account.", 403)

        try:
            delete_user_model(uid)
            return jsonify({
                "status": "success",
                "message": "User deleted successfully."
            }), 200
        except Exception as db_err:
            return standard_error("Database error while deleting user.", 500, db_err)
    except Exception as e:
        return standard_error("Internal server error while deleting user.", 500, e)


# =====================================================================
# PART 3: DOCTOR VERIFICATION CONTROLLERS
# =====================================================================

@admin_required
def pending_doctors():
    """Handle GET /admin/doctors/pending. Return all pending doctors."""
    try:
        docs = get_pending_doctors_model()
        return jsonify(docs), 200
    except Exception as e:
        return standard_error("Database error while retrieving pending doctors.", 500, e)


@admin_required
def verified_doctors():
    """Handle GET /admin/doctors/verified. Return all verified doctors."""
    try:
        docs = get_verified_doctors_model()
        return jsonify(docs), 200
    except Exception as e:
        return standard_error("Database error while retrieving verified doctors.", 500, e)


@admin_required
def rejected_doctors():
    """Handle GET /admin/doctors/rejected. Return all rejected doctors."""
    try:
        docs = get_rejected_doctors_model()
        return jsonify(docs), 200
    except Exception as e:
        return standard_error("Database error while retrieving rejected doctors.", 500, e)


@admin_required
def doctor_details(doctor_id=None):
    """Handle GET /admin/doctors/<doctor_id>. Return complete doctor profile."""
    try:
        doc_id_val = doctor_id or request.args.get("doctor_id") or request.args.get("id")
        doc_id, err = parse_int(doc_id_val, "doctor_id")
        if err:
            return standard_error(err, 400)

        record = get_doctor_model(doc_id)
        if not record:
            return standard_error("Invalid doctor: Doctor not found in database.", 404)
        return jsonify(record), 200
    except Exception as e:
        return standard_error("Database error while retrieving doctor profile.", 500, e)


@admin_required
def verify(doctor_id=None):
    """Handle PUT /admin/doctors/verify/<doctor_id>. Approve doctor."""
    try:
        doc_id_val = doctor_id or request.args.get("doctor_id") or request.args.get("id")
        if request.is_json and not doc_id_val:
            payload = request.get_json(force=True, silent=True) or {}
            doc_id_val = payload.get("doctor_id") or payload.get("id")

        doc_id, err = parse_int(doc_id_val, "doctor_id")
        if err:
            return standard_error(err, 400)

        record = get_doctor_model(doc_id)
        if not record:
            return standard_error("Invalid doctor: Doctor not found in database.", 404)

        curr_status = str(record.get("verification_status", "")).strip().title()
        if curr_status in ("Verified", "Approved"):
            return standard_error("Doctor is already verified.", 400)

        admin_user = getattr(request, "admin", None)
        admin_id = admin_user["id"] if admin_user else None

        try:
            verify_doctor_model(doc_id, admin_id)
            return jsonify({
                "status": "success",
                "message": "Doctor verified successfully."
            }), 200
        except Exception as db_err:
            return standard_error("Database error while verifying doctor.", 500, db_err)
    except Exception as e:
        return standard_error("Internal server error while verifying doctor.", 500, e)


@admin_required
def reject(doctor_id=None):
    """Handle PUT /admin/doctors/reject/<doctor_id>. Reject doctor and store reason."""
    try:
        doc_id_val = doctor_id or request.args.get("doctor_id") or request.args.get("id")
        reason = None
        if request.is_json:
            payload = request.get_json(force=True, silent=True) or {}
            if not doc_id_val:
                doc_id_val = payload.get("doctor_id") or payload.get("id")
            reason = payload.get("reason")
        if not reason:
            reason = request.form.get("reason") or request.args.get("reason") or "Rejected by Admin"

        doc_id, err = parse_int(doc_id_val, "doctor_id")
        if err:
            return standard_error(err, 400)

        record = get_doctor_model(doc_id)
        if not record:
            return standard_error("Invalid doctor: Doctor not found in database.", 404)

        curr_status = str(record.get("verification_status", "")).strip().title()
        if curr_status == "Rejected":
            return standard_error("Doctor is already rejected.", 400)

        admin_user = getattr(request, "admin", None)
        admin_id = admin_user["id"] if admin_user else None

        try:
            reject_doctor_model(doc_id, admin_id, reason)
            return jsonify({
                "status": "success",
                "message": "Doctor rejected successfully.",
                "reason": reason
            }), 200
        except Exception as db_err:
            return standard_error("Database error while rejecting doctor.", 500, db_err)
    except Exception as e:
        return standard_error("Internal server error while rejecting doctor.", 500, e)


@admin_required
def search_doc():
    """Handle GET /admin/doctors/search. Search doctors by name, specialization, and status."""
    try:
        name = request.args.get("name")
        spec = request.args.get("specialization")
        status = request.args.get("verification_status")
        results = search_doctors_model(name=name, specialization=spec, verification_status=status)
        return jsonify(results), 200
    except Exception as e:
        return standard_error("Database error while searching doctors.", 500, e)


# =====================================================================
# PART 4: ADMIN DASHBOARD & ANALYTICS CONTROLLERS
# =====================================================================

@admin_required
def dashboard():
    """Handle GET /admin/dashboard. Return aggregate statistics."""
    try:
        stats = dashboard_model()
        return jsonify(stats), 200
    except Exception as e:
        return standard_error("Database error while retrieving dashboard statistics.", 500, e)


@admin_required
def revenue():
    """Handle GET /admin/dashboard/revenue. Return monthly revenue breakdown."""
    try:
        rev_data = monthly_revenue_model()
        return jsonify(rev_data), 200
    except Exception as e:
        return standard_error("Database error while retrieving revenue analytics.", 500, e)


@admin_required
def consultations():
    """Handle GET /admin/dashboard/consultations. Return consultation statistics."""
    try:
        cns_data = consultation_statistics_model()
        return jsonify(cns_data), 200
    except Exception as e:
        return standard_error("Database error while retrieving consultation statistics.", 500, e)


@admin_required
def reports():
    """Handle GET /admin/dashboard/reports. Return report statistics."""
    try:
        rep_data = report_statistics_model()
        return jsonify(rep_data), 200
    except Exception as e:
        return standard_error("Database error while retrieving report statistics.", 500, e)


@admin_required
def recent_activities():
    """Handle GET /admin/dashboard/recent-activities. Return latest activities."""
    try:
        act_data = recent_activities_model()
        return jsonify(act_data), 200
    except Exception as e:
        return standard_error("Database error while retrieving recent activities.", 500, e)


@admin_required
def summary():
    """Handle GET /admin/dashboard/system-summary. Return real-time system summary."""
    try:
        sum_data = system_summary_model()
        return jsonify(sum_data), 200
    except Exception as e:
        return standard_error("Database error while retrieving system summary.", 500, e)
