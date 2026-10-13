# Presentation and stand

## 5-minute talk

Speak in your own words; these are just the points. Practise out loud with a timer at least twice.

**1. Hook (30 s)**
Ask the audience: *"If you buy a 35 lei coffee every day, how much is that in 5 years?"* Let them guess, then show the what-if page: **63 875 lei**.

**2. The problem (40 s)**
Teens get pocket money and first salaries, but nobody teaches how to manage them. Apps are for adults, in English, and don't know Moldovan taxes. Mention the UN goals: **Goal 4, Quality Education** and **Goal 1, No Poverty**.

**3. Live demo (2 min)** — have it open and logged in before you start
1. Home: the big weekly number → press **Add expense** → 25 lei, Food → the number updates.
2. Goals: show the jar, press **Add money**, watch it fill, read the estimate out loud.
3. Summary: the bar chart and the **money flow** diagram.
4. Payslip: type 10 000 → "you take home 7 780 lei", explain one tax.
5. Switch the language to Russian and back.

**4. How it's built (1 min)**
Next.js + Supabase. Point at one idea you understand well, for example: money is stored in bani so there are no rounding errors, or Row Level Security means each user only sees their own data. Mention the 25 tests and that GitHub runs them automatically.

**5. AI and honesty (30 s)**
"I used Claude Design for the first design and Claude Code to write most of the code from my spec. I tested everything, found and fixed problems, and documented it all in AI_LOG.md."

**6. Close (20 s)**
"CoinFlow helps teenagers see where their money flows, before it flows away." Invite them to scan the QR code.

## Before you present

- [ ] App deployed on Vercel and the link works on your phone's mobile data
- [ ] Demo account logged in, with a few expenses and one goal already added (looks better than empty)
- [ ] Browser zoom at 125% so people can read it
- [ ] Backup: screenshots in `docs/screenshots/` in case the Wi-Fi fails
- [ ] You can answer the questions in [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md#6-questions-the-teacher-might-ask)

## Stand design

- **Poster:** run the app and open `/poster.html` (e.g. http://localhost:3000/poster.html or your Vercel link + `/poster.html`) in Chrome, put your live link in the box at the top, and print it (A3 or A4, "Background graphics" on). It has the logo, the problem, the features and a QR code to the app.
- **Live demo:** a laptop with the app open, plus your phone showing the mobile version.
- **Physical "flow" prop:** a clear jar with coins and a paper label "Goal: 1 200 lei". It matches the jars in the app and makes people stop.
- **Try it:** a printed card "How much does your daily habit cost?" — people pick a habit, you show the what-if result.
- **Colours:** use the app's teal (#0b6e6e) and yellow (#ffc845) for any decorations so the stand looks like the app.
