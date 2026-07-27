import datetime
import jwt
from flask import request, jsonify
from config import SECRET_KEY
from models.admin_model import admin_login, get_admin
from middleware.admin_auth import admin_required


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
