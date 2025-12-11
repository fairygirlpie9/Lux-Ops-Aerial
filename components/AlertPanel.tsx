import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Alert } from '../types';

interface AlertProps {
    alert: Alert;
    darkMode: boolean;
}

const AlertItem: React.FC<AlertProps> = ({ alert, darkMode }) => (
    <div className={`p-4 rounded-sm border-l-4 border-y border-r transition-all hover:shadow-md ${
        alert.severity === 'CRITICAL' 
        ? (darkMode ? 'border-l-orange-500 border-gray-700 bg-gray-800' : 'border-l-orange-500 border-gray-200 bg-white')
        : (darkMode ? 'border-l-gray-600 border-gray-700 bg-gray-800/80' : 'border-l-gray-300 border-gray-100 bg-white opacity-80')
    }`}>
       <div className="flex items-start gap-3 mb-2">
          {alert.severity === 'CRITICAL' && <AlertTriangle className="text-orange-500 shrink-0" size={18} />}
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold uppercase ${darkMode ? 'text-gray-200' : 'text-[#111827]'}`}>{alert.code} POWER RESERVE</span>
                <span className="text-[10px] text-gray-500">{alert.timestamp}</span>
             </div>
             <p className={`text-sm leading-tight mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {alert.severity === 'CRITICAL' ? 'Battery level dropping (22%).' : alert.message}
             </p>
             
             {alert.severity === 'CRITICAL' && (
               <div className={`flex items-center justify-between p-2 rounded-sm border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Mitigation: <span className={darkMode ? 'text-white' : 'text-[#111827]'}>MONITOR</span></span>
                  <button className={`flex items-center gap-1 border px-2 py-0.5 rounded-sm transition-colors ${
                      darkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}>
                     <span className={`text-[9px] font-bold uppercase ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Execute</span>
                     <ArrowRight size={10} className="text-gray-500" />
                  </button>
               </div>
             )}
          </div>
       </div>
    </div>
);

const AlertPanel: React.FC<{ alerts: Alert[]; darkMode: boolean }> = ({ alerts, darkMode }) => {
  return (
    <div className={`flex flex-col h-full p-6 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
       <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actionable Alerts</h2>
          <span className={`text-white text-[10px] px-1.5 py-0.5 font-bold rounded-sm ${darkMode ? 'bg-blue-600' : 'bg-[#111827]'}`}>1 ACT</span>
       </div>
       
       <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {alerts.map(alert => (
             <AlertItem key={alert.id} alert={alert} darkMode={darkMode} />
          ))}
       </div>
    </div>
  );
};

export default AlertPanel;