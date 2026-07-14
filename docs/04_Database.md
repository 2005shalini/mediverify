# 🩺 MediVerify

# Database Design

## Database

PostgreSQL

---

# 1. Patients Table

| Column | Type |
|----------|------|
| patient_id | UUID (PK) |
| full_name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| phone | VARCHAR |
| gender | VARCHAR |
| age | INTEGER |
| blood_group | VARCHAR |
| city | VARCHAR |
| created_at | TIMESTAMP |

---

# 2. Doctors Table

| Column | Type |
|----------|------|
| doctor_id | UUID (PK) |
| full_name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| specialization | VARCHAR |
| qualification | VARCHAR |
| experience | INTEGER |
| hospital | VARCHAR |
| city | VARCHAR |
| consultation_fee | DECIMAL |
| medical_license | VARCHAR |
| status | VARCHAR |
| created_at | TIMESTAMP |

---

# 3. Consultation Table

| Column | Type |
|----------|------|
| consultation_id | UUID (PK) |
| patient_id | UUID (FK) |
| doctor_id | UUID (FK) |
| disease_category | VARCHAR |
| symptoms | TEXT |
| treatment_duration | VARCHAR |
| status | VARCHAR |
| ai_summary | TEXT |
| recommendation | TEXT |
| created_at | TIMESTAMP |

---

# 4. Medical Reports Table

| Column | Type |
|----------|------|
| report_id | UUID (PK) |
| consultation_id | UUID (FK) |
| report_name | VARCHAR |
| report_url | TEXT |
| uploaded_at | TIMESTAMP |

---

# 5. Chat Table

| Column | Type |
|----------|------|
| chat_id | UUID (PK) |
| consultation_id | UUID (FK) |
| sender_role | VARCHAR |
| message | TEXT |
| created_at | TIMESTAMP |

---

# 6. Admin Table

| Column | Type |
|----------|------|
| admin_id | UUID (PK) |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |

---

# Relationships

Patient

↓

Many Consultations

↓

One Doctor

↓

Many Reports

↓

Many Chats

---

# Entity Relationships

Patient

1 ---- M Consultation

Doctor

1 ---- M Consultation

Consultation

1 ---- M Reports

Consultation

1 ---- M Chats