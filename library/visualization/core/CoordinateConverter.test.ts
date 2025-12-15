/**
 * Tests for CoordinateConverter
 */

import { CoordinateConverter } from './CoordinateConverter';
import type { Complex } from '../types';

describe('CoordinateConverter', () => {
  describe('State to Bloch conversion', () => {
    test('|0⟩ state should point to north pole', () => {
      const amp0: Complex = { re: 1, im: 0 };
      const amp1: Complex = { re: 0, im: 0 };
      const bloch = CoordinateConverter.stateToBloch(amp0, amp1);

      expect(bloch.x).toBeCloseTo(0, 5);
      expect(bloch.y).toBeCloseTo(0, 5);
      expect(bloch.z).toBeCloseTo(1, 5);
    });

    test('|1⟩ state should point to south pole', () => {
      const amp0: Complex = { re: 0, im: 0 };
      const amp1: Complex = { re: 1, im: 0 };
      const bloch = CoordinateConverter.stateToBloch(amp0, amp1);

      expect(bloch.x).toBeCloseTo(0, 5);
      expect(bloch.y).toBeCloseTo(0, 5);
      expect(bloch.z).toBeCloseTo(-1, 5);
    });

    test('|+⟩ state should point along +X axis', () => {
      const amp0: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const amp1: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const bloch = CoordinateConverter.stateToBloch(amp0, amp1);

      expect(bloch.x).toBeCloseTo(1, 5);
      expect(bloch.y).toBeCloseTo(0, 5);
      expect(bloch.z).toBeCloseTo(0, 5);
    });

    test('|-⟩ state should point along -X axis', () => {
      const amp0: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const amp1: Complex = { re: -1 / Math.sqrt(2), im: 0 };
      const bloch = CoordinateConverter.stateToBloch(amp0, amp1);

      expect(bloch.x).toBeCloseTo(-1, 5);
      expect(bloch.y).toBeCloseTo(0, 5);
      expect(bloch.z).toBeCloseTo(0, 5);
    });

    test('|+i⟩ state should point along +Y axis', () => {
      const amp0: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const amp1: Complex = { re: 0, im: 1 / Math.sqrt(2) };
      const bloch = CoordinateConverter.stateToBloch(amp0, amp1);

      expect(bloch.x).toBeCloseTo(0, 5);
      expect(bloch.y).toBeCloseTo(1, 5);
      expect(bloch.z).toBeCloseTo(0, 5);
    });

    test('|-i⟩ state should point along -Y axis', () => {
      const amp0: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const amp1: Complex = { re: 0, im: -1 / Math.sqrt(2) };
      const bloch = CoordinateConverter.stateToBloch(amp0, amp1);

      expect(bloch.x).toBeCloseTo(0, 5);
      expect(bloch.y).toBeCloseTo(-1, 5);
      expect(bloch.z).toBeCloseTo(0, 5);
    });
  });

  describe('Bloch to State conversion', () => {
    test('North pole should convert to |0⟩', () => {
      const bloch = { x: 0, y: 0, z: 1 };
      const state = CoordinateConverter.blochToState(bloch);

      expect(state.amplitude0.re).toBeCloseTo(1, 5);
      expect(state.amplitude0.im).toBeCloseTo(0, 5);
      expect(state.amplitude1.re).toBeCloseTo(0, 5);
      expect(state.amplitude1.im).toBeCloseTo(0, 5);
    });

    test('South pole should convert to |1⟩', () => {
      const bloch = { x: 0, y: 0, z: -1 };
      const state = CoordinateConverter.blochToState(bloch);

      expect(state.amplitude0.re).toBeCloseTo(0, 5);
      expect(state.amplitude0.im).toBeCloseTo(0, 5);
      expect(state.amplitude1.re).toBeCloseTo(1, 5);
      expect(state.amplitude1.im).toBeCloseTo(0, 5);
    });

    test('+X axis should convert to |+⟩', () => {
      const bloch = { x: 1, y: 0, z: 0 };
      const state = CoordinateConverter.blochToState(bloch);

      expect(state.amplitude0.re).toBeCloseTo(1 / Math.sqrt(2), 5);
      expect(state.amplitude1.re).toBeCloseTo(1 / Math.sqrt(2), 5);
    });
  });

  describe('Spherical coordinate conversion', () => {
    test('Convert Cartesian to Spherical', () => {
      const bloch = { x: 1, y: 0, z: 0 };
      const spherical = CoordinateConverter.blochToSpherical(bloch);

      expect(spherical.theta).toBeCloseTo(Math.PI / 2, 5);
      expect(spherical.phi).toBeCloseTo(0, 5);
    });

    test('Convert Spherical to Cartesian', () => {
      const spherical = { theta: Math.PI / 2, phi: 0 };
      const bloch = CoordinateConverter.sphericalToBloch(spherical);

      expect(bloch.x).toBeCloseTo(1, 5);
      expect(bloch.y).toBeCloseTo(0, 5);
      expect(bloch.z).toBeCloseTo(0, 5);
    });
  });

  describe('QubitState creation', () => {
    test('Create normalized qubit state', () => {
      const amp0: Complex = { re: 1, im: 0 };
      const amp1: Complex = { re: 0, im: 0 };
      const state = CoordinateConverter.createQubitState(amp0, amp1);

      expect(state.probability0).toBeCloseTo(1, 5);
      expect(state.probability1).toBeCloseTo(0, 5);
      expect(state.blochVector.z).toBeCloseTo(1, 5);
    });

    test('Auto-normalize unnormalized state', () => {
      const amp0: Complex = { re: 2, im: 0 };
      const amp1: Complex = { re: 2, im: 0 };
      const state = CoordinateConverter.createQubitState(amp0, amp1);

      expect(state.probability0 + state.probability1).toBeCloseTo(1, 5);
    });
  });

  describe('Formatting utilities', () => {
    test('Format complex number', () => {
      const c: Complex = { re: 0.707, im: 0.707 };
      const formatted = CoordinateConverter.formatComplex(c);
      expect(formatted).toContain('0.707');
      expect(formatted).toContain('+');
    });

    test('Format angle in terms of π', () => {
      expect(CoordinateConverter.formatAngle(0)).toBe('0');
      expect(CoordinateConverter.formatAngle(Math.PI)).toBe('π');
      expect(CoordinateConverter.formatAngle(Math.PI / 2)).toBe('π/2');
      expect(CoordinateConverter.formatAngle(Math.PI / 4)).toBe('π/4');
    });
  });
});
