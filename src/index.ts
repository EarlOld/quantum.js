import { Circuit } from '../library';

const circuit = new Circuit(3);

const teported = Circuit.teleportationOneToTree(circuit);

teported.print(true);
console.log('Q#:', circuit.toQsharp());
const measurement = circuit.measure(2);

console.log('Teported result:', measurement);
