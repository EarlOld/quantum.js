# Quantum.js Framework

This repository contains a quantum computing framework implemented in TypeScript. The library provides a `Circuit` class that allows users to create and manipulate quantum circuits using quantum gates. The library also includes static methods to generate random numbers and strings using quantum principles. Also, it includes a method to optimize the QAOA algorithm using the COBYLA optimization algorithm for the Max-Cut problem.

## [Documentation link](https://docs-quantum-js.iot-sdn.space/)

## Installation

To use the Quantum.js library in your project, you can install it via npm:

```bash
npm i @earlold/quantum.js
```

## Basic Example Usage

```typescript
import { Circuit } from '@earlold/quantum.js'; // Import the Circuit class from the library

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

## Supported Gates

The library supports the following quantum gates, check the table below for the corresponding methods:

| Gate                | Method                                        |
| ------------------- | --------------------------------------------- |
| Identity (I)        | i(qubitIndex: number)                         |
| Hadamard (H)        | h(qubitIndex: number)                         |
| Pauli-X (X)         | x(qubitIndex: number)                         |
| Pauli-Y (Y)         | y(qubitIndex: number)                         |
| Pauli-Z (Z)         | z(qubitIndex: number)                         |
| T-gate              | t(qubitIndex: number)                         |
| S-gate              | s(qubitIndex: number)                         |
| Controlled-X (CNOT) | cx(controlIndex: number, targetIndex: number) |
| Controlled-Z        | cz(controlIndex: number, targetIndex: number) |

## Quantum Functions

| Functions                        | Description                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Circuit.genRandomNumber          | Generate a random number using quantum principles                                       |
| Circuit.genRandomString          | Generate a random string using quantum principles                                       |
| Circuit.genRandomNumberWithRange | Generate a random number within a specified range using quantum principles              |
| Circuit.teleportationOneToTree   | Teleportation of a qubit from one quantum register to another                           |
| optimizeQAOAWithCOBYLA           | Optimize the QAOA algorithm using the COBYLA optimization algorithm for Max-Cut problem |

## Bell State Functions

| Functions                   | Description                 |
| --------------------------- | --------------------------- |
| Circuit.prepareBellPhiPlus  | Prepare the Bell state Phi+ |
| Circuit.prepareBellPhiMinus | Prepare the Bell state Phi- |
| Circuit.prepareBellPsiPlus  | Prepare the Bell state Psi+ |
| Circuit.prepareBellPsiMinus | Prepare the Bell state Psi- |

## Dependencies

The library uses the following dependencies:

- [mathjs](https://www.npmjs.com/package/mathjs) - For mathematical operations
- [quantum-circuit](https://www.npmjs.com/package/quantum-circuit) - For quantum circuit simulation

For more information, check the [documentation](https://docs-quantum-js.iot-sdn.space/).
