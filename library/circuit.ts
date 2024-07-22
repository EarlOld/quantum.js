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

  public measure(qubitIndex?: number): number {
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
}
