"use client";

import React, { useState, useEffect, useRef } from "react";

// Inline Types
interface Incident {
  id: string;
  type: string;
  title: string;
  description: string;
  location: { lat: number; lng: number; name: string };
  severity: string;
  status: string;
  timestamp: string;
  reported_by: string;
}

interface Shelter {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  occupied: number;
  resources: { food: number; water: number; medicine: number; blankets: number };
  status: string;
}

interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  availability: string;
  location: { lat: number; lng: number; name: string };
  phone: string;
}

interface NewsItem {
  id: string;
  level: string;
  summary: string;
  actions: string[];
  timestamp: string;
}

interface FamilyMember {
  id: string;
  name: string;
  status: string;
  location: string;
  last_updated: string;
}

export default function Dashboard() {
  // Global API base
  const API_BASE = "http://127.0.0.1:8000";

  // State Management
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "inc-001",
      type: "flood",
      title: "Severe Flooding in Sector 4 Safe Zone Perimeter",
      description: "Water levels rising near the river bank. Evacuation recommended for low-lying areas.",
      location: { lat: 12.9716, lng: 77.5946, name: "Sector 4, Central Region" },
      severity: "high",
      status: "active",
      timestamp: new Date().toISOString(),
      reported_by: "System Drone Monitor"
    },
    {
      id: "inc-002",
      type: "fire",
      title: "Industrial Warehouse Fire",
      description: "Chemical smoke detected. Firefighters dispatched. Residents advised to keep windows closed.",
      location: { lat: 12.9816, lng: 77.6046, name: "Industrial Area, East Sector" },
      severity: "high",
      status: "active",
      timestamp: new Date().toISOString(),
      reported_by: "Crowd Report"
    },
    {
      id: "inc-003",
      type: "road_blockage",
      title: "Landslide Road Blockage on Highway 2A",
      description: "Major debris blocking both lanes. Clearance crew en route. Use detour Route B.",
      location: { lat: 12.9616, lng: 77.5846, name: "Highway 2A, South Ridge" },
      severity: "medium",
      status: "active",
      timestamp: new Date().toISOString(),
      reported_by: "Highway Police"
    }
  ]);
  const [shelters, setShelters] = useState<Shelter[]>([
    {
      id: "she-001",
      name: "Central Community Shelter",
      location: { lat: 12.9750, lng: 77.5910 },
      capacity: 500,
      occupied: 320,
      resources: { food: 85, water: 90, medicine: 70, blankets: 60 },
      status: "operating"
    },
    {
      id: "she-002",
      name: "East Ridge Shelter",
      location: { lat: 12.9850, lng: 77.6110 },
      capacity: 300,
      occupied: 280,
      resources: { food: 30, water: 40, medicine: 20, blankets: 45 },
      status: "critical_resources"
    },
    {
      id: "she-003",
      name: "South Stadium Shelter",
      location: { lat: 12.9550, lng: 77.5810 },
      capacity: 1000,
      occupied: 150,
      resources: { food: 95, water: 95, medicine: 90, blankets: 90 },
      status: "operating"
    }
  ]);
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "news-001",
      level: "critical",
      summary: "Severe weather alert: Heavy rainfall predicted for the next 24 hours. Red Alert issued.",
      actions: ["Stay indoors", "Move to higher ground if in low-lying zones", "Keep power banks charged"],
      timestamp: new Date().toISOString()
    },
    {
      id: "news-002",
      level: "info",
      summary: "Central Community Shelter has received a fresh shipment of medical supplies and baby food.",
      actions: ["Contact local control room for distribution details"],
      timestamp: new Date().toISOString()
    }
  ]);
  const [family, setFamily] = useState<FamilyMember[]>([
    {
      id: "fam-001",
      name: "Karan Johar",
      status: "safe",
      location: "Central Shelter",
      last_updated: new Date().toISOString()
    },
    {
      id: "fam-002",
      name: "Sunita Johar",
      status: "need_help",
      location: "Sector 4 Area",
      last_updated: new Date().toISOString()
    }
  ]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: "vol-001",
      name: "Amit Sharma",
      skills: ["first_aid", "swimming", "rescue"],
      availability: "immediate",
      location: { lat: 12.9720, lng: 77.5960, name: "Central District" },
      phone: "+91 98765 43210"
    },
    {
      id: "vol-002",
      name: "Priya Patel",
      skills: ["cooking", "logistics", "counseling"],
      availability: "weekends",
      location: { lat: 12.9880, lng: 77.6020, name: "East Sector" },
      phone: "+91 98765 43211"
    }
  ]);
  
  // Dashboard view toggles
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);
  const [mapLayer, setMapLayer] = useState<"all" | "high-risk" | "shelters">("all");
  
  // Multi-Agent Workflow State
  const [reportInput, setReportInput] = useState("");
  const [workflowActive, setWorkflowActive] = useState(false);
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<number>(-1);

  // SOS Mode State
  const [sosActive, setSosActive] = useState(false);
  const [sosSubmitted, setSosSubmitted] = useState(false);
  const [sosForm, setSosForm] = useState({ name: "", phone: "", type: "flood", message: "" });
  const [sosCardData, setSosCardData] = useState<any>(null);

  // AI Chatbot State
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Welcome to LifeBridge Emergency Portal. Ask me any emergency preparedness or first aid questions." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Voice Assistant Speech API Support
  const [selectedVoiceLang, setSelectedVoiceLang] = useState("en-US");
  const [isListening, setIsListening] = useState(false);

  // Smart Kit Generator State
  const [kitForm, setKitForm] = useState({ members: 2, children: 0, elderly: 0, pets: 0 });
  const [kitResult, setKitResult] = useState<any>(null);
  const [isGeneratingKit, setIsGeneratingKit] = useState(false);

  // First Aid Assistant State
  const [selectedInjury, setSelectedInjury] = useState("");
  const [firstAidResult, setFirstAidResult] = useState<any>(null);
  const [isFirstAidLoading, setIsFirstAidLoading] = useState(false);

  // Risk Predictor State
  const [riskForm, setRiskForm] = useState({ rainfall: 50, wind_speed: 30, water_level: 1.5, temperature: 28, humidity: 65 });
  const [riskResult, setRiskResult] = useState<any>(null);
  const [isPredictingRisk, setIsPredictingRisk] = useState(false);

  // Image Analyzer State
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<any>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Volunteer & Victim request
  const [volunteerForm, setVolunteerForm] = useState({ name: "", phone: "", skills: "first_aid", location: "Central Region" });
  const [isVolunteerRegistered, setIsVolunteerRegistered] = useState(false);
  
  const [victimForm, setVictimForm] = useState({ name: "", phone: "", need_type: "Food Supplies", location: "Sector 4", description: "" });
  const [matchedVolunteers, setMatchedVolunteers] = useState<any[]>([]);
  const [victimRequestSubmitted, setVictimRequestSubmitted] = useState(false);

  // Family Safety Trackers
  const [familyForm, setFamilyForm] = useState({ name: "", status: "safe", location: "" });
  const [isFamilyUpdated, setIsFamilyUpdated] = useState(false);

  // Offline Mode Tracker
  const [isOffline, setIsOffline] = useState(false);

  // Fetch initial data
  useEffect(() => {
    // Check network connectivity status
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));

    fetchIncidents();
    fetchShelters();
    fetchNews();
    fetchFamily();
    fetchVolunteers();
  }, []);

  // API Call Helpers
  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents`);
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      // Offline fallback seed data
      console.warn("Could not fetch incidents, running with local caches.");
    }
  };

  const fetchShelters = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/shelters`);
      const data = await res.json();
      setShelters(data);
    } catch (err) {}
  };

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/news`);
      const data = await res.json();
      setNews(data);
    } catch (err) {}
  };

  const fetchFamily = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/family-safety`);
      const data = await res.json();
      setFamily(data);
    } catch (err) {}
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/volunteers`);
      const data = await res.json();
      setVolunteers(data);
    } catch (err) {}
  };

  // SOS Submission
  const handleSOSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockLocation = { lat: 12.9716, lng: 77.5946, name: "Captured GPS (Sector 4)" };
    
    // Capture user location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: `User Live GPS (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
          };
          triggerSosApi(loc);
        },
        () => {
          triggerSosApi(mockLocation);
        }
      );
    } else {
      triggerSosApi(mockLocation);
    }
  };

  const triggerSosApi = async (location: any) => {
    const payload = {
      name: sosForm.name || "Anonymous Citizen",
      message: sosForm.message || "EMERGENCY: Immediate extraction needed.",
      phone: sosForm.phone || "Not provided",
      type: sosForm.type,
      location: location
    };

    try {
      const res = await fetch(`${API_BASE}/api/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSosCardData(data);
      setSosSubmitted(true);
      fetchIncidents(); // Refresh live dashboard map
    } catch (err) {
      // Local storage fallback for offline
      const offlineSOS = {
        ...payload,
        id: `sos-off-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString()
      };
      setSosCardData(offlineSOS);
      setSosSubmitted(true);
      
      // Save offline queue
      const existing = localStorage.getItem("offline_sos_queue");
      const queue = existing ? JSON.parse(existing) : [];
      queue.push(offlineSOS);
      localStorage.setItem("offline_sos_queue", JSON.stringify(queue));
    }
  };

  // Chat Submission
  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatLog((prev) => [...prev, { sender: "user", text: userText }]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setChatLog((prev) => [...prev, { sender: "ai", text: data.response }]);
      speakText(data.response); // Text-To-Speech output
    } catch (err) {
      // Offline fallback simple responses
      let offlineResponse = "LifeBridge AI is operating offline. Move to high-ground for floods. Drop, cover and hold for earthquakes. Keep matches dry. For bleeding apply firm pressure. Contact helpline 112.";
      if (userText.toLowerCase().includes("flood")) {
        offlineResponse = "Offline Flood Advice: Move to upper floors immediately. Do not walk or drive in floodwaters. Turn off electricity mains. Keep clean drinking water reserves.";
      } else if (userText.toLowerCase().includes("first aid") || userText.toLowerCase().includes("bleed") || userText.toLowerCase().includes("burn")) {
        offlineResponse = "Offline First Aid Advice: Burns need cool running water. Bleeding needs direct pressure and limb elevation. Avoid moving fractured joints. Seek medical help immediately.";
      }
      setChatLog((prev) => [...prev, { sender: "ai", text: offlineResponse }]);
      speakText(offlineResponse);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Voice Speech Synthesis (Text-to-Speech)
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speaking
    const cleanText = text.replace(/[*#]/g, ""); // Strip markdown characters
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedVoiceLang;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Speech Recognition (Speech-to-Text)
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = selectedVoiceLang;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatMessage(transcript);
    };

    recognition.onerror = (err: any) => {
      console.error("Speech Recognition Error:", err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Multi-Agent Workflow Coordinator Trigger
  const handleWorkflowTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportInput.trim()) return;

    setWorkflowActive(true);
    setWorkflowResult(null);
    setCurrentWorkflowStep(0);

    // Visual step sequence animation
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount < 6) {
        setCurrentWorkflowStep(stepCount);
      } else {
        clearInterval(interval);
      }
    }, 1800);

    try {
      const res = await fetch(`${API_BASE}/api/workflow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: reportInput })
      });
      const data = await res.json();
      
      clearInterval(interval);
      setWorkflowResult(data);
      setCurrentWorkflowStep(5); // Complete all steps
      fetchIncidents(); // Refresh alerts
    } catch (err) {
      clearInterval(interval);
      // Mock workflow offline response
      const mockWorkflow = {
        report: reportInput,
        final_summary: "LIFEBRIDGE ALERTS: High Risk detected. Evacuate to Central shelter immediately.",
        steps: [
          { agent: "Emergency Alert Agent", status: "completed", log: "Identified distress type: flood/hazard.", output: {} },
          { agent: "Disaster Prediction Agent", status: "completed", log: "Rain levels flagged above 120mm.", output: {} },
          { agent: "Shelter Recommendation Agent", status: "completed", log: "Central shelter recommended.", output: {} },
          { agent: "Medical Assistance Agent", status: "completed", log: "Dispatched warning protocols.", output: {} },
          { agent: "Resource Allocation Agent", status: "completed", log: "Verified food supply availability.", output: {} },
          { agent: "Communication Agent", status: "completed", log: "Queued SMS public alerts.", output: {} }
        ]
      };
      setWorkflowResult(mockWorkflow);
      setCurrentWorkflowStep(5);
    }
  };

  // Smart Kit Generator Trigger
  const handleKitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingKit(true);
    setKitResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/kit-generator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kitForm)
      });
      const data = await res.json();
      setKitResult(data);
    } catch (err) {
      // Local calculator fallback for offline kit
      const members = kitForm.members;
      setKitResult({
        water_requirement: `${members * 12} Liters of water (3-day standard reserve)`,
        food_supplies: `${members * 9} Non-perishable meals`,
        medicine_checklist: kitForm.elderly > 0 ? ["Essential medicines", "Bandages", "BP monitor"] : ["First-aid ointment", "Band-aids"],
        supplies_checklist: ["Flashlight", "Backup power batteries", "Whistle"],
        emergency_contacts: [{"name": "National helpline", "number": "112"}]
      });
    } finally {
      setIsGeneratingKit(false);
    }
  };

  // Download Kit Report File
  const handleDownloadKit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/kit/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kitForm)
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lifebridge_emergency_kit.md";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      // Local file creation fallback
      const content = `LIFEBRIDGE EMERGENCY KIT CHECKLIST\nMembers: ${kitForm.members}\nWater: ${kitResult?.water_requirement}\nFood: ${kitResult?.food_supplies}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lifebridge_kit_offline.txt";
      a.click();
    }
  };

  // First Aid Injury Trigger
  const handleInjurySelect = async (injury: string) => {
    setSelectedInjury(injury);
    setIsFirstAidLoading(true);
    setFirstAidResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/firstaid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ injury: injury })
      });
      const data = await res.json();
      setFirstAidResult(data);
    } catch (err) {
      // Local first-aid manuals
      const manuals: Record<string, any> = {
        burn: {
          injury: "Burns",
          immediate_response: "Cool immediately with cool running water.",
          safety_steps: ["Do not apply butter or oil", "Cover loosely with sterile wrap"],
          recommendation: "Seek medical emergency units immediately."
        },
        bleeding: {
          injury: "Severe Bleeding",
          immediate_response: "Apply firm direct pressure.",
          safety_steps: ["Elevate wound above heart level", "Add wraps; don't remove soaked ones"],
          recommendation: "Get ambulance service."
        },
        fracture: {
          injury: "Bone Fracture",
          immediate_response: "Immobilize the limb.",
          safety_steps: ["Do not align the bones", "Apply cold compress for swelling"],
          recommendation: "Proceed to trauma center."
        }
      };
      setFirstAidResult(manuals[injury] || { injury: injury, immediate_response: "Keep calm. Call emergency rescue.", safety_steps: [], recommendation: "Seek medical help." });
    } finally {
      setIsFirstAidLoading(false);
    }
  };

  // Risk Prediction Meter Trigger
  const handleRiskPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredictingRisk(true);
    setRiskResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/predict-risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(riskForm)
      });
      const data = await res.json();
      setRiskResult(data);
    } catch (err) {
      const score = Math.min(100, Math.max(0, Math.floor(riskForm.rainfall * 0.4 + riskForm.wind_speed * 0.3 + riskForm.water_level * 10 * 0.3)));
      const level = score > 70 ? "High Risk" : score > 35 ? "Medium Risk" : "Low Risk";
      setRiskResult({
        risk_score: score,
        risk_level: level,
        recommendations: [level === "High Risk" ? "Evacuation urged" : "Monitor warnings closely"]
      });
    } finally {
      setIsPredictingRisk(false);
    }
  };

  // Image analyzer file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setImageAnalysisResult(null);
    }
  };

  const handleImageAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImageFile) return;

    setIsAnalyzingImage(true);
    const formData = new FormData();
    formData.append("file", selectedImageFile);

    try {
      const res = await fetch(`${API_BASE}/api/image-analyzer`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setImageAnalysisResult(data);
    } catch (err) {
      // Simulated image analysis fallback
      setImageAnalysisResult({
        disaster_identified: "Severe Flood & Inundation",
        risk_level: "High Risk",
        damage_assessment: "Substantial building flooding. Power lines partially compromised. Evacuation route blocked by standing water.",
        safety_recommendations: [
          "Do not drive or walk through flood waters.",
          "Check battery reserves.",
          "Locate high-ground exits."
        ]
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Volunteer register
  const handleRegisterVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: volunteerForm.name,
      skills: [volunteerForm.skills],
      availability: "immediate",
      location: { lat: 12.9716, lng: 77.5946, name: volunteerForm.location },
      phone: volunteerForm.phone
    };

    try {
      await fetch(`${API_BASE}/api/volunteers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setIsVolunteerRegistered(true);
      fetchVolunteers();
    } catch (err) {
      setIsVolunteerRegistered(true); // Mock success offline
    }
  };

  // Help Request trigger
  const handleVictimRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      need_type: victimForm.need_type,
      location: { lat: 12.9716, lng: 77.5946, name: victimForm.location },
      name: victimForm.name,
      phone: victimForm.phone,
      description: victimForm.description
    };

    try {
      const res = await fetch(`${API_BASE}/api/volunteer-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setMatchedVolunteers(data.matched_volunteers || []);
      setVictimRequestSubmitted(true);
    } catch (err) {
      setMatchedVolunteers([
        { name: "Amit Sharma", phone: "+91 98765 43210", skills: ["first_aid", "swimming"] }
      ]);
      setVictimRequestSubmitted(true);
    }
  };

  // Family status update
  const handleFamilyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/family-safety`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(familyForm)
      });
      setIsFamilyUpdated(true);
      fetchFamily();
      setTimeout(() => setIsFamilyUpdated(false), 3000);
    } catch (err) {
      setIsFamilyUpdated(true);
    }
  };

  // UI components
  return (
    <div className="flex-grow bg-[#030408] px-4 py-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 1. SIDEBAR ALERTS & NEWS (Left Column, span 4) */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Offline Mode Alert banner */}
        {isOffline && (
          <div className="p-4 rounded-lg bg-orange-950/40 border border-orange-500/40 text-orange-200 text-xs flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping flex-shrink-0"></span>
            <div>
              <p className="font-bold uppercase tracking-wider">OFFLINE MODE ACTIVE</p>
              <p className="mt-0.5 text-orange-300">Using local caches for First Aid guidance and SOS card generations.</p>
            </div>
          </div>
        )}

        {/* SOS EMERGENCY CORE BUTTON CARD */}
        <div className="p-6 rounded-xl border border-red-500/20 bg-gradient-to-b from-red-950/20 to-black/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mb-2 uppercase tracking-wide">
            <span className="w-3 h-3 bg-red-500 rounded-full glow-red animate-pulse"></span>
            SOS Emergency Mode
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            If you are trapped, flooded, or need urgent safety extraction, click below to trigger alert vectors immediately.
          </p>

          {!sosActive ? (
            <button
              onClick={() => setSosActive(true)}
              className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-xl tracking-widest uppercase transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-600/30 border border-red-500"
            >
              TRIGGER SOS NOW
            </button>
          ) : (
            <div className="space-y-4">
              {!sosSubmitted ? (
                <form onSubmit={handleSOSSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-red-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                      placeholder="Enter Full Name"
                      value={sosForm.name}
                      onChange={(e) => setSosForm({ ...sosForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Phone Line</label>
                      <input
                        type="text"
                        className="w-full bg-black/60 border border-red-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                        placeholder="Mobile Number"
                        value={sosForm.phone}
                        onChange={(e) => setSosForm({ ...sosForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Incident Type</label>
                      <select
                        className="w-full bg-black/60 border border-red-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                        value={sosForm.type}
                        onChange={(e) => setSosForm({ ...sosForm, type: e.target.value })}
                      >
                        <option value="flood">Flood Inundation</option>
                        <option value="fire">Structural Fire</option>
                        <option value="medical">Medical Injury</option>
                        <option value="landslide">Landslide Block</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Distress Message</label>
                    <textarea
                      rows={2}
                      className="w-full bg-black/60 border border-red-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                      placeholder="Describe immediate danger details..."
                      value={sosForm.message}
                      onChange={(e) => setSosForm({ ...sosForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-grow py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded"
                    >
                      Broadcast Distress Signal
                    </button>
                    <button
                      type="button"
                      onClick={() => setSosActive(false)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium rounded text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/50 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-[10px] border-b border-red-500/30 pb-1">
                    <span className="text-red-400 font-bold uppercase">SOS CARD GENERATED</span>
                    <span className="text-gray-500">ID: {sosCardData?.id}</span>
                  </div>
                  <p><span className="text-gray-400">Name:</span> <span className="text-white font-bold">{sosCardData?.name}</span></p>
                  <p><span className="text-gray-400">Phone:</span> <span className="text-white">{sosCardData?.phone}</span></p>
                  <p><span className="text-gray-400">Distress:</span> <span className="text-red-300 font-semibold">{sosCardData?.message}</span></p>
                  <p><span className="text-gray-400">Location:</span> <span className="text-emerald-400">{sosCardData?.location?.name}</span></p>
                  <p><span className="text-gray-400">Time:</span> <span className="text-gray-400 text-[10px]">{new Date(sosCardData?.timestamp).toLocaleString()}</span></p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSosSubmitted(false);
                        setSosForm({ name: "", phone: "", type: "flood", message: "" });
                      }}
                      className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-center rounded text-gray-300 text-[11px] font-bold"
                    >
                      Reset SOS Signal
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI EMERGENCY CHATBOT & VOICE ASSISTANT */}
        <div className="p-5 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md flex flex-col h-[400px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
            <h3 className="font-extrabold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              AI Emergency Chat
            </h3>
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded px-2 py-1">
              <span className="text-[9px] uppercase text-gray-500 font-bold">Voice:</span>
              <select
                className="bg-transparent text-[10px] text-gray-300 focus:outline-none border-none cursor-pointer"
                value={selectedVoiceLang}
                onChange={(e) => setSelectedVoiceLang(e.target.value)}
              >
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi</option>
                <option value="kn-IN">Kannada</option>
                <option value="ta-IN">Tamil</option>
                <option value="te-IN">Telugu</option>
              </select>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-1 text-xs">
            {chatLog.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                    chat.sender === "user"
                      ? "bg-red-600 text-white font-medium rounded-tr-none"
                      : "bg-[#111420] text-gray-200 border border-white/5 rounded-tl-none"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-[#111420] text-gray-400 p-3 rounded-lg border border-white/5 animate-pulse rounded-tl-none">
                  AI Agent is typing safety guidelines...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              className="flex-grow bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              placeholder="Ask: 'What should I do during a flood?'"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button
              type="button"
              onClick={startSpeechRecognition}
              className={`p-2.5 rounded-lg border flex items-center justify-center transition-colors ${
                isListening 
                  ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
                  : "bg-black/60 border-white/10 hover:border-red-500/40 text-gray-400 hover:text-white"
              }`}
              title="Speak Question"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs"
            >
              Send
            </button>
          </form>
        </div>

        {/* GOVERNMENT BROADCAST & WEATHER ALERTS NEWS FEED */}
        <div className="p-5 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2 mb-4 border-b border-white/5 pb-2 uppercase tracking-wide">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            Command Broadcast Alerts
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {news.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  item.level === "critical"
                    ? "bg-red-950/15 border-red-500/30"
                    : "bg-gray-900/30 border-white/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                    item.level === "critical" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {item.level}
                  </span>
                  <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-gray-300 font-medium">{item.summary}</p>
                <div className="border-t border-white/5 pt-1.5 mt-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Directives:</span>
                  <ul className="list-disc list-inside text-[11px] text-red-300/80 space-y-0.5">
                    {item.actions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. DYNAMIC DIGITAL TWIN & ACTIVE AGENT FLOW (Right Column, span 8) */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* DISASTER DIGITAL TWIN DASHBOARD (Futuristic Interactive City Map) */}
        <div className="p-6 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                Disaster Digital Twin
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">Tactical Command Map: Click indicators to query infrastructure state.</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setMapLayer("all")}
                className={`px-3 py-1.5 rounded text-xs font-bold ${
                  mapLayer === "all" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                All Nodes
              </button>
              <button
                onClick={() => setMapLayer("high-risk")}
                className={`px-3 py-1.5 rounded text-xs font-bold ${
                  mapLayer === "high-risk" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                Hazard Vectors
              </button>
              <button
                onClick={() => setMapLayer("shelters")}
                className={`px-3 py-1.5 rounded text-xs font-bold ${
                  mapLayer === "shelters" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                Shelters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* INTERACTIVE SVG GEOMETRY RADAR */}
            <div className="md:col-span-2 relative w-full aspect-square md:aspect-auto md:h-[350px] bg-black/60 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-2">
              <div className="absolute inset-0 radar-sweep opacity-10"></div>
              
              {/* Radar sweep lines SVG */}
              <svg className="w-full h-full opacity-60 pointer-events-none absolute" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="0.5" />
              </svg>

              {/* Dynamic SVG plotting nodes */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 300">
                
                {/* Safe Grid Sections */}
                <rect x="10" y="10" width="380" height="280" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                
                {/* 1. Hazard Zones (Active Incidents) */}
                {(mapLayer === "all" || mapLayer === "high-risk") && incidents.map((inc, i) => {
                  // Map coordinates locally inside SVG viewBox
                  const x = 50 + (i * 120);
                  const y = 80 + (i * 60);
                  return (
                    <g key={inc.id} className="cursor-pointer group" onClick={() => setSelectedMapNode({ type: "incident", data: inc })}>
                      {/* Pulse ring animation */}
                      <circle cx={x} cy={y} r="18" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" className="animate-pulse" />
                      <circle cx={x} cy={y} r="8" fill="rgba(239, 68, 68, 0.2)" />
                      {/* Core point */}
                      <circle cx={x} cy={y} r="4" fill="#ef4444" className="glow-red" />
                      <text x={x + 10} y={y + 4} fill="#ef4444" fontSize="8" fontWeight="bold" className="opacity-75">{inc.type.toUpperCase()}</text>
                    </g>
                  );
                })}

                {/* 2. Emergency Shelter Locations */}
                {(mapLayer === "all" || mapLayer === "shelters") && shelters.map((she, i) => {
                  const x = 90 + (i * 110);
                  const y = 180 - (i * 40);
                  const isCritical = she.status === "critical_resources";
                  return (
                    <g key={she.id} className="cursor-pointer" onClick={() => setSelectedMapNode({ type: "shelter", data: she })}>
                      <polygon points={`${x},${y-8} ${x+7},${y+5} ${x-7},${y+5}`} fill={isCritical ? "#f97316" : "#10b981"} opacity="0.8" />
                      <circle cx={x} cy={y+2} r="10" fill="none" stroke={isCritical ? "rgba(249, 115, 22, 0.3)" : "rgba(16, 185, 129, 0.3)"} strokeWidth="1" />
                      <text x={x + 10} y={y + 4} fill="#fff" fontSize="8" opacity="0.8">{she.name.split(" ")[0]}</text>
                    </g>
                  );
                })}
              </svg>
              
              <div className="absolute bottom-3 left-3 bg-black/80 border border-white/5 px-2.5 py-1.5 rounded text-[9px] font-mono text-gray-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Incident Threat Vector
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2 bg-emerald-500 block"></span> Operational Shelter Hub
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2 bg-orange-500 block"></span> Critical Resource Shortage
                </div>
              </div>
            </div>

            {/* TWIN STATE METRIC INFORMATION PANEL */}
            <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-xs flex flex-col justify-between h-[350px]">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-3">Incident Intel Matrix</h4>
                
                {!selectedMapNode ? (
                  <div className="text-center py-12 text-gray-500 space-y-2">
                    <svg className="w-8 h-8 mx-auto opacity-35" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                    </svg>
                    <p className="text-[11px]">Click any coordinate marker in the radar screen to request live diagnostics.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedMapNode.type === "incident" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-red-400 font-bold uppercase tracking-wider text-[10px]">Active Triage: {selectedMapNode.data.type}</span>
                          <span className="px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 font-mono text-[9px] uppercase">{selectedMapNode.data.severity}</span>
                        </div>
                        <h3 className="font-extrabold text-white text-sm">{selectedMapNode.data.title}</h3>
                        <p className="text-gray-400 text-[11px] leading-relaxed">{selectedMapNode.data.description}</p>
                        <div className="pt-2 border-t border-white/5 space-y-1 text-gray-400 text-[10px]">
                          <p><span className="text-gray-500">Zone:</span> {selectedMapNode.data.location.name}</p>
                          <p><span className="text-gray-500">Source:</span> {selectedMapNode.data.reported_by}</p>
                          <p><span className="text-gray-500">Stamp:</span> {new Date(selectedMapNode.data.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Shelter Node</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono ${
                            selectedMapNode.data.status === "critical_resources" ? "bg-orange-500/20 text-orange-300" : "bg-emerald-500/20 text-emerald-300"
                          }`}>{selectedMapNode.data.status}</span>
                        </div>
                        <h3 className="font-extrabold text-white text-sm">{selectedMapNode.data.name}</h3>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-500">Capacity:</span>
                            <span className="text-white font-bold">{selectedMapNode.data.occupied} / {selectedMapNode.data.capacity}</span>
                          </div>
                          {/* Resource gauges */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Resource Stock:</span>
                            {Object.entries(selectedMapNode.data.resources).map(([resName, quantity]: any) => (
                              <div key={resName} className="space-y-0.5">
                                <div className="flex justify-between text-[10px] text-gray-400 uppercase">
                                  <span>{resName}</span>
                                  <span className={quantity < 35 ? "text-orange-400 font-bold" : "text-emerald-400"}>{quantity}%</span>
                                </div>
                                <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
                                  <div
                                    className={`h-full rounded ${quantity < 35 ? "bg-orange-500" : "bg-emerald-500"}`}
                                    style={{ width: `${quantity}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-3">
                <button
                  onClick={() => setSelectedMapNode(null)}
                  className="w-full py-1.5 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold text-gray-400 hover:text-white"
                >
                  Clear Screen Query
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* MULTI-AGENT WORKFLOW ORCHESTRATION PANEL */}
        <div className="p-6 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
            Multi-Agent Incident Orchestrator
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Enter a description of flooding, blocks, or accidents. A sequence of 6 AI agents will dynamically process, predict, and coordinate safety metrics.
          </p>

          <form onSubmit={handleWorkflowTrigger} className="flex gap-2 mb-6">
            <input
              type="text"
              className="flex-grow bg-black/60 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-red-500"
              placeholder="Example: 'There is major water logging near Central Square, a resident is trapped on the roof with injuries.'"
              value={reportInput}
              onChange={(e) => setReportInput(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={workflowActive && currentWorkflowStep < 5}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider disabled:opacity-50"
            >
              Analyze & Coordinate
            </button>
          </form>

          {/* VISUAL PIPELINE GRAPHS */}
          {workflowActive && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[
                  "Emergency Alert Agent",
                  "Disaster Prediction Agent",
                  "Shelter Recommendation Agent",
                  "Medical Assistance Agent",
                  "Resource Allocation Agent",
                  "Communication Agent"
                ].map((agentName, idx) => {
                  const isActive = currentWorkflowStep === idx;
                  const isCompleted = currentWorkflowStep > idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-center font-mono text-[10px] transition-all duration-300 ${
                        isActive
                          ? "bg-red-500/10 border-red-500 text-red-400 glow-red"
                          : isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-gray-900/40 border-white/5 text-gray-500"
                      }`}
                    >
                      <div className="font-bold mb-1">Step {idx + 1}</div>
                      <div className="truncate font-semibold">{agentName.split(" ")[0]} Agent</div>
                      <div className="text-[8px] uppercase tracking-wider mt-1 opacity-75">
                        {isActive ? "Executing..." : isCompleted ? "Completed" : "Idle"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Step Logs */}
              <div className="p-4 bg-black/60 border border-white/5 rounded-xl font-mono text-[11px] text-gray-400 space-y-2 leading-relaxed max-h-[220px] overflow-y-auto">
                <p className="text-red-500 font-bold">$ lifebridge-agent --pipe run</p>
                {currentWorkflowStep >= 0 && <p className="text-gray-300">● [AlertAgent]: Triaging incident report. Detected flood threat level RED.</p>}
                {currentWorkflowStep >= 1 && <p className="text-gray-300">● [PredictionAgent]: Weather indices evaluated. Wind: 45km/h, Rain: 120mm/hr. High disaster index predicted.</p>}
                {currentWorkflowStep >= 2 && <p className="text-gray-300">● [ShelterAgent]: Querying nearest shelter registry. Recommending South Stadium Shelter (Cap: 1000, Free: 850).</p>}
                {currentWorkflowStep >= 3 && <p className="text-gray-300">● [MedicalAgent]: Scanning report keywords. Generating emergency first-aid guide for victim support.</p>}
                {currentWorkflowStep >= 4 && <p className="text-gray-300">● [ResourceAgent]: Monitoring inventory indices. Resource status safe inside selected shelter.</p>}
                {currentWorkflowStep >= 5 && <p className="text-gray-300">● [CommsAgent]: Evacuation routes finalized. Public text alert packet compiled.</p>}

                {workflowResult && (
                  <div className="pt-3 border-t border-white/10 mt-3 text-xs space-y-3 font-sans text-gray-200">
                    <div className="bg-[#111420] border border-red-500/20 p-3 rounded">
                      <span className="text-red-400 text-[10px] font-bold uppercase block tracking-wider mb-1">Final Dispatch Directives:</span>
                      <p className="font-medium text-white">{workflowResult.final_summary}</p>
                    </div>
                    {workflowResult.sms_package && (
                      <div className="bg-black/80 p-2.5 rounded border border-white/5 text-[11px] font-mono text-gray-400 flex items-center gap-2">
                        <span className="text-gray-500">SMS:</span>
                        <span>{workflowResult.sms_package}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. MULTI-WIDGET PANELS: FIRST AID, RISK PREDICTOR, KIT GENERATOR (GRID 2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SMART EMERGENCY KIT GENERATOR */}
          <div className="p-5 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 mb-4 border-b border-white/5 pb-2 uppercase tracking-wide">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              Smart Survival Kit
            </h3>

            {!kitResult ? (
              <form onSubmit={handleKitSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Household Members</label>
                    <input
                      type="number"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      value={kitForm.members}
                      onChange={(e) => setKitForm({ ...kitForm, members: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Children (under 12)</label>
                    <input
                      type="number"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      value={kitForm.children}
                      onChange={(e) => setKitForm({ ...kitForm, children: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Elderly Members</label>
                    <input
                      type="number"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      value={kitForm.elderly}
                      onChange={(e) => setKitForm({ ...kitForm, elderly: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Household Pets</label>
                    <input
                      type="number"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      value={kitForm.pets}
                      onChange={(e) => setKitForm({ ...kitForm, pets: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isGeneratingKit}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider text-xs"
                >
                  {isGeneratingKit ? "Analyzing Demographics..." : "Generate Custom Survival Kit"}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 bg-[#111420] border border-white/5 rounded leading-relaxed text-gray-200">
                  <p className="text-red-400 font-bold text-[10px] uppercase mb-1">Inventory Checklist:</p>
                  <p className="mb-1">💧 <span className="font-bold">{kitResult.water_requirement}</span></p>
                  <p className="mb-2">🍞 <span className="font-bold">{kitResult.food_supplies}</span></p>
                  
                  {kitResult.medicine_checklist.length > 0 && (
                    <div className="mb-2 pt-1 border-t border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">Medicines:</span>
                      {kitResult.medicine_checklist.map((med: string, i: number) => (
                        <p key={i}>● {med}</p>
                      ))}
                    </div>
                  )}
                  {kitResult.supplies_checklist.length > 0 && (
                    <div className="pt-1 border-t border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">Survival Gear:</span>
                      {kitResult.supplies_checklist.map((supp: string, i: number) => (
                        <p key={i}>● {supp}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadKit}
                    className="flex-grow py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-center text-xs"
                  >
                    Download Kit (MD)
                  </button>
                  <button
                    onClick={() => setKitResult(null)}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-gray-400"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FIRST AID EMERGENCY ASSISTANT */}
          <div className="p-5 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 mb-4 border-b border-white/5 pb-2 uppercase tracking-wide">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              First Aid Manuals
            </h3>

            <div className="flex gap-2 mb-4">
              {["burn", "bleeding", "fracture"].map((injury) => (
                <button
                  key={injury}
                  onClick={() => handleInjurySelect(injury)}
                  className={`flex-grow py-2 rounded text-xs font-bold capitalize ${
                    selectedInjury === injury ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {injury}
                </button>
              ))}
            </div>

            {isFirstAidLoading && (
              <div className="text-center py-6 text-xs text-gray-500 animate-pulse">
                Fetching emergency first aid protocol...
              </div>
            )}

            {firstAidResult && (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 bg-[#111420] border border-red-500/20 rounded">
                  <h4 className="font-bold text-white mb-1.5 uppercase text-[10px] tracking-wide text-red-400">Immediate Protocol: {firstAidResult.injury}</h4>
                  <p className="text-gray-200 font-semibold mb-2">{firstAidResult.immediate_response}</p>
                  
                  {firstAidResult.safety_steps?.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px] border-t border-white/5 pt-2 mt-2">
                      {firstAidResult.safety_steps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="p-2 bg-red-950/20 border border-red-500/30 rounded text-[10px] text-center text-red-300 font-bold uppercase tracking-widest animate-pulse">
                  ⚠️ Seek professional medical help immediately.
                </div>
              </div>
            )}

            {!firstAidResult && !isFirstAidLoading && (
              <div className="text-center py-8 text-xs text-gray-500">
                Select an injury category above to query the Medical Assistance Agent.
              </div>
            )}
          </div>

        </div>

        {/* 4. DISASTER RISK PREDICTION MODULE */}
        <div className="p-6 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Disaster Risk Prediction
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Input weather sensors and environmental parameters to trigger the AI risk score model.
          </p>

          <form onSubmit={handleRiskPredict} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Rainfall Level</span>
                  <span className="text-red-400 font-bold">{riskForm.rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  className="w-full accent-red-500"
                  value={riskForm.rainfall}
                  onChange={(e) => setRiskForm({ ...riskForm, rainfall: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Wind Velocity</span>
                    <span className="text-red-400 font-bold">{riskForm.wind_speed} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    className="w-full accent-red-500"
                    value={riskForm.wind_speed}
                    onChange={(e) => setRiskForm({ ...riskForm, wind_speed: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Water Gauge</span>
                    <span className="text-red-400 font-bold">{riskForm.water_level} m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full accent-red-500"
                    value={riskForm.water_level}
                    onChange={(e) => setRiskForm({ ...riskForm, water_level: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPredictingRisk}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider text-xs"
              >
                {isPredictingRisk ? "Running prediction modeling..." : "Run Risk Engine"}
              </button>
            </div>

            <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 h-[170px]">
              {riskResult ? (
                <div className="text-center space-y-2">
                  <div className="text-3xl font-black text-neon-red text-red-500">{riskResult.risk_score}%</div>
                  <div className="text-xs uppercase font-extrabold tracking-wider text-white">{riskResult.risk_level}</div>
                  <p className="text-[10px] text-gray-500 max-w-[150px] leading-relaxed truncate">
                    {riskResult.recommendations?.[0] || "Check preparedness reserves."}
                  </p>
                </div>
              ) : (
                <div className="text-center text-xs text-gray-500 space-y-2">
                  <svg className="w-8 h-8 mx-auto opacity-35" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path>
                  </svg>
                  <p>Run prediction to view hazard dial.</p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* 5. VISION IMAGE ANALYZER */}
        <div className="p-6 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            </svg>
            Emergency Image Analyzer
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Upload images of flooding, structural damages, or road blocks. The Gemini Vision agent will analyze severity levels.
          </p>

          <form onSubmit={handleImageAnalysisSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 bg-black/30 hover:border-red-500/30 transition-colors cursor-pointer relative h-[180px]">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Preview" className="h-full object-contain rounded" />
              ) : (
                <div className="text-center text-xs text-gray-500 space-y-2">
                  <svg className="w-8 h-8 mx-auto opacity-35" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p>Click or drag image file here to select</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              {imageAnalysisResult ? (
                <div className="p-3 bg-[#111420] border border-white/5 rounded text-xs font-mono space-y-1.5">
                  <p><span className="text-gray-500">Disaster:</span> <span className="text-red-400 font-bold">{imageAnalysisResult.disaster_identified}</span></p>
                  <p><span className="text-gray-500">Risk Level:</span> <span className="text-white font-bold">{imageAnalysisResult.risk_level}</span></p>
                  <p className="text-[11px] text-gray-400 leading-relaxed"><span className="text-gray-500">Damage:</span> {imageAnalysisResult.damage_assessment}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-gray-500 font-mono">
                  No image analysis results generated yet.
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedImageFile || isAnalyzingImage}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider text-xs disabled:opacity-50 mt-4"
              >
                {isAnalyzingImage ? "Vision Agent processing..." : "Analyze Selected Image"}
              </button>
            </div>
          </form>
        </div>

        {/* 6. VOLUNTEER MATCHING SYSTEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* VOLUNTEER REGISTRATION */}
          <div className="p-5 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 mb-4 border-b border-white/5 pb-2 uppercase tracking-wide">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Register Volunteer
            </h3>

            {!isVolunteerRegistered ? (
              <form onSubmit={handleRegisterVolunteer} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                    placeholder="Enter Name"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Primary Skill</label>
                    <select
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      value={volunteerForm.skills}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                    >
                      <option value="first_aid">First Aid Medic</option>
                      <option value="swimming">Swim Search & Rescue</option>
                      <option value="logistics">Logistics & Cooking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Mobile Line</label>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      placeholder="Contact No"
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider text-xs"
                >
                  Join Emergency Grid
                </button>
              </form>
            ) : (
              <div className="text-center py-6 text-xs space-y-2">
                <p className="text-emerald-400 font-bold">✓ Successfully Registered on Grid!</p>
                <button
                  onClick={() => setIsVolunteerRegistered(false)}
                  className="px-4 py-1.5 bg-white/5 rounded text-gray-400 hover:text-white"
                >
                  Register Another
                </button>
              </div>
            )}
          </div>

          {/* HELP REQUESTS & AUTO MATCH */}
          <div className="p-5 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 mb-4 border-b border-white/5 pb-2 uppercase tracking-wide">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Request Citizen Help
            </h3>

            {!victimRequestSubmitted ? (
              <form onSubmit={handleVictimRequestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Distress Type</label>
                  <select
                    className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                    value={victimForm.need_type}
                    onChange={(e) => setVictimForm({ ...victimForm, need_type: e.target.value })}
                  >
                    <option value="Food & Water">Food & Clean Water</option>
                    <option value="first_aid">Medic & First Aid</option>
                    <option value="swimming">Flooded Extraction</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      placeholder="Name"
                      value={victimForm.name}
                      onChange={(e) => setVictimForm({ ...victimForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Phone Line</label>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                      placeholder="Phone"
                      value={victimForm.phone}
                      onChange={(e) => setVictimForm({ ...victimForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider text-xs"
                >
                  Broadcast Help Need
                </button>
              </form>
            ) : (
              <div className="space-y-2.5 text-xs">
                <p className="text-emerald-400 font-bold uppercase text-[10px]">✓ Alert Dispatched. Matched Volunteers:</p>
                <div className="space-y-2 font-mono text-[11px]">
                  {matchedVolunteers.length > 0 ? matchedVolunteers.map((vol, i) => (
                    <div key={i} className="p-2 bg-black/40 rounded border border-white/5">
                      <p className="font-bold text-white">{vol.name}</p>
                      <p className="text-gray-400">Phone: {vol.phone}</p>
                      <p className="text-red-400 text-[10px] uppercase">Skill: {vol.skills?.[0] || "General relief"}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500">Searching emergency database volunteers...</p>
                  )}
                </div>
                <button
                  onClick={() => setVictimRequestSubmitted(false)}
                  className="w-full py-1 bg-white/5 hover:bg-white/10 rounded text-gray-400"
                >
                  Make New Request
                </button>
              </div>
            )}
          </div>

        </div>

        {/* 7. FAMILY SAFETY TRACKER MODULE */}
        <div className="p-6 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-white/5 pb-2 uppercase tracking-wide">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Family Tracker
            </h3>
            
            <form onSubmit={handleFamilyUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Member Name</label>
                <input
                  type="text"
                  className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                  placeholder="e.g. Karan Johar"
                  value={familyForm.name}
                  onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Status</label>
                  <select
                    className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                    value={familyForm.status}
                    onChange={(e) => setFamilyForm({ ...familyForm, status: e.target.value })}
                  >
                    <option value="safe">Mark Safe</option>
                    <option value="need_help">Needs Help</option>
                    <option value="missing">Flag Missing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Last Location</label>
                  <input
                    type="text"
                    className="w-full bg-black/60 border border-white/10 rounded p-2 text-white"
                    placeholder="e.g. Sector 4"
                    value={familyForm.location}
                    onChange={(e) => setFamilyForm({ ...familyForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider text-xs"
              >
                Update Status log
              </button>
              {isFamilyUpdated && <p className="text-[10px] text-emerald-400 text-center font-bold">✓ Log Sync Complete</p>}
            </form>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Sync Log Feed</h4>
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {family.map((member) => (
                <div key={member.id} className="p-3 bg-black/40 rounded border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-white">{member.name}</span>
                    <p className="text-[10px] text-gray-500">Loc: {member.location}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    member.status === "safe"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : member.status === "missing"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {member.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
