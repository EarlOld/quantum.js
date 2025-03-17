import QuantumCircuit from 'quantum-circuit';

import { ObjectQubitState } from './types';

export class Circuit {
  private quantumCircuit: QuantumCircuit;

  constructor(qubitCount: number) {
    this.quantumCircuit = new QuantumCircuit(qubitCount);
  }

  public i(qubitIndex: number): void {
    this.quantumCircuit.addGate('id', -1, qubitIndex);
  }

  public h(qubitIndex: number): void {
    this.quantumCircuit.addGate('h', -1, qubitIndex);
  }

  public x(qubitIndex: number): void {
    this.quantumCircuit.addGate('x', -1, qubitIndex);
  }

  public y(qubitIndex: number): void {
    this.quantumCircuit.addGate('y', -1, qubitIndex);
  }

  public z(qubitIndex: number): void {
    this.quantumCircuit.addGate('z', -1, qubitIndex);
  }

  public t(qubitIndex: number): void {
    this.quantumCircuit.addGate('t', -1, qubitIndex);
  }

  public s(qubitIndex: number): void {
    this.quantumCircuit.addGate('s', -1, qubitIndex);
  }

  public cx(controlQubitIndex: number, targetQubitIndex: number): void {
    this.quantumCircuit.addGate('cx', -1, [controlQubitIndex, targetQubitIndex]);
  }

  public cz(controlQubitIndex: number, targetQubitIndex: number): void {
    this.quantumCircuit.addGate('cz', -1, [controlQubitIndex, targetQubitIndex]);
  }

  public rx(angle: number, qubitIndex: number): void {
    this.quantumCircuit.addGate('rx', -1, qubitIndex, {
      params: {
        theta: angle,
      },
    });
  }

  public rz(angle: number, qubitIndex: number): void {
    this.quantumCircuit.addGate('rz', -1, qubitIndex, {
      params: {
        phi: angle,
      },
    });
  }

  public print(nonZero?: boolean): void {
    this.quantumCircuit.print(nonZero);
  }

  public run(): void {
    this.quantumCircuit.run();
  }

  public measure(qubitIndex?: number): number | number[] {
    if (qubitIndex !== undefined) {
      return this.quantumCircuit.measure(qubitIndex, 'c', qubitIndex);
    }

    return this.quantumCircuit.measureAll();
  }

  public stateToString(): string {
    return this.quantumCircuit.stateAsString(false) as string;
  }

  public stateToArray(): ObjectQubitState[] {
    return this.quantumCircuit.stateAsArray(false, undefined, undefined, undefined) as ObjectQubitState[];
  }

  public toQsharp(): string {
    return this.quantumCircuit.exportQSharp('quantum.js', false, null, null, false, null);
  }

  public exportSVG(): string {
    return this.quantumCircuit.exportSVG(true);
  }

  // Bell states

  public prepareBellPhiPlus(first: number, second: number): void {
    if (first === second) {
      throw new Error('The qubits must be different');
    }

    this.h(first);
    this.cx(first, second);
  }

  public prepareBellPhiMinus(first: number, second: number): void {
    if (first === second) {
      throw new Error('The qubits must be different');
    }

    this.h(first);
    this.z(first);
    this.cx(first, second);
  }

  public prepareBellPsiPlus(first: number, second: number): void {
    if (first === second) {
      throw new Error('The qubits must be different');
    }

    this.h(first);
    this.x(second);
    this.cx(first, second);
  }

  public prepareBellPsiMinus(first: number, second: number): void {
    if (first === second) {
      throw new Error('The qubits must be different');
    }

    this.h(first);
    this.z(first);
    this.x(second);
    this.cx(first, second);
  }

  public static genRandomNumber(max: number): number {
    // Generate a random number between 0 and max
    // Max to binary
    const maxBinary = max.toString(2);

    // Generate a random binary number
    const circuit = new Circuit(maxBinary.length);
    for (let i = 0; i < maxBinary.length; i++) {
      circuit.h(i);
    }

    circuit.run();
    const result = circuit.measure() as number[];
    const binaryResult = result.join('');
    // Binary to decimal
    const decimalResult = parseInt(binaryResult, 2);

    if (decimalResult > max) {
      return this.genRandomNumber(max);
    }

    return decimalResult;
  }

  public static genRandomNumberWithRange(min: number, max: number): number {
    // Generate a random number between min and max
    const range = max - min;
    const randomNumber = this.genRandomNumber(range) + min;

    return randomNumber;
  }

  public static genRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = this.genRandomNumber(characters.length);
      result += characters[randomIndex];
    }

    return result;
  }

  public static teleportationOneToTree(circuit: Circuit): Circuit {
    circuit.h(1);
    circuit.cx(1, 2);

    circuit.cx(0, 1);
    circuit.h(0);

    circuit.measure(0);
    circuit.measure(1);

    circuit.cx(1, 2);
    circuit.cz(0, 2);

    circuit.run();

    return circuit;
  }
}
