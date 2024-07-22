import { multiply } from 'mathjs';
import { Qubit, QubitState } from './Qubit';
import { CircuitActions } from './CircuitActions';

export class Circuit {
  private qubits: Qubit[];
  private actions: CircuitActions;

  constructor(qubitCount: number) {
    this.qubits = Array.from({ length: qubitCount }, () => new Qubit());
    this.actions = new CircuitActions(qubitCount);
  }

  public h(qubitIndex?: number): void {
    this.actions.h(qubitIndex);
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyHadamard());
    } else {
      this.qubits[qubitIndex].applyHadamard();
    }
  }

  public x(qubitIndex?: number): void {
    this.actions.x(qubitIndex);
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyX());
    } else {
      this.qubits[qubitIndex].applyX();
    }
  }

  public y(qubitIndex?: number): void {
    this.actions.y(qubitIndex);
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyY());
    } else {
      this.qubits[qubitIndex].applyY();
    }
  }

  public z(qubitIndex?: number): void {
    this.actions.z(qubitIndex);
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyZ());
    } else {
      this.qubits[qubitIndex].applyZ();
    }
  }

  public t(qubitIndex?: number): void {
    this.actions.t(qubitIndex);
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyT());
    } else {
      this.qubits[qubitIndex].applyT();
    }
  }

  public cx(controlQubitIndex: number, targetQubitIndex: number): void {
    const CONTROL_NOT = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0],
    ];

    const controlQubit = this.qubits[controlQubitIndex].getState();
    const targetQubit = this.qubits[targetQubitIndex].getState();

    const multiplyResult = multiply(CONTROL_NOT, [...controlQubit, ...targetQubit]);

    this.qubits[controlQubitIndex].setState([multiplyResult[0], multiplyResult[1]]);
    this.qubits[targetQubitIndex].setState([multiplyResult[2], multiplyResult[3]]);
  }

  public measure(qubitIndex: number): number {
    return this.qubits[qubitIndex].measure();
  }

  public getQubitCount(): number {
    return this.qubits.length;
  }

  public getQubitStates(): QubitState[][] {
    return this.qubits.map((qubit) => qubit.getState());
  }

  public getActions(): string[][] {
    return this.actions.getActions();
  }

  public printActions(): void {
    this.actions.printActions();
  }

  public toQsharp(): string {
    return this.actions.toQsharp();
  }
}
