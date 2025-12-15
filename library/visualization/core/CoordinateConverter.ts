/**
 * Coordinate conversion utilities for Bloch sphere visualization
 */

import { complex, Complex as MathJsComplex } from 'mathjs';
import type { BlochVector, SphericalCoordinates, QubitState, Complex } from '../types';

export class CoordinateConverter {
  /**
   * Convert quantum state amplitudes to Bloch sphere coordinates
   * |ψ⟩ = α|0⟩ + β|1⟩
   * Bloch vector: (sin(θ)cos(φ), sin(θ)sin(φ), cos(θ))
   */
  static stateToBloch(amp0: Complex, amp1: Complex): BlochVector {
    // Calculate theta (polar angle) from |α|²
    const prob0 = amp0.re * amp0.re + amp0.im * amp0.im;
    const theta = 2 * Math.acos(Math.sqrt(prob0));

    // Calculate phi (azimuthal angle) from the phase difference
    const phase0 = Math.atan2(amp0.im, amp0.re);
    const phase1 = Math.atan2(amp1.im, amp1.re);
    let phi = phase1 - phase0;

    // Normalize phi to [0, 2π)
    phi = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Convert spherical to Cartesian
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    return { x, y, z };
  }

  /**
   * Convert Bloch vector to quantum state amplitudes
   * Returns normalized state |ψ⟩ = α|0⟩ + β|1⟩
   */
  static blochToState(bloch: BlochVector): QubitState {
    const { theta, phi } = this.blochToSpherical(bloch);

    // Calculate amplitudes
    const alpha = Math.cos(theta / 2);
    const betaReal = Math.sin(theta / 2) * Math.cos(phi);
    const betaImag = Math.sin(theta / 2) * Math.sin(phi);

    const amplitude0: Complex = { re: alpha, im: 0 };
    const amplitude1: Complex = { re: betaReal, im: betaImag };

    const probability0 = alpha * alpha;
    const probability1 = betaReal * betaReal + betaImag * betaImag;

    return {
      amplitude0,
      amplitude1,
      probability0,
      probability1,
      blochVector: bloch,
      spherical: { theta, phi },
    };
  }

  /**
   * Convert Bloch vector (Cartesian) to spherical coordinates
   */
  static blochToSpherical(bloch: BlochVector): SphericalCoordinates {
    const { x, y, z } = bloch;

    // Calculate theta (polar angle)
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = r > 0 ? Math.acos(z / r) : 0;

    // Calculate phi (azimuthal angle)
    let phi = Math.atan2(y, x);
    phi = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    return { theta, phi };
  }

  /**
   * Convert spherical coordinates to Bloch vector (Cartesian)
   */
  static sphericalToBloch(coords: SphericalCoordinates): BlochVector {
    const { theta, phi } = coords;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    return { x, y, z };
  }

  /**
   * Create QubitState from complex amplitudes
   */
  static createQubitState(amp0: Complex, amp1: Complex): QubitState {
    const probability0 = amp0.re * amp0.re + amp0.im * amp0.im;
    const probability1 = amp1.re * amp1.re + amp1.im * amp1.im;

    // Normalize if needed
    const norm = Math.sqrt(probability0 + probability1);
    if (Math.abs(norm - 1.0) > 1e-10) {
      amp0 = { re: amp0.re / norm, im: amp0.im / norm };
      amp1 = { re: amp1.re / norm, im: amp1.im / norm };
    }

    const blochVector = this.stateToBloch(amp0, amp1);
    const spherical = this.blochToSpherical(blochVector);

    return {
      amplitude0: amp0,
      amplitude1: amp1,
      probability0: probability0 / (norm * norm),
      probability1: probability1 / (norm * norm),
      blochVector,
      spherical,
    };
  }

  /**
   * Format complex number as a string
   */
  static formatComplex(c: Complex, decimals: number = 3): string {
    const re = c.re.toFixed(decimals);
    const im = Math.abs(c.im).toFixed(decimals);
    const sign = c.im >= 0 ? '+' : '-';
    return `${re} ${sign} ${im}i`;
  }

  /**
   * Format angle in terms of π
   */
  static formatAngle(radians: number): string {
    const piMultiple = radians / Math.PI;
    const rounded = Math.round(piMultiple * 12) / 12; // Round to nearest π/12

    if (Math.abs(rounded) < 0.001) return '0';
    if (Math.abs(rounded - 1) < 0.001) return 'π';
    if (Math.abs(rounded - 2) < 0.001) return '2π';
    if (Math.abs(rounded + 1) < 0.001) return '-π';

    // Check for common fractions
    const fractions: Array<[number, string]> = [
      [1 / 6, 'π/6'],
      [1 / 4, 'π/4'],
      [1 / 3, 'π/3'],
      [1 / 2, 'π/2'],
      [2 / 3, '2π/3'],
      [3 / 4, '3π/4'],
      [5 / 6, '5π/6'],
    ];

    for (const [value, label] of fractions) {
      if (Math.abs(rounded - value) < 0.001) return label;
      if (Math.abs(rounded + value) < 0.001) return `-${label}`;
    }

    return `${piMultiple.toFixed(2)}π`;
  }
}
