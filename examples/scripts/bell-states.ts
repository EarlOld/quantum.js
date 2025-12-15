import { Circuit } from '../../library/index';
import { BlochSphereThreeJS } from '../../library/visualization/renderers/ThreeJSRenderer';
import { updateStateDisplay } from './helpers';

let circuit: Circuit | null = null;
let currentQubit = 0;
let renderer: BlochSphereThreeJS | null = null;

function updateVisualization() {
  if (!circuit) return;

  try {
    const state = circuit.getQubitState(currentQubit);

    // Initialize Three.js renderer if not exists
    const container = document.getElementById('blochSphere');
    if (container && !renderer) {
      container.innerHTML = ''; // Clear any existing content
      renderer = new BlochSphereThreeJS(container, {
        width: 600,
        height: 600,
        showProbabilities: false, // We handle this separately
        showPhase: true,
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

function createBellState(type: string) {
  circuit = new Circuit(2);

  switch (type) {
    case 'phi-plus':
      // |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
      circuit.h(0);
      circuit.cnot(0, 1);
      break;

    case 'phi-minus':
      // |Φ⁻⟩ = (|00⟩ - |11⟩)/√2
      circuit.h(0);
      circuit.z(0);
      circuit.cnot(0, 1);
      break;

    case 'psi-plus':
      // |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2
      circuit.h(0);
      circuit.x(1);
      circuit.cnot(0, 1);
      break;

    case 'psi-minus':
      // |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2
      circuit.h(0);
      circuit.z(0);
      circuit.x(1);
      circuit.cnot(0, 1);
      break;
  }

  updateVisualization();
}

// Event listeners
document.getElementById('generateBtn')?.addEventListener('click', () => {
  const bellState = (document.getElementById('bellState') as HTMLSelectElement).value;
  createBellState(bellState);
});

document.getElementById('qubitSelect')?.addEventListener('change', (e) => {
  currentQubit = parseInt((e.target as HTMLSelectElement).value);
  updateVisualization();
});

document.getElementById('measureBtn')?.addEventListener('click', () => {
  if (!circuit) return;
  
  const result = circuit.measure(currentQubit);
  alert(`Measurement result for qubit ${currentQubit}: |${result}⟩\n\nNote: The quantum state has collapsed!`);
  updateVisualization();
});

document.getElementById('resetBtn')?.addEventListener('click', () => {
  const bellState = (document.getElementById('bellState') as HTMLSelectElement).value;
  createBellState(bellState);
});

// Initialize with default Bell state
createBellState('phi-plus');
