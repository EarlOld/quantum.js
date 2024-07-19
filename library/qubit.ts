export class Qubit {
  private state: [number, number];

  constructor(initialState: [number, number] = [1, 0]) {
    this.state = initialState;
  }

  public applyGate(gate: number[][]): void {
    const [a, b] = this.state;
    const [g11, g12] = gate[0];
    const [g21, g22] = gate[1];

    this.state = [
      g11 * a + g12 * b,
      g21 * a + g22 * b,
    ];
  }

  public applyHadamard(): void {
    const H = [
      [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
      [1 / Math.sqrt(2), -1 / Math.sqrt(2)]
    ];
    this.applyGate(H);
  }

  public applyX(): void {
    const X = [
      [0, 1],
      [1, 0]
    ];
    this.applyGate(X);
  }

  public measure(): number {
    const [a, b] = this.state;
    const probability0 = a * a;
    const random = Math.random();

    return random < probability0 ? 0 : 1;
  }

  public getState(): [number, number] {
    return this.state;
  }
}
