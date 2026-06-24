import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json

from backend.database import (
    get_incidents, add_incident,
    get_sos_alerts, add_sos,
    get_shelters, update_shelter_resources,
    get_volunteers, add_volunteer,
    get_volunteer_requests, add_volunteer_request,
    get_family_members, update_family_status,
    get_news, add_news
)
from backend.agents import (
    call_gemini,
    execute_multi_agent_workflow,
    analyze_disaster_image,
    LifeBridgeAgents
)

app = FastAPI(title="LifeBridge AI Backend", description="Emergency Response & Disaster Assistant API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Requests
class ChatRequest(BaseModel):
    message: str

class FirstAidRequest(BaseModel):
    injury: str

class RiskPredictionRequest(BaseModel):
    rainfall: float
    wind_speed: float
    water_level: float
    temperature: float
    humidity: float

class KitRequest(BaseModel):
    members: int
    children: int
    elderly: int
    pets: int

class SOSRequest(BaseModel):
    name: str
    message: str
    phone: str
    type: str
    location: Dict[str, Any]

class IncidentRequest(BaseModel):
    type: str
    title: str
    description: str
    location: Dict[str, Any]
    severity: str
    reported_by: str

class VolunteerRequest(BaseModel):
    name: str
    skills: List[str]
    availability: str
    location: Dict[str, Any]
    phone: str

class VictimHelpRequest(BaseModel):
    need_type: str
    location: Dict[str, Any]
    name: str
    phone: str
    description: str

class FamilyStatusRequest(BaseModel):
    name: str
    status: str
    location: str

class WorkflowRequest(BaseModel):
    report: str

# API Routes

@app.get("/")
def read_root():
    return {"status": "running", "service": "LifeBridge AI API"}

# 1. Incidents & Alerts
@app.get("/api/incidents")
def fetch_incidents():
    return get_incidents()

@app.post("/api/incidents")
def create_incident(req: IncidentRequest):
    new_inc = req.dict()
    new_inc["status"] = "active"
    return add_incident(new_inc)

# 2. SOS emergency mode
@app.get("/api/sos")
def fetch_sos():
    return get_sos_alerts()

@app.post("/api/sos")
def trigger_sos(req: SOSRequest):
    sos_data = req.dict()
    return add_sos(sos_data)

# 3. Shelters & Resources
@app.get("/api/shelters")
def fetch_shelters():
    return get_shelters()

@app.patch("/api/shelters/{shelter_id}/resources")
def patch_shelter_resources(shelter_id: str, resources: Dict[str, int]):
    shelter = update_shelter_resources(shelter_id, resources)
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return shelter

# 4. Volunteer Matching System
@app.get("/api/volunteers")
def fetch_volunteers():
    return get_volunteers()

@app.post("/api/volunteers")
def register_volunteer(req: VolunteerRequest):
    return add_volunteer(req.dict())

@app.get("/api/volunteer-requests")
def fetch_volunteer_requests():
    return get_volunteer_requests()

@app.post("/api/volunteer-requests")
def create_volunteer_request(req: VictimHelpRequest):
    new_req = add_volunteer_request(req.dict())
    
    # Try to auto-match with volunteers
    volunteers = get_volunteers()
    matched = []
    
    # Simple logic: match if skill matches help request
    for vol in volunteers:
        for skill in vol["skills"]:
            if skill.lower() in req.need_type.lower() or req.need_type.lower() in skill.lower() or "general" in skill.lower():
                matched.append({
                    "name": vol["name"],
                    "phone": vol["phone"],
                    "skills": vol["skills"]
                })
                break
                
    new_req["matched_volunteers"] = matched[:3] # Return top 3 matches
    return new_req

# 5. Family Safety Tracker
@app.get("/api/family-safety")
def fetch_family():
    return get_family_members()

@app.post("/api/family-safety")
def update_family(req: FamilyStatusRequest):
    return update_family_status(req.name, req.status, req.location)

# 6. News Monitoring Agent
@app.get("/api/news")
def fetch_news():
    return get_news()

# 7. AI Chatbot
@app.post("/api/chatbot")
def chatbot_interaction(req: ChatRequest):
    system_instruction = (
        "You are the LifeBridge Emergency Chatbot. Provide helpful, accurate, and direct safety advice "
        "for natural disasters like floods, cyclones, earthquakes, landslides, and fires. Focus on safety tips, "
        "preparedness steps, and extraction guidelines. Keep your responses organized with markdown bullet points."
    )
    answer = call_gemini(req.message, system_instruction)
    return {"response": answer}

# 8. First Aid Assistant
@app.post("/api/firstaid")
def firstaid_interaction(req: FirstAidRequest):
    system_instruction = (
        "You are the LifeBridge First Aid Assistant. Provide immediate, structured, step-by-step first aid "
        "recommandations for the specified injury. Always end with a warning that the user must seek professional "
        "medical help immediately. Return the details in JSON format containing fields: injury, immediate_response, "
        "safety_steps (list), recommendation, disclaimer."
    )
    res_str = call_gemini(req.injury, system_instruction, is_json=True)
    try:
        data = json.loads(res_str)
    except Exception:
        # Triage manual simulation if JSON parse fails
        data = {
            "injury": req.injury,
            "immediate_response": "Keep patient warm and calm. Avoid moving them.",
            "safety_steps": ["Check breathing and airway", "Apply clean dressing", "Elevate limb if bleeding"],
            "recommendation": "Seek emergency response unit dispatch immediately.",
            "disclaimer": "Seek professional medical help immediately."
        }
    return data

# 9. Disaster Risk Predictor
@app.post("/api/predict-risk")
def predict_risk(req: RiskPredictionRequest):
    inputs = req.dict()
    system_instruction = (
        "You are the LifeBridge Disaster Prediction Agent. Analyze weather metrics and compute a hazard risk score (0-100), "
        "a risk level (Low Risk, Medium Risk, High Risk), and specific safety recommendations. Return JSON format with fields: "
        "risk_score (int), risk_level (string), recommendations (list of strings)."
    )
    res_str = call_gemini(json.dumps(inputs), system_instruction, is_json=True)
    try:
        data = json.loads(res_str)
    except Exception:
        # Simple local heuristic fallback
        score = int((req.rainfall * 0.4) + (req.wind_speed * 0.3) + (req.water_level * 10 * 0.3))
        score = min(max(score, 5), 100)
        level = "High Risk" if score > 70 else "Medium Risk" if score > 35 else "Low Risk"
        data = {
            "risk_score": score,
            "risk_level": level,
            "recommendations": ["Evacuate low structures" if level == "High Risk" else "Check emergency reserves"]
        }
    return data

# 10. Smart Emergency Kit Generator
@app.post("/api/kit-generator")
def generate_kit(req: KitRequest):
    inputs = req.dict()
    system_instruction = (
        "You are the LifeBridge Smart Emergency Kit Generator. Formulate a personalized 3-day survival kit list "
        "based on the family count, kids, elders, and pets. Define clean water volume in Liters, food amount in count, "
        "medical supplies lists, survival tools lists, and crucial help numbers. Return JSON format with fields: "
        "water_requirement (string), food_supplies (string), medicine_checklist (list of strings), supplies_checklist (list of strings), "
        "emergency_contacts (list of dicts with name & number)."
    )
    res_str = call_gemini(json.dumps(inputs), system_instruction, is_json=True)
    try:
        data = json.loads(res_str)
    except Exception:
        # Custom mock fallback
        data = {
            "water_requirement": f"{req.members * 12} Liters of clean water (3-day buffer)",
            "food_supplies": f"{req.members * 9} Ready-to-eat meals",
            "medicine_checklist": ["Painkillers", "Bandages"],
            "supplies_checklist": ["Flashlight", "Batteries"],
            "emergency_contacts": [{"name": "Emergency Line", "number": "112"}]
        }
    return data

# 11. Smart Emergency Kit PDF/Markdown Download
@app.post("/api/kit/download")
def download_kit_report(req: KitRequest):
    # Generates a clean printable markdown text file
    kit_data = generate_kit(req)
    
    report_content = f"""# LIFEBRIDGE AI - EMERGENCY SURVIVAL KIT
Generated on: Live Command Center System
Household Size: {req.members} members (Children: {req.children}, Elderly: {req.elderly}, Pets: {req.pets})
==================================================

1. WATER AND HYDRATION BUFFER
--------------------------------------------------
{kit_data.get('water_requirement', '12 Liters per member')}

2. SUSTENANCE AND FOOD
--------------------------------------------------
{kit_data.get('food_supplies', '3-day ration supplies')}

3. CUSTOM MEDICAL CHECKLIST
--------------------------------------------------
"""
    for med in kit_data.get('medicine_checklist', []):
        report_content += f"[] {med}\n"
        
    report_content += "\n4. ADVANCED SURVIVAL EQUIPMENT\n--------------------------------------------------\n"
    for item in kit_data.get('supplies_checklist', []):
        report_content += f"[] {item}\n"
        
    report_content += "\n5. EMERGENCY COMMUNICATIONS NETWORK\n--------------------------------------------------\n"
    for contact in kit_data.get('emergency_contacts', []):
        report_content += f"- {contact['name']}: {contact['number']}\n"
        
    report_content += "\n==================================================\nSeek professional evacuation shelters if status turns RED."

    return Response(
        content=report_content,
        media_type="text/markdown",
        headers={"Content-Disposition": "attachment; filename=lifebridge_survival_kit.md"}
    )

# 12. Image Analyzer
@app.post("/api/image-analyzer")
async def upload_image_analysis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        analysis = analyze_disaster_image(content, file.filename)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

# 13. Multi-Agent Workflow orchestration
@app.post("/api/workflow")
def trigger_agent_workflow(req: WorkflowRequest):
    return execute_multi_agent_workflow(req.report)
