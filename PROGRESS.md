# Progress

- [x] 1. Project setup, theme, fonts, translations, layout
- [x] 2. Database SQL + login (env fixed; verify tables exist in Supabase — they returned 404 on first check)
- [x] 3. Home page
- [x] 4. Expenses + weekly summary
- [x] 5. Savings goals + what-if simulator
- [x] 6. Payslip + currency converter
- [x] 7. Lessons, settings
- [x] 8. Final build check, tests, README, AI_LOG

## Notes
- Project lives in ~/Desktop/coinflow (created fresh; no design/ folder or .env.local existed).
- All steps done. Build, lint and 14 Vitest tests pass.
- Supabase tables created; email confirmation turned off by user.
- Tested end-to-end in the browser with the user's account: add/edit/delete transaction, weekly chart, goals + estimate, lesson quiz saving, language switch. Fixed quiz answer state bug.

## Rubric pass (2026-10-13) — aim for 5/5 on each criterion
- [x] UX: custom dialogs instead of prompt()/confirm(), Escape closes, focus styles, dates by locale, 404 page, nav for logged-out users
- [x] Functionality: edit goals, validation messages, language saved to profile and restored on login
- [x] Originality: monthly "money flow" diagram (income -> wallet -> categories + saved)
- [x] Technical: more unit tests + GitHub Actions CI (lint, test, build)
- [ ] Documentation: README with screenshots, architecture, DB diagram, credits; docs/HOW_IT_WORKS.md
- [ ] Responsible AI: full AI_LOG (prompts, what AI did vs me, review, licences, privacy)
- [ ] Presentation + stand: docs/PRESENTATION.md, printable poster
