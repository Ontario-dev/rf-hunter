import { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { CITIES } from '../data/stations';

export default function LocationManager({ onLocationUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState('uninitialized'); // uninitialized, detecting, success, manual
  const [detectedCity, setDetectedCity] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const requestLocation = () => {
    setLoading(true);
    setError(null);
    setLocationStatus('detecting');

    if (!navigator.geolocation) {
      handleLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        // In a real app we might reverse-geocode. For now, we assume Lagos or use proximity if we had multiple cities.
        // Let's just default to Lagos for this prototype or allow manual fallback.
        setDetectedCity('Lagos, Nigeria');
        setLocationStatus('success');
        setLoading(false);
        onLocationUpdate(CITIES['Lagos']);
      },
      (err) => {
        handleLocationError(err.message || 'Unable to retrieve your location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleLocationError = (errorMsg) => {
    setLoading(false);
    setError(errorMsg);
    setLocationStatus('manual');
    onLocationUpdate(CITIES['Lagos']); // Fallback to Lagos
  };

  const handleManualCityChange = (e) => {
    const city = e.target.value;
    setDetectedCity(city);
    onLocationUpdate(CITIES[city] || CITIES['Lagos']);
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-8 shadow-sm dark:shadow-lg transition-colors duration-300">
      <div className="flex flex-col gap-4">
        {locationStatus === 'uninitialized' && (
          <div className="text-center py-4">
            <div className="bg-blue-50 dark:bg-slate-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-slate-600">
              <MapPin className="text-blue-500 dark:text-blue-400 w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">Find Clear Frequencies</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              We need your location to find the best FM frequencies near you.
            </p>
            <button
              onClick={requestLocation}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              <span>{loading ? 'Detecting Location...' : 'Use My GPS Location'}</span>
            </button>
          </div>
        )}

        {(locationStatus === 'success' || locationStatus === 'manual') && (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Current Location
                </h3>
                <div className="flex items-center gap-2">
                  <MapPin className="text-green-500 dark:text-green-400 w-5 h-5" />
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex-1">
                    {locationStatus === 'manual' && !error ? 'Manual Selection' : detectedCity || 'Lagos, Nigeria'}
                  </span>
                </div>
                {coordinates && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-mono mt-1">
                    {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <button
                onClick={requestLocation}
                disabled={loading}
                className="p-2 box-content bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-600"
                aria-label="Refresh location"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-500 dark:text-blue-400' : ''}`} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300 mb-0.5">Location Error</p>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
              <label htmlFor="city-select" className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                Or choose manually:
              </label>
              <select
                id="city-select"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 appearance-none outline-none transition-colors"
                onChange={handleManualCityChange}
                defaultValue="Lagos"
              >
                {Object.keys(CITIES).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
