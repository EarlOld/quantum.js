import { Circuit } from '../../circuit';

export type SuperDenseCoding = '00' | '01' | '10' | '11';

export type SuperDenseCodingResult = {
  data: SuperDenseCoding;
  circuit: Circuit;
};

export const sendTwoBitsWithSDC = (data: SuperDenseCoding): SuperDenseCodingResult => {
  // Create a new circuit
  const circuit = new Circuit(2);

  // Encode the qubits
  circuit.h(0);
  circuit.cx(0, 1);

  // Apply the SuperDanceCoding

  switch (data) {
    case '00':
      break;
    case '01':
      circuit.x(0);
      break;
    case '10':
      circuit.z(0);
      break;
    case '11':
      circuit.x(0);
      circuit.z(0);
      break;
  }

  // Decode the qubits

  circuit.cx(0, 1);
  circuit.h(0);

  circuit.run();

  // Measure the qubits

  const result = circuit.measure() as number[];

  return {
    data: `${result[0]}${result[1]}` as SuperDenseCoding,
    circuit,
  };
};
