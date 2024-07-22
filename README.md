# Quantum.js Library

This repository contains a quantum computing framework implemented in TypeScript. The library provides a `Circuit` class that allows users to create and manipulate quantum circuits using quantum gates. The library also includes static methods to generate random numbers and strings using quantum principles.

## [Documentation link](https://docs-quantum-js.iot-sdn.space/)

## Installation

To use the Quantum.js library in your project, you can install it via npm:

```bash
npm i @earlold/quantum.js
```

## Example Usage

```typescript
import { Circuit } from './circuit';

// Create a quantum circuit with 3 qubits
const circuit = new Circuit(3);

// Apply a Hadamard gate to the first qubit
circuit.h(0);

// Apply a CNOT gate with the first qubit as control and the second qubit as target
circuit.cx(0, 1);

// Run the circuit
circuit.run();

// Measure the qubits
const result = circuit.measure();

console.log(result);
```

This documentation provides an overview of the `Circuit` class and its methods, including their parameters and return types. It also includes an example of how to use the class.

# Circuit Class Documentation

The `Circuit` class is designed to create and manipulate quantum circuits using the `quantum-circuit` library. This class provides methods to apply quantum gates, measure qubits, and export the circuit to various formats. It also includes static methods to generate random numbers and strings using quantum principles.

## Constructor

### `constructor(qubitCount: number)`

Creates a new quantum circuit with the specified number of qubits.

- **Parameters:**
  - `qubitCount` (number): The number of qubits in the quantum circuit.

## Methods

### `h(qubitIndex: number): void`

Applies a Hadamard gate to the specified qubit.

- **Parameters:**
  - `qubitIndex` (number): The index of the qubit.

### `x(qubitIndex: number): void`

Applies an X (NOT) gate to the specified qubit.

- **Parameters:**
  - `qubitIndex` (number): The index of the qubit.

### `y(qubitIndex: number): void`

Applies a Y gate to the specified qubit.

- **Parameters:**
  - `qubitIndex` (number): The index of the qubit.

### `z(qubitIndex: number): void`

Applies a Z gate to the specified qubit.

- **Parameters:**
  - `qubitIndex` (number): The index of the qubit.

### `t(qubitIndex: number): void`

Applies a T gate to the specified qubit.

- **Parameters:**
  - `qubitIndex` (number): The index of the qubit.

### `cx(controlQubitIndex: number, targetQubitIndex: number): void`

Applies a controlled-X (CNOT) gate with the specified control and target qubits.

- **Parameters:**
  - `controlQubitIndex` (number): The index of the control qubit.
  - `targetQubitIndex` (number): The index of the target qubit.

### `print(nonZero?: boolean): void`

Prints the current state of the quantum circuit. If `nonZero` is true, only prints non-zero amplitudes.

- **Parameters:**
  - `nonZero` (boolean, optional): Whether to print only non-zero amplitudes. Default is `false`.

### `run(): void`

Executes the quantum circuit.

### `measure(qubitIndex?: number): number | number[]`

Measures the specified qubit or all qubits if no index is provided.

- **Parameters:**
  - `qubitIndex` (number, optional): The index of the qubit to measure. If not provided, measures all qubits.

- **Returns:**
  - (number | number[]): The measurement result of the specified qubit or all qubits.

### `toQsharp(): string`

Exports the quantum circuit to Q# format.

- **Returns:**
  - (string): The Q# representation of the quantum circuit.

### `exportSVG(): string`

Exports the quantum circuit to SVG format.

- **Returns:**
  - (string): The SVG representation of the quantum circuit.

## Static Methods

### `static genRandomNumber(max: number): number`

Generates a random number between 0 and the specified maximum using quantum principles.

- **Parameters:**
  - `max` (number): The maximum value for the random number.

- **Returns:**
  - (number): A random number between 0 and `max`.

### `static genRandomNumberWithRange(min: number, max: number): number`

Generates a random number between the specified minimum and maximum values using quantum principles.

- **Parameters:**
  - `min` (number): The minimum value for the random number.
  - `max` (number): The maximum value for the random number.

- **Returns:**
  - (number): A random number between `min` and `max`.

### `static genRandomString(length: number): string`

Generates a random string of the specified length using quantum principles.

- **Parameters:**
  - `length` (number): The length of the random string.

- **Returns:**
  - (string): A random string of the specified length.

