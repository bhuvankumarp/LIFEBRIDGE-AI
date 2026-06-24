"use client";

import React, { useState } from "react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      title: "1. Emergency Alert Agent",
      role: "Trriage & Core Intake",
      desc: "Detects disaster type (flood, landslide, fire), estimates severity level, and captures location coordinates.",
      color: "border-red-500 text-red-400 bg-red-950/20"
    },
    {
      title: "2. Disaster Prediction Agent",
      role: "Risk & Hazard Indexing",
      desc: "Calculates live risk indicators based on rainfall metrics, wind velocity, temperatures, and water gauge heights.",
      color: "border-orange-500 text-orange-400 bg-orange-950/20"
    },
    {
      title: "3. Shelter Recommendation Agent",
      role: "Safe Evacuation & Placement",
      desc: "Finds closest safe shelters, verifies operational status, checks hospital capacity, and plots risk-free routes.",
      color: "border-yellow-500 text-yellow-400 bg-yellow-950/20"
    },
    {
      title: "4. Medical Assistance Agent",
      role: "First Aid & Trauma Support",
      desc: "Triages emergency injuries, produces immediate safety directives (burns, bleeding, fractures), and files dispatch requests.",
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/20"
    },
    {
      title: "5. Resource Allocation Agent",
      role: "Logistics & Priority Routing",
      desc: "Monitors supply levels (food, water, kits) inside shelters and routes replenishment trucks to critical hubs.",
      color: "border-blue-500 text-blue-400 bg-blue-950/20"
    },
    {
      title: "6. Communication Agent",
      role: "Public Broadcast & SMS Push",
      desc: "Drafts warning feeds, compiles local radio scripts, and broadcasts geo-targeted SMS warnings to residents.",
      color: "border-purple-500 text-purple-400 bg-purple-950/20"
    }
  ];

  return (
    <div className="flex-grow bg-[#030408] tactical-grid min-h-screen relative overflow-hidden">
      {/* Glow overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-6 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Kaggle AI Agents Capstone Project
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight max-w-4xl">
          LIFEBRIDGE <span className="text-red-500 text-neon-red">AI</span><br />
          <span className="text-3xl md:text-5xl font-light text-gray-400">Emergency Response & Disaster Assistant</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          An autonomous multi-agent disaster response network coordinating real-time risk intelligence, resource dispatch, first-aid support, and community coordination.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="/dashboard" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-red-600/30 flex items-center gap-2 group">
            Launch Live Command Center
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
          <a href="/dashboard?sos=true" className="px-8 py-4 bg-transparent border border-red-500/40 hover:bg-red-500/10 text-red-400 font-bold rounded-lg transition-all duration-200">
            Immediate SOS Protocol
          </a>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mt-16 p-6 rounded-xl border border-white/5 bg-gray-950/40 backdrop-blur-md">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-red-500 text-neon-red">3</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Active Incidents</div>
          </div>
          <div className="text-center border-l border-white/5">
            <div className="text-3xl font-extrabold text-white">8</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">AI Agents Online</div>
          </div>
          <div className="text-center border-l border-white/5">
            <div className="text-3xl font-extrabold text-emerald-500 text-neon-emerald">3,500 L</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Water Allocated</div>
          </div>
          <div className="text-center border-l border-white/5">
            <div className="text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">System Health</div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES OVERVIEW */}
      <section className="py-20 border-t border-white/5 bg-gradient-to-b from-[#030408] to-[#060810] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Core Emergency Capabilities</h2>
            <p className="text-gray-500 mt-2">Next-generation features built for field operations and citizen relief.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-white/5 bg-gray-950/30 glass-panel">
              <div className="w-12 h-12 bg-red-950/50 border border-red-500/30 rounded-lg flex items-center justify-center text-red-500 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Disaster Chatbot</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Receive natural, instantaneous safety manuals for floods, landslides, fires, and cyclones. Multilingual text and speech output supported.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-white/5 bg-gray-950/30 glass-panel">
              <div className="w-12 h-12 bg-orange-950/50 border border-orange-500/30 rounded-lg flex items-center justify-center text-orange-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Disaster Digital Twin</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                An interactive map displaying active danger levels, live hospital occupancies, shelter resources, and safe evacuation corridors.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-white/5 bg-gray-950/30 glass-panel">
              <div className="w-12 h-12 bg-emerald-950/50 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Kit Generator</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generate highly specific, downloadable 3-day emergency supplies lists matched to your household's kids, elders, and pets.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-white/5 bg-gray-950/30 glass-panel">
              <div className="w-12 h-12 bg-purple-950/50 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Image Disaster Analyzer</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Upload images of road blockages, fires, or structural issues. The Vision Agent analyzes damage scope and produces instant safety steps.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-white/5 bg-gray-950/30 glass-panel">
              <div className="w-12 h-12 bg-blue-950/50 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Volunteer & Help Board</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Victims submit requests for food, swimming extraction, or first-aid, while AI immediately recruits matched regional volunteers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-white/5 bg-gray-950/30 glass-panel">
              <div className="w-12 h-12 bg-red-950/50 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">SOS Broadcast Engine</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Trigger emergency protocol with a single click. Captures GPS, compiles distress messages, and flags emergency agencies instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MULTI-AGENT WORKFLOW VISUALIZER */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">The Multi-Agent Orchestration</h2>
          <p className="text-gray-500 mt-2">See how our AI agents coordinate automatically when an emergency report is submitted.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Timeline flow */}
          <div className="lg:col-span-7 space-y-4">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                  activeStep === idx 
                    ? "glass-panel-red border-red-500/50 shadow-md shadow-red-500/5" 
                    : "border-white/5 bg-gray-950/20 hover:border-white/10"
                }`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    activeStep === idx ? "bg-red-500 text-white" : "border-gray-700 text-gray-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      {step.title}
                      {activeStep === idx && (
                        <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">
                          Active State
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-red-400 font-semibold mb-1">{step.role}</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visualization Graphic */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center p-8 rounded-2xl border border-white/5 bg-gray-950/50 relative overflow-hidden h-[450px]">
            <div className="absolute inset-0 radar-sweep opacity-30"></div>
            
            {/* Display active state details */}
            <div className="relative z-10 w-full text-center space-y-6">
              <div className="inline-flex w-24 h-24 rounded-full border-2 border-dashed border-red-500/30 items-center justify-center bg-red-950/10 glow-red animate-pulse">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white">{workflowSteps[activeStep].title}</h3>
                <p className="text-xs text-red-400 uppercase tracking-widest font-semibold mt-1">Orchestration Phase {activeStep + 1}</p>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-left text-xs text-gray-400 font-mono leading-relaxed h-[130px] overflow-y-auto">
                <span className="text-red-500 font-bold">$ lifebridge-agent run_orchestration</span>
                <br /><br />
                {activeStep === 0 && "ALERT_AGENT: Listening to distress channels... Report captured. Identifying disaster parameters..."}
                {activeStep === 1 && "PREDICT_AGENT: Loading sensors... Water sensor: +2.5m. Rain index: 120mm/hr. Triggering RISK LEVEL RED prediction."}
                {activeStep === 2 && "SHELTER_AGENT: Querying community shelter registers. Nearest option: Central Community (320/500 occupancy). Checking routes..."}
                {activeStep === 3 && "MEDICAL_AGENT: Tracing medical terms. Bleeding keywords present. Rendering wound pressure instruction protocol."}
                {activeStep === 4 && "RESOURCE_AGENT: Evaluating inventory logs. Food levels low at East Shelter. Alerting dispatch unit."}
                {activeStep === 5 && "COMMUNICATION_AGENT: Formatting SMS alert template. Text body: 'LIFEBRIDGE: Sector 4 evacuation recommended.' Dispatching warnings."}
              </div>
              
              <div className="flex gap-2 justify-center">
                <button 
                  className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-gray-400 hover:text-white"
                  onClick={() => setActiveStep(prev => (prev === 0 ? 5 : prev - 1))}
                >
                  ◀ Previous
                </button>
                <button 
                  className="px-3 py-1 rounded bg-red-950/40 border border-red-500/30 text-[11px] text-red-400 hover:bg-red-500/20"
                  onClick={() => setActiveStep(prev => (prev === 5 ? 0 : prev + 1))}
                >
                  Next Step ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY SYSTEM CTA */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-white mb-4">Launch Command Center Platform</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Start coordinating incidents, managing resources, simulating evacuations, and monitoring the multi-agent AI response logs.
        </p>
        <a href="/dashboard" className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg tracking-wider transition-all duration-200 shadow-xl shadow-red-600/20">
          ENTER SECURE COMMAND SYSTEM
        </a>
      </section>
    </div>
  );
}
