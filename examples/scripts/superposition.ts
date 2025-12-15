import { Circuit } from '../../library/index';
import { BlochSphereThreeJS } from '../../library/visualization/renderers/ThreeJSRenderer';
import { updateStateDisplay } from './helpers';

let circuit: Circuit;
let renderer: BlochSphereThreeJS | null = null;

function initCircuit() {
  circuit = new Circuit(1);
  circuit.h(0); // Start with |+⟩ state
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

function applyCustomState() {
  const theta = parseInt((document.getElementById('thetaSlider') as HTMLInputElement).value);
  const phi = parseInt((document.getElementById('phiSlider') as HTMLInputElement).value);
  
  const thetaRad = (theta * Math.PI) / 180;
  const phiRad = (phi * Math.PI) / 180;
  
  // Reset circuit
  circuit = new Circuit(1);
  
  // Apply rotations to create desired state
  // |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
  circuit.ry(thetaRad, 0);
  circuit.rz(phiRad, 0);
  
  updateVisualization();
}

function applyPreset(preset: string) {
  circuit = new Circuit(1);
  
  switch (preset) {
    case '0':
      // |0⟩ - ground state (default)
      break;
    case '1':
      // |1⟩ - excited state
      circuit.x(0);
      break;
    case 'plus':
      // |+⟩ = (|0⟩ + |1⟩)/√2
      circuit.h(0);
      (document.getElementById('thetaSlider') as HTMLInputElement).value = '90';
      (document.getElementById('phiSlider') as HTMLInputElement).value = '0';
      document.getElementById('thetaValue')!.textContent = '90°';
      document.getElementById('phiValue')!.textContent = '0°';
      break;
    case 'minus':
      // |-⟩ = (|0⟩ - |1⟩)/√2
      circuit.h(0);
      circuit.z(0);
      (document.getElementById('thetaSlider') as HTMLInputElement).value = '90';
      (document.getElementById('phiSlider') as HTMLInputElement).value = '180';
      document.getElementById('thetaValue')!.textContent = '90°';
      document.getElementById('phiValue')!.textContent = '180°';
      break;
    case 'i-plus':
      // |+i⟩ = (|0⟩ + i|1⟩)/√2
      circuit.h(0);
      circuit.s(0);
      (document.getElementById('thetaSlider') as HTMLInputElement).value = '90';
      (document.getElementById('phiSlider') as HTMLInputElement).value = '90';
      document.getElementById('thetaValue')!.textContent = '90°';
      document.getElementById('phiValue')!.textContent = '90°';
      break;
    case 'i-minus':
      // |-i⟩ = (|0⟩ - i|1⟩)/√2
      circuit.h(0);
      circuit.sdg(0);
      (document.getElementById('thetaSlider') as HTMLInputElement).value = '90';
      (document.getElementById('phiSlider') as HTMLInputElement).value = '270';
      document.getElementById('thetaValue')!.textContent = '90°';
      document.getElementById('phiValue')!.textContent = '270°';
      break;
  }
  
  updateVisualization();
}

// Event listeners
document.getElementById('thetaSlider')?.addEventListener('input', (e) => {
  const value = (e.target as HTMLInputElement).value;
  document.getElementById('thetaValue')!.textContent = `${value}°`;
});

document.getElementById('phiSlider')?.addEventListener('input', (e) => {
  const value = (e.target as HTMLInputElement).value;
  document.getElementById('phiValue')!.textContent = `${value}°`;
});

document.getElementById('applyBtn')?.addEventListener('click', applyCustomState);

document.querySelectorAll('[data-preset]').forEach(button => {
  button.addEventListener('click', (e) => {
    const preset = (e.target as HTMLElement).getAttribute('data-preset');
    if (preset) {
      applyPreset(preset);
    }
  });
});

// Initialize
initCircuit();
