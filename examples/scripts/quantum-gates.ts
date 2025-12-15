import { Circuit } from '../../library/index';
import { BlochSphereThreeJS } from '../../library/visualization/renderers/ThreeJSRenderer';
import { updateStateDisplay } from './helpers';

let circuit: Circuit;
let gateHistory: string[] = [];
let renderer: BlochSphereThreeJS | null = null;

function initCircuit() {
  circuit = new Circuit(1);
  gateHistory = [];
  updateGateHistory();
  updateVisualization();
}

function updateVisualization() {
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

    // Update state information
    updateStateDisplay(state);

  } catch (error) {
    console.error('Error updating visualization:', error);
  }
}

function updateGateHistory() {
  const historyEl = document.getElementById('gateHistory');
  if (historyEl) {
    historyEl.textContent = gateHistory.length > 0 
      ? gateHistory.join(' → ') 
      : 'None';
  }
}

function applyGate(gate: string) {
  const angleControl = document.getElementById('angleControl');
  
  if (['rx', 'ry', 'rz'].includes(gate)) {
    // Show angle control for rotation gates
    if (angleControl) {
      angleControl.style.display = 'block';
    }
    
    const angle = parseInt((document.getElementById('rotationAngle') as HTMLInputElement).value);
    const angleRad = (angle * Math.PI) / 180;
    
    switch (gate) {
      case 'rx':
        circuit.rx(angleRad, 0);
        gateHistory.push(`Rx(${angle}°)`);
        break;
      case 'ry':
        circuit.ry(angleRad, 0);
        gateHistory.push(`Ry(${angle}°)`);
        break;
      case 'rz':
        circuit.rz(angleRad, 0);
        gateHistory.push(`Rz(${angle}°)`);
        break;
    }
  } else {
    // Hide angle control for other gates
    if (angleControl) {
      angleControl.style.display = 'none';
    }
    
    switch (gate) {
      case 'h':
        circuit.h(0);
        gateHistory.push('H');
        break;
      case 'x':
        circuit.x(0);
        gateHistory.push('X');
        break;
      case 'y':
        circuit.y(0);
        gateHistory.push('Y');
        break;
      case 'z':
        circuit.z(0);
        gateHistory.push('Z');
        break;
      case 's':
        circuit.s(0);
        gateHistory.push('S');
        break;
      case 't':
        circuit.t(0);
        gateHistory.push('T');
        break;
      case 'sdg':
        circuit.sdg(0);
        gateHistory.push('S†');
        break;
      case 'tdg':
        circuit.tdg(0);
        gateHistory.push('T†');
        break;
    }
  }

  updateGateHistory();
  updateVisualization();
}

// Event listeners
document.querySelectorAll('[data-gate]').forEach(button => {
  button.addEventListener('click', (e) => {
    const gate = (e.target as HTMLElement).getAttribute('data-gate');
    if (gate) {
      applyGate(gate);
    }
  });
});

document.getElementById('rotationAngle')?.addEventListener('input', (e) => {
  const value = (e.target as HTMLInputElement).value;
  document.getElementById('angleValue')!.textContent = `${value}°`;
});

document.getElementById('resetBtn')?.addEventListener('click', () => {
  initCircuit();
});

document.getElementById('clearBtn')?.addEventListener('click', () => {
  gateHistory = [];
  updateGateHistory();
});

// Initialize
initCircuit();
