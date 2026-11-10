# Jurnal de laborator / Laboratory logbook (Anexa 3)

**Proiect / Project:** CoinFlow: prognoza cheltuielilor adolescenților și educație financiară
**Autor / Author:** ______________________ **Clasa / Grade:** 12
**Tipul proiectului / Project type:** individual

Toate datele de mai jos corespund istoricului Git al proiectului (`git log`), care este public pe GitHub. Instrumentele AI folosite sunt notate la fiecare etapă (vezi și `AI_LOG.md`).
*All dates match the project's public Git history. AI tools used are noted at each step.*

| Data | Activitate | Ipoteză / încercare | Rezultat | Probleme și soluții | Notițele autorului |
|---|---|---|---|---|---|
| 2026-10-07 | Am scris specificația aplicației (funcții, tehnologii, design, ordinea pașilor) și am creat proiectul Supabase. Codul de bază a fost generat cu Claude Code după specificația mea. | O aplicație gratuită, în 3 limbi, poate acoperi nevoile financiare de bază ale unui adolescent din Moldova. | Aplicație funcțională cu 10 funcții; 14 teste automate. | Cheile din `.env.local` erau scrise greșit; tabelele lipseau; înregistrarea dădea eroarea „email rate limit”. Am corectat cheile, am rulat din nou SQL-ul și am dezactivat confirmarea prin email. | |
| 2026-10-07 | Testare manuală a tuturor funcțiilor cu un cont real. | — | Toate funcțiile salvează corect datele. | Răspunsurile la test se suprascriau la clicuri rapide; problema a fost corectată. | |
| 2026-10-13 | Îmbunătățiri UI/UX după grila de evaluare: ferestre de dialog proprii, editarea obiectivelor, diagrama „fluxul banilor”, verificare automată pe GitHub. | — | 25 de teste; aplicația publicată pe Vercel. | — | |
| 2026-10-13 | Am verificat lecțiile în 3 limbi, am testat pe telefon și pe calculator și am rulat testele (25/25). Am modificat singur prețul cafelei în simulator (35 → 25 lei). | — | Totul a funcționat. | Verificarea mea a cotelor de impozit pe sfs.md nu a observat 2 erori (vezi 10.11). | |
| 2026-11-10 | Am primit evaluarea nr. 1 (6/10). | — | Neajunsuri: lipsa unei ipoteze științifice, erori la impozite, lipsa analizei economice și a documentelor MoldSEF. | — | |
| 2026-11-10 | Am verificat din nou regulile salariale pentru 2026 (CNAS, sfs.md, calculatoare publice). | — | Contribuția angajatului: 0 % din 2021; asigurarea medicală de 9 % se scade înainte de impozit; scutirea personală este de 29 700 lei, sub plafonul de 360 000 lei. 10 000 lei brut → 8 305 lei net. | Formula greșită (6 % CNAS, 30 000 lei) a fost corectată; am adăugat teste pentru aceste cazuri. | |
| 2026-11-10 23:15 | **Am înregistrat ipoteza înainte de experiment** (`research/HYPOTHESIS.md`). | H1: metoda Holt are o eroare (MAE) mai mică decât SMA cu p < 0,05 și ≥ 10 % pe registrele cu tendință. H2: toate metodele de netezire sunt mai bune decât metoda naivă. | — | — | |
| 2026-11-10 23:18 | Experimentul principal: 150 de registre sintetice, 4 metode, evaluare cu origine glisantă, 2 700 de prognoze per metodă. Codul experimentului a fost scris cu Claude Code. | H1, H2 | SMA: 174,0 lei/săpt.; SES: 178,8; HOLT: 216,6; NAIVE: 226,1. **H1 infirmată** (Holt cu 24,5 % mai slab, p < 0,001). **H2 confirmată.** | Am verificat dacă rezultatul nu vine dintr-o eroare de programare: am scris teste cu răspuns cunoscut (o dreaptă perfectă este continuată exact de Holt). Testele au trecut, deci rezultatul este real. | |
| 2026-11-10 23:18 | Analiză exploratorie (după experiment): metoda cu tendință amortizată (Gardner & McKenzie) și analiza de sensibilitate la zgomot. | Tendința amortizată ar trebui să reducă exagerările metodei Holt. | DAMPED este cu 9,7 % mai bună decât HOLT, dar tot mai slabă decât SMA. Când zgomotul scade, diferența HOLT–SMA scade de la 21 % la 5 %. | Rezultatele exploratorii sunt raportate separat de ipotezele inițiale. | |
| 2026-11-10 23:19 | Actualizare de securitate pentru Next.js (vulnerabilitate critică). | — | 0 vulnerabilități. | — | |
| 2026-11-10 23:22 | Am folosit rezultatul în aplicație: prognoza săptămânală se face cu SMA (4 săptămâni); am adăugat pagina „Cercetare”. | — | Decizie de inginerie bazată pe date. | — | |
| 2026-11-10 | Analiza economică: costuri de găzduire, comparație cu aplicațiile comerciale, scenarii de impact. | — | 0 lei până la ~1 000 de elevi; ≈ 1 leu pe elev pe an la 10 000 de elevi. | Prețurile au fost verificate pe surse publice (noiembrie 2026). | |
| | | | | | |
| | | | | | |

**Semnătura autorului / Author's signature:** ______________________ **Data:** ____________

**Semnătura profesorului coordonator / Supervisor:** ______________________
