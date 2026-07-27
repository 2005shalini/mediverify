import jwt
from flask import request, jsonify
from functools import wraps
from config import SECRET_KEY
from models.admin_model import get_admin


def admin_required(f):
    """
    Middleware decorator to protect admin routes.
    Verifies JWT token in Authorization header, checks if admin exists and is active,
    and attaches admin object to request.admin.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")

        if auth_header:
            try:
                parts = auth_header.split(" ")
                if len(parts) == 2 and parts[0].lower() == "bearer":
                    token = parts[1]
                else:
                    token = parts[-1]
            except Exception:
                return jsonify({
                    "status": "error",
                    "message": "Invalid token format."
                }), 401

        if not token:
            return jsonify({
                "status": "error",
                "message": "Access denied: Missing JWT token."
            }), 401

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )
            admin_id = payload.get("admin_id") or payload.get("id")
            if not admin_id:
                return jsonify({
                    "status": "error",
                    "message": "Access denied: Invalid token payload."
                }), 401

            admin = get_admin(admin_id)
            if not admin:
                return jsonify({
                    "status": "error",
                    "message": "Access denied: Admin account not found."
                }), 401

            if not admin.get("is_active", True):
                return jsonify({
                    "status": "error",
                    "message": "Access denied: Admin account is inactive."
                }), 403

            request.admin = admin

        except jwt.ExpiredSignatureError:
            return jsonify({
                "status": "error",
                "message": "Access denied: JWT token has expired."
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "status": "error",
                "message": "Access denied: Invalid JWT token."
            }), 401

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": "Access denied: Token verification failed."
            }), 401

        return f(*args, **kwargs)

    return decorated
