/**
 * Tests for ThreeJSRenderer types and configuration
 */

import { CoordinateConverter } from '../core/CoordinateConverter';
import type { Complex, ColorScheme } from '../types';
import { COLOR_SCHEMES } from '../types';

describe('BlochSphereThreeJS Configuration', () => {
  describe('Color Schemes', () => {
    test('Light theme has correct colors', () => {
      expect(COLOR_SCHEMES.light).toBeDefined();
      expect(COLOR_SCHEMES.light.background).toBe('#f8f9fa');
      expect(COLOR_SCHEMES.light.arrow).toBe(0x3366ff);
      expect(COLOR_SCHEMES.light.arrowCone).toBe(0x2255ff);
      expect(COLOR_SCHEMES.light.originSphere).toBe(0x3366ff);
    });

    test('Dark theme has correct colors', () => {
      expect(COLOR_SCHEMES.dark).toBeDefined();
      expect(COLOR_SCHEMES.dark.background).toBe('#0f172a');
      expect(COLOR_SCHEMES.dark.arrow).toBe(0x75f0f0);
      expect(COLOR_SCHEMES.dark.arrowCone).toBe(0x75f0f0);
      expect(COLOR_SCHEMES.dark.originSphere).toBe(0x75f0f0);
    });

    test('Custom theme exists', () => {
      expect(COLOR_SCHEMES.custom).toBeDefined();
      expect(COLOR_SCHEMES.custom.background).toBe('#ffffff');
    });

    test('All themes have required properties', () => {
      const requiredProps = [
        'background',
        'upperHemisphere',
        'lowerHemisphere',
        'equatorPlane',
        'equatorRing',
        'meridians',
        'axisX',
        'axisY',
        'axisZ',
        'arrow',
        'arrowCone',
        'originSphere',
        'labels',
      ];

      Object.values(COLOR_SCHEMES).forEach((scheme) => {
        requiredProps.forEach((prop) => {
          expect(scheme).toHaveProperty(prop);
        });
      });
    });
  });

  describe('Quantum State Integration', () => {
    test('Create |0⟩ state for rendering', () => {
      const amp0: Complex = { re: 1, im: 0 };
      const amp1: Complex = { re: 0, im: 0 };
      const state = CoordinateConverter.createQubitState(amp0, amp1);

      expect(state.blochVector.x).toBeCloseTo(0, 5);
      expect(state.blochVector.y).toBeCloseTo(0, 5);
      expect(state.blochVector.z).toBeCloseTo(1, 5);
    });

    test('Create |1⟩ state for rendering', () => {
      const amp0: Complex = { re: 0, im: 0 };
      const amp1: Complex = { re: 1, im: 0 };
      const state = CoordinateConverter.createQubitState(amp0, amp1);

      expect(state.blochVector.x).toBeCloseTo(0, 5);
      expect(state.blochVector.y).toBeCloseTo(0, 5);
      expect(state.blochVector.z).toBeCloseTo(-1, 5);
    });

    test('Create |+⟩ superposition state', () => {
      const amp0: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const amp1: Complex = { re: 1 / Math.sqrt(2), im: 0 };
      const state = CoordinateConverter.createQubitState(amp0, amp1);

      expect(state.blochVector.x).toBeCloseTo(1, 5);
      expect(state.blochVector.y).toBeCloseTo(0, 5);
      expect(state.blochVector.z).toBeCloseTo(0, 5);
    });

    test('State vectors are normalized', () => {
      const amp0: Complex = { re: 0.6, im: 0.8 };
      const amp1: Complex = { re: 0, im: 0 };
      const state = CoordinateConverter.createQubitState(amp0, amp1);

      const length = Math.sqrt(
        state.blochVector.x ** 2 +
        state.blochVector.y ** 2 +
        state.blochVector.z ** 2
      );

      expect(length).toBeCloseTo(1, 5);
    });
  });

  describe('Theme Configuration', () => {
    test('Can create custom color scheme', () => {
      const customScheme: ColorScheme = {
        ...COLOR_SCHEMES.light,
        arrow: 0xff0000,
        arrowCone: 0xff0000,
        originSphere: 0xff0000,
      };

      expect(customScheme.arrow).toBe(0xff0000);
      expect(customScheme.background).toBe(COLOR_SCHEMES.light.background);
    });

    test('Dark theme vector is brighter than light theme', () => {
      // Dark theme should have lighter colors for visibility
      const lightArrow = COLOR_SCHEMES.light.arrow;
      const darkArrow = COLOR_SCHEMES.dark.arrow;

      // 0x75f0f0 (dark) should be > 0x3366ff (light) in terms of brightness
      expect(darkArrow).toBeGreaterThan(lightArrow);
    });
  });
});
