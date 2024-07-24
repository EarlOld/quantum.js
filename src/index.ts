import { getQAOACircuit } from 'library/utils/QAOA';
import { Circuit } from '../library';
import { re } from 'mathjs';

const nodes = [0, 1, 2, 3, 4];
const edges: Array<[number, number, number]> = [
  [0, 3, 1.0],
  [0, 4, 0.5],
  [1, 3, 0.8],
  [1, 4, 1.2],
  [2, 3, 1.5],
  [2, 4, 0.9],
];
const beta = [Math.PI / 3];
const gamma = [Math.PI / 2];

// const qaoaCircuit = getQAOACircuit(nodes, edges, beta, gamma);

// qaoaCircuit.run();
// const result = qaoaCircuit.measure();

const results: { [key: string]: number } = {};
// run QAOA 100 times
for (let i = 0; i < 1000; i++) {
  const qaoaCircuit = getQAOACircuit(nodes, edges, beta, gamma);
  qaoaCircuit.run();
  const result = parseInt(qaoaCircuit.measure().toString().replace(/,/g, ''), 2);
  results[result] = results[result] ? results[result] + 1 : 1;
}

console.log('results:', results);
