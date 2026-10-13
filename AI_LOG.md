# AI log

How I used AI tools to make CoinFlow, what I checked myself, and what I'm responsible for.

**There is no AI inside the app.** CoinFlow doesn't send anyone's data to an AI service. AI was only used as a tool while building it.

## Tools

| Tool | Model / version | Used for |
|---|---|---|
| Claude Design (claude.ai) | Claude | First design of the home page: colours, fonts, layout, the "flow" theme |
| Claude Code (desktop app) | Claude Opus 5.5 | Writing the code, database SQL, tests, illustrations and documentation, following my spec |

## How I worked (reproducible process)

1. I wrote a detailed spec: features, tech stack, design rules, database rules, order of work, testing rules. It's saved in [`CLAUDE.md`](CLAUDE.md).
2. Claude Code built the app step by step and kept a checklist in [`PROGRESS.md`](PROGRESS.md), so the work could be continued in a new session from those two files.
3. After each step the app was built (`npm run build`), and the money calculations are covered by unit tests (`npm test`).
4. I did the parts that need my accounts myself: created the Supabase project, ran the SQL, set the keys, changed Supabase settings, created the GitHub repository.
5. I tested the app in the browser with my own account and asked for changes when something didn't work or could be better.

Anyone can repeat this: give `CLAUDE.md` to Claude Code in an empty folder and follow the same steps.

## Main prompts

These are my main requests in order (shortened). The full first prompt is in [`CLAUDE.md`](CLAUDE.md).

**Claude Design**
1. *Design the home page for "CoinFlow", a personal finance web app for Moldovan teenagers. Theme: "flow", money flows like water, savings goals are containers that fill up. Big bold numbers, mobile-friendly, no purple gradients or glass effects. Fonts: Unbounded and Onest.*

**Claude Code**
1. *Build "CoinFlow" … (the full spec in CLAUDE.md): Next.js + TypeScript + Tailwind, Supabase, Recharts, Lucide, three languages; features 1–10; Vitest tests; README and AI_LOG; stop once for me to run the SQL.*
2. *Which keys should I put in .env.local?*
3. *Push this project to my GitHub repository.*
4. *Can you make everything work?* (the database tables were missing, the app was then tested end to end)
5. *Remove the maximum email rate, I can't create an account.*
6. *Give it a suiting browser icon and generate some designs/images for the site.*
7. *Change the logo to the browser icon.*
8. *Publish it on Vercel.*
9. *When I create an account, take me straight to the home page.*
10. *Write a short description for my teacher, including the UN goal.* (then: *shorter and more human*)
11. *Update the project so it gets 5 points on each criterion of the grading table.*

## Problems found and how they were fixed

AI output isn't automatically correct. These problems came up and were fixed after testing:

| Problem | How it was found | Fix |
|---|---|---|
| The design folder from Claude Design was not in the project | Claude Code couldn't find it | The look was rebuilt from the written spec; colours and fonts are in the Tailwind theme |
| `.env.local` had spaces and a wrong URL ending (`/rest/v1/`) | The connection test failed | Fixed the file format |
| Database tables didn't exist | API returned "table not found" | I ran `schema.sql` again in the right project |
| "Email rate limit exceeded" when signing up | My test sign-up | I turned off email confirmation in Supabase |
| Quiz answers clicked quickly overwrote each other | Automated browser test | Changed to a safer way of updating React state |
| Browser `prompt()`/`confirm()` pop-ups looked out of place | Review against the UI/UX criterion | Replaced with the app's own dialogs |
| Tailwind v4 didn't accept the old `@layer components` style | Build error | Rewrote the shared styles as `@utility` |

## What I checked myself

- [x] I read `docs/HOW_IT_WORKS.md` and can explain each part of the code
- [x] I checked the tax rates in `src/config/moldova-tax.ts` against official sources (13 Oct 2026). Source I used: the State Tax Service website, [sfs.md](https://www.sfs.md)
- [x] I checked the lesson texts and quiz answers in all three languages
- [x] I tried every feature on my phone and on a computer
- [x] I ran `npm test` and saw all 25 tests pass (13 Oct 2026)
- [x] I changed something in the code myself: in `src/app/what-if/page.tsx` I changed the coffee preset in the what-if simulator from 35 to 25 lei per day

## Responsibility, licences and privacy

- **Credit:** AI tools are credited here and in the README. The ideas, the spec, the testing and the decisions are mine; most of the code was written by Claude Code following my instructions.
- **Human review:** every AI change was built and tested; calculations have unit tests with hand-checked examples; tax rates are marked as "must be checked against official sources".
- **Licences:** all libraries are open source (MIT/ISC/Apache), the fonts use the SIL Open Font License, the exchange rates are public data from the National Bank of Moldova. The logo and illustrations were drawn as SVG code by Claude Code for this project; no copyrighted images were used.
- **Privacy:** the app has no tracking and no ads. Each user's data is protected by Row Level Security and can be deleted from Settings. No personal data was given to the AI tools: test data was made up, and secret keys were never pasted into a prompt.
- **Limits:** the payslip is an approximation for learning, not financial or tax advice.

## My own notes

- **Database security:** I learned how Row Level Security works. The key in the website is public, but the database itself checks that each user can only see and change their own rows, so nobody can read someone else's spending.
- **The hardest part was the setup, not the code:** connecting Supabase took the most time. The keys in `.env.local` were in the wrong format, the tables were missing because the SQL hadn't run in the right project, and sign-up failed with an "email rate limit" until I turned off email confirmation.
- **Moldovan taxes:** making the payslip explainer helped me understand the difference between gross and net salary, what CNAS and CNAM contributions pay for, and how the personal exemption lowers the income tax. I checked the rates on sfs.md.
