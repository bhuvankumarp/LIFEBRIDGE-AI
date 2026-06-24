import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Any

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "local_db.json")

# Default seed data for the dashboard
DEFAULT_DB = {
    "incidents": [
        {
            "id": "inc-001",
            "type": "flood",
            "title": "Severe Flooding in Sector 4 Safe Zone Perimeter",
            "description": "Water levels rising near the river bank. Evacuation recommended for low-lying areas.",
            "location": {"lat": 12.9716, "lng": 77.5946, "name": "Sector 4, Central Region"},
            "severity": "high",
            "status": "active",
            "timestamp": datetime.now().isoformat(),
            "reported_by": "System Drone Monitor"
        },
        {
            "id": "inc-002",
            "type": "fire",
            "title": "Industrial Warehouse Fire",
            "description": "Chemical smoke detected. Firefighters dispatched. Residents advised to keep windows closed.",
            "location": {"lat": 12.9816, "lng": 77.6046, "name": "Industrial Area, East Sector"},
            "severity": "high",
            "status": "active",
            "timestamp": datetime.now().isoformat(),
            "reported_by": "Crowd Report"
        },
        {
            "id": "inc-003",
            "type": "road_blockage",
            "title": "Landslide Road Blockage on Highway 2A",
            "description": "Major debris blocking both lanes. Clearance crew en route. Use detour Route B.",
            "location": {"lat": 12.9616, "lng": 77.5846, "name": "Highway 2A, South Ridge"},
            "severity": "medium",
            "status": "active",
            "timestamp": datetime.now().isoformat(),
            "reported_by": "Highway Police"
        }
    ],
    "shelters": [
        {
            "id": "she-001",
            "name": "Central Community Shelter",
            "location": {"lat": 12.9750, "lng": 77.5910},
            "capacity": 500,
            "occupied": 320,
            "resources": {"food": 85, "water": 90, "medicine": 70, "blankets": 60},
            "status": "operating"
        },
        {
            "id": "she-002",
            "name": "East Ridge Shelter",
            "location": {"lat": 12.9850, "lng": 77.6110},
            "capacity": 300,
            "occupied": 280,
            "resources": {"food": 30, "water": 40, "medicine": 20, "blankets": 45},
            "status": "critical_resources"
        },
        {
            "id": "she-003",
            "name": "South Stadium Shelter",
            "location": {"lat": 12.9550, "lng": 77.5810},
            "capacity": 1000,
            "occupied": 150,
            "resources": {"food": 95, "water": 95, "medicine": 90, "blankets": 90},
            "status": "operating"
        }
    ],
    "volunteers": [
        {
            "id": "vol-001",
            "name": "Amit Sharma",
            "skills": ["first_aid", "swimming", "rescue"],
            "availability": "immediate",
            "location": {"lat": 12.9720, "lng": 77.5960, "name": "Central District"},
            "phone": "+91 98765 43210"
        },
        {
            "id": "vol-002",
            "name": "Priya Patel",
            "skills": ["cooking", "logistics", "counseling"],
            "availability": "weekends",
            "location": {"lat": 12.9880, "lng": 77.6020, "name": "East Sector"},
            "phone": "+91 98765 43211"
        }
    ],
    "volunteer_requests": [],
    "family_safety": [
        {
            "id": "fam-001",
            "name": "Karan Johar",
            "status": "safe",
            "location": "Central Shelter",
            "last_updated": datetime.now().isoformat()
        },
        {
            "id": "fam-002",
            "name": "Sunita Johar",
            "status": "need_help",
            "location": "Sector 4 Area",
            "last_updated": datetime.now().isoformat()
        }
    ],
    "sos_alerts": [],
    "news": [
        {
            "id": "news-001",
            "level": "critical",
            "summary": "Severe weather alert: Heavy rainfall predicted for the next 24 hours. Red Alert issued.",
            "actions": ["Stay indoors", "Move to higher ground if in low-lying zones", "Keep power banks charged"],
            "timestamp": datetime.now().isoformat()
        },
        {
            "id": "news-002",
            "level": "info",
            "summary": "Central Community Shelter has received a fresh shipment of medical supplies and baby food.",
            "actions": ["Contact local control room for distribution details"],
            "timestamp": datetime.now().isoformat()
        }
    ]
}

def load_db() -> Dict[str, Any]:
    if not os.path.exists(DB_FILE):
        save_db(DEFAULT_DB)
        return DEFAULT_DB
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading local DB, resetting to defaults. Error: {e}")
        save_db(DEFAULT_DB)
        return DEFAULT_DB

def save_db(data: Dict[str, Any]):
    try:
        with open(DB_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving local DB: {e}")

# Helper Functions
def add_incident(incident: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    incident["id"] = f"inc-{uuid.uuid4().hex[:6]}"
    incident["timestamp"] = datetime.now().isoformat()
    db["incidents"].append(incident)
    save_db(db)
    return incident

def get_incidents() -> List[Dict[str, Any]]:
    return load_db()["incidents"]

def add_sos(sos: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    sos["id"] = f"sos-{uuid.uuid4().hex[:6]}"
    sos["timestamp"] = datetime.now().isoformat()
    db["sos_alerts"].append(sos)
    
    # Also add an incident based on SOS
    new_inc = {
        "id": f"inc-{sos['id']}",
        "type": sos.get("type", "emergency"),
        "title": f"SOS Alert: {sos.get('name', 'Anonymous')}",
        "description": f"URGENT: {sos.get('message', 'Immediate rescue needed.')}",
        "location": sos.get("location", {"lat": 12.9716, "lng": 77.5946, "name": "Captured GPS"}),
        "severity": "critical",
        "status": "active",
        "timestamp": sos["timestamp"],
        "reported_by": f"SOS Portal ({sos.get('name', 'Anonymous')})"
    }
    db["incidents"].append(new_inc)
    
    save_db(db)
    return sos

def get_sos_alerts() -> List[Dict[str, Any]]:
    return load_db()["sos_alerts"]

def get_shelters() -> List[Dict[str, Any]]:
    return load_db()["shelters"]

def update_shelter_resources(shelter_id: str, resources: Dict[str, int]) -> Dict[str, Any]:
    db = load_db()
    for shelter in db["shelters"]:
        if shelter["id"] == shelter_id:
            shelter["resources"].update(resources)
            # Recalculate status
            critical = any(val < 30 for val in shelter["resources"].values())
            shelter["status"] = "critical_resources" if critical else "operating"
            save_db(db)
            return shelter
    return {}

def add_volunteer(volunteer: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    volunteer["id"] = f"vol-{uuid.uuid4().hex[:6]}"
    db["volunteers"].append(volunteer)
    save_db(db)
    return volunteer

def add_volunteer_request(request: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    request["id"] = f"req-{uuid.uuid4().hex[:6]}"
    request["timestamp"] = datetime.now().isoformat()
    request["status"] = "pending"
    db["volunteer_requests"].append(request)
    save_db(db)
    return request

def get_volunteer_requests() -> List[Dict[str, Any]]:
    return load_db()["volunteer_requests"]

def get_volunteers() -> List[Dict[str, Any]]:
    return load_db()["volunteers"]

def get_family_members() -> List[Dict[str, Any]]:
    return load_db()["family_safety"]

def update_family_status(name: str, status: str, location: str) -> Dict[str, Any]:
    db = load_db()
    found = False
    updated_member = {}
    for member in db["family_safety"]:
        if member["name"].lower() == name.lower():
            member["status"] = status
            member["location"] = location
            member["last_updated"] = datetime.now().isoformat()
            updated_member = member
            found = True
            break
    if not found:
        updated_member = {
            "id": f"fam-{uuid.uuid4().hex[:6]}",
            "name": name,
            "status": status,
            "location": location,
            "last_updated": datetime.now().isoformat()
        }
        db["family_safety"].append(updated_member)
    save_db(db)
    return updated_member

def get_news() -> List[Dict[str, Any]]:
    return load_db()["news"]

def add_news(bulletin: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    bulletin["id"] = f"news-{uuid.uuid4().hex[:6]}"
    bulletin["timestamp"] = datetime.now().isoformat()
    db["news"].insert(0, bulletin) # Prepend
    save_db(db)
    return bulletin
