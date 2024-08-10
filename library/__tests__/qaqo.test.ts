import { optimizeQAOAWithCOBYLA } from '../index';

describe('QAOA', () => {
  it('should calc', () => {
    const nodes = [0, 1, 2, 3, 4];
    const edges: Array<[number, number]> = [
      [0, 3],
      [0, 4],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ];
    const steps = 1;

    const { score } = optimizeQAOAWithCOBYLA(nodes, edges, steps);

    expect(score).toEqual(6);
  });
});
