/**
 * SVG generation helper functions
 */

import type { Point2D, BlochVector } from '../types';

/**
 * 3D to 2D projection for isometric view
 */
export class Projection {
  private rotationX: number;
  private rotationZ: number;
  private scale: number;
  private centerX: number;
  private centerY: number;

  constructor(width: number, height: number, scale: number = 200) {
    this.rotationX = Math.PI / 6; // 30 degrees
    this.rotationZ = Math.PI / 4; // 45 degrees
    this.scale = scale;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  /**
   * Project 3D coordinates to 2D screen space
   */
  project(x: number, y: number, z: number): Point2D {
    // Apply rotation around Z axis
    const cosZ = Math.cos(this.rotationZ);
    const sinZ = Math.sin(this.rotationZ);
    const x1 = x * cosZ - y * sinZ;
    const y1 = x * sinZ + y * cosZ;
    const z1 = z;

    // Apply rotation around X axis
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    // Project to 2D (orthographic projection)
    return {
      x: this.centerX + x1 * this.scale,
      y: this.centerY - y2 * this.scale, // Invert Y for screen coordinates
    };
  }

  /**
   * Project a Bloch vector
   */
  projectVector(vector: BlochVector): Point2D {
    return this.project(vector.x, vector.y, vector.z);
  }
}

/**
 * SVG element builders
 */
export class SVGBuilder {
  private elements: string[] = [];

  /**
   * Create SVG wrapper
   */
  createSVG(width: number, height: number, content: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="sphereGradient" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:lightgray;stop-opacity:0.3" />
    </radialGradient>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
    </marker>
  </defs>
  ${content}
</svg>`;
  }

  /**
   * Draw a circle
   */
  circle(cx: number, cy: number, r: number, options: any = {}): string {
    const stroke = options.stroke || 'black';
    const strokeWidth = options.strokeWidth || 1;
    const fill = options.fill || 'none';
    const opacity = options.opacity || 1;
    const dashArray = options.dashArray || '';

    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${dashArray ? `stroke-dasharray="${dashArray}"` : ''} />`;
  }

  /**
   * Draw a line
   */
  line(x1: number, y1: number, x2: number, y2: number, options: any = {}): string {
    const stroke = options.stroke || 'black';
    const strokeWidth = options.strokeWidth || 1;
    const opacity = options.opacity || 1;
    const dashArray = options.dashArray || '';
    const marker = options.marker ? `marker-end="url(#${options.marker})"` : '';

    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${dashArray ? `stroke-dasharray="${dashArray}"` : ''} ${marker} />`;
  }

  /**
   * Draw a path
   */
  path(d: string, options: any = {}): string {
    const stroke = options.stroke || 'black';
    const strokeWidth = options.strokeWidth || 1;
    const fill = options.fill || 'none';
    const opacity = options.opacity || 1;
    const dashArray = options.dashArray || '';

    return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${dashArray ? `stroke-dasharray="${dashArray}"` : ''} />`;
  }

  /**
   * Draw text
   */
  text(x: number, y: number, content: string, options: any = {}): string {
    const fontSize = options.fontSize || 14;
    const fill = options.fill || 'black';
    const fontWeight = options.fontWeight || 'normal';
    const textAnchor = options.textAnchor || 'middle';
    const fontFamily = options.fontFamily || 'Arial, sans-serif';

    return `<text x="${x}" y="${y}" font-size="${fontSize}" fill="${fill}" font-weight="${fontWeight}" text-anchor="${textAnchor}" font-family="${fontFamily}">${content}</text>`;
  }

  /**
   * Draw an ellipse (for 3D sphere appearance)
   */
  ellipse(cx: number, cy: number, rx: number, ry: number, options: any = {}): string {
    const stroke = options.stroke || 'black';
    const strokeWidth = options.strokeWidth || 1;
    const fill = options.fill || 'none';
    const opacity = options.opacity || 1;
    const dashArray = options.dashArray || '';

    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${dashArray ? `stroke-dasharray="${dashArray}"` : ''} />`;
  }

  /**
   * Create a group
   */
  group(content: string, transform?: string): string {
    const transformAttr = transform ? ` transform="${transform}"` : '';
    return `<g${transformAttr}>${content}</g>`;
  }

  /**
   * Draw an arrow
   */
  arrow(x1: number, y1: number, x2: number, y2: number, options: any = {}): string {
    const color = options.color || 'black';
    const width = options.width || 2;

    // Calculate arrow direction
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < 0.001) return '';

    // Normalize
    const nx = dx / length;
    const ny = dy / length;

    // Arrow head size
    const headLength = 15;
    const headWidth = 8;

    // Calculate arrow head points
    const headBase = {
      x: x2 - nx * headLength,
      y: y2 - ny * headLength,
    };

    const perp = { x: -ny, y: nx };
    const head1 = {
      x: headBase.x + perp.x * headWidth,
      y: headBase.y + perp.y * headWidth,
    };
    const head2 = {
      x: headBase.x - perp.x * headWidth,
      y: headBase.y - perp.y * headWidth,
    };

    return `
      <line x1="${x1}" y1="${y1}" x2="${headBase.x}" y2="${headBase.y}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" />
      <polygon points="${x2},${y2} ${head1.x},${head1.y} ${head2.x},${head2.y}" fill="${color}" />
    `;
  }

  /**
   * Create elliptical arc path
   */
  createArcPath(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    startAngle: number,
    endAngle: number
  ): string {
    const start = {
      x: cx + rx * Math.cos(startAngle),
      y: cy + ry * Math.sin(startAngle),
    };
    const end = {
      x: cx + rx * Math.cos(endAngle),
      y: cy + ry * Math.sin(endAngle),
    };

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${start.x} ${start.y} A ${rx} ${ry} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }
}
