# Economic benefit analysis

All amounts in MDL use the National Bank of Moldova rate of **10.11.2026: 1 USD = 17.94 MDL, 1 EUR = 20.07 MDL**. Prices are as published in November 2026. Sources are listed at the end, and every estimate states its assumptions.

> **Rezumat (RO):** CoinFlow costă **0 lei** pentru utilizator și **0 lei** de găzduit până la circa 1 000 de elevi (planurile gratuite Vercel și Supabase). La 10 000 de elevi costul ar fi de aproximativ **1 leu pe elev pe an**, față de 359–1 955 lei pe an pentru aplicațiile comerciale. Pentru o clasă de 30 de elevi, economia față de YNAB este de circa **58 660 lei pe an**.

## 1. Infrastructure cost

CoinFlow has no servers of its own. Pages are hosted on Vercel; the database and login run on Supabase.

### Data each student produces (estimate)

| Assumption | Value |
|---|---|
| Transactions per student per day | 3 |
| Storage per transaction (PostgreSQL row + index + overhead) | ~300 bytes |
| Storage per student per year | 3 × 365 × 300 B ≈ **0.33 MB** |
| Goals, lessons, profile | < 0.01 MB (negligible) |

### Cost per number of students

| Students | Database / year | Supabase plan | Vercel plan | Cost / year | Cost / student / year |
|---|---|---|---|---|---|
| up to ~1 000 | ≈ 330 MB | Free (500 MB, 50 000 monthly users) | Hobby (free) | **0 MDL** | **0 MDL** |
| 10 000 | ≈ 3.3 GB | Pro, $25/month (8 GB, 100 000 monthly users) | Pro, $20/month * | $540 ≈ 9 690 MDL | **≈ 0.97 MDL** |
| 50 000 | ≈ 16.5 GB | Pro + ~8.5 GB extra disk (≈ $0.125/GB → ≈ $27/month, approximate) | Pro, $20/month | $564 ≈ 10 120 MDL | **≈ 0.20 MDL** |

\* Vercel's free Hobby plan is for personal, non-commercial use. A school or NGO running CoinFlow officially would use the Pro plan.

**Why it is so cheap:** all calculations (forecast, payslip, what-if, money flow) run in the student's browser, not on a server. The forecasting algorithm chosen by our experiment takes **under 0.001 ms** per forecast (`research/RESULTS.md`), so it adds no server cost at all.

## 2. Comparison with commercial apps

| App | Price / year | ≈ MDL / year | MDL salary (payslip) explainer | Official BNM exchange rates | Lessons for teens | Price for a class of 30 |
|---|---|---|---|---|---|---|
| **CoinFlow** | **free** | **0** | yes | yes | yes, with quizzes | **0 MDL** |
| YNAB | $109 | 1 955 | no | no | partial (online workshops) | 58 660 MDL |
| Spendee Premium | $22.99 | 412 | no | no | no | 12 370 MDL |
| Toshl Pro | $19.99 | 359 | no | no | no | 10 760 MDL |
| Wallet (BudgetBakers) Premium | £19.99 (after 1st year) | n/a † | no | no | no | n/a † |

† CoinFlow uses BNM rates for EUR, USD, RON and UAH only; the GBP price is shown as published.

Commercial apps are built for adults with bank accounts and are not localised for Moldovan taxes or the leu. CoinFlow's value is the **combination**: free, made for teenagers, in Romanian/Russian/English, with Moldova-specific tools.

## 3. Financial impact (scenarios)

These are **illustrative scenarios**, not measured effects. Measuring them would need a real user study, which is listed as future work.

### a) Better planning (measured in our experiment)

On 150 test ledgers, the 4-week moving average that CoinFlow uses has a forecast error of **174 lei/week**, compared with **226 lei/week** for "same as last week". That is **23 % smaller planning error** (p < 0.001, `research/RESULTS.md`). A student who plans with the CoinFlow forecast is, on average, 52 lei closer to reality each week.

### b) Small daily habits

| Daily habit | Per month | Per year | 5 years |
|---|---|---|---|
| 25 lei coffee | 750 | 9 125 | 45 625 |
| Halving it | saves 375 | **saves 4 562** | **saves 22 812** |

For a class of 30 where only **one in five** students halves one such habit, the class saves about **27 400 lei a year**.

### c) Scams

According to the Moldovan police (IGP), losses from online scams grew from over **40 million lei (2023)** to over **130 million (2024)** and over **272 million lei (2025)**, with more than 1 750 cases in 2025. That is about **155 000 lei lost per case** on average. Most victims are adults, but teenagers often help their families online. The CoinFlow scam lesson teaches the three warning signs used in the most common schemes: false investments, fake bank/telecom calls asking for codes, and urgency.

**Break-even illustration:** if the scam lesson helps prevent **one** average case among CoinFlow users and their families, it saves **≈ 155 000 MDL**, more than the hosting cost of 10 000 students for **16 years**.

## 4. Social return

- **Zero cost for families**: no subscription, no ads, no selling of data.
- **Privacy**: no third-party tracking; Row Level Security; "delete all my data" in Settings.
- **Accessible**: works on any phone browser, three languages used in Moldova.
- **Supports UN SDG 4 (Quality Education) and SDG 1 (No Poverty).**

## Sources

1. Supabase pricing (Free: 500 MB, 50 000 MAU; Pro: $25/month, 8 GB, 100 000 MAU): https://supabase.com/pricing, summarised in https://uibakery.io/blog/supabase-pricing (2026)
2. Vercel pricing (Hobby free for personal use; Pro $20/user/month): https://vercel.com/pricing, see also https://www.13labs.au/compare/supabase-vs-vercel
3. YNAB pricing 2026 ($14.99/month or $109/year): https://www.planandmultiply.com/en/blog/ynab-pricing-2026-plans-features-alternatives
4. Spendee Premium ($22.99/year): https://getfinny.app/blog/best-ynab-alternatives-2026
5. Toshl Pro ($19.99/year, US App Store): https://apps.apple.com/us/app/toshl-finance-best-budget/id921590251
6. Wallet by BudgetBakers (£17.99 first year, then £19.99): https://finder.com/uk/wallet-budgetbakers-review
7. Online scam losses in Moldova 2023–2025 (IGP data presented in Parliament): https://newsmaker.md/ro/audieri-parlamentare-despre-escrocheriile-onlineprejudicii-de-272-de-milioane-de-lei-%C3%AEn-2025-ce-propun-poli%C8%9Bia-%C8%99i-pccocs-pentru-a-stopa-fenomenul and https://radiomoldova.md/p/75007
8. National Bank of Moldova official rates, 10.11.2026: https://www.bnm.md
