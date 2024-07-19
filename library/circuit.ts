import { Qubit } from './qubit';

export class Circuit {
  private qubits: Qubit[];

  constructor(qubitCount: number) {
    this.qubits = Array.from({ length: qubitCount }, () => new Qubit());
  }

  public h(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyHadamard());
    } else {
      this.qubits[qubitIndex].applyHadamard();
    }
  }

  public x(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.qubits.forEach((qubit) => qubit.applyX());
    } else {
      this.qubits[qubitIndex].applyX();
    }
  }

  public measure(qubitIndex: number): number {
    return this.qubits[qubitIndex].measure();
  }

  public getQubitCount(): number {
    return this.qubits.length;
  }

  public getQubitStates(): [number, number][] {
    return this.qubits.map((qubit) => qubit.getState());
  }
}
