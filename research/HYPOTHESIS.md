# Research question and hypothesis (written before the experiment)

## Research question

Can a simple, explainable algorithm that runs in the browser predict a teenager's **spending for the next week** accurately enough to be useful — and which of the classic forecasting methods works best on teen spending patterns?

## Why it matters

Teens' money comes in irregular bursts (pocket money, gifts, summer jobs) and goes out in small daily amounts plus occasional impulse purchases. A reliable "next week you will probably spend ~X lei" warning helps them plan before the money is gone. The method must be light enough to run on a phone with no server and no AI service (privacy, zero cost).

## Methods compared

| Code | Method | Idea |
|---|---|---|
| NAIVE | Seasonal naive (baseline) | Next week = last week |
| SMA | Simple moving average | Next week = average of the last 4 weeks |
| SES | Simple exponential smoothing | Weighted average; recent days count more (parameter α) |
| HOLT | Holt's linear trend (double exponential smoothing) | SES plus a trend term (parameters α, β) |

α and β are chosen automatically for each ledger from its own history (grid search), never from the test weeks.

## Hypotheses

- **H1 (main):** Holt's method gives a **lower weekly forecast error (MAE) than SMA** on teen spending ledgers, with an improvement of **at least 10 %** on ledgers that have a trend.
- **H2:** All three smoothing methods (SMA, SES, HOLT) beat the naive baseline overall.
- **H0 (null):** There is no difference in error between HOLT and SMA (median paired difference = 0).

## Experiment design

- **Data:** 150 synthetic teen ledgers, 26 weeks (182 days) each, generated from a documented model with a fixed random seed so anyone can reproduce them. Five spending profiles × 30 ledgers: stable, rising trend, falling trend, weekly allowance cycle, impulse shocks.
- **Evaluation:** rolling origin. Starting at week 8, each method forecasts the next 7 days using only past data; repeated every week until the end → 18 forecasts per ledger, 2 700 per method.
- **Metrics:** MAE and RMSE in lei per week, sMAPE in %, and time per forecast in milliseconds.
- **Statistics:** Wilcoxon signed-rank test on the paired per-ledger MAE (HOLT vs SMA, and each method vs NAIVE), significance level α = 0.05, effect size r.
- **Decision rule:** H1 is supported if HOLT's MAE is lower than SMA's with p < 0.05 overall and the improvement on trend ledgers is ≥ 10 %.

## Limitations known in advance

- Synthetic data cannot capture every real behaviour; the generator's assumptions are listed in `research/README.md`.
- Real CoinFlow user data is private (Row Level Security) and was not used.
