from flask import Blueprint
from controllers.doctor_controller import (
    create_profile,
    get_profile,
    update_profile,
    delete_profile,
    get_doctors,
    search,
    update_availability,
    dashboard,
    cases,
    review,
    license_info,
    verify,
    top,
    details,
    history
)

doctor_bp = Blueprint("doctor", __name__)

# Profile management
doctor_bp.route("/doctor/profile", methods=["POST"])(create_profile)
doctor_bp.route("/doctor/profile", methods=["GET"])(get_profile)
doctor_bp.route("/doctor/profile", methods=["PUT"])(update_profile)
doctor_bp.route("/doctor/profile", methods=["DELETE"])(delete_profile)

# Doctor listings & searching
doctor_bp.route("/doctors", methods=["GET"])(get_doctors)
doctor_bp.route("/doctors/search", methods=["GET"])(search)
doctor_bp.route("/doctors/top", methods=["GET"])(top)

# Availability & Dashboard
doctor_bp.route("/doctor/availability", methods=["PUT"])(update_availability)
doctor_bp.route("/doctor/dashboard", methods=["GET"])(dashboard)
doctor_bp.route("/doctor/cases", methods=["GET"])(cases)
doctor_bp.route("/doctor/history", methods=["GET"])(history)
doctor_bp.route("/doctor/details", methods=["GET"])(details)
doctor_bp.route("/doctor/license", methods=["GET"])(license_info)

# Review patient report & Admin verify
doctor_bp.route("/doctor/review", methods=["POST"])(review)
doctor_bp.route("/admin/doctor/verify", methods=["PUT"])(verify)
