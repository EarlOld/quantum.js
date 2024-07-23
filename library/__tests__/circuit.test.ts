import { Circuit } from '../';

describe('Circuit', () => {
  it('should create a circuit with 3 qubits', () => {
    const circuit = new Circuit(3);

    expect(circuit).toBeDefined();
  });

  it('should run a circuit', () => {
    const circuit = new Circuit(3);

    circuit.h(0);
    circuit.cx(0, 1);
    circuit.cx(1, 2);

    circuit.run();
  });

  it('should measure a qubit', () => {
    const circuit = new Circuit(3);

    circuit.h(0);
    circuit.cx(0, 1);
    circuit.cx(1, 2);

    circuit.run();

    const result = circuit.measure(2);

    expect(result).toBeDefined();
  });

  it('should teleport a qubit', () => {
    const circuit = new Circuit(3);

    circuit.x(0);
    const teported = Circuit.teleportationOneToTree(circuit);

    expect(teported.measure(2)).toEqual(1);
  });

  it('should generate a random number', () => {
    const randomNumber = Circuit.genRandomNumber(10);

    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(10);
  });

  it('should generate a random number with range', () => {
    const randomNumber = Circuit.genRandomNumberWithRange(10, 20);

    expect(randomNumber).toBeGreaterThanOrEqual(10);
    expect(randomNumber).toBeLessThanOrEqual(20);
  });

  it('should generate a random string', () => {
    const randomString = Circuit.genRandomString(10);

    expect(randomString.length).toEqual(10);
  });
});
