import jwt
from flask import request, jsonify
from functools import wraps
from config import SECRET_KEY


def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        # Header se token lena
        auth_header = request.headers.get("Authorization")

        if auth_header:
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({
                    "message": "Invalid token format"
                }), 401


        if not token:
            return jsonify({
                "message": "Token missing"
            }), 401


        try:
            # JWT verify
            data = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

            request.user = data

        except jwt.ExpiredSignatureError:
            return jsonify({
                "message": "Token expired"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "message": "Invalid token"
            }), 401


        return f(*args, **kwargs)


    return decorated