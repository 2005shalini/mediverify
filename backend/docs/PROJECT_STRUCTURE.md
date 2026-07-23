MediVerify Project Structure

Project Overview----

MediVerify is a healthcare platform that helps patients manage their current treatment, medicines, and medical history while allowing them to consult verified doctors.

Main Goals

* Maintain current treatment details
* Consult doctors regarding ongoing treatment and medicines
* Track medicines and medication schedules
* Manage medical history
* Provide secure healthcare communication

Overall Project Structure-----
MediVerify/

│
├── frontend/
│
├── backend/
│
├── database/
│
├── docs/
│
└── README.md

Backend Structure
backend/

│
├── app.py
├── config.py
├── requirements.txt
├── .env
├── .gitignore
│
├── routes/
├── controllers/
├── models/
├── services/
├── middleware/
├── utils/
├── database/
├── uploads/
├── docs/
└── tests/

Folder Explanation

app.py

Purpose:
Main entry point of Flask backend.

Work:

* Create Flask application
* Register routes
* Run backend server

Flow:

Request
   ↓
app.py
   ↓
Routes
   ↓
Controllers

config.py

Purpose:
Manage project configuration.

Work:

* Database connection
* Load environment variables
* Manage JWT secret key

⸻

.env

Purpose:
Store sensitive information securely.

Contains:

* Database credentials
* JWT SECRET_KEY

Reason:
Private information should not be exposed on GitHub.

⸻

Routes Folder

Purpose:
Contains all API endpoints.

Structure:
routes/

├── auth.py
├── patient.py
├── doctor.py
├── consultation.py
├── treatment.py
├── medicine.py
└── admin.py

auth.py

Handles:

* Signup
* Login
* JWT authentication

patient.py

Handles patient features:

* Patient profile
* Current treatment details
* Medicine tracking
* Medical history

doctor.py

Handles doctor features:

* Doctor profile
* Patient consultation
* Treatment advice

consultation.py

Handles:

* Doctor consultation
* Appointment management
* Follow-ups

treatment.py

Handles:

* Add current treatment
* Update treatment
* Treatment history

medicine.py

Handles:

* Add medicines
* Medicine schedule
* Medicine tracking

admin.py

Handles:

* Doctor verification
* User management

⸻

Controllers Folder

Purpose:
Contains business logic of APIs.

Example:
controllers/auth_controller.py

Handles:

* Request processing
* Validation
* Password hashing
* JWT token generation

Flow:
Route
 ↓
Controller
 ↓
Service / Model
 ↓
Database

Models Folder

Purpose:
Handles database operations.

Work:

* Insert data
* Fetch data
* Update data
* Delete data

Example:
user_model.py
medicine_model.py
treatment_model.py

Services Folder

Purpose:
Contains reusable and complex logic.

Examples:

* Notification service
* AI service
* Doctor verification service
* Medicine reminder service

⸻

Middleware Folder

Purpose:
Security layer between request and API.

Contains:
auth_middleware.py
role_middleware.py
Work:

* Verify JWT token
* Check user permissions

Flow:
User Request
      ↓
JWT Middleware
      ↓
API Access

Utils Folder

Purpose:
Common helper functions.

Examples:

* Validators
* Response formatting
* Utility functions

⸻

Database Folder

Purpose:
Database related files.

Contains:

* Database connection
* SQL schema
* Initial data

Database Tables:
users
patients
doctors
consultations
treatments
medicines
medical_records
prescriptions

Uploads Folder

Purpose:
Store uploaded documents.

Examples:

* Medical reports
* Doctor certificates
* Prescriptions

⸻

Tests Folder

Purpose:
API testing.

Contains:

* Authentication tests
* Patient API tests
* Doctor API tests

⸻

Backend Request Flow
Frontend
    ↓
Routes
    ↓
Controllers
    ↓
Services
    ↓
Models
    ↓
Database

Authentication Flow

Signup
User
 ↓
Signup API
 ↓
Validate Data
 ↓
Hash Password
 ↓
Save User

Login
User
 ↓
Login API
 ↓
Verify Password
 ↓
Generate JWT Token
 ↓
Access Granted

Protected API
Request
 ↓
JWT Token
 ↓
Middleware Verification
 ↓
API Response