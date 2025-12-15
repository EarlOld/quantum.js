import QuantumCircuit from 'quantum-circuit';

import { ObjectQubitState } from './types';
import { CoordinateConverter } from './visualization/core/CoordinateConverter';
import type { QubitState } from './visualization/types';

export class Circuit {
  private quantumCircuit: QuantumCircuit;
  private qubitCount: number;

  constructor(qubitCount: number) {
    this.quantumCircuit = new QuantumCircuit(qubitCount);
    this.qubitCount = qubitCount;
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

  public sdg(qubitIndex: number): void {
    this.quantumCircuit.addGate('sdg', -1, qubitIndex);
  }

  public tdg(qubitIndex: number): void {
    this.quantumCircuit.addGate('tdg', -1, qubitIndex);
  }

  public cx(controlQubitIndex: number, targetQubitIndex: number): void {
    this.quantumCircuit.addGate('cx', -1, [controlQubitIndex, targetQubitIndex]);
  }

  public cnot(controlQubitIndex: number, targetQubitIndex: number): void {
    this.cx(controlQubitIndex, targetQubitIndex);
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

  public ry(angle: number, qubitIndex: number): void {
    this.quantumCircuit.addGate('ry', -1, qubitIndex, {
      params: {
        theta: angle,
      },
    });
  }

  public crx(angle: number, controlQubitIndex: number, targetQubitIndex: number): void {
    this.quantumCircuit.addGate('crx', -1, [controlQubitIndex, targetQubitIndex], {
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
    this.cx(first, second);
    this.z(first);
  }

  public prepareBellPsiPlus(first: number, second: number): void {
    if (first === second) {
      throw new Error('The qubits must be different');
    }

    this.h(first);
    this.cx(first, second);

    this.x(second);
  }

  public prepareBellPsiMinus(first: number, second: number): void {
    if (first === second) {
      throw new Error('The qubits must be different');
    }

    this.h(first);
    this.cx(first, second);

    this.z(first);
    this.x(second);
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

  // Visualization methods

  /**
   * Get the quantum state of a specific qubit
   * @param qubitIndex Index of the qubit to get state for
   * @returns QubitState object with amplitude and probability information
   */
  public getQubitState(qubitIndex: number): QubitState {
    // Run circuit to get current state
    this.run();

    // Get state as array
    const stateArray = this.stateToArray();

    if (stateArray.length === 0) {
      throw new Error('Circuit state is empty. Run the circuit first.');
    }

    // For a single qubit or to isolate qubit state, we need to trace out other qubits
    // For simplicity, if we have multiple qubits, we'll extract the reduced state

    const numQubits = this.qubitCount;

    if (qubitIndex < 0 || qubitIndex >= numQubits) {
      throw new Error(`Qubit index ${qubitIndex} out of range [0, ${numQubits - 1}]`);
    }

    // For single qubit circuit, it's straightforward
    if (numQubits === 1) {
      const state0 = stateArray.find((s) => s.index === 0);
      const state1 = stateArray.find((s) => s.index === 1);

      const amp0 = state0 ? { re: state0.amplitude.re, im: state0.amplitude.im } : { re: 1, im: 0 };
      const amp1 = state1 ? { re: state1.amplitude.re, im: state1.amplitude.im } : { re: 0, im: 0 };

      return CoordinateConverter.createQubitState(amp0, amp1);
    }

    // For multi-qubit systems, we need to trace out other qubits
    // This is a simplified approach - we calculate the reduced density matrix
    let amp0 = { re: 0, im: 0 };
    let amp1 = { re: 0, im: 0 };

    for (const state of stateArray) {
      const binaryIndex = state.index.toString(2).padStart(numQubits, '0');
      const qubitValue = binaryIndex[numQubits - 1 - qubitIndex];

      if (qubitValue === '0') {
        amp0.re += state.amplitude.re;
        amp0.im += state.amplitude.im;
      } else {
        amp1.re += state.amplitude.re;
        amp1.im += state.amplitude.im;
      }
    }

    // Normalize
    const norm = Math.sqrt(
      amp0.re * amp0.re + amp0.im * amp0.im + amp1.re * amp1.re + amp1.im * amp1.im
    );

    if (norm > 1e-10) {
      amp0 = { re: amp0.re / norm, im: amp0.im / norm };
      amp1 = { re: amp1.re / norm, im: amp1.im / norm };
    }

    return CoordinateConverter.createQubitState(amp0, amp1);
  }


}
