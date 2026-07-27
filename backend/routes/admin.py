from flask import Blueprint
from controllers.admin_controller import login, profile, logout

admin_bp = Blueprint("admin", __name__)

# Register Admin Authentication routes
admin_bp.route("/admin/login", methods=["POST"])(login)
admin_bp.route("/admin/profile", methods=["GET"])(profile)
admin_bp.route("/admin/logout", methods=["POST"])(logout)

# Support fallback routes in case blueprint is mounted with URL prefix
admin_bp.route("/login", methods=["POST"])(login)
admin_bp.route("/profile", methods=["GET"])(profile)
admin_bp.route("/logout", methods=["POST"])(logout)
