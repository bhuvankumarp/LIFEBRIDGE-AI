import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "LifeBridge AI - Emergency Response & Disaster Assistant",
  description: "A multi-agent real-time disaster management and emergency response command center platform powered by Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark h-full antialiased`}>
      <body className="min-h-screen bg-[#030408] text-gray-100 flex flex-col antialiased">
        {/* Real-time Emergency Header Ticker */}
        <div className="bg-red-950/60 border-b border-red-500/20 text-red-200 text-xs px-4 py-2 flex items-center justify-between gap-4 select-none backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 glow-red animate-pulse flex-shrink-0"></span>
            <span className="font-bold tracking-wider uppercase text-red-400">SYSTEM BROADCAST:</span>
            <div className="overflow-hidden relative w-96 md:w-[600px] h-4">
              <div className="animate-marquee text-gray-300 absolute">
                🚨 Severe Red Alert: Cyclone threat near East Coast active. Evacuation channels open. | 💧 Flood warning issued for low-lying zones. | 📞 Contact local control panel at 112 or 1078. | 🧠 AI Agent grid fully synced.
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 text-red-400 font-semibold uppercase text-[10px] tracking-widest hidden md:inline-block border border-red-500/30 px-2 py-0.5 rounded bg-red-950/80">
            Node: ACTIVE (SECURE)
          </div>
        </div>

        {/* Global Navigation */}
        <header className="border-b border-white/5 bg-[#030408]/80 backdrop-blur-md sticky top-[33px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/30">
                L
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-dark"></span>
              </div>
              <div>
                <span className="font-bold tracking-wider text-white text-base">LIFEBRIDGE <span className="text-red-500 font-extrabold text-xs px-1.5 py-0.5 bg-red-950/50 border border-red-500/30 rounded ml-1">AI</span></span>
                <span className="hidden sm:block text-[9px] uppercase tracking-widest text-gray-500 font-medium">Emergency Response Command</span>
              </div>
            </div>
            
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Portal Home</a>
              <a href="/dashboard" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 border border-red-500/20 px-3 py-1.5 rounded-md bg-red-950/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                Command Center
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#030408]/90 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© 2026 LifeBridge AI. Developed under Kaggle AI Agents Capstone Project ("Agents for Good" track).</p>
            <div className="flex gap-4">
              <span className="text-emerald-500 font-medium">● Local Database Synced</span>
              <span>● Offline Mode Active</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
