# AI log

AI tools I used while making CoinFlow. There is no AI inside the app itself.

## Tools

| Tool | What I used it for |
|---|---|
| Claude Design | Designing the home page (colors, fonts, layout, "flow" theme) |
| Claude Code | Building the app: project setup, database, pages, tests and docs |

## Main prompts

**Claude Design**
- Design the home page for "CoinFlow", a personal finance web app for Moldovan teenagers. Theme: "flow", money flows like water, savings goals are containers that fill up. Big bold numbers, mobile-friendly, no purple gradients or glass effects. Fonts: Unbounded + Onest.

**Claude Code**
- Build "CoinFlow", a simple personal finance web app for Moldovan teenagers (Next.js + TypeScript + Tailwind, Supabase, Recharts, Lucide, three languages RO/RU/EN). Features: login, income/expenses with categories, savings goals with an estimate, what-if simulator, payslip explainer, currency converter with BNM rates, three lessons with quizzes, home page, weekly summary, settings. Keep the code simple and readable, everything free, write Vitest tests for the money calculations, plus README and AI_LOG.
- Follow-up: which Supabase keys go in `.env.local`?

## Notes from Claude Code

- The `design/` folder from Claude Design was not in the project folder, so the home page was built from the written spec (deep teal "water" colors, wave shapes, container-style goals). If needed, export the design into `design/` and ask for the styles to be matched.
- `.env.local` first had spaces after `=` and an extra `/rest/v1/` at the end of the URL. This was fixed.

## My own notes

_(What I learned, what I changed by hand, what I checked myself...)_

-
-
-
