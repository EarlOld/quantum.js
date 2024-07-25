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
  const p = beta.length; // Кількість QAOA кроків
  const qc = new Circuit(nodes.length);

  // Перший крок: застосувати шар Гадамардових воріт
  nodes.forEach((node) => qc.h(node));

  // Другий крок: застосувати p чергуючих операторів
  for (let i = 0; i < p; i++) {
    appendCostOperatorCircuit(qc, edges, gamma[i]);
    appendMixerOperatorCircuit(qc, nodes, beta[i]);
  }

  // Останній крок: виміряти результат
  nodes.forEach((node) => qc.measure(node));

  return qc;
}

// Визначення цільової функції
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

  // Оцінка результату
  return computeMaxCutScore(result, edges);
}

// Функція для обчислення кількості розрізаних ребер
function computeMaxCutScore(result: number[], edges: Array<[number, number]>): number {
  let score = 0;
  for (const [i, j] of edges) {
    if (result[i] !== result[j]) {
      score++;
    }
  }
  return score;
}

// Простий приклад оптимізації COBYLA
export function optimizeQAOAWithCOBYLA(
  nodes: Array<number>,
  edges: Array<[number, number]>,
  steps: number,
  idCircuitDraw?: string
): { beta: number[]; gamma: number[]; score: number; maxCutScore: number } {
  let bestBeta: number[] = Array(steps).fill(Math.PI / 4); // Початкове припущення для beta
  let bestGamma: number[] = Array(steps).fill(Math.PI / 4); // Початкове припущення для gamma
  let bestScore = objectiveFunction(bestBeta, bestGamma, nodes, edges, idCircuitDraw);
  let bestMaxCutScore = bestScore;

  const maxIterations = 100; // Максимальна кількість ітерацій
  //   const tol = 1e-6; // Допустима похибка
  const randomStepScale = 0.01; // Масштаб випадкових змін

  for (let iter = 0; iter < maxIterations; iter++) {
    for (let i = 0; i < steps; i++) {
      const newBeta = [...bestBeta];
      const newGamma = [...bestGamma];

      // Зміна значень beta та gamma на невеликий випадковий крок
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
