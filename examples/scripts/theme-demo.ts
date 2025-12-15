import { Circuit } from '../../library/index';
import { BlochSphereThreeJS } from '../../library/visualization/renderers/ThreeJSRenderer';
import { updateStateDisplay } from './helpers';

let circuit: Circuit;
let renderer: BlochSphereThreeJS | null = null;
let currentTheme: 'light' | 'dark' = 'dark';

function initCircuit() {
  circuit = new Circuit(1);
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
        theme: currentTheme,
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

function setTheme(theme: 'light' | 'dark') {
  currentTheme = theme;
  
  // Update button states
  const lightBtn = document.getElementById('lightTheme');
  const darkBtn = document.getElementById('darkTheme');
  
  if (lightBtn && darkBtn) {
    lightBtn.classList.toggle('active', theme === 'light');
    darkBtn.classList.toggle('active', theme === 'dark');
  }
  
  // Update renderer theme
  if (renderer) {
    renderer.setTheme(theme);
  }
}

// Initialize
initCircuit();

// Theme buttons
document.getElementById('lightTheme')?.addEventListener('click', () => {
  setTheme('light');
});

document.getElementById('darkTheme')?.addEventListener('click', () => {
  setTheme('dark');
});

// Gate buttons
document.getElementById('hadamard')?.addEventListener('click', () => {
  circuit.h(0);
  updateVisualization();
});

document.getElementById('pauliX')?.addEventListener('click', () => {
  circuit.x(0);
  updateVisualization();
});

document.getElementById('pauliY')?.addEventListener('click', () => {
  circuit.y(0);
  updateVisualization();
});

document.getElementById('pauliZ')?.addEventListener('click', () => {
  circuit.z(0);
  updateVisualization();
});

// Reset button
document.getElementById('resetBtn')?.addEventListener('click', () => {
  initCircuit();
});
