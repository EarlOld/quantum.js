import { Complex, complex, multiply } from 'mathjs';

export type QubitState = number | Complex;
export class Qubit {
  private state: QubitState[];

  constructor(initialState: [QubitState, QubitState] = [1, 0]) {
    this.state = initialState;
  }

  public setState(newState: QubitState[]) {
    this.state = newState;
  }

  public applyGate(gate: QubitState[][]): void {
    const [a, b] = this.state;
    this.state = multiply([a, b], gate);
  }

  public applyHadamard(): void {
    const H = [
      [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
      [1 / Math.sqrt(2), -1 / Math.sqrt(2)],
    ];
    this.applyGate(H);
  }

  public applyX(): void {
    const X = [
      [0, 1],
      [1, 0],
    ];
    this.applyGate(X);
  }

  public applyY(): void {
    const Y = [
      [0, complex(0, -1)],
      [complex(0, 1), 0],
    ];
    this.applyGate(Y);
  }

  public applyZ(): void {
    const Z = [
      [1, 0],
      [0, -1],
    ];
    this.applyGate(Z);
  }

  public applyT(): void {
    const T = [
      [1, 0],
      [0, complex(0, 1)],
    ];
    this.applyGate(T);
  }

  public measure(): number {
    const [a, b] = this.state;
    const probability0 = Number(a) ** 2;
    const random = Math.random();

    return random < probability0 ? 0 : 1;
  }

  public getState(): QubitState[] {
    return this.state;
  }
}
