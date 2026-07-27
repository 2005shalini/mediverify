from flask import Blueprint, request
from controllers.admin_controller import (
    login,
    profile,
    logout,
    users,
    user,
    search,
    block,
    unblock,
    delete
)

admin_bp = Blueprint("admin", __name__)

# ==========================================================
# PART 1: ADMIN AUTHENTICATION ROUTES
# ==========================================================
admin_bp.route("/admin/login", methods=["POST"])(login)
admin_bp.route("/admin/profile", methods=["GET"])(profile)
admin_bp.route("/admin/logout", methods=["POST"])(logout)

# Support fallback routes in case blueprint is mounted with URL prefix
admin_bp.route("/login", methods=["POST"], endpoint="fallback_login")(login)
admin_bp.route("/profile", methods=["GET"], endpoint="fallback_profile")(profile)
admin_bp.route("/logout", methods=["POST"], endpoint="fallback_logout")(logout)


# ==========================================================
# PART 2: USER MANAGEMENT ROUTES (Defined before /<int:user_id> to avoid routing ambiguity)
# ==========================================================
admin_bp.route("/admin/users/search", methods=["GET"])(search)
admin_bp.route("/admin/users/block/<int:user_id>", methods=["PUT", "POST"])(block)
admin_bp.route("/admin/users/unblock/<int:user_id>", methods=["PUT", "POST"])(unblock)
admin_bp.route("/admin/users/<int:user_id>", methods=["GET"])(user)
admin_bp.route("/admin/users/<int:user_id>", methods=["DELETE"])(delete)
admin_bp.route("/admin/users", methods=["GET"])(users)

# Support fallback routes without /admin prefix
admin_bp.route("/users/search", methods=["GET"], endpoint="fallback_users_search")(search)
admin_bp.route("/users/block/<int:user_id>", methods=["PUT", "POST"], endpoint="fallback_users_block")(block)
admin_bp.route("/users/unblock/<int:user_id>", methods=["PUT", "POST"], endpoint="fallback_users_unblock")(unblock)
admin_bp.route("/users/<int:user_id>", methods=["GET"], endpoint="fallback_users_get")(user)
admin_bp.route("/users/<int:user_id>", methods=["DELETE"], endpoint="fallback_users_delete")(delete)
admin_bp.route("/users", methods=["GET"], endpoint="fallback_users_all")(users)
