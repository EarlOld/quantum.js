import { Circuit } from '../../circuit';

export type UserInput = boolean;
export type Result = 0 | 1;

export const quantumCoinGame = (flip: UserInput): Result => {
  // Create a new circuit
  const circuit = new Circuit(1);

  // 1. Prepare the qubit
  circuit.h(0);

  // 2. Apply the user input
  if (flip) {
    circuit.x(0);
  } else {
    circuit.i(0);
  }

  // 3. Set H gate to the qubit

  circuit.h(0);

  // 4. Measure the qubit

  circuit.run();
  const result = circuit.measure(0) as number;

  return result as Result;
};

export const getQuantumCoinGameResult = (result: Result): string => {
  return result === 0 ? 'Quantum Computer wins!' : 'You win!';
}
