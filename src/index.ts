import { Circuit } from 'library';

const circuit = new Circuit(2);
circuit.prepareBellPsiMinus(0, 1);
circuit.run();

console.log(circuit.stateToString());
