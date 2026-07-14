# 🩺 MediVerify

# API Documentation

## Authentication APIs

### Register Patient

POST /api/patient/register

### Login Patient

POST /api/patient/login

### Register Doctor

POST /api/doctor/register

### Login Doctor

POST /api/doctor/login

### Admin Login

POST /api/admin/login

---

## Patient APIs

### Get Patient Profile

GET /api/patient/profile

### Update Patient Profile

PUT /api/patient/profile

### Create Consultation

POST /api/consultation

### Get My Consultations

GET /api/consultation/my

### Get Consultation Details

GET /api/consultation/:id

### Upload Medical Report

POST /api/report/upload

---

## Doctor APIs

### Get Assigned Cases

GET /api/doctor/cases

### Get Consultation Details

GET /api/doctor/case/:id

### Submit Recommendation

POST /api/doctor/recommendation

### Update Availability

PUT /api/doctor/availability

---

## Chat APIs

### Send Message

POST /api/chat/send

### Get Messages

GET /api/chat/:consultationId

---

## AI APIs

### Generate Medical Summary

POST /api/ai/summary

---

## Admin APIs

### Get All Doctors

GET /api/admin/doctors

### Verify Doctor

PUT /api/admin/verify-doctor/:id

### Get All Patients

GET /api/admin/patients

### Get Dashboard Analytics

GET /api/admin/dashboard

---

## Future APIs

POST /api/payment

POST /api/video-call

POST /api/notification

POST /api/review

POST /api/lab-booking