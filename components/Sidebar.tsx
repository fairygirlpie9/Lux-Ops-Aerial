import React from 'react';
import { Battery } from 'lucide-react';
import { Drone } from '../types';

interface SidebarProps {
  weather: any;
  drones: Drone[];
  selectedDroneId: string | null;
  onSelectDrone: (id: string) => void;
  darkMode: boolean;
  units: string;
}

const Sidebar: React.FC<SidebarProps> = ({ drones, selectedDroneId, onSelectDrone, darkMode, units }) => {
  const complianceScore = 72;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (complianceScore / 100) * circumference;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Gauge Card */}
      <div className={`p-6 rounded-sm border shadow-sm flex flex-col items-center transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E7EB]'
      }`}>
        <h2 className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Compliance Score</h2>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="transform -rotate-90 w-full h-full block" viewBox="0 0 160 160">
            {/* Background Circle with dashes */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={darkMode ? "#374151" : "#F3F4F6"}
              strokeWidth="6"
              fill="transparent"
            />
             {/* Dashed ticks */}
             <circle
              cx="80"
              cy="80"
              r={radius + 12}
              stroke={darkMode ? "#4B5563" : "#E5E7EB"}
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="1 10"
            />
            {/* Value Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={darkMode ? "#065F46" : "#10B981"} // Base Green
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#F59E0B" // Amber for 72
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
             {/* Use flex and exact alignment to ensure centering */}
             <div className="flex flex-col items-center justify-center h-full w-full gap-0.5 pt-1">
                 <span className={`text-5xl font-bold tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{complianceScore}</span>
                 <span className="text-[9px] font-bold text-[#F59E0B] uppercase tracking-widest leading-none">HAZARDOUS</span>
             </div>
          </div>
        </div>

        <div className={`flex justify-between w-full mt-8 px-2 border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="text-center">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Risk Factors</div>
                <div className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>2 Active</div>
            </div>
            <div className={`h-8 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <div className="text-center">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Projection</div>
                <div className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>Stable</div>
            </div>
        </div>
      </div>

      {/* Fleet Status Card */}
      <div className={`p-6 rounded-sm border shadow-sm flex-1 transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E7EB]'
      }`}>
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Fleet Status</h2>
        <div className="flex flex-col gap-3">
            {drones.map(drone => {
                const isSelected = selectedDroneId === drone.id;
                // Dark Mode Logic for items
                let itemClass = "";
                if (isSelected) {
                    itemClass = darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-[#F0F9FF] border-blue-200 shadow-sm';
                } else {
                     if (drone.status === 'CRITICAL' || drone.status === 'WARNING') {
                         itemClass = darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300';
                     } else {
                         itemClass = darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50';
                     }
                }

                return (
                    <button 
                        key={drone.id} 
                        onClick={() => onSelectDrone(drone.id)}
                        className={`w-full text-left p-4 rounded-sm border transition-all duration-200 relative overflow-hidden group cursor-pointer ${itemClass}`}
                    >
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                        
                        <div className="flex justify-between items-center mb-2">
                            <span className={`font-bold text-sm ${isSelected ? 'text-blue-500' : (darkMode ? 'text-gray-200' : 'text-[#111827]')}`}>
                                {drone.callsign}
                            </span>
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                                drone.battery < 30 
                                ? (darkMode ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50') 
                                : (darkMode ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50')
                            }`}>
                                <Battery size={10} />
                                {drone.battery}%
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="text-[10px] text-gray-400">
                                ALT: {isSelected ? 'LOCATING...' : (units === 'metric' ? '46m' : '150ft')}
                            </div>
                            <div className="flex items-center gap-2">
                                {drone.status === 'CRITICAL' && (
                                    <>
                                        <span className="text-[9px] font-bold text-red-500">CRITICAL</span>
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    </>
                                )}
                                {drone.status === 'WARNING' && (
                                    <>
                                        <span className="text-[9px] font-bold text-amber-500">WARNING</span>
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    </>
                                )}
                                {drone.status === 'OPERATIONAL' && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                )}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;