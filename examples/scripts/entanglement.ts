import { Circuit } from '../../library/index';
import { BlochSphereThreeJS } from '../../library/visualization/renderers/ThreeJSRenderer';

let circuit: Circuit;
let measurementHistory: string[] = [];
let hasMeasured = false;
let renderer0: BlochSphereThreeJS | null = null;
let renderer1: BlochSphereThreeJS | null = null;

function createEntangledPair() {
  circuit = new Circuit(2);
  circuit.h(0);
  circuit.cnot(0, 1);
  hasMeasured = false;
  measurementHistory = [];

  updateVisualization();
  updateSystemInfo();
  document.getElementById('measurementResults')!.textContent = 'No measurements yet';
  document.getElementById('isMeasured')!.textContent = 'No';
}

function updateVisualization() {
  try {
    const state0 = circuit.getQubitState(0);
    const state1 = circuit.getQubitState(1);

    // Initialize Three.js renderers if not exists
    const container0 = document.getElementById('blochSphere0');
    const container1 = document.getElementById('blochSphere1');

    if (container0 && !renderer0) {
      container0.innerHTML = '';
      renderer0 = new BlochSphereThreeJS(container0, {
        width: 600,
        height: 600,
        theme: 'dark',
      });
    }

    if (container1 && !renderer1) {
      container1.innerHTML = '';
      renderer1 = new BlochSphereThreeJS(container1, {
        width: 600,
        height: 600,
        theme: 'dark',
      });
    }

    if (renderer0) renderer0.updateState(state0);
    if (renderer1) renderer1.updateState(state1);
  } catch (error) {
    console.error('Error updating visualization:', error);
  }
}

function updateSystemInfo() {
  try {
    const state0 = circuit.getQubitState(0);
    const state1 = circuit.getQubitState(1);

    // For entangled state, show the two-qubit probabilities
    // This is a simplified representation
    document.getElementById('fullState')!.textContent = `|Ψ⟩ = (|00⟩ + |11⟩)/√2 (Bell state)`;

    document.getElementById('isEntangled')!.textContent = hasMeasured ? 'No (collapsed)' : 'Yes';

    // Update two-qubit probabilities
    // For a simple Bell state before measurement
    if (!hasMeasured) {
      document.getElementById('prob00')!.textContent = '50%';
      document.getElementById('prob11')!.textContent = '50%';
      (document.getElementById('prob00Fill') as HTMLElement).style.width = '50%';
      (document.getElementById('prob11Fill') as HTMLElement).style.width = '50%';
    }
  } catch (error) {
    console.error('Error updating system info:', error);
  }
}

function applyGate(gate: string, qubit: number) {
  if (hasMeasured) {
    alert('Circuit has been measured. Please reset to apply gates.');
    return;
  }

  switch (gate) {
    case 'x':
      circuit.x(qubit);
      break;
    case 'y':
      circuit.y(qubit);
      break;
    case 'z':
      circuit.z(qubit);
      break;
    case 'h':
      circuit.h(qubit);
      break;
  }

  updateVisualization();
  updateSystemInfo();
}

function measureQubit(qubit: number) {
  const result = circuit.measure(qubit);
  hasMeasured = true;

  const timestamp = new Date().toLocaleTimeString();
  measurementHistory.push(`[${timestamp}] Q${qubit} → |${result}⟩`);

  updateMeasurementDisplay();
  updateVisualization();
  document.getElementById('isMeasured')!.textContent = 'Yes';
  document.getElementById('isEntangled')!.textContent = 'No (collapsed)';
}

function measureBoth() {
  const result0 = circuit.measure(0);
  const result1 = circuit.measure(1);
  hasMeasured = true;

  const timestamp = new Date().toLocaleTimeString();
  measurementHistory.push(`[${timestamp}] Both qubits → |${result0}${result1}⟩`);

  // Highlight correlation
  if (result0 === result1) {
    measurementHistory.push(`  ✓ Correlated: both qubits collapsed to same state!`);
  }

  updateMeasurementDisplay();
  updateVisualization();
  document.getElementById('isMeasured')!.textContent = 'Yes';
  document.getElementById('isEntangled')!.textContent = 'No (collapsed)';
}

function updateMeasurementDisplay() {
  const resultsDiv = document.getElementById('measurementResults');
  if (resultsDiv) {
    resultsDiv.innerHTML = measurementHistory
      .slice(-10)
      .reverse()
      .map((result) => `<div>${result}</div>`)
      .join('');
  }
}

// Event listeners
document.getElementById('createEntanglementBtn')?.addEventListener('click', createEntangledPair);

document.querySelectorAll('[data-gate]').forEach((button) => {
  button.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const gate = target.getAttribute('data-gate');
    const qubit = parseInt(target.getAttribute('data-qubit') || '0');
    if (gate) {
      applyGate(gate, qubit);
    }
  });
});

document.getElementById('measureQubit0Btn')?.addEventListener('click', () => measureQubit(0));
document.getElementById('measureQubit1Btn')?.addEventListener('click', () => measureQubit(1));
document.getElementById('measureBothBtn')?.addEventListener('click', measureBoth);
document.getElementById('resetBtn')?.addEventListener('click', createEntangledPair);

// Initialize
createEntangledPair();
