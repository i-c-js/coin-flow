# CoinFlow

A simple personal finance web app for teenagers in Moldova. A school project.

## The problem

Many teens get pocket money or earn their first lei, but nobody shows them where it goes, how to save for something, what a payslip really means, or how to recognize a money scam. CoinFlow makes this visual and simple: money flows like water, and savings goals are containers that fill up.

## What it does

- **Log in / sign up** with email and password.
- **Income and expenses** in MDL with categories (food & snacks, transport, phone, going out, clothes, gifts, other). Adding an expense takes two taps: amount + category. Edit and delete.
- **Home page**: this week's spending, savings goals and a big "add expense" button.
- **Weekly summary**: a chart of spending by category, week by week.
- **Savings goals**: name, target, optional deadline, a container that fills up, and an estimate of when you'll reach it.
- **What-if simulator**: a slider for a daily habit (like a 35 lei coffee) showing the cost per month, year and 5 years.
- **Payslip explainer**: from gross to net salary, with each tax explained simply.
- **Currency converter**: MDL ⇄ EUR, USD, RON, UAH using the National Bank of Moldova's official daily rates (falls back to sample rates if the bank's site can't be reached).
- **Lessons**: budgeting, saving and spotting money scams, each with a 3-question quiz. Progress is saved.
- **Settings**: change language, log out, delete all my data.
- **Three languages**: Romanian (default), Russian, English.

## How to run it

1. Install [Node.js](https://nodejs.org) (version 20 or newer).
2. Create a free project at [supabase.com](https://supabase.com). In **Authentication → Sign In / Providers → Email**, turn off "Confirm email".
3. In the Supabase **SQL editor**, paste and run `supabase/schema.sql`.
4. Create `.env.local` in this folder:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. Open http://localhost:3000

Other commands: `npm test` (unit tests for the money calculations), `npm run build`, `npm run lint`.

## Tech used

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- **Supabase**: database (PostgreSQL) and login. Row Level Security makes sure each user only sees their own data.
- **Recharts** for charts, **Lucide** for icons
- **Vitest** for unit tests
- Fonts: **Unbounded** (headings, big numbers) and **Onest** (text) from Google Fonts
- Exchange rates: public XML from the National Bank of Moldova (bnm.md)

Everything is free. Money is stored as whole numbers in bani (1 leu = 100 bani) to avoid rounding errors.

## Project structure

```
src/app/            pages (home, transactions, summary, goals, what-if, payslip, converter, lessons, settings, login)
src/app/api/rates/  API route that fetches the BNM exchange rates
src/components/     shared UI (header, goal container, forms, chart...)
src/lib/            money helpers and calculations (+ tests)
src/config/         moldova-tax.ts: tax rates used by the payslip
src/content/        lesson texts and quizzes in 3 languages
src/i18n/           ro.json, ru.json, en.json + language switcher logic
supabase/schema.sql database tables and security rules
```
