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
    delete,
    pending_doctors,
    verified_doctors,
    rejected_doctors,
    doctor_details,
    verify,
    reject,
    search_doc,
    dashboard,
    revenue,
    consultations,
    reports,
    recent_activities,
    summary
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


# ==========================================================
# PART 3: DOCTOR VERIFICATION ROUTES (Defined before /<int:doctor_id> to avoid routing ambiguity)
# ==========================================================
admin_bp.route("/admin/doctors/pending", methods=["GET"])(pending_doctors)
admin_bp.route("/admin/doctors/verified", methods=["GET"])(verified_doctors)
admin_bp.route("/admin/doctors/rejected", methods=["GET"])(rejected_doctors)
admin_bp.route("/admin/doctors/search", methods=["GET"])(search_doc)
admin_bp.route("/admin/doctors/verify/<int:doctor_id>", methods=["PUT", "POST"])(verify)
admin_bp.route("/admin/doctors/reject/<int:doctor_id>", methods=["PUT", "POST"])(reject)
admin_bp.route("/admin/doctors/<int:doctor_id>", methods=["GET"])(doctor_details)

# Support fallback routes without /admin prefix
admin_bp.route("/doctors/pending", methods=["GET"], endpoint="fallback_doc_pending")(pending_doctors)
admin_bp.route("/doctors/verified", methods=["GET"], endpoint="fallback_doc_verified")(verified_doctors)
admin_bp.route("/doctors/rejected", methods=["GET"], endpoint="fallback_doc_rejected")(rejected_doctors)
admin_bp.route("/doctors/search", methods=["GET"], endpoint="fallback_doc_search")(search_doc)
admin_bp.route("/doctors/verify/<int:doctor_id>", methods=["PUT", "POST"], endpoint="fallback_doc_verify")(verify)
admin_bp.route("/doctors/reject/<int:doctor_id>", methods=["PUT", "POST"], endpoint="fallback_doc_reject")(reject)
admin_bp.route("/doctors/<int:doctor_id>", methods=["GET"], endpoint="fallback_doc_details")(doctor_details)


# ==========================================================
# PART 4: ADMIN DASHBOARD & ANALYTICS ROUTES
# ==========================================================
admin_bp.route("/admin/dashboard/revenue", methods=["GET"])(revenue)
admin_bp.route("/admin/dashboard/consultations", methods=["GET"])(consultations)
admin_bp.route("/admin/dashboard/reports", methods=["GET"])(reports)
admin_bp.route("/admin/dashboard/recent-activities", methods=["GET"])(recent_activities)
admin_bp.route("/admin/dashboard/system-summary", methods=["GET"])(summary)
admin_bp.route("/admin/dashboard", methods=["GET"])(dashboard)

# Support fallback routes without /admin prefix
admin_bp.route("/dashboard/revenue", methods=["GET"], endpoint="fallback_admin_revenue")(revenue)
admin_bp.route("/dashboard/consultations", methods=["GET"], endpoint="fallback_admin_consultations")(consultations)
admin_bp.route("/dashboard/reports", methods=["GET"], endpoint="fallback_admin_reports")(reports)
admin_bp.route("/dashboard/recent-activities", methods=["GET"], endpoint="fallback_admin_activities")(recent_activities)
admin_bp.route("/dashboard/system-summary", methods=["GET"], endpoint="fallback_admin_summary")(summary)
admin_bp.route("/dashboard", methods=["GET"], endpoint="fallback_admin_dashboard")(dashboard)
