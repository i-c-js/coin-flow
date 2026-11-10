// How wrong were the forecasts? (all in lei, lower is better)

// Mean Absolute Error: the average size of the mistake.
export function mae(actual: number[], predicted: number[]): number {
  return actual.reduce((sum, a, i) => sum + Math.abs(a - predicted[i]), 0) / actual.length;
}

// Root Mean Squared Error: like MAE, but big mistakes count much more.
export function rmse(actual: number[], predicted: number[]): number {
  return Math.sqrt(actual.reduce((sum, a, i) => sum + (a - predicted[i]) ** 2, 0) / actual.length);
}

// Symmetric Mean Absolute Percentage Error, in % (0 = perfect, 200 = worst).
export function smape(actual: number[], predicted: number[]): number {
  const terms = actual.map((a, i) => {
    const denominator = (Math.abs(a) + Math.abs(predicted[i])) / 2;
    return denominator === 0 ? 0 : Math.abs(a - predicted[i]) / denominator;
  });
  return (100 * terms.reduce((sum, x) => sum + x, 0)) / terms.length;
}
