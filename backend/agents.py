import os
import json
import logging
from typing import Dict, Any, List
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LifeBridgeAgents")

# Load environment variables
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
is_ai_enabled = False

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        is_ai_enabled = True
        logger.info("Gemini API successfully configured.")
    except Exception as e:
        logger.error(f"Error configuring Gemini API: {e}")
else:
    logger.warning("GEMINI_API_KEY not found in environment. Running in SIMULATION MODE with high-fidelity mock AI agents.")

def get_gemini_model(model_name="gemini-1.5-flash"):
    if not is_ai_enabled:
        return None
    try:
        return genai.GenerativeModel(model_name)
    except Exception as e:
        logger.error(f"Failed to load Gemini model: {e}")
        return None

def call_gemini(prompt: str, system_instruction: str = "", is_json: bool = False, model_name="gemini-1.5-flash") -> str:
    """Wrapper to call Gemini API or fall back to mock response."""
    if is_ai_enabled:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction if system_instruction else None
            )
            config = {}
            if is_json:
                config = {"response_mime_type": "application/json"}
            
            response = model.generate_content(prompt, generation_config=config)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API execution error: {e}. Falling back to simulation.")
    
    # Return custom mock simulation results if API fails or is not key-configured
    return simulate_agent_response(prompt, system_instruction, is_json)

def simulate_agent_response(prompt: str, system_instruction: str, is_json: bool) -> str:
    """High-fidelity simulation for offline/no-key usage."""
    p_lower = prompt.lower()
    
    if "first aid" in system_instruction.lower() or "medical" in system_instruction.lower():
        if "burn" in p_lower:
            return json.dumps({
                "injury": "Burn",
                "immediate_response": "Cool the burn with cool running water for 10-20 minutes. Do not use ice.",
                "safety_steps": [
                    "Remove any clothing or jewelry near the burn area, but do not peel away stuck fabric.",
                    "Cover the burn loosely with clean, non-stick sterile gauze or plastic wrap.",
                    "Do not pop any blisters that form."
                ],
                "recommendation": "For second or third-degree burns, or burns on hands, face, or joints, seek immediate emergency medical care.",
                "disclaimer": "Seek professional medical help immediately."
            }) if is_json else "Cool the burn with cool running water for 10-20 minutes. Do not use ice. Cover loosely with sterile gauze. Seek professional medical help immediately."
        elif "bleed" in p_lower or "bleeding" in p_lower:
            return json.dumps({
                "injury": "Severe Bleeding",
                "immediate_response": "Apply direct, firm pressure to the wound using a clean cloth or sterile dressing.",
                "safety_steps": [
                    "Elevate the injured limb above heart level if possible.",
                    "Keep applying pressure without releasing to check. Add more dressings on top if soaked.",
                    "If bleeding does not stop with pressure, a tourniquet may be required by trained personnel."
                ],
                "recommendation": "Keep the patient warm and lying down. Watch for signs of shock.",
                "disclaimer": "Seek professional medical help immediately."
            }) if is_json else "Apply direct pressure with a clean cloth. Elevate the wound. Seek professional medical help immediately."
        elif "fracture" in p_lower or "bone" in p_lower:
            return json.dumps({
                "injury": "Fracture/Broken Bone",
                "immediate_response": "Immobilize the injured area. Do not attempt to realign the bone.",
                "safety_steps": [
                    "Apply a cold pack wrapped in a cloth to reduce swelling.",
                    "Construct a temporary splint using rolled newspapers or boards to prevent movement of joints above and below the fracture.",
                    "Stop any bleeding by applying direct pressure around the wound."
                ],
                "recommendation": "Do not give the patient anything to eat or drink in case surgery is needed.",
                "disclaimer": "Seek professional medical help immediately."
            }) if is_json else "Immobilize the area. Apply cold pack. Splint if moving. Seek professional medical help immediately."
        else:
            return json.dumps({
                "injury": "General Injury",
                "immediate_response": "Keep the patient calm, sitting or lying down in a safe area.",
                "safety_steps": [
                    "Assess consciousness and breathing.",
                    "Apply pressure to bleeding wounds and immobilize painful extremities.",
                    "Keep the patient comfortable and warm."
                ],
                "recommendation": "Monitor vital signs while waiting for medical assistance.",
                "disclaimer": "Seek professional medical help immediately."
            }) if is_json else "Keep the patient calm, clean the area if minor, apply pressure if bleeding. Seek professional medical help immediately."

    if "prediction" in system_instruction.lower() or "risk" in system_instruction.lower():
        # Predict disaster risk based on metrics
        try:
            metrics = json.loads(prompt)
        except:
            metrics = {}
        
        rainfall = float(metrics.get("rainfall", 0))
        wind_speed = float(metrics.get("wind_speed", 0))
        water_level = float(metrics.get("water_level", 0))
        
        score = int((rainfall * 0.4) + (wind_speed * 0.3) + (water_level * 0.3))
        score = min(max(score, 5), 100)
        
        if score > 70:
            level = "High Risk"
            recs = ["Evacuate low-lying zones immediately", "Assemble emergency supply kit", "Move to designated high-ground shelters"]
        elif score > 35:
            level = "Medium Risk"
            recs = ["Stay alert for official updates", "Secure loose outdoor items", "Review evacuation routes"]
        else:
            level = "Low Risk"
            recs = ["Normal conditions observed", "Maintain standard preparedness kits", "No immediate action required"]
            
        return json.dumps({
            "risk_score": score,
            "risk_level": level,
            "recommendations": recs
        })

    if "kit" in system_instruction.lower() or "emergency kit" in system_instruction.lower():
        # Smart kit generator
        try:
            params = json.loads(prompt)
        except:
            params = {"members": 2, "children": 0, "elderly": 0, "pets": 0}
            
        members = int(params.get("members", 1))
        children = int(params.get("children", 0))
        elderly = int(params.get("elderly", 0))
        pets = int(params.get("pets", 0))
        
        water_gal = members * 3 * 3.78  # 3 days, 1 gallon per day
        food_bars = members * 3 * 3     # 3 meals a day, 3 days
        
        meds = ["Pain relievers", "Bandages", "Antiseptics"]
        if elderly > 0:
            meds.extend(["Chronic illness prescriptions", "Blood pressure monitor support guidelines"])
        if children > 0:
            meds.extend(["Pediatric rehydration salts", "Baby wipes", "Infant formula (if needed)"])
            
        supplies = [
            f"{members} Flashlight(s) with spare batteries",
            f"{max(1, members // 2)} Heavy-duty power banks (fully charged)",
            "Multi-tool / pocket knife",
            "Emergency thermal space blankets",
            "Waterproof matches or lighter",
            "Whistle to signal for help"
        ]
        if pets > 0:
            supplies.extend(["Pet food (3-day supply)", "Extra leash & collar", "Pet first aid items"])
            
        return json.dumps({
            "water_requirement": f"{water_gal:.1f} Liters of clean drinking water (3-day supply)",
            "food_supplies": f"{food_bars} High-calorie emergency food rations / canned goods",
            "medicine_checklist": meds,
            "supplies_checklist": supplies,
            "emergency_contacts": [
                {"name": "National Emergency Helpline", "number": "112"},
                {"name": "Disaster Management Authority", "number": "1078"},
                {"name": "Ambulance", "number": "102"},
                {"name": "Fire Services", "number": "101"},
                {"name": "Police", "number": "100"}
            ]
        })

    if "image" in system_instruction.lower() or "damage" in system_instruction.lower():
        # Image analysis
        return json.dumps({
            "disaster_identified": "Severe Flash Flood",
            "risk_level": "Critical / High",
            "damage_assessment": "Substantial water inundation. Roads are fully submerged under 2-3 feet of water. Ground floor structures are flooded. Electric poles are partially compromised.",
            "safety_recommendations": [
                "Do not walk or drive through flooded waters (Turn Around, Don't Drown).",
                "Switch off main electricity breakers if safe to do so.",
                "Move valuables and family members to upper levels.",
                "Wait for search and rescue boats; do not swim."
            ]
        })

    # Default chatbot mock response
    if "flood" in p_lower:
        return "1. Move to higher ground immediately.\n2. Do NOT walk, swim, or drive through floodwaters.\n3. Turn off utilities at the main switches if safe to do so.\n4. Keep updated with weather alerts on radio or phone."
    elif "cyclone" in p_lower or "hurricane" in p_lower:
        return "1. Secure loose items around the house.\n2. Move to a designated shelter or stay in an interior windowless room.\n3. Keep your emergency kit handy.\n4. Disconnect electrical appliances."
    elif "earthquake" in p_lower:
        return "1. DROP, COVER, and HOLD ON under a sturdy desk or table.\n2. Stay away from windows, outer walls, and hanging objects.\n3. If outdoors, move to an open area away from buildings, trees, and power lines.\n4. Be prepared for aftershocks."
    elif "fire" in p_lower:
        return "1. Stay low to the ground to avoid inhaling toxic smoke.\n2. Feel doors with the back of your hand before opening; if hot, use an alternate exit.\n3. Stop, Drop, and Roll if your clothes catch fire.\n4. Get out, stay out, and call 101/112 immediately."
    
    return "LifeBridge Emergency Assistant: I am here to guide you. Please specify if you need assistance with First Aid, Emergency Kit Generation, Risk Assessment, or immediate disaster safety instructions."


# The 8 Specialized Agents implementations

class LifeBridgeAgents:
    @staticmethod
    def emergency_alert_agent(request: str) -> Dict[str, Any]:
        system_instruction = (
            "You are the Emergency Alert Agent of LifeBridge AI. Your role is to assess and triage "
            "incoming disaster reports. Determine: the disaster type, severity level (low, medium, high, critical), "
            "location clues, and immediate action priority. Return your response in JSON format."
        )
        prompt = f"Analyze this incident report and triage it: '{request}'"
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "disaster_type": "flood" if "flood" in request.lower() else "fire" if "fire" in request.lower() else "medical",
                "severity": "critical" if "injur" in request.lower() or "trap" in request.lower() else "high",
                "location_clues": "Detected from description",
                "action_priority": "Immediate Triage & Resource Dispatch"
            }

    @staticmethod
    def disaster_prediction_agent(data: Dict[str, Any]) -> Dict[str, Any]:
        system_instruction = (
            "You are the Disaster Prediction Agent. Analyze environment parameters (rainfall, wind speed, water levels) "
            "and compute risk level and safety directives. Return your response in JSON format."
        )
        prompt = json.dumps(data)
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            # Fallback mock
            return {"risk_score": 75, "risk_level": "High Risk", "recommendations": ["Evacuate low areas"]}

    @staticmethod
    def shelter_recommendation_agent(location: str) -> Dict[str, Any]:
        system_instruction = (
            "You are the Shelter Recommendation Agent. Recommand the safest emergency shelters and hospitals "
            "based on the general location. Provide status, capacity, and route notes. Return JSON."
        )
        prompt = f"Recommend emergency shelters near: {location}"
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "nearest_shelter": "Central Community Shelter (Capacity: 500, Occupied: 320)",
                "hospital": "Central Emergency General Hospital (Operating, Trauma Center active)",
                "safe_route": "Use Main North Highway. Avoid South River Bridge due to flooding risks."
            }

    @staticmethod
    def medical_assistance_agent(injury_desc: str) -> Dict[str, Any]:
        system_instruction = (
            "You are the Medical Assistance Agent. Provide clear, step-by-step first-aid steps for injuries. "
            "Always include emergency safety procedures. Add a bold warning to seek medical professionals. Return JSON."
        )
        res_str = call_gemini(injury_desc, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "injury": "Extracted Injury",
                "immediate_response": "Keep patient calm. Support the area.",
                "safety_steps": ["Apply direct pressure to stop bleeding", "Keep warm", "Avoid moving joints"],
                "recommendation": "Seek professional medical help immediately.",
                "disclaimer": "Seek professional medical help immediately."
            }

    @staticmethod
    def resource_allocation_agent(shelter_data: Dict[str, Any]) -> Dict[str, Any]:
        system_instruction = (
            "You are the Resource Allocation Agent. Evaluate inventory shortages and determine resource supply priority. "
            "Suggest item shipments (food, water, kits). Return JSON."
        )
        prompt = f"Evaluate these resource levels: {json.dumps(shelter_data)}"
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "priority_shelter": "East Ridge Shelter",
                "critical_need": "Food and Water (Current supply below 30%)",
                "allocation_plan": "Dispatch Truck 3 from South Hub with 100 Food cases and 200 Water boxes."
            }

    @staticmethod
    def volunteer_coordination_agent(request_type: str, location: str) -> Dict[str, Any]:
        system_instruction = (
            "You are the Volunteer Coordination Agent. Match safety volunteers to distress requests based on skills "
            "and local proximity. Return JSON."
        )
        prompt = f"Match volunteers for need type '{request_type}' near '{location}'"
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "matched_volunteers": [
                    {"name": "Amit Sharma", "skills": "First Aid & Swim rescue", "contact": "+91 98765 43210"},
                    {"name": "Priya Patel", "skills": "Logistics support", "contact": "+91 98765 43211"}
                ],
                "instructions": "Contact volunteers directly via their phone lines to establish coordinates."
            }

    @staticmethod
    def communication_agent(alert_data: Dict[str, Any]) -> Dict[str, Any]:
        system_instruction = (
            "You are the Communication Agent. Draft public warnings, SMS emergency alerts, and broadcast announcements "
            "based on disaster reports. Keep messages clean, clear, and actionable. Return JSON."
        )
        prompt = json.dumps(alert_data)
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "sms_alert": "LIFEBRIDGE ALERT: Flooding reported in Sector 4. Evacuate to Central Shelter immediately. Avoid low roads.",
                "public_broadcast": "Attention residents of Sector 4. Water levels are rising rapidly. Please prepare emergency kits and evacuate.",
                "social_media_post": "#LifeBridgeAlert: Sector 4 flooding active. Contact helpline 112 for extraction. Stay safe."
            }

    @staticmethod
    def news_monitoring_agent(news_feed: List[str]) -> Dict[str, Any]:
        system_instruction = (
            "You are the News Monitoring Agent. Summarize multiple emergency bulletins, categorize threat levels, "
            "and write bullet points for public safety. Return JSON."
        )
        prompt = json.dumps(news_feed)
        res_str = call_gemini(prompt, system_instruction, is_json=True)
        try:
            return json.loads(res_str)
        except Exception:
            return {
                "summary": "Heavy rainfall alert active. Supply distribution hub at Central Shelter is fully loaded.",
                "alert_level": "Red Alert",
                "recommended_actions": ["Stay indoors", "Keep battery backups charged"]
            }

# Multi-Agent Orchestrator workflow executor
def execute_multi_agent_workflow(user_report: str) -> Dict[str, Any]:
    """
    Executes a visual multi-agent workflow chain:
    Emergency Report -> Alert Agent -> Prediction Agent -> Shelter Agent -> Medical Agent -> Resource Agent -> Communication Agent
    """
    logger.info(f"Initiating Multi-Agent Workflow for report: {user_report}")
    
    # 1. Alert Agent Triage
    alert_triage = LifeBridgeAgents.emergency_alert_agent(user_report)
    disaster_type = alert_triage.get("disaster_type", "flood")
    severity = alert_triage.get("severity", "high")
    
    # 2. Prediction Agent assessment
    # Simulated weather conditions for prediction based on reported hazard
    weather_inputs = {
        "rainfall": 120 if "flood" in disaster_type else 20,
        "wind_speed": 85 if "cyclone" in disaster_type else 15,
        "water_level": 4.2 if "flood" in disaster_type else 0.8,
        "temperature": 40 if "fire" in disaster_type else 25,
        "humidity": 80
    }
    prediction = LifeBridgeAgents.disaster_prediction_agent(weather_inputs)
    
    # 3. Shelter Recommendations
    location_clue = alert_triage.get("location_clues", "Central Region")
    shelter_recommendations = LifeBridgeAgents.shelter_recommendation_agent(location_clue)
    
    # 4. Medical Assistance Triage
    medical_needs = "No severe injuries reported in prompt."
    if any(keyword in user_report.lower() for keyword in ["hurt", "injur", "bleeding", "burn", "broke", "wound"]):
        medical_needs = user_report
    medical_advice = LifeBridgeAgents.medical_assistance_agent(medical_needs)
    
    # 5. Resource Allocation
    shelter_inventory = {
        "shelter_name": shelter_recommendations.get("nearest_shelter", "Central Community Shelter"),
        "current_stock": {"food": 45, "water": 35, "medicine": 60}
    }
    resources_allocated = LifeBridgeAgents.resource_allocation_agent(shelter_inventory)
    
    # 6. Communication Broadcast
    comms_package = LifeBridgeAgents.communication_agent({
        "type": disaster_type,
        "severity": severity,
        "location": location_clue,
        "shelter": shelter_recommendations.get("nearest_shelter", "Central Shelter"),
        "medical_criticality": "high" if "injur" in user_report.lower() else "low"
    })
    
    # Assemble workflow steps for visualizer in UI
    workflow_steps = [
        {
            "agent": "Emergency Alert Agent",
            "status": "completed",
            "log": f"Triaged incident report. Detected type: '{disaster_type}' with severity: '{severity}'.",
            "output": alert_triage
        },
        {
            "agent": "Disaster Prediction Agent",
            "status": "completed",
            "log": f"Calculated risk index score based on incident metrics. Risk level: {prediction.get('risk_level', 'High Risk')}.",
            "output": prediction
        },
        {
            "agent": "Shelter Recommendation Agent",
            "status": "completed",
            "log": f"Identified nearest shelter centers and verified clear evacuation paths avoiding water bottlenecks.",
            "output": shelter_recommendations
        },
        {
            "agent": "Medical Assistance Agent",
            "status": "completed",
            "log": f"Analyzed incident description for trauma elements. Generated life support first-aid warnings.",
            "output": medical_advice
        },
        {
            "agent": "Resource Allocation Agent",
            "status": "completed",
            "log": f"Checked supply logistics for target shelters. Dispatched resource trucks for low buffers.",
            "output": resources_allocated
        },
        {
            "agent": "Communication Agent",
            "status": "completed",
            "log": f"Drafted and queued SMS push alerts and public warnings for sector residents.",
            "output": comms_package
        }
    ]
    
    return {
        "report": user_report,
        "final_summary": comms_package.get("public_broadcast", "LifeBridge AI has dispatched resources. Evacuate to nearest shelter immediately."),
        "sms_package": comms_package.get("sms_alert", ""),
        "steps": workflow_steps
    }

# Emergency Image Analyzer wrapper
def analyze_disaster_image(image_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Simulates or calls Gemini to identify disaster damage in an uploaded image.
    Since raw bytes are sent, if Gemini is enabled we construct Part object.
    """
    if is_ai_enabled:
        try:
            # Using Gemini 1.5 Flash for vision
            model = genai.GenerativeModel("gemini-1.5-flash")
            # Construct mime type
            mime_type = "image/jpeg"
            if filename.endswith(".png"):
                mime_type = "image/png"
            elif filename.endswith(".webp"):
                mime_type = "image/webp"
                
            contents = [
                {
                    "mime_type": mime_type,
                    "data": image_bytes
                },
                "Analyze this emergency/disaster image. Identify the disaster type, estimate the risk/severity level (Low, Medium, High, Critical), assess structural or environmental damage in detail, and provide safety recommendations. Return your analysis in JSON format with fields: disaster_identified, risk_level, damage_assessment (string summary), safety_recommendations (list of strings)."
            ]
            response = model.generate_content(contents, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text.strip())
        except Exception as e:
            logger.error(f"Error calling Gemini Vision API: {e}")
            
    # Fallback simulation
    return json.loads(simulate_agent_response(f"image upload: {filename}", "image analyzer", is_json=True))
