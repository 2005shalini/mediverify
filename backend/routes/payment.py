from flask import Blueprint
from controllers.payment_controller import (
    create_order,
    verify_payment,
    payment_history,
    payment_details,
    invoice,
    refund,
    dashboard,
    monthly_revenue,
    recent,
    summary
)

payment_bp = Blueprint("payment", __name__)

# Register Razorpay Order Creation endpoints
payment_bp.route("/payment/create-order", methods=["POST"])(create_order)
payment_bp.route("/payment/create_order", methods=["POST"])(create_order)
payment_bp.route("/payment/order", methods=["POST"])(create_order)

# Register Razorpay Payment Verification endpoints
payment_bp.route("/payment/verify", methods=["POST"])(verify_payment)
payment_bp.route("/payment/verify_payment", methods=["POST"])(verify_payment)

# Register Refund endpoint
payment_bp.route("/payment/refund", methods=["POST"])(refund)

# Register Payment Dashboard & Analytics endpoints (defined before /<int:payment_id> to avoid routing ambiguity)
payment_bp.route("/payment/dashboard", methods=["GET"])(dashboard)
payment_bp.route("/payment/revenue/monthly", methods=["GET"])(monthly_revenue)
payment_bp.route("/payment/recent", methods=["GET"])(recent)
payment_bp.route("/payment/summary", methods=["GET"])(summary)

# Register Payment History endpoints
payment_bp.route("/payment/history/<int:patient_id>", methods=["GET"])(payment_history)
payment_bp.route("/payment/history", methods=["GET"])(payment_history)

# Register Invoice Generation endpoints (no PDF in this phase)
payment_bp.route("/payment/invoice/<int:payment_id>", methods=["GET"])(invoice)
payment_bp.route("/payment/invoice", methods=["GET"])(invoice)

# Register Single Payment Details endpoints
payment_bp.route("/payment/<int:payment_id>", methods=["GET"])(payment_details)
payment_bp.route("/payment/details/<int:payment_id>", methods=["GET"])(payment_details)
payment_bp.route("/payment/details", methods=["GET"])(payment_details)
