import { Circuit } from '../../library/index';

let recentNumbers: number[] = [];
let distribution: Map<number, number> = new Map();
const MAX_HISTORY = 100;

function generateRandomNumber(): number {
  const numBits = parseInt((document.getElementById('numBits') as HTMLSelectElement).value);
  const circuit = new Circuit(numBits);

  // Put all qubits in superposition
  for (let i = 0; i < numBits; i++) {
    circuit.h(i);
  }
  updateVisualization(circuit);

  circuit.run();

  // Measure all qubits
  let result = 0;
  for (let i = 0; i < numBits; i++) {
    const measurement = circuit.measure(i) as number;
    result = result | (measurement << (numBits - 1 - i));
  }

  return result;
}

import { BlochSphereThreeJS } from '../../library/visualization/renderers/ThreeJSRenderer';

let renderer: BlochSphereThreeJS | null = null;

function updateVisualization(circuit: Circuit) {
  try {
    const state = circuit.getQubitState(0);

    // Initialize Three.js renderer if not exists
    const container = document.getElementById('blochSphere');
    if (container && !renderer) {
      container.innerHTML = '';
      renderer = new BlochSphereThreeJS(container, {
        width: 600,
        height: 600,
        theme: 'dark',
      });
    }

    // Update the visualization
    if (renderer) {
      renderer.updateState(state);
    }
  } catch (error) {
    console.error('Error updating visualization:', error);
  }
}

function updateDisplay(number: number) {
  const numBits = parseInt((document.getElementById('numBits') as HTMLSelectElement).value);

  // Update number display
  document.getElementById('randomNumber')!.textContent = number.toString();
  document.getElementById('binaryValue')!.textContent = number.toString(2).padStart(numBits, '0');

  // Add to history
  recentNumbers.unshift(number);
  if (recentNumbers.length > MAX_HISTORY) {
    recentNumbers.pop();
  }

  // Update distribution
  distribution.set(number, (distribution.get(number) || 0) + 1);

  // Update recent numbers display
  const recentDiv = document.getElementById('recentNumbers');
  if (recentDiv) {
    recentDiv.innerHTML = recentNumbers
      .slice(0, 20)
      .map((n) => `<span style="background: var(--surface-light); padding: 0.5rem; border-radius: 4px;">${n}</span>`)
      .join('');
  }

  // Update statistics
  updateStatistics();
  updateDistributionChart();
}

function updateStatistics() {
  if (recentNumbers.length === 0) return;

  const count = recentNumbers.length;
  const sum = recentNumbers.reduce((a, b) => a + b, 0);
  const average = sum / count;
  const min = Math.min(...recentNumbers);
  const max = Math.max(...recentNumbers);

  document.getElementById('statsCount')!.textContent = count.toString();
  document.getElementById('statsAverage')!.textContent = average.toFixed(2);
  document.getElementById('statsMin')!.textContent = min.toString();
  document.getElementById('statsMax')!.textContent = max.toString();
}

function updateDistributionChart() {
  const numBits = parseInt((document.getElementById('numBits') as HTMLSelectElement).value);
  const maxValue = (1 << numBits) - 1;
  const chartDiv = document.getElementById('distributionChart');

  if (!chartDiv) return;

  // Calculate maximum count for scaling
  const maxCount = Math.max(...Array.from(distribution.values()), 1);

  // Create bars
  const bars: string[] = [];
  for (let i = 0; i <= maxValue; i++) {
    const count = distribution.get(i) || 0;
    const height = (count / maxCount) * 250;
    bars.push(`
      <div style="flex: 1; background: var(--primary); height: ${height}px; min-width: 2px; border-radius: 2px 2px 0 0; position: relative;" title="${i}: ${count}">
      </div>
    `);
  }

  chartDiv.innerHTML = bars.join('');
}

function clearStatistics() {
  recentNumbers = [];
  distribution.clear();

  document.getElementById('randomNumber')!.textContent = '-';
  document.getElementById('binaryValue')!.textContent = '-';
  document.getElementById('recentNumbers')!.innerHTML =
    '<span style="color: var(--text-muted);">No numbers generated yet</span>';
  document.getElementById('statsCount')!.textContent = '0';
  document.getElementById('statsAverage')!.textContent = '-';
  document.getElementById('statsMin')!.textContent = '-';
  document.getElementById('statsMax')!.textContent = '-';
  document.getElementById('distributionChart')!.innerHTML = '';
}

// Event listeners
document.getElementById('generateBtn')?.addEventListener('click', () => {
  const number = generateRandomNumber();
  updateDisplay(number);
});

document.getElementById('generate10Btn')?.addEventListener('click', () => {
  for (let i = 0; i < 10; i++) {
    const number = generateRandomNumber();
    updateDisplay(number);
  }
});

document.getElementById('numBits')?.addEventListener('change', () => {
  clearStatistics();
});

document.getElementById('clearStatsBtn')?.addEventListener('click', clearStatistics);

// Initialize
const initialCircuit = new Circuit(4);
for (let i = 0; i < 4; i++) {
  initialCircuit.h(i);
}
updateVisualization(initialCircuit);
