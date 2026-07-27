import os
from flask import request, jsonify
from models.payment_model import (
    create_payment_order as create_order_model,
    save_payment as save_payment_model
)
from models.report_model import check_user_exists
from models.consultation_model import get_consultation as get_consultation_model


def parse_int(val, field_name):
    """Parse positive integer, returning (int_val, error_msg)."""
    if val is None or str(val).strip() == "":
        return None, f"Invalid {field_name}: {field_name} is required."
    try:
        int_val = int(val)
        if int_val <= 0:
            return None, f"Invalid {field_name}: {field_name} must be a positive integer > 0."
        return int_val, None
    except ValueError:
        return None, f"Invalid {field_name}: {field_name} must be a valid integer."


def parse_amount(val):
    """Parse amount, returning (float_val, error_msg)."""
    if val is None or str(val).strip() == "":
        return None, "Invalid amount: amount is required."
    try:
        float_val = float(val)
        if float_val <= 0:
            return None, "Invalid amount: amount must be greater than zero."
        return float_val, None
    except ValueError:
        return None, "Invalid amount: amount must be a valid numeric number."


def standard_error(message, status_code=400, details=None):
    """Return standardized JSON error response."""
    resp = {"status": "error", "message": message}
    if details:
        resp["details"] = str(details)
    return jsonify(resp), status_code


def create_order():
    """
    Handle POST /payment/create-order.
    Validates patient and consultation, converts amount to paise,
    creates Razorpay order via SDK, saves payment in DB, and returns order details.
    """
    try:
        payload = {}
        if request.is_json:
            payload = request.get_json(force=True, silent=True) or {}
        if not payload:
            payload = request.form.to_dict() or request.args.to_dict()

        # Step 1: Validate patient
        pid_val = payload.get("patient_id") or payload.get("user_id")
        pid, err = parse_int(pid_val, "patient")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(pid):
            return standard_error("Invalid patient: Patient (user) not found in database.", 404)

        # Step 2: Validate consultation
        cid_val = payload.get("consultation_id")
        cid, err = parse_int(cid_val, "consultation")
        if err:
            return standard_error(err, 400)

        consultation = get_consultation_model(consultation_id=cid)
        if not consultation:
            return standard_error("Invalid consultation: Consultation not found in database.", 404)

        if int(consultation.get("patient_id", 0)) != pid:
            return standard_error("Invalid consultation: Consultation does not belong to the specified patient.", 403)

        # Step 3: Validate amount
        amount_val, err = parse_amount(payload.get("amount"))
        if err:
            return standard_error(err, 400)

        # Convert amount to paise (e.g. 500 becomes 50000)
        amount_paise = int(round(amount_val * 100))
        currency = payload.get("currency", "INR").upper()

        # Create Razorpay Order
        try:
            rzp_order = create_order_model(amount_paise, currency=currency, receipt=f"rcpt_{cid}_{pid}")
            razorpay_order_id = rzp_order.get("id")
            if not razorpay_order_id:
                return standard_error("Razorpay API error: Order ID not returned by Razorpay.", 502)
        except RuntimeError as rzp_err:
            return standard_error("Razorpay API error: Failed to generate order.", 502, str(rzp_err))

        # Save Order in database
        try:
            save_payment_model(
                patient_id=pid,
                consultation_id=cid,
                amount=amount_val,
                currency=currency,
                razorpay_order_id=razorpay_order_id,
                status="Pending"
            )
        except Exception as db_err:
            return standard_error("Database error while saving payment order.", 500, str(db_err))

        # Return exact required JSON format
        key_id = os.getenv("RAZORPAY_KEY_ID")
        if not key_id or key_id == "rzp_test_mock_key_id":
            key_id = "YOUR_RAZORPAY_KEY"

        return jsonify({
            "status": "success",
            "order_id": razorpay_order_id,
            "amount": amount_paise,
            "currency": currency,
            "key": key_id
        }), 200

    except Exception as e:
        return standard_error("Internal server error during payment order creation.", 500, e)
