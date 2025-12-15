import type { QubitState } from '../../library/visualization/types';

export function formatComplex(re: number, im: number): string {
  const reStr = re.toFixed(3);
  const imStr = Math.abs(im).toFixed(3);
  const sign = im >= 0 ? '+' : '-';
  return `${reStr}${sign}${imStr}i`;
}

export function formatStateVector(state: QubitState): string {
  const alpha = formatComplex(state.amplitude0.re, state.amplitude0.im);
  const beta = formatComplex(state.amplitude1.re, state.amplitude1.im);
  return `(${alpha})|0⟩ + (${beta})|1⟩`;
}

export function updateStateDisplay(state: QubitState) {
  // Update state information
  const stateVectorEl = document.getElementById('stateVector');
  if (stateVectorEl) {
    stateVectorEl.textContent = formatStateVector(state);
  }
  
  const thetaEl = document.getElementById('theta');
  if (thetaEl) {
    thetaEl.textContent = `${(state.spherical.theta * 180 / Math.PI).toFixed(2)}°`;
  }
  
  const phiEl = document.getElementById('phi');
  if (phiEl) {
    phiEl.textContent = `${(state.spherical.phi * 180 / Math.PI).toFixed(2)}°`;
  }
  
  const blochVectorEl = document.getElementById('blochVector');
  if (blochVectorEl) {
    blochVectorEl.textContent = 
      `(${state.blochVector.x.toFixed(3)}, ${state.blochVector.y.toFixed(3)}, ${state.blochVector.z.toFixed(3)})`;
  }

  // Update probabilities
  const prob0 = state.probability0 * 100;
  const prob1 = state.probability1 * 100;
  
  const prob0TextEl = document.getElementById('prob0');
  if (prob0TextEl) {
    prob0TextEl.textContent = `${prob0.toFixed(1)}%`;
  }
  
  const prob1TextEl = document.getElementById('prob1');
  if (prob1TextEl) {
    prob1TextEl.textContent = `${prob1.toFixed(1)}%`;
  }
  
  const prob0FillEl = document.getElementById('prob0Fill') as HTMLElement | null;
  if (prob0FillEl) {
    prob0FillEl.style.width = `${prob0}%`;
  }
  
  const prob1FillEl = document.getElementById('prob1Fill') as HTMLElement | null;
  if (prob1FillEl) {
    prob1FillEl.style.width = `${prob1}%`;
  }
}
