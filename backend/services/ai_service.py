"""
Mock AI Service for medical report analysis.
Designed as a clean placeholder for Phase 5 Part 2 so that Phase 5 Part 3 can later
integrate OpenAI / Gemini without modifying controllers or routes.
"""

def analyze_report_mock(report_data):
    """
    Simulate AI analysis on an uploaded medical report.
    Returns structured analysis containing summary, detected diseases, medicines,
    abnormal values, risk level, and recommendations.
    """
    title = str(report_data.get("report_title", "")).lower() if report_data else ""
    report_type = str(report_data.get("report_type", "")).lower() if report_data else ""

    if "sugar" in title or "diabetes" in title or "glucose" in title:
        return {
            "report_summary": "Fasting blood glucose levels are slightly elevated above normal reference range.",
            "detected_diseases": ["Pre-Diabetes", "Insulin Resistance"],
            "detected_medicines": ["Metformin 500mg"],
            "abnormal_values": ["Fasting Blood Sugar High (118 mg/dL)"],
            "risk_level": "Medium",
            "recommendation": "Adopt a low-glycemic diet, increase daily physical activity, and consult an endocrinologist.",
            "analysis_status": "Completed"
        }
    elif "lipid" in title or "cholesterol" in title or "heart" in title:
        return {
            "report_summary": "Lipid profile shows elevated LDL cholesterol and triglycerides.",
            "detected_diseases": ["Hypercholesterolemia", "Mild Dyslipidemia"],
            "detected_medicines": ["Atorvastatin 10mg", "Omega-3 Fatty Acids"],
            "abnormal_values": ["LDL Cholesterol High (165 mg/dL)", "Triglycerides High (210 mg/dL)"],
            "risk_level": "Medium",
            "recommendation": "Reduce saturated fat intake, perform aerobic exercises 4-5 times a week, and follow up in 3 months.",
            "analysis_status": "Completed"
        }
    else:
        # Default mock analysis (matches example in requirements)
        return {
            "report_summary": "Blood report indicates mild infection.",
            "detected_diseases": ["Iron Deficiency", "Viral Fever"],
            "detected_medicines": ["Paracetamol", "Vitamin C"],
            "abnormal_values": ["WBC High", "Hemoglobin Low"],
            "risk_level": "Low",
            "recommendation": "Consult physician and repeat blood test after one week.",
            "analysis_status": "Completed"
        }
