from flask import Blueprint, jsonify, request
from controllers.auth_controller import signup, login
from middleware.auth_middleware import token_required


auth_bp = Blueprint("auth", __name__)


auth_bp.route("/signup", methods=["POST"])(signup)
auth_bp.route("/login", methods=["POST"])(login)


@auth_bp.route("/profile", methods=["GET"])
@token_required
def profile():

    return jsonify({
        "message": "JWT working",
        "user": request.user
    })