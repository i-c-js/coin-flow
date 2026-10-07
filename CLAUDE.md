@AGENTS.md

# CoinFlow — project spec

> Note: the original spec said `.env.local` and `design/` already existed. They did not, so the project was created fresh in `~/Desktop/coinflow` and the home page was designed from this spec (the "flow" theme). The user adds `.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).
> Auth approach: client-side Supabase (browser client + `AuthGuard` component). Keep it simple.

Build "CoinFlow", a simple personal finance web app for Moldovan teenagers. It's a school project I'll present to my teacher, not a commercial product, so keep the code simple and readable. Everything must be free: no paid APIs or services, no AI inside the app.

Work on your own from start to finish. Only stop once: when the database SQL is ready, give it to me to paste into the Supabase SQL editor and wait until I say "done". Be efficient with tokens: don't rewrite working code and keep your messages to me short.

Before starting, save this whole spec into CLAUDE.md and create PROGRESS.md with a checklist of the steps below. Update PROGRESS.md as you go, so if the session ends a new one can continue by reading those two files.

## Setup already done
- .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
- Email confirmation is off in Supabase.
- The home page design is in the design/ folder. Match it, and use the same style on every other page.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase for the database and login (email + password)
- Recharts for charts, Lucide for icons (no emoji in the UI)
- Three languages: Romanian (default), Russian, English, using simple JSON translation files and a language switcher in the header.

## Database
- Simple tables: profiles, transactions, savings_goals, lesson_progress. Store money as whole numbers in bani (1 leu = 100 bani).
- Turn on Row Level Security with a basic policy on each table so every user only sees their own data.
- Put all the SQL in one file: supabase/schema.sql.

## Design   https://claude.ai/design/p/2bc67d66-7c91-44c8-9d8d-379dbf685cc2?file=CoinFlow+Home+Web.dc.html&via=share
- Take the colors, fonts, and spacing from the design and put them in the Tailwind theme so everything looks consistent.
- Fonts: Unbounded for headings and big numbers, Onest for text (Google Fonts, with Cyrillic and Latin Extended so Romanian and Russian display correctly).
- Theme: "flow", money flows like water; savings goals look like containers that fill up.
- Big, bold numbers; mobile-friendly; no purple gradients or glass effects.
- Show a friendly message instead of empty screens.

## Features
1. Log in / sign up / log out.
2. Add income and expenses in MDL with categories (food & snacks, transport, phone, going out, clothes, gifts, other). Adding an expense should be quick: amount + category. Edit and delete.
3. Savings goals: name, target amount, optional deadline, progress bar (fill container), and an estimate of when you'll reach it.
4. What-if simulator: a slider for a daily habit cost (e.g. 35 lei coffee per day) showing the total per month, year, and 5 years.
5. Payslip explainer: enter gross salary, see net salary and each tax/contribution explained simply. Put the tax rates in one file, src/config/moldova-tax.ts, with a comment that I must check them against official Moldovan sources.
6. Currency converter MDL to/from EUR, USD, RON, UAH using the National Bank of Moldova's official daily rates (fetched through a Next.js API route). If the fetch fails, use sample rates and show "sample rates" on the page.
7. Three short lessons (budgeting, saving, spotting money scams) with a 3-question quiz each, in all three languages. Save which lessons the user finished.
8. Home page (as in the design): savings goals, this week's spending, and an "add expense" button.
9. Weekly summary: a chart of spending by category.
10. Settings: change language and delete all my data.

## Checking your work
After each feature, run npm run build and fix any errors. Write a few simple unit tests (Vitest) for the money calculations (goal estimate, what-if totals, payslip, currency conversion) and make sure they pass. If something fails 3 times, choose a simpler solution and move on.

## Documentation
- README.md: what the app does, the problem it solves, how to run it, and the tech used.
- AI_LOG.md: short list of the AI tools I used (Claude Design for the home page, Claude Code for building) with the main prompts and a section for my own notes.

## Order
1. Project setup, theme, fonts, translations, layout
2. Database SQL (pause for me) + login
3. Home page
4. Expenses + weekly summary
5. Savings goals + what-if simulator
6. Payslip + currency converter
7. Lessons, settings
8. Final build check, tests, README, AI_LOG

At the end, give me a short summary of what's done and anything I need to check myself (like the tax rates).
