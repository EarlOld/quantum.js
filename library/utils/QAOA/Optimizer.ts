export class Optimizer {
  maxIter: number;

  constructor(maxIter: number = 100) {
    this.maxIter = maxIter;
  }

  optimize(costFunction: (params: number[]) => number, initialParams: number[]): number[] {
    let params = initialParams.slice();
    let minCost = costFunction(params);
    let bestParams = params.slice();

    for (let i = 0; i < this.maxIter; i++) {
      const newParams = params.map((p) => p + (Math.random() - 0.5) * 0.1);
      const newCost = costFunction(newParams);

      if (newCost < minCost) {
        minCost = newCost;
        bestParams = newParams.slice();
      }

      params = newParams.slice();
    }

    return bestParams;
  }
}
