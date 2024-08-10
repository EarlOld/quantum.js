import { Circuit } from 'library';
import sharp from 'sharp';

export const circuitToImage = (circuit: Circuit): void => {
  const svg = circuit.exportSVG();

  sharp(Buffer.from(svg)).toFile(`circuit-${Date.now()}.webp`);
};
