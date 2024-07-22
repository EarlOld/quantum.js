import { Circuit } from '../library';

const circuit = new Circuit(2);

circuit.h(0);

circuit.cx(0, 1);

circuit.run();

circuit.print(true);

const measurement = circuit.measure(0);
console.log('Measurement result:', measurement);
