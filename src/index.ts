import { Qubit, Circuit } from '../library';

const circuit = new Circuit(2);

circuit.h(0);
circuit.h(0);
circuit.h(0);
circuit.h(0);

circuit.x(1);
circuit.x(1);
circuit.x(1);
circuit.x(1);

// circuit.cx(0, 1);

circuit.printActions();
const measurement = circuit.measure(0);
console.log('Measurement result:', measurement);
