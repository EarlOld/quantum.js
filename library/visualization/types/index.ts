/**
 * Types and interfaces for Bloch sphere visualization
 */

/**
 * Complex number representation
 */
export interface Complex {
  re: number;
  im: number;
}

/**
 * 3D Cartesian coordinates on the Bloch sphere
 */
export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

/**
 * Spherical coordinates for the Bloch sphere
 * theta: polar angle (0 to π)
 * phi: azimuthal angle (0 to 2π)
 */
export interface SphericalCoordinates {
  theta: number;
  phi: number;
}

/**
 * Color theme for visualization
 */
export type Theme = 'light' | 'dark' | 'custom';

/**
 * Color scheme for the Bloch sphere
 */
export interface ColorScheme {
  background: string;
  upperHemisphere: number;
  lowerHemisphere: number;
  equatorPlane: number;
  equatorRing: number;
  meridians: number;
  axisX: number;
  axisY: number;
  axisZ: number;
  arrow: number;
  arrowCone: number;
  originSphere: number;
  labels: string;
}

/**
 * Predefined color schemes
 */
export const COLOR_SCHEMES: Record<Theme, ColorScheme> = {
  light: {
    background: '#f8f9fa',
    upperHemisphere: 0xc8d5f0,
    lowerHemisphere: 0xd5c8f0,
    equatorPlane: 0x4050b0,
    equatorRing: 0x3040a0,
    meridians: 0x4050b0,
    axisX: 0xef4444,
    axisY: 0x22c55e,
    axisZ: 0x3b82f6,
    arrow: 0x3366ff,
    arrowCone: 0x2255ff,
    originSphere: 0x3366ff,
    labels: '#1e293b',
  },
  dark: {
    background: '#0f172a',
    upperHemisphere: 0x475569,
    lowerHemisphere: 0x64748b,
    equatorPlane: 0x60a5fa,
    equatorRing: 0x3b82f6,
    meridians: 0x60a5fa,
    axisX: 0xf87171,
    axisY: 0x4ade80,
    axisZ: 0x60a5fa,
    arrow: 0x75f0f0,
    arrowCone: 0x75f0f0,
    originSphere: 0x75f0f0,
    labels: '#e2e8f0',
  },
  custom: {
    background: '#ffffff',
    upperHemisphere: 0xc8d5f0,
    lowerHemisphere: 0xd5c8f0,
    equatorPlane: 0x4050b0,
    equatorRing: 0x3040a0,
    meridians: 0x4050b0,
    axisX: 0xef4444,
    axisY: 0x22c55e,
    axisZ: 0x3b82f6,
    arrow: 0x3366ff,
    arrowCone: 0x2255ff,
    originSphere: 0x3366ff,
    labels: '#000000',
  },
};

/**
 * Quantum state of a single qubit
 */
export interface QubitState {
  amplitude0: Complex;
  amplitude1: Complex;
  probability0: number;
  probability1: number;
  blochVector: BlochVector;
  spherical: SphericalCoordinates;
}

/**
 * Options for visualization rendering
 */
export interface VisualizationOptions {
  width?: number;
  height?: number;
  theme?: Theme;
  colorScheme?: ColorScheme;
  showAxes?: boolean;
  showLabels?: boolean;
  showProbabilities?: boolean;
  showPhase?: boolean;
  showEquator?: boolean;
  arrowColor?: string;
  arrowWidth?: number;
  sphereColor?: string;
  sphereOpacity?: number;
  backgroundColor?: string;
  axisColor?: string;
  labelSize?: number;
  gridLines?: boolean;
}

/**
 * 2D point for SVG rendering
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Default visualization options
 */
export const DEFAULT_VISUALIZATION_OPTIONS: Required<VisualizationOptions> = {
  width: 600,
  height: 600,
  theme: 'light',
  colorScheme: COLOR_SCHEMES.light,
  showAxes: true,
  showLabels: true,
  showProbabilities: true,
  showPhase: true,
  showEquator: true,
  arrowColor: '#2563eb',
  arrowWidth: 3,
  sphereColor: '#e5e7eb',
  sphereOpacity: 0.2,
  backgroundColor: '#ffffff',
  axisColor: '#6b7280',
  labelSize: 16,
  gridLines: true,
};
