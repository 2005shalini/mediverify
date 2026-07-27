from flask import Blueprint
from controllers.payment_controller import create_order, verify_payment

payment_bp = Blueprint("payment", __name__)

# Register Razorpay Order Creation endpoints
payment_bp.route("/payment/create-order", methods=["POST"])(create_order)
payment_bp.route("/payment/create_order", methods=["POST"])(create_order)
payment_bp.route("/payment/order", methods=["POST"])(create_order)

# Register Razorpay Payment Verification endpoints
payment_bp.route("/payment/verify", methods=["POST"])(verify_payment)
payment_bp.route("/payment/verify_payment", methods=["POST"])(verify_payment)
