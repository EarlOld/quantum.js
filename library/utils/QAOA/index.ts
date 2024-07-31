import { Circuit } from '../../circuit';

function appendZZTerm(qc: Circuit, q1: number, q2: number, gamma: number) {
  qc.cx(q1, q2);
  qc.rz(2 * gamma, q2);
  qc.cx(q1, q2);
}

function appendCostOperatorCircuit(qc: Circuit, edges: Array<[number, number]>, gamma: number) {
  for (const [i, j] of edges) {
    appendZZTerm(qc, i, j, gamma);
  }
}

function appendXTerm(qc: Circuit, q: number, beta: number) {
  qc.rx(2 * beta, q);
}

function appendMixerOperatorCircuit(qc: Circuit, nodes: Array<number>, beta: number) {
  for (const n of nodes) {
    appendXTerm(qc, n, beta);
  }
}

function getQAOACircuit(
  nodes: Array<number>,
  edges: Array<[number, number]>,
  beta: number[],
  gamma: number[]
): Circuit {
  const p = beta.length;
  const qc = new Circuit(nodes.length);

  nodes.forEach((node) => qc.h(node));

  for (let i = 0; i < p; i++) {
    appendCostOperatorCircuit(qc, edges, gamma[i]);
    appendMixerOperatorCircuit(qc, nodes, beta[i]);
  }

  nodes.forEach((node) => qc.measure(node));

  return qc;
}

export function objectiveFunction(
  beta: number[],
  gamma: number[],
  nodes: Array<number>,
  edges: Array<[number, number]>,
  idCircuitDraw?: string
): number {
  const qc = getQAOACircuit(nodes, edges, beta, gamma);

  qc.run();

  if (typeof document !== 'undefined' && idCircuitDraw) {
    const circuitDraw = document.getElementById(idCircuitDraw);
    if (circuitDraw) {
      circuitDraw.innerHTML = qc.exportSVG();
    }
  }
  const result = qc.measure() as number[];

  return computeMaxCutScore(result, edges);
}

function computeMaxCutScore(result: number[], edges: Array<[number, number]>): number {
  let score = 0;
  for (const [i, j] of edges) {
    if (result[i] !== result[j]) {
      score++;
    }
  }
  return score;
}

export function optimizeQAOAWithCOBYLA(
  nodes: Array<number>,
  edges: Array<[number, number]>,
  steps: number,
  idCircuitDraw?: string
): { beta: number[]; gamma: number[]; score: number; maxCutScore: number } {
  let bestBeta: number[] = Array(steps).fill(Math.PI / 4);
  let bestGamma: number[] = Array(steps).fill(Math.PI / 4);
  let bestScore = objectiveFunction(bestBeta, bestGamma, nodes, edges, idCircuitDraw);
  let bestMaxCutScore = bestScore;

  const maxIterations = 100;
  const randomStepScale = 0.01;

  for (let iter = 0; iter < maxIterations; iter++) {
    for (let i = 0; i < steps; i++) {
      const newBeta = [...bestBeta];
      const newGamma = [...bestGamma];

      newBeta[i] += (Math.random() - 0.5) * randomStepScale;
      newGamma[i] += (Math.random() - 0.5) * randomStepScale;

      const newScore = objectiveFunction(newBeta, newGamma, nodes, edges);

      if (newScore > bestScore) {
        bestBeta = newBeta;
        bestGamma = newGamma;
        bestScore = newScore;
        bestMaxCutScore = newScore;
      }
    }
  }

  return { beta: bestBeta, gamma: bestGamma, score: bestScore, maxCutScore: bestMaxCutScore };
}
