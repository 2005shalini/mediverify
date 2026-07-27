from flask import Blueprint
from controllers.payment_controller import create_order

payment_bp = Blueprint("payment", __name__)

# Register Razorpay Order Creation endpoint exactly as specified
payment_bp.route("/payment/create-order", methods=["POST"])(create_order)

# Register fallback routes for client flexibility
payment_bp.route("/payment/create_order", methods=["POST"])(create_order)
payment_bp.route("/payment/order", methods=["POST"])(create_order)
