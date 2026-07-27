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


def ensure_users_active_column():
    """Ensure users table has is_active column."""
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER is_verified")
        connection.commit()
    except Exception:
        pass
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def format_user_record(record):
    if not record:
        return None
    return {
        "id": record["id"],
        "name": record["full_name"],
        "email": record["email"],
        "role": record["role"],
        "phone": record.get("phone") or "",
        "profile_image": record.get("profile_image") or "",
        "is_verified": bool(record.get("is_verified", False)),
        "is_active": bool(record.get("is_active", True)),
        "created_at": str(record.get("created_at", "")),
        "updated_at": str(record.get("updated_at", ""))
    }


def get_all_users():
    """Retrieve all registered users (excluding password)."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, role, phone, profile_image, is_verified, is_active, created_at, updated_at FROM users ORDER BY id DESC")
        records = cursor.fetchall()
        return [format_user_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_user(user_id):
    """Retrieve complete details of a single user by ID."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, role, phone, profile_image, is_verified, is_active, created_at, updated_at FROM users WHERE id = %s", (user_id,))
        record = cursor.fetchone()
        return format_user_record(record)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def search_users(name=None, email=None):
    """Search registered users by name and/or email."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, full_name, email, role, phone, profile_image, is_verified, is_active, created_at, updated_at FROM users WHERE 1=1"
        params = []
        if name and str(name).strip():
            query += " AND full_name LIKE %s"
            params.append(f"%{str(name).strip()}%")
        if email and str(email).strip():
            query += " AND email LIKE %s"
            params.append(f"%{str(email).strip()}%")
        query += " ORDER BY id DESC"
        cursor.execute(query, tuple(params))
        records = cursor.fetchall()
        return [format_user_record(r) for r in records]
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def block_user(user_id):
    """Block a user by setting is_active to False."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET is_active = False WHERE id = %s", (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def unblock_user(user_id):
    """Unblock a user by setting is_active to True."""
    ensure_users_active_column()
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET is_active = True WHERE id = %s", (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def delete_user(user_id):
    """Delete a user from the database."""
    connection = get_db_connection()
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        connection.commit()
        return cursor.rowcount > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
