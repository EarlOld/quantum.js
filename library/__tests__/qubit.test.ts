import { Qubit } from '../qubit';

describe('Qubit', () => {
  it('should initialize in the |0> state by default', () => {
    const qubit = new Qubit();
    expect(qubit.getState()).toEqual([1, 0]);
  });

  it('should initialize in the specified state', () => {
    const initialState: [number, number] = [0.6, 0.8];
    const qubit = new Qubit(initialState);
    expect(qubit.getState()).toEqual(initialState);
  });

  it('should apply the Hadamard gate correctly', () => {
    const qubit = new Qubit();
    qubit.applyHadamard();
    const [a, b] = qubit.getState();
    const expectedValue = 1 / Math.sqrt(2);
    expect(a).toBeCloseTo(expectedValue);
    expect(b).toBeCloseTo(expectedValue);
  });

  it('should apply the NOT gate correctly', () => {
    const qubit = new Qubit();
    qubit.applyX();
    expect(qubit.getState()).toEqual([0, 1]);
  });

  it('should measure correctly in the |0> state', () => {
    const qubit = new Qubit([1, 0]);
    expect(qubit.measure()).toBe(0);
  });

  it('should measure correctly in the |1> state', () => {
    const qubit = new Qubit([0, 1]);
    expect(qubit.measure()).toBe(1);
  });
});
