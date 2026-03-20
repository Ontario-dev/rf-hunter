// Utility functions for RF-Hunter

const MIN_FREQ = 88.0;
const MAX_FREQ = 108.0;
const STEP = 0.1;

export const generateAllFrequencies = () => {
  const freqs = [];
  for (let f = MIN_FREQ; f <= MAX_FREQ; f += STEP) {
    freqs.push(parseFloat(f.toFixed(1)));
  }
  return freqs;
};

/**
 * Evaluates interference for a given frequency against a list of occupied stations.
 * Returns { score: number, reason: string, nearest: object|null }
 * Score is higher (better) when further from occupied stations.
 * Interference rules:
 * - Exact match (dist 0): interference 1.0
 * - ±0.1 (dist 0.1): risky, interference 0.5
 * - ±0.2 (dist 0.2): minor risk, interference 0.2
 * - dist >= 0.3: clear, interference 0.0
 */
export const evaluateFrequency = (freq, stations) => {
  let minDistance = Infinity;
  let nearestStation = null;

  for (const station of stations) {
    const dist = Math.abs(freq - station.freq);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStation = station;
    }
  }

  // Calculate interference
  const distFixed = parseFloat(minDistance.toFixed(1));
  let interference = 0.0;
  let label = 'Perfect';

  if (distFixed === 0) {
    interference = 1.0;
    label = 'Occupied';
  } else if (distFixed === 0.1) {
    interference = 0.5;
    label = 'Risky (Adjacent)';
  } else if (distFixed === 0.2) {
    interference = 0.2;
    label = 'Good (Minor Risk)';
  }

  return {
    freq,
    distanceToNearest: distFixed,
    nearestStation,
    interference,
    label,
  };
};

export const findClearFrequencies = (stations, limit = 10) => {
  const allFreqs = generateAllFrequencies();
  
  const evaluated = allFreqs.map(f => evaluateFrequency(f, stations));
  
  // Filter out completely occupied ones (interference === 1.0)
  // Actually, let's keep them in the array but sort them to the bottom,
  // or just filter out interference > 0.5 for recommendations.
  const recommended = evaluated.filter(e => e.interference < 0.5);

  // Sort by highest distance to nearest station first (descending)
  // If distances are equal, sort by lower frequency just for consistency
  recommended.sort((a, b) => {
    if (b.distanceToNearest !== a.distanceToNearest) {
      return b.distanceToNearest - a.distanceToNearest;
    }
    return a.freq - b.freq;
  });

  return recommended.slice(0, limit);
};
