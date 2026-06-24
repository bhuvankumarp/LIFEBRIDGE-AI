import json
from backend.database import load_db, get_incidents, get_shelters
from backend.agents import simulate_agent_response, LifeBridgeAgents, execute_multi_agent_workflow

def test_database():
    print("Testing Database Load...")
    db = load_db()
    assert "incidents" in db
    assert "shelters" in db
    assert len(get_incidents()) > 0
    print("[OK] Database Load Verified!")

def test_agents():
    print("Testing Agent Simulations...")
    first_aid_res = simulate_agent_response("burn wound", "first aid assistance", is_json=True)
    first_aid_data = json.loads(first_aid_res)
    assert first_aid_data["injury"] == "Burn"
    print("[OK] Agent Simulations Verified!")

def test_multi_agent_workflow():
    print("Testing Multi-Agent Workflow Coordinator...")
    res = execute_multi_agent_workflow("There is a landslide block on Highway 2A and an injured passenger is bleeding.")
    assert len(res["steps"]) == 6
    assert res["steps"][0]["agent"] == "Emergency Alert Agent"
    assert res["steps"][3]["agent"] == "Medical Assistance Agent"
    print("[OK] Multi-Agent Workflow Coordinator Verified!")

if __name__ == "__main__":
    print("Starting LifeBridge Backend Integration Tests...")
    test_database()
    test_agents()
    test_multi_agent_workflow()
    print("All tests completed successfully!")
