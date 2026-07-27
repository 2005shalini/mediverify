import os
import uuid
import razorpay
from config import get_db_connection


def ensure_payments_table():
    """
    Create payments table only if it does not already exist.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT NOT NULL,
            consultation_id INT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            currency VARCHAR(10) DEFAULT 'INR',
            razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
            payment_status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        cursor.execute(query)
        connection.commit()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def format_record(record):
    """
    Helper function to format date, time, and Decimal objects into strings/floats.
    """
    if not record:
        return record
    for k, v in record.items():
        if hasattr(v, 'isoformat'):
            record[k] = str(v)
        elif hasattr(v, 'seconds'):
            record[k] = str(v)
        elif type(v).__name__ == 'Decimal':
            record[k] = float(v)
    return record


def format_records(records):
    """
    Helper function to format a list of records.
    """
    if not records:
        return []
    return [format_record(r) for r in records]


def create_payment_order(amount_paise, currency="INR", receipt=None):
    """
    Create an order using the official Razorpay Python SDK.
    Handles local development/testing gracefully when mock/placeholder credentials are used.
    """
    key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mock_key_id")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_mock_key_secret")

    order_data = {
        "amount": amount_paise,
        "currency": currency,
        "receipt": receipt or f"rcpt_{uuid.uuid4().hex[:8]}"
    }

    if key_id in ("rzp_test_mock_key_id", "YOUR_RAZORPAY_KEY", "") or key_secret in ("rzp_test_mock_key_secret", ""):
        # Simulate Razorpay SDK order creation for local testing/review without live API credentials
        return {
            "id": f"order_{uuid.uuid4().hex[:14]}",
            "amount": amount_paise,
            "currency": currency,
            "status": "created",
            "receipt": order_data["receipt"]
        }
    else:
        client = razorpay.Client(auth=(key_id, key_secret))
        try:
            rzp_order = client.order.create(data=order_data)
            return rzp_order
        except razorpay.errors.RazorpayError as e:
            raise RuntimeError(f"Razorpay API error: {str(e)}") from e


def save_payment(patient_id, consultation_id, amount, currency, razorpay_order_id, status="Pending"):
    """
    Save the newly created payment order details in the database.
    """
    ensure_payments_table()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO payments (
            patient_id,
            consultation_id,
            amount,
            currency,
            razorpay_order_id,
            payment_status
        ) VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (patient_id, consultation_id, amount, currency, razorpay_order_id, status))
        new_id = cursor.lastrowid
        connection.commit()
        return new_id
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_payment_by_order_id(razorpay_order_id):
    """
    Retrieve payment record by razorpay_order_id.
    """
    ensure_payments_table()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT * FROM payments WHERE razorpay_order_id = %s", (razorpay_order_id,))
        record = cursor.fetchone()
        return format_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
