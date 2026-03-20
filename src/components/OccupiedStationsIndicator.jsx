import { useState } from 'react';
import { Radio } from 'lucide-react';

export default function OccupiedStationsIndicator({ stations }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!stations || stations.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-2xl mb-8 overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-transparent dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="font-medium text-slate-800 dark:text-slate-200">Nearby Stations ({stations.length})</h3>
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-500">{isOpen ? 'Hide' : 'Show'}</span>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar bg-white dark:bg-transparent">
          {stations.map(station => (
            <div key={`${station.freq}-${station.name}`} className="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800/80 flex justify-between items-center group transition-colors duration-300">
              <span className="text-slate-900 dark:text-slate-300 font-medium">{station.freq.toFixed(1)}</span>
              <span className="text-slate-500 dark:text-slate-500 text-xs truncate max-w-[80px]" title={station.name}>
                {station.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
