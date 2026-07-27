import os
from flask import request, jsonify
from models.payment_model import (
    create_payment_order as create_order_model,
    save_payment as save_payment_model,
    get_payment_by_order_id,
    verify_payment as verify_payment_model,
    update_payment_status,
    mark_consultation_paid,
    get_payment_history,
    get_payment as get_payment_model,
    generate_invoice as generate_invoice_model,
    refund_payment as refund_payment_model,
    payment_dashboard as payment_dashboard_model,
    monthly_revenue as monthly_revenue_model,
    recent_payments as recent_payments_model,
    payment_summary as payment_summary_model
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


def verify_payment():
    """
    Handle POST /payment/verify.
    Verifies Razorpay signature, updates payments table status,
    and updates related consultation payment_status to 'Paid'.
    """
    try:
        payload = {}
        if request.is_json:
            payload = request.get_json(force=True, silent=True) or {}
        if not payload:
            payload = request.form.to_dict() or request.args.to_dict()

        order_id = payload.get("razorpay_order_id")
        payment_id = payload.get("razorpay_payment_id")
        signature = payload.get("razorpay_signature")

        # Step 1: Validate request fields
        if not order_id or not str(order_id).strip():
            return standard_error("Invalid request: razorpay_order_id is required.", 400)
        if not payment_id or not str(payment_id).strip():
            return standard_error("Invalid request: razorpay_payment_id is required.", 400)
        if not signature or not str(signature).strip():
            return standard_error("Invalid request: razorpay_signature is required.", 400)

        # Validate order and payment exist in DB
        payment_record = get_payment_by_order_id(order_id)
        if not payment_record:
            return standard_error("Order not found: Payment order does not exist in database.", 404)

        # Step 2: Verify Razorpay Signature using SDK / model
        is_valid = verify_payment_model(order_id, payment_id, signature)

        # Step 3 & Step 4: Handle verification result
        if is_valid:
            try:
                update_payment_status(order_id, status="Success", razorpay_payment_id=payment_id)
                mark_consultation_paid(consultation_id=payment_record["consultation_id"])
            except Exception as db_err:
                return standard_error("Database error while updating payment status.", 500, str(db_err))

            return jsonify({
                "status": "success",
                "message": "Payment verified successfully."
            }), 200
        else:
            try:
                update_payment_status(order_id, status="Failed", razorpay_payment_id=payment_id)
            except Exception:
                pass
            return jsonify({
                "status": "error",
                "message": "Payment verification failed."
            }), 400

    except Exception as e:
        return standard_error("Internal server error during payment verification.", 500, e)


def payment_history(patient_id=None):
    """
    Handle GET /payment/history/<patient_id>.
    Returns list of all payments for the patient.
    """
    try:
        pid_val = patient_id or request.args.get("patient_id") or request.args.get("user_id")
        pid, err = parse_int(pid_val, "patient")
        if err:
            return standard_error(err, 400)

        if not check_user_exists(pid):
            return standard_error("Invalid patient: Patient (user) not found in database.", 404)

        try:
            history = get_payment_history(pid)
            return jsonify(history), 200
        except Exception as db_err:
            return standard_error("Database error while retrieving payment history.", 500, str(db_err))

    except Exception as e:
        return standard_error("Internal server error during payment history retrieval.", 500, e)


def payment_details(payment_id=None):
    """
    Handle GET /payment/<payment_id>.
    Returns complete details of a single payment.
    """
    try:
        pay_id_val = payment_id or request.args.get("payment_id") or request.args.get("id")
        pay_id, err = parse_int(pay_id_val, "payment")
        if err:
            return standard_error(err, 400)

        try:
            record = get_payment_model(pay_id)
            if not record:
                return standard_error("Invalid payment: Payment record not found in database.", 404)
            return jsonify(record), 200
        except Exception as db_err:
            return standard_error("Database error while retrieving payment details.", 500, str(db_err))

    except Exception as e:
        return standard_error("Internal server error during payment details retrieval.", 500, e)


def invoice(payment_id=None):
    """
    Handle GET /payment/invoice/<payment_id>.
    Returns invoice JSON data for a specific payment.
    """
    try:
        pay_id_val = payment_id or request.args.get("payment_id") or request.args.get("id")
        pay_id, err = parse_int(pay_id_val, "payment")
        if err:
            return standard_error(err, 400)

        try:
            inv_data = generate_invoice_model(pay_id)
            if not inv_data:
                return standard_error("Invalid payment: Payment record not found in database.", 404)
            return jsonify(inv_data), 200
        except Exception as db_err:
            return standard_error("Database error while generating invoice data.", 500, str(db_err))

    except Exception as e:
        return standard_error("Internal server error during invoice generation.", 500, e)


def refund():
    """
    Handle POST /payment/refund.
    Validates payment exists and is Successful, prevents duplicate refunds,
    updates status to 'Refunded', and sets refund_date.
    """
    try:
        payload = {}
        if request.is_json:
            payload = request.get_json(force=True, silent=True) or {}
        if not payload:
            payload = request.form.to_dict() or request.args.to_dict()

        pay_id_val = payload.get("payment_id") or payload.get("id")
        pay_id, err = parse_int(pay_id_val, "payment")
        if err:
            return standard_error(err, 400)

        record = get_payment_model(pay_id)
        if not record:
            return standard_error("Invalid payment: Payment record not found in database.", 404)

        current_status = str(record.get("payment_status", "")).strip().title()
        if current_status == "Refunded":
            return standard_error("Duplicate refund prevented: Payment has already been refunded.", 400)
        if current_status != "Success":
            return standard_error(f"Refund denied: Only successful payments can be refunded (current status: {current_status}).", 400)

        try:
            refund_payment_model(pay_id)
            return jsonify({
                "status": "success",
                "message": "Payment refunded successfully."
            }), 200
        except Exception as db_err:
            return standard_error("Database error while processing refund.", 500, str(db_err))

    except Exception as e:
        return standard_error("Internal server error during payment refund processing.", 500, e)


def dashboard():
    """
    Handle GET /payment/dashboard.
    Returns aggregate counts and total revenue.
    """
    try:
        stats = payment_dashboard_model()
        return jsonify(stats), 200
    except Exception as e:
        return standard_error("Database error while retrieving payment dashboard statistics.", 500, e)


def monthly_revenue():
    """
    Handle GET /payment/revenue/monthly.
    Returns monthly revenue breakdown for successful payments.
    """
    try:
        rev_data = monthly_revenue_model()
        return jsonify(rev_data), 200
    except Exception as e:
        return standard_error("Database error while retrieving monthly revenue data.", 500, e)


def recent():
    """
    Handle GET /payment/recent.
    Returns latest 10 payment transactions.
    """
    try:
        recents = recent_payments_model()
        return jsonify(recents), 200
    except Exception as e:
        return standard_error("Database error while retrieving recent payments.", 500, e)


def summary():
    """
    Handle GET /payment/summary.
    Returns temporal payment counts and transaction size averages.
    """
    try:
        summ = payment_summary_model()
        return jsonify(summ), 200
    except Exception as e:
        return standard_error("Database error while retrieving payment summary data.", 500, e)
