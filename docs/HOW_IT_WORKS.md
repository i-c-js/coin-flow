# How CoinFlow works — a guide for explaining the code

Read this before presenting. The teacher may open any file and ask "what does this do?". You should be able to answer in your own words.

## 1. The big picture

CoinFlow has three parts:

1. **The pages** (`src/app/…/page.tsx`) — React components that run in the browser. They show the data and the forms.
2. **Supabase** — a free online database (PostgreSQL) that also handles login. The pages talk to it with `supabase.from("transactions").select(...)`.
3. **One API route** (`src/app/api/rates/route.ts`) — a small piece of code that runs on the server and downloads exchange rates from the National Bank of Moldova.

## 2. Five ideas to know

### Money is stored in bani
`12,50 lei` is saved as `1250`. Computers store decimals in binary, which causes errors like `0.1 + 0.2 = 0.30000000000000004`. Whole numbers don't have that problem. See `leiToBani` and `formatBani` in `src/lib/money.ts`.

### Row Level Security (RLS)
The public key in `.env.local` is visible to anyone who opens the website. So how is the data safe? In `supabase/schema.sql` every table has a rule:

```sql
create policy "own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

The database itself checks that the logged-in user's id (`auth.uid()`) matches the row's `user_id`. Even if someone changes the JavaScript, the database refuses to show or change other people's rows.

### Calculations are separate from the screen
All the maths is in plain functions in `src/lib/` (`calculations.ts`, `payslip.ts`, `flow.ts`). They take numbers and return numbers. That's why they can be tested with Vitest without opening a browser (`npm test`).

### Translations
`src/i18n/ro.json`, `ru.json`, `en.json` have the same keys. A component calls `t("home.addExpense")` and gets the text in the current language. The chosen language is remembered in the browser and saved in the user's profile.

### Components are reused
`GoalCard`, `GoalJar`, `Modal`, `ConfirmDialog`, `TransactionForm`, `EmptyState`… are written once in `src/components/` and used on several pages. The design (colours, fonts, rounded corners) is defined once in `src/app/globals.css` inside `@theme`.

## 3. Follow one action: "Add expense"

1. On the home page you press **Add expense** → `setShowForm(true)` opens `TransactionForm` inside a `Modal`.
2. You type `35` and tap **Food & snacks**. React keeps these in state (`useState`).
3. You press **Save** → `handleSubmit` runs:
   - `parseLeiInput("35")` → `3500` bani (or an error message if it's not a valid amount),
   - `supabase.from("transactions").insert({ type: "expense", amount_bani: 3500, category: "food", ... })`.
4. Supabase adds `user_id` automatically (`default auth.uid()` in the SQL) and checks the RLS rule.
5. The form calls `onSaved()` → the home page reloads this week's data → the big number updates.

## 4. How the main calculations work

**Goal estimate** (`estimateGoal`): remaining = target − saved. Months = remaining ÷ monthly amount, rounded **up** (4.5 months means you finish in the 5th month).
Example: 1 200 lei goal, 400 saved, 150/month → 800 ÷ 150 = 5.33 → **6 months**.

**Deadline** (`monthlyNeededForDeadline`): remaining ÷ months until the deadline.

**What if** (`whatIfTotals`): daily × 30, × 365, × 365 × 5. 25 lei/day → 750 / 9 125 / 45 625 lei.

**Payslip** (`calculatePayslip`), for 10 000 lei gross:
- social insurance: **0%** for the employee (abolished in 2021; the employer pays 24% on top)
- medical insurance 9% = 900
- taxable = 10 000 − 900 − 2 475 (monthly personal exemption, 29 700 / 12) = 6 625
- income tax 12% of 6 625 = 795
- net = 10 000 − 900 − 795 = **8 305 lei**
- no exemption if yearly taxable income is 360 000 lei or more; +825 lei/month exemption per dependant

**Currency** (`mdlToForeign`, `foreignToMdl`): the BNM rate says how many lei 1 euro costs. Lei → euro: divide. Euro → lei: multiply. Rounded to 2 decimals.

**Money flow** (`buildMoneyFlow`): income categories → wallet → expense categories. If you earned more than you spent, the rest goes to "left over". If you spent more, an "earlier money" stream is added so in = out.

## 5. Files worth opening during the presentation

| File | Why it's interesting |
|---|---|
| `supabase/schema.sql` | Tables and the security rules |
| `src/lib/calculations.ts` | Short, clear money functions |
| `src/lib/calculations.test.ts` | How the maths is tested |
| `src/app/api/rates/route.ts` | Downloading real data + fallback if it fails |
| `src/components/GoalJar.tsx` | The "container that fills up" in ~20 lines |
| `src/config/moldova-tax.ts` | All tax rates in one place |

## 6. Questions the teacher might ask

- **Why Supabase and not your own server?** It's free, gives a real database and login, and RLS keeps data safe without writing a backend.
- **What if the bank's website is down?** The API route catches the error and returns sample rates with `sample: true`; the page shows a "sample rates" warning.
- **How do you know the calculations are right?** 42 unit tests with examples calculated by hand, and GitHub runs them on every push.
- **What would you add next?** A monthly budget limit with a warning, reminders, sharing a goal with a friend, an installable phone app (PWA).
- **What did AI do and what did you do?** See `AI_LOG.md`. Be honest and specific.

## 7. Practise

Try making these small changes yourself before presenting. If you can do them, you understand the project:

1. Add a new expense category, e.g. "games" (`src/lib/categories.ts` + the three JSON files).
2. Change the coffee price in the what-if simulator (`src/app/what-if/page.tsx`).
3. Add a 4th quiz question to a lesson (`src/content/lessons.ts`).
4. Write one more test in `src/lib/calculations.test.ts` and run `npm test`.

## 8. The research module (forecasting)

Files: `src/lib/forecast/`. Read them in this order:

1. `methods.ts`: the 5 forecasting methods. Each is a short loop over the weekly totals. Start with `naive` and `sma`, then `ses` (a running average where recent weeks count more), then `holt` (level + trend).
2. `metrics.ts`: how wrong a forecast is (MAE = the average size of the mistake).
3. `evaluate.ts`: the "rolling origin". Stand at week 8, predict week 9, compare, move forward one week.
4. `synthetic.ts`: how the 150 test ledgers are generated (fixed seeds, so the result is always the same).
5. `stats.ts`: the Wilcoxon test that tells whether a difference is real or luck.
6. `weekly.ts`: how the app turns your transactions into weekly totals and uses the winning method (SMA).

Try it: run `npm run benchmark` and compare the output with `research/RESULTS.md`. Then change `sma(weeks, 4)` to `sma(weeks, 6)` in `methods.ts`, run it again and see how the error changes.

The questions the jury is likely to ask about the research are in `docs/PRESENTATION.md`.
