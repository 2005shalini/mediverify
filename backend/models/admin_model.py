import os
import bcrypt
from config import get_db_connection


def ensure_admins_table():
    """
    Create admins table only if it does not already exist.
    """
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'Super Admin',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        cursor.execute(query)
        connection.commit()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def create_default_admin():
    """
    Create one default admin if admins table is empty.
    Name: System Administrator
    Email: admin@mediverify.com
    Password: Admin@123 (hashed using bcrypt)
    Role: Super Admin
    """
    ensure_admins_table()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) AS cnt FROM admins")
        res = cursor.fetchone()
        if res and res["cnt"] == 0:
            hpw = bcrypt.hashpw(b"Admin@123", bcrypt.gensalt()).decode("utf-8")
            insert_query = """
            INSERT INTO admins (full_name, email, password, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, ("System Administrator", "admin@mediverify.com", hpw, "Super Admin", 1))
            connection.commit()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def admin_login(email, password):
    """
    Verify admin credentials.
    Returns (admin_dict, error_message).
    """
    create_default_admin()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM admins WHERE email = %s", (email,))
        admin = cursor.fetchone()
        if not admin:
            return None, "Invalid email or password."

        if not admin.get("is_active", True):
            return None, "Admin account is inactive."

        stored_pw = admin["password"]
        if not bcrypt.checkpw(password.encode("utf-8"), stored_pw.encode("utf-8")):
            return None, "Invalid email or password."

        return admin, None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_admin(admin_id):
    """
    Retrieve admin profile details by ID (excluding password).
    """
    create_default_admin()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, role, is_active, created_at, updated_at FROM admins WHERE id = %s", (admin_id,))
        admin = cursor.fetchone()
        return admin
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
