import { forecastNextWeek, type MethodName } from "./methods";
import { mae, rmse, smape } from "./metrics";

export const FIRST_FORECAST_WEEK = 8; // methods always get at least 8 weeks of history

// Rolling-origin evaluation: stand at week 8, forecast week 9, compare with what really happened,
// move one week forward, repeat until the end. The method never sees the week it predicts.
export function evaluateLedger(weeks: number[], method: MethodName) {
  const actual: number[] = [];
  const predicted: number[] = [];
  let totalMs = 0;

  for (let t = FIRST_FORECAST_WEEK; t < weeks.length; t++) {
    const start = performance.now();
    predicted.push(forecastNextWeek(method, weeks.slice(0, t)));
    totalMs += performance.now() - start;
    actual.push(weeks[t]);
  }

  return {
    forecasts: actual.length,
    mae: mae(actual, predicted),
    rmse: rmse(actual, predicted),
    smape: smape(actual, predicted),
    msPerForecast: totalMs / actual.length,
  };
}
