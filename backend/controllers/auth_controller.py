from flask import request, jsonify

import bcrypt

from models.user_model import get_user_by_email, create_user

def signup():

    data = request.get_json()

    name = data.get("name")

    email = data.get("email")

    password = data.get("password")

    role = data.get("role")

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

        "message": "Signup Successful "

    }), 201

def login():

    return jsonify({

        "message": "Login API Coming Soon "

    })
