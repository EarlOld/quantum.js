import { optimizeQAOAWithCOBYLA } from 'library';

const nodes = [0, 1, 2, 3, 4];
const edges: Array<[number, number]> = [
  [0, 3],
  [0, 4],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
];
const steps = 1;

const { beta, gamma, score, maxCutScore } = optimizeQAOAWithCOBYLA(nodes, edges, steps);

console.log('Optimized beta:', beta);
console.log('Optimized gamma:', gamma);
console.log('Best score:', score);
console.log('maxCutScore:', maxCutScore);
