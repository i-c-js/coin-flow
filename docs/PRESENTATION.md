# Pitch (3 minutes, RO + EN) and defence (7 minutes Q&A)

Competition format: a **3-minute pitch**, then **7 minutes of questions** from the jury. Practise with a timer. Each version below takes about 2 min 50 s at a calm pace.

## Pitch — Română (3 min)

**0:00 — Cârligul (20 s)**
„Dacă bei o cafea de 25 de lei în fiecare zi, cât te costă în 5 ani? … **45 625 de lei.** Adolescenții nu văd cum curg banii — și nimeni nu-i învață asta la școală. În 2025, moldovenii au pierdut peste 272 de milioane de lei în fraude online.”

**0:20 — Soluția (30 s)**
„Am creat **CoinFlow**, o aplicație gratuită în română, rusă și engleză. Adaugi o cheltuială în două atingeri, vezi obiectivele ca borcane care se umplu, înțelegi fluturașul de salariu după regulile din 2026 și înveți să recunoști fraudele.”
→ *Arată pe telefon: Acasă → Adaugă cheltuială.*

**0:50 — Întrebarea de cercetare (30 s)**
„Am vrut ca aplicația să-ți spună: *săptămâna asta vei cheltui probabil X lei.* Dar ce algoritm este cel mai precis? Ipoteza mea, înregistrată înainte de experiment: metoda Holt, care modelează tendința, va fi mai bună decât o medie mobilă simplă.”

**1:20 — Metoda (30 s)**
„Am comparat 5 algoritmi pe 150 de registre de cheltuieli × 26 de săptămâni, adică 2 700 de prognoze pentru fiecare metodă, cu evaluare cu origine glisantă și testul statistic Wilcoxon.”
→ *Arată pe poster: secțiunea Metodă.*

**1:50 — Rezultatul (40 s)**
„Surpriza: **ipoteza mea a fost infirmată.** Metoda Holt a fost cu 24,5 % mai slabă, cu p sub 0,001. Cea mai bună a fost media mobilă pe 4 săptămâni. De ce? Cheltuielile adolescenților sunt zgomotoase, iar modelele cu tendință confundă vârfurile întâmplătoare cu o tendință. Am verificat cu teste că nu este o eroare de programare, iar analiza de sensibilitate confirmă rezultatul.”
→ *Arată graficul cu barele.*

**2:30 — Impact și final (30 s)**
„Așa că aplicația folosește media mobilă: cea mai precisă, cea mai rapidă și cea mai ușor de explicat. CoinFlow costă 0 lei, față de 360–1 955 de lei pe an pentru aplicațiile comerciale, și susține obiectivele ONU 4 și 1. Scanați codul QR și încercați-o. Mulțumesc!”

## Pitch — English (3 min)

**0:00 — Hook (20 s)**
"If you buy a 25-lei coffee every day, how much is that in five years? … **45,625 lei.** Teenagers don't see where their money flows, and school doesn't teach it. In 2025, people in Moldova lost over 272 million lei to online scams."

**0:20 — Solution (30 s)**
"I built **CoinFlow**, a free app in Romanian, Russian and English. You add an expense in two taps, watch your goals fill up like jars, understand your payslip under the 2026 rules and learn to spot scams."
→ *Show on the phone: Home → Add expense.*

**0:50 — Research question (30 s)**
"I wanted the app to tell you: *this week you'll probably spend X lei.* But which algorithm is most accurate? My hypothesis, registered before the experiment, was that Holt's trend method would beat a simple moving average."

**1:20 — Method (30 s)**
"I compared five algorithms on 150 spending ledgers of 26 weeks each. That's 2,700 forecasts per method, with rolling-origin evaluation and a Wilcoxon signed-rank test."

**1:50 — Result (40 s)**
"The surprise: **my hypothesis was rejected.** Holt was 24.5 % worse, p below 0.001. The 4-week moving average won. Why? Teen spending is noisy, and trend models mistake random spikes for trends. I checked with tests that this isn't a bug, and a sensitivity analysis confirms it."

**2:30 — Impact and close (30 s)**
"So the app uses the moving average: the most accurate, the fastest and the easiest to explain. CoinFlow is free, while commercial apps cost 360 to 1,955 lei a year, and it supports UN Goals 4 and 1. Scan the QR code and try it. Thank you!"

## Q&A preparation (7 min)

Short answers you should be able to give **without notes**. Opening the file and pointing at the code is a strong move.

| Likely question | Answer (key points) | Show |
|---|---|---|
| Why is money stored in bani? | Decimals like 0.1 can't be stored exactly in binary (`0.1 + 0.2 = 0.30000000000000004`). Whole numbers are exact, and I divide by 100 only when showing. | `src/lib/money.ts` |
| How does each user see only their own data? | Row Level Security in PostgreSQL: the policy `auth.uid() = user_id` is checked by the database itself, so even with the public key nobody can read other people's rows. | `supabase/schema.sql` |
| Explain the moving average. | The average of the last 4 weekly totals. Simple, robust to noise, no parameters. | `sma()` in `methods.ts` |
| Explain Holt's method. | A level (a smoothed average) plus a trend (growth per week). α controls how fast the level reacts, β how fast the trend reacts. Forecast = level + trend. | `holt()` |
| Why did Holt lose? | Weekly teen spending is short and noisy, and the trends are gentle (about 5 % a week). The trend term chases random spikes and overshoots. This is consistent with the M3 competition. | `research/RESULTS.md` |
| How do you know it isn't a bug? | Tests with known answers: on a perfect straight line Holt predicts the exact next value; with φ = 1 the damped method equals Holt. | `forecast.test.ts` |
| How were α and β chosen? Is there data leakage? | Grid search on **past** weeks only; the week being predicted is never used. | `bestHoltParams()` |
| Why synthetic data? | No public dataset of Moldovan teen spending exists, and real user data is private. The generator is documented and seeded, so anyone can reproduce the results. Next step: real, consented, anonymised data. | `synthetic.ts`, `research/README.md` |
| What does the Wilcoxon test do? | It compares paired errors on the same ledgers without assuming a normal distribution. p < 0.001 means the difference is very unlikely to be luck; r = 0.83 is a large effect. | `stats.ts` |
| What did you add after the experiment? | The damped-trend method and the noise sensitivity analysis. They are reported separately as **exploratory** and did not change the H1 verdict. | `HYPOTHESIS.md` git date vs results |
| Is the payslip correct? | 2026 rules: 9 % medical insurance deducted before tax; 12 % income tax; exemption of 29,700 lei/year under 360,000 lei. The employee's 6 % social contribution was abolished in 2021. 10,000 gross → 8,305 net, tested. | `payslip.ts`, `moldova-tax.ts` |
| What did AI do and what did you do? | Be honest and specific: the spec, the research question and the hypothesis, the decisions, the testing and the tax verification were mine; the code was generated with Claude Code from my instructions; I checked results and know how every part works. | `AI_LOG.md` |
| How much would it cost to run for a whole school? | Free up to about 1,000 students; about 1 leu per student per year at 10,000. | `ECONOMIC_ANALYSIS.md` |
| What would you do next? | Validation on real data, anomaly detection for scam-like or unusual spending, and a classroom pre/post-test study of the lessons. | `research/README.md` |

**Live-change drill** (judges may ask you to change code live): practise these until each takes under a minute:
1. Change the moving-average window from 4 to 6 weeks (`sma(weeks, 4)` in `weekly.ts`) and run `npm test`.
2. Add a new expense category (`categories.ts` + the three `i18n` files).
3. Change the CNAM rate in `moldova-tax.ts` and see the payslip test fail, then change it back.

## Stand checklist

- [ ] A0 poster printed from `/poster-a0.html` (Chrome → Print → paper 841 × 1189 mm, margins None, Background graphics on)
- [ ] Laptop: app logged in with sample data; the Research page open in another tab
- [ ] Phone: mobile version, QR code tested
- [ ] Printed abstract (Anexa 2) and logbook (Anexa 3)
- [ ] Optional prop: a clear jar with coins labelled "Goal: 1,200 lei"
