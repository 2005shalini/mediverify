from flask import request, jsonify

import bcrypt
import jwt
import datetime
import os

from models.user_model import get_user_by_email, create_user


# ==================================================
# SIGNUP API
# ==================================================
def signup():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # Validation
    if not name or not email or not password or not role:
        return jsonify({
            "message": "All fields are required"
        }), 400

    # Check if email already exists
    user = get_user_by_email(email)

    if user:
        return jsonify({
            "message": "Email already registered"
        }), 400

    # Hash password
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    # Save user
    create_user(
        name,
        email,
        hashed_password.decode("utf-8"),
        role
    )

    return jsonify({
        "message": "Signup Successful"
    }), 201


# ==================================================
# LOGIN API
# ==================================================
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Validation
    if not email or not password:
        return jsonify({
            "message": "Email and Password are required"
        }), 400

    # Check if user exists
    user = get_user_by_email(email)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    # Verify password
    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    ):
        return jsonify({
            "message": "Invalid password"
        }), 401

    # Generate JWT Token
    token = jwt.encode(
        {
            "user_id": user["id"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        os.getenv("SECRET_KEY"),
        algorithm="HS256"
    )

    return jsonify({
        "message": "Login Successful",
        "token": token
    }), 200
