import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

const SystemLogs: React.FC<{ logs: LogEntry[]; darkMode: boolean }> = ({ logs, darkMode }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className={`h-full p-4 font-mono text-[11px] flex flex-col transition-colors ${
        darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Logs</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3">
             <span className="text-gray-500 shrink-0 font-medium">&gt;</span>
             <span className={`break-words ${
                 log.level === 'ERR' 
                 ? 'text-red-500 font-bold' 
                 : (darkMode ? 'text-gray-400' : 'text-gray-600')
             }`}>
               {log.message}
             </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default SystemLogs;