import QuantumCircuit from 'quantum-circuit';

import { QuantumCircuitInterface } from './types/quantum-circuit';

export class Circuit {
  private quantumCircuit: QuantumCircuitInterface;

  constructor(qubitCount: number) {
    this.quantumCircuit = new QuantumCircuit(qubitCount);
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

  public cx(controlQubitIndex: number, targetQubitIndex: number): void {
    this.quantumCircuit.addGate('cx', -1, [controlQubitIndex, targetQubitIndex]);
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

  public toQsharp(): string {
    return this.quantumCircuit.exportQSharp('quantum.js', false, null, null, false, null);
  }

  public exportSVG(): string {
    return this.quantumCircuit.exportSVG(true);
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

  // public static teleportation(): Circuit {
  //   const circuit = new Circuit(3);

  //   circuit.h(1);
  //   circuit.cx(1, 2);

  //   circuit.cx(0, 1);
  //   circuit.h(0);

  //   circuit.measure(0);
  //   circuit.measure(1);

  //   circuit.cx(1, 2);
  //   circuit.cz(0, 2);

  //   return circuit;
  // }
}
