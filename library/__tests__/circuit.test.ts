import { Circuit } from '../circuit';

describe('Circuit', () => {
  it('should initialize with the correct number of qubits', () => {
    const circuit = new Circuit(3);
    expect(circuit.getQubitCount()).toBe(3);
  });

  it('should apply the Hadamard gate to all qubits', () => {
    const circuit = new Circuit(3);
    circuit.h();
    const states = circuit.getQubitStates();
    const expectedValue = 1 / Math.sqrt(2);
    states.forEach(([a, b]) => {
      expect(a).toBeCloseTo(expectedValue);
      expect(b).toBeCloseTo(expectedValue);
    });
  });

  it('should apply the Hadamard gate to a specific qubit', () => {
    const circuit = new Circuit(3);
    circuit.h(1);
    const states = circuit.getQubitStates();
    const expectedValue = 1 / Math.sqrt(2);
    expect(states[0]).toEqual([1, 0]);
    expect(states[1][0]).toBeCloseTo(expectedValue);
    expect(states[1][1]).toBeCloseTo(expectedValue);
    expect(states[2]).toEqual([1, 0]);
  });

  it('should measure a specific qubit', () => {
    const circuit = new Circuit(3);
    const measurement = circuit.measure(1);
    expect(measurement).toBe(0);
  });
});
