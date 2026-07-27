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
    delete_user as delete_user_model
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
