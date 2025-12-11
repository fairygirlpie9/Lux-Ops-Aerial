import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Bell, Settings, Volume2, Moon, Ruler, Cpu, Activity, Zap, Wind } from 'lucide-react';
import Sidebar from './components/Sidebar';
import OperationalMap from './components/OperationalMap';
import AlertPanel from './components/AlertPanel';
import SystemLogs from './components/SystemLogs';
import { INITIAL_ALERTS, INITIAL_DRONES, INITIAL_LOGS, INITIAL_WEATHER } from './constants';
import { Drone } from './types';

const DroneSchematic: React.FC<{ drone: Drone | null; darkMode: boolean; units: string }> = ({ drone, darkMode, units }) => {
  if (!drone) return (
    <div className={`h-full rounded-sm border shadow-sm p-6 flex flex-col items-center justify-center transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-white border-[#E5E7EB] text-gray-300'
    }`}>
       <Cpu size={48} strokeWidth={1} className="mb-4 opacity-50" />
       <span className="text-[10px] font-bold uppercase tracking-widest">Select Drone for Schematic</span>
    </div>
  );

  return (
    <div className={`h-full rounded-sm border shadow-sm p-5 flex flex-col relative overflow-hidden transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E7EB]'
    }`}>
        <div className="flex justify-between items-start mb-4 z-10">
            <div>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schematic View</h3>
               <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{drone.callsign}</div>
            </div>
            <div className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase ${
                darkMode ? 'border-gray-500 text-gray-300' : 'border-[#111827] text-[#111827]'
            }`}>
                MK-IV
            </div>
        </div>

        {/* Wireframe Graphic */}
        <div className="flex-1 relative flex items-center justify-center my-2">
            <svg viewBox="0 0 200 200" className="w-full h-full max-h-40 opacity-80">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={darkMode ? "#374151" : "#F3F4F6"} strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Drone Body Wireframe */}
                <g stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeLinejoin="round" className="animate-pulse-slow">
                    <path d="M70,100 L130,100 M100,70 L100,130" opacity="0.5" />
                    <circle cx="100" cy="100" r="25" />
                    <rect x="90" y="90" width="20" height="20" />
                    {/* Arms */}
                    <path d="M82,82 L50,50" />
                    <path d="M118,82 L150,50" />
                    <path d="M118,118 L150,150" />
                    <path d="M82,118 L50,150" />
                    {/* Rotors */}
                    <circle cx="50" cy="50" r="12" strokeDasharray="4 2" className="animate-spin-slow origin-[50px_50px]" />
                    <circle cx="150" cy="50" r="12" strokeDasharray="4 2" className="animate-spin-slow origin-[150px_50px]" />
                    <circle cx="150" cy="150" r="12" strokeDasharray="4 2" className="animate-spin-slow origin-[150px_150px]" />
                    <circle cx="50" cy="150" r="12" strokeDasharray="4 2" className="animate-spin-slow origin-[50px_150px]" />
                </g>

                {/* Status Indicators */}
                 {drone.status === 'CRITICAL' && (
                     <circle cx="100" cy="100" r="40" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" className="animate-ping" opacity="0.5"/>
                 )}
            </svg>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] z-10">
            <div className={`p-2 rounded-sm border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="text-gray-400 font-bold mb-0.5 flex items-center gap-1"><Activity size={8}/> MOTOR RPM</div>
                <div className={`font-mono ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>
                    {drone.status === 'OPERATIONAL' ? '4200' : 'VAR'} <span className="text-gray-400">avg</span>
                </div>
            </div>
            <div className={`p-2 rounded-sm border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="text-gray-400 font-bold mb-0.5 flex items-center gap-1"><Zap size={8}/> ESC TEMP</div>
                <div className={`font-mono ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>
                    {drone.status === 'CRITICAL' ? (units === 'metric' ? '62°C' : '143°F') : (units === 'metric' ? '45°C' : '113°F')} <span className="text-gray-400">nom</span>
                </div>
            </div>
            <div className={`p-2 rounded-sm border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="text-gray-400 font-bold mb-0.5 flex items-center gap-1"><Wind size={8}/> AIRSPEED</div>
                <div className={`font-mono ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>
                    {drone.velocity} <span className="text-gray-400">m/s</span>
                </div>
            </div>
            <div className={`p-2 rounded-sm border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="text-gray-400 font-bold mb-0.5">PAYLOAD</div>
                <div className={`font-mono ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>OPTICAL</div>
            </div>
        </div>
        
        {/* Background Decorative Lines */}
        <div className={`absolute inset-0 pointer-events-none ${darkMode ? 'opacity-10' : 'opacity-5'}`}>
            <div className={`absolute top-10 left-0 w-full h-px ${darkMode ? 'bg-white' : 'bg-[#111827]'}`}></div>
            <div className={`absolute bottom-10 left-0 w-full h-px ${darkMode ? 'bg-white' : 'bg-[#111827]'}`}></div>
            <div className={`absolute top-0 left-10 w-px h-full ${darkMode ? 'bg-white' : 'bg-[#111827]'}`}></div>
            <div className={`absolute top-0 right-10 w-px h-full ${darkMode ? 'bg-white' : 'bg-[#111827]'}`}></div>
        </div>
    </div>
  )
}

export default function App() {
  const [drones] = useState(INITIAL_DRONES);
  const [alerts] = useState(INITIAL_ALERTS);
  const [logs] = useState(INITIAL_LOGS);
  const [weather] = useState(INITIAL_WEATHER);
  
  // State
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState({
    sound: false, // Default off to not annoy, user can toggle
    darkMode: false,
    units: 'metric' // 'metric' | 'imperial'
  });

  // Sound Effect
  const playAlert = useCallback(() => {
    if (!settings.sound) return;
    
    // Simple oscillator beep
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }
  }, [settings.sound]);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().split('T')[1].split('.')[0]);
    };
    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger sound on mount if critical alerts exist (and sound enabled)
  useEffect(() => {
      if (alerts.some(a => a.severity === 'CRITICAL')) {
          // Debounce slightly
          const t = setTimeout(() => playAlert(), 1000);
          return () => clearTimeout(t);
      }
  }, [alerts, playAlert]);

  const selectedDrone = drones.find(d => d.id === selectedDroneId) || null;

  // Unit Conversion Helpers
  const displayWindSpeed = settings.units === 'metric' 
    ? `${weather.windSpeed} m/s` 
    : `${(weather.windSpeed * 1.94384).toFixed(1)} kts`;

  const displayTemp = settings.units === 'metric'
    ? `${weather.temp}°C`
    : `${(weather.temp * 9/5 + 32).toFixed(1)}°F`;

  return (
    <div className={`h-screen w-screen font-mono flex flex-col overflow-hidden selection:bg-gray-200 transition-colors duration-300 ${
        settings.darkMode ? 'bg-[#111827] text-gray-100' : 'bg-[#F0F1F2] text-[#111827]'
    }`} onClick={() => showSettings && setShowSettings(false)}>
      
      {/* Global Header */}
      <header className={`h-14 border-b flex items-center justify-between px-6 shrink-0 z-30 relative transition-colors ${
          settings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div className="flex items-center gap-3">
           <LayoutGrid size={20} className={settings.darkMode ? 'text-white' : 'text-[#111827]'} />
           <span className={`text-sm font-bold tracking-tight ${settings.darkMode ? 'text-white' : 'text-[#111827]'}`}>NORDICFLIGHT<span className="font-normal text-gray-500">OPS</span></span>
        </div>

        <div className="flex items-center gap-8 text-xs font-medium text-gray-500">
           <div className="flex items-center gap-2">
             <span className={`tabular-nums font-bold ${settings.darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>{currentTime || '13:13:33'} <span className="text-gray-400 font-normal">UTC</span></span>
           </div>
           <div className={`h-4 w-px ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
           <div className="flex items-center gap-2">
             <span className={`font-bold ${settings.darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>{displayWindSpeed} {weather.windDirection}</span>
           </div>
           <div className={`h-4 w-px ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
           <div className="flex items-center gap-2">
             <div className="flex items-end gap-1">
                <div className={`w-0.5 h-1 ${settings.darkMode ? 'bg-green-500' : 'bg-black'}`}></div>
                <div className={`w-0.5 h-2 ${settings.darkMode ? 'bg-green-500' : 'bg-black'}`}></div>
                <div className={`w-0.5 h-3 ${settings.darkMode ? 'bg-green-500' : 'bg-black'}`}></div>
             </div>
             <span>LINKS: 100%</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
             className={`relative p-1 rounded transition-colors ${settings.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
             onClick={playAlert} // Test sound
           >
             <Bell size={18} className="text-gray-400" />
             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </button>
           
           <div className="relative">
             <button 
                className={`p-1 rounded transition-colors ${showSettings ? (settings.darkMode ? 'bg-gray-800' : 'bg-gray-100') : (settings.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50')}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
             >
               <Settings size={18} className="text-gray-400" />
             </button>
             
             {showSettings && (
               <div className={`absolute top-full right-0 mt-2 w-56 border shadow-lg rounded-sm p-1 z-50 ${settings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} onClick={e => e.stopPropagation()}>
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-700/20 mb-1">
                    System Preferences
                  </div>
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${settings.darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                    onClick={() => setSettings(s => ({...s, sound: !s.sound}))}
                  >
                    <div className="flex items-center gap-3"><Volume2 size={14} /> Sound Alerts</div>
                    <div className={`w-2 h-2 rounded-full ${settings.sound ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </button>
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${settings.darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                    onClick={() => setSettings(s => ({...s, darkMode: !s.darkMode}))}
                  >
                    <div className="flex items-center gap-3"><Moon size={14} /> Dark Mode</div>
                     <div className={`w-8 h-4 rounded-full p-0.5 ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors relative`}>
                         <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${settings.darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                     </div>
                  </button>
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${settings.darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                    onClick={() => setSettings(s => ({...s, units: s.units === 'metric' ? 'imperial' : 'metric'}))}
                  >
                    <div className="flex items-center gap-3"><Ruler size={14} /> Units</div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{settings.units}</span>
                  </button>
               </div>
             )}
           </div>

           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${settings.darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
             OD
           </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        
        {/* Left Sidebar: Metrics & Fleet */}
        <aside className="w-80 flex flex-col gap-4 shrink-0">
           <Sidebar 
              weather={weather} 
              drones={drones} 
              selectedDroneId={selectedDroneId}
              onSelectDrone={setSelectedDroneId}
              darkMode={settings.darkMode}
              units={settings.units}
           />
        </aside>

        {/* Center: Map & Logs */}
        <main className="flex-1 flex flex-col gap-4 min-w-0">
           <div className={`flex-1 rounded-sm border relative overflow-hidden shadow-sm ${settings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-[#E5E7EB]'}`}>
              <OperationalMap drones={drones} selectedDroneId={selectedDroneId} darkMode={settings.darkMode} />
           </div>
           <div className={`h-48 rounded-sm border shadow-sm shrink-0 overflow-hidden ${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E7EB]'}`}>
              <SystemLogs logs={logs} darkMode={settings.darkMode} />
           </div>
        </main>

        {/* Right Sidebar: Alerts & Schematic */}
        <aside className="w-80 flex flex-col gap-4 shrink-0">
           <div className={`flex-1 rounded-sm border shadow-sm overflow-hidden flex flex-col min-h-[40%] ${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E7EB]'}`}>
              <AlertPanel alerts={alerts} darkMode={settings.darkMode} />
           </div>
           <div className="h-72 shrink-0">
              <DroneSchematic drone={selectedDrone} darkMode={settings.darkMode} units={settings.units} />
           </div>
        </aside>

      </div>
    </div>
  );
}