import { Qubit } from '../library';

const qubit = new Qubit();
console.log('Initial state:', qubit.getState());

qubit.applyHadamard();

console.log('After applying Hadamard gate:', qubit.getState());

const measurement = qubit.measure();
console.log('Measurement result:', measurement);
