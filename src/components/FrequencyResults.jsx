import { useState } from 'react';
import { Copy, CheckCircle2, AlertCircle, Info, Heart, Star } from 'lucide-react';

export default function FrequencyResults({ frequencies, savedFrequency, onSaveFrequency }) {
  const [copiedFreq, setCopiedFreq] = useState(null);

  if (!frequencies || frequencies.length === 0) {
    return null; // Don't render if no frequencies provided yet
  }

  const handleCopy = (freq) => {
    navigator.clipboard.writeText(freq.freq.toFixed(1));
    setCopiedFreq(freq.freq);
    setTimeout(() => setCopiedFreq(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Top Clear Frequencies</h2>
        <div className="h-6 px-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full flex items-center border border-green-200 dark:border-green-500/30">
          {frequencies.length} found
        </div>
      </div>

      <div className="space-y-3">
        {frequencies.map((item, index) => {
          const isBest = index === 0;
          const isSaved = savedFrequency === item.freq;
          
          return (
            <div 
              key={item.freq}
              className={`relative overflow-hidden group bg-white dark:bg-slate-800 border transition-all duration-300 rounded-xl p-4
                ${isBest ? 'border-green-500 dark:border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)] dark:shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                ${isSaved ? 'ring-1 ring-blue-500/50' : 'shadow-sm dark:shadow-none'}`}
            >
              {isBest && (
                <div className="absolute top-0 right-0 bg-green-500 text-white dark:text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
                  Best Choice
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 
                    ${isBest ? 'bg-green-50 dark:bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    <span className="text-xl font-bold">{item.freq.toFixed(1)}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">
                        {item.freq.toFixed(1)} FM
                      </h3>
                      {isSaved && <Star className="w-4 h-4 text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400" />}
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        {item.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-1 opacity-80 dark:opacity-70">
                      <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Nearest: {item.nearestStation?.freq} ({item.nearestStation?.name}) &middot; {item.distanceToNearest.toFixed(1)} away
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-2 group-hover:border-slate-300 dark:group-hover:border-slate-500 active:scale-95 z-10"
                    aria-label={`Copy ${item.freq} to clipboard`}
                  >
                    {copiedFreq === item.freq ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => onSaveFrequency(item.freq)}
                    className={`p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 rounded-lg transition-colors border flex items-center justify-center active:scale-95 z-10
                      ${isSaved ? 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' : 'text-slate-400 dark:text-slate-500 border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                    aria-label="Save as favorite"
                  >
                     <Heart className={`w-4 h-4 ${isSaved ? 'fill-blue-500 dark:fill-blue-400' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
