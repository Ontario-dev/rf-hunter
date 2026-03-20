import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LocationManager from './components/LocationManager';
import FrequencyResults from './components/FrequencyResults';
import OccupiedStationsIndicator from './components/OccupiedStationsIndicator';
import { findClearFrequencies } from './utils/frequencyLogic';
import { Download } from 'lucide-react';

function App() {
  const [stations, setStations] = useState([]);
  const [clearFreqs, setClearFreqs] = useState([]);
  const [savedFreq, setSavedFreq] = useState(null);
  const [theme, setTheme] = useState('dark');

  // Load saved frequency and theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rf-hunter-saved-freq');
    if (saved) {
      setSavedFreq(parseFloat(saved));
    }
    
    // Theme logic
    const savedTheme = localStorage.getItem('rf-hunter-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []);

  // Sync theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('rf-hunter-theme', newTheme);
  };

  const handleLocationUpdate = (localStations) => {
    setStations(localStations);
    const recommended = findClearFrequencies(localStations, 8);
    setClearFreqs(recommended);
  };

  const handleSaveFrequency = (freq) => {
    if (savedFreq === freq) {
      // Toggle off
      setSavedFreq(null);
      localStorage.removeItem('rf-hunter-saved-freq');
    } else {
      setSavedFreq(freq);
      localStorage.setItem('rf-hunter-saved-freq', freq.toString());
    }
  };

  const handleExportText = () => {
    if (clearFreqs.length === 0) return;
    
    let text = `Clear FM Frequencies (RF-Hunter)\n\n`;
    text += `Best options:\n`;
    clearFreqs.forEach((f, i) => {
      text += `${i + 1}. ${f.freq.toFixed(1)} FM - ${f.label} (nearest interference: ${f.nearestStation?.freq} FM)\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clear_frequencies.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col pt-4 transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow max-w-md w-full mx-auto p-4 flex flex-col pt-6">
        <LocationManager onLocationUpdate={handleLocationUpdate} />
        
        {stations.length > 0 && (
          <OccupiedStationsIndicator stations={stations} />
        )}

        <FrequencyResults 
          frequencies={clearFreqs} 
          savedFrequency={savedFreq}
          onSaveFrequency={handleSaveFrequency} 
        />
        
        {clearFreqs.length > 0 && (
          <button
            onClick={handleExportText}
            className="mt-8 mx-auto w-full max-w-[200px] py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-medium rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export List</span>
          </button>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
