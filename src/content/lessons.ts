import type { Lang } from "@/i18n/LanguageProvider";

// The three lessons. Each one has the text and a 3-question quiz in every language.
// `answer` is the index of the correct option (0, 1 or 2).

export type QuizQuestion = { question: string; options: string[]; answer: number };
export type LessonText = { title: string; summary: string; paragraphs: string[]; quiz: QuizQuestion[] };
export type Lesson = { id: string; minutes: number; text: Record<Lang, LessonText> };

export const LESSONS: Lesson[] = [
  {
    id: "budgeting",
    minutes: 3,
    text: {
      ro: {
        title: "Bugetul: harta banilor tăi",
        summary: "Află încotro curg banii înainte să dispară.",
        paragraphs: [
          "Un buget este un plan simplu: câți bani intră și pe ce îi folosești. Nu e doar pentru adulți — și banii de buzunar au nevoie de un plan.",
          "Regula 50/30/20 te ajută să începi: 50% pentru ce ai nevoie (transport, telefon), 30% pentru ce îți dorești (ieșiri, haine) și 20% pentru economii.",
          "Notează fiecare cheltuială, chiar și o gustare de 15 lei. Micile cheltuieli se adună repede și sunt primele care «scapă» din buget.",
          "La sfârșitul săptămânii, uită-te la rezumat. Dacă o categorie e prea mare, alege o singură schimbare mică pentru săptămâna următoare.",
        ],
        quiz: [
          { question: "Ce este un buget?", options: ["Un plan pentru banii care intră și ies", "Un cont la bancă", "O listă de cumpărături"], answer: 0 },
          { question: "În regula 50/30/20, cât merge la economii?", options: ["50%", "30%", "20%"], answer: 2 },
          { question: "De ce să notezi și cheltuielile mici?", options: ["Nu contează", "Se adună repede într-o sumă mare", "Ca să ai multe notițe"], answer: 1 },
        ],
      },
      ru: {
        title: "Бюджет: карта твоих денег",
        summary: "Узнай, куда утекают деньги, пока они не исчезли.",
        paragraphs: [
          "Бюджет — это простой план: сколько денег приходит и на что ты их тратишь. Он нужен не только взрослым — карманным деньгам тоже нужен план.",
          "Правило 50/30/20 поможет начать: 50% на нужное (транспорт, телефон), 30% на желаемое (развлечения, одежда) и 20% на накопления.",
          "Записывай каждую трату, даже перекус за 15 лей. Мелкие траты быстро складываются и первыми «утекают» из бюджета.",
          "В конце недели посмотри итоги. Если какая-то категория слишком большая, выбери одно маленькое изменение на следующую неделю.",
        ],
        quiz: [
          { question: "Что такое бюджет?", options: ["План для денег, которые приходят и уходят", "Банковский счёт", "Список покупок"], answer: 0 },
          { question: "Сколько идёт на накопления по правилу 50/30/20?", options: ["50%", "30%", "20%"], answer: 2 },
          { question: "Зачем записывать даже мелкие траты?", options: ["Это не важно", "Они быстро складываются в большую сумму", "Чтобы было много заметок"], answer: 1 },
        ],
      },
      en: {
        title: "Budgeting: a map of your money",
        summary: "Find out where your money flows before it disappears.",
        paragraphs: [
          "A budget is a simple plan: how much money comes in and what you use it for. It's not just for adults — pocket money needs a plan too.",
          "The 50/30/20 rule helps you start: 50% for needs (transport, phone), 30% for wants (going out, clothes) and 20% for savings.",
          "Write down every expense, even a 15 lei snack. Small expenses add up fast and are the first to leak out of a budget.",
          "At the end of the week, look at your summary. If one category is too big, pick one small change for next week.",
        ],
        quiz: [
          { question: "What is a budget?", options: ["A plan for money coming in and going out", "A bank account", "A shopping list"], answer: 0 },
          { question: "In the 50/30/20 rule, how much goes to savings?", options: ["50%", "30%", "20%"], answer: 2 },
          { question: "Why write down small expenses too?", options: ["They don't matter", "They quickly add up to a big amount", "To have lots of notes"], answer: 1 },
        ],
      },
    },
  },
  {
    id: "saving",
    minutes: 3,
    text: {
      ro: {
        title: "Economisirea: umple containerul",
        summary: "Cum să strângi bani pentru ce îți dorești cu adevărat.",
        paragraphs: [
          "Economisirea e mai ușoară când ai un obiectiv clar: căști noi, o excursie sau un curs. Dă-i un nume și o sumă.",
          "Plătește-te pe tine primul: când primești bani, pune deoparte partea pentru economii imediat, nu ce rămâne la sfârșit.",
          "Împarte obiectivul în bucăți mici. 1 200 lei pare mult, dar 100 lei pe lună înseamnă un an — sau 6 luni cu 200 lei.",
          "Înainte de o cumpărătură neplanificată, așteaptă 24 de ore. Adesea dorința trece, iar banii rămân în container.",
        ],
        quiz: [
          { question: "Ce înseamnă «plătește-te pe tine primul»?", options: ["Cumperi ce vrei mai întâi", "Pui deoparte economiile imediat ce primești bani", "Împrumuți de la prieteni"], answer: 1 },
          { question: "Economisești 200 lei pe lună pentru 1 200 lei. Câte luni îți trebuie?", options: ["6", "12", "4"], answer: 0 },
          { question: "Ce faci înainte de o cumpărătură neplanificată?", options: ["Cumperi repede", "Aștepți 24 de ore", "Ceri reducere"], answer: 1 },
        ],
      },
      ru: {
        title: "Накопления: наполни сосуд",
        summary: "Как накопить на то, что тебе действительно нужно.",
        paragraphs: [
          "Копить проще, когда есть ясная цель: новые наушники, поездка или курс. Дай ей название и сумму.",
          "Плати сначала себе: когда получаешь деньги, сразу откладывай часть на накопления, а не то, что останется в конце.",
          "Раздели цель на маленькие части. 1 200 лей кажется много, но по 100 лей в месяц — это год, а по 200 лей — 6 месяцев.",
          "Перед незапланированной покупкой подожди 24 часа. Часто желание проходит, а деньги остаются в сосуде.",
        ],
        quiz: [
          { question: "Что значит «плати сначала себе»?", options: ["Сначала покупаешь, что хочешь", "Сразу откладываешь накопления, когда получаешь деньги", "Занимаешь у друзей"], answer: 1 },
          { question: "Ты откладываешь 200 лей в месяц на 1 200 лей. Сколько месяцев нужно?", options: ["6", "12", "4"], answer: 0 },
          { question: "Что делать перед незапланированной покупкой?", options: ["Быстро купить", "Подождать 24 часа", "Попросить скидку"], answer: 1 },
        ],
      },
      en: {
        title: "Saving: fill the container",
        summary: "How to save up for what you really want.",
        paragraphs: [
          "Saving is easier when you have a clear goal: new headphones, a trip or a course. Give it a name and an amount.",
          "Pay yourself first: when you get money, put your savings aside right away — not whatever is left at the end.",
          "Split the goal into small pieces. 1,200 lei sounds like a lot, but 100 lei a month is one year — or 6 months at 200 lei.",
          "Before an unplanned purchase, wait 24 hours. Often the wish passes and the money stays in the container.",
        ],
        quiz: [
          { question: "What does \"pay yourself first\" mean?", options: ["Buy what you want first", "Put savings aside as soon as you get money", "Borrow from friends"], answer: 1 },
          { question: "You save 200 lei a month for a 1,200 lei goal. How many months?", options: ["6", "12", "4"], answer: 0 },
          { question: "What should you do before an unplanned purchase?", options: ["Buy it fast", "Wait 24 hours", "Ask for a discount"], answer: 1 },
        ],
      },
    },
  },
  {
    id: "scams",
    minutes: 4,
    text: {
      ro: {
        title: "Cum recunoști o țeapă",
        summary: "Semnele de alarmă ale escrocheriilor cu bani.",
        paragraphs: [
          "Escrocii folosesc grabă și emoții: «Ai câștigat un iPhone!», «Contul tău va fi blocat în 10 minute!». Dacă te grăbesc, oprește-te.",
          "Nicio bancă și niciun magazin nu îți cere vreodată parola, codul PIN sau codul din SMS. Cine le cere este escroc.",
          "Ofertele «prea bune ca să fie adevărate» — profit garantat, bani dublați, joburi de 5 000 lei pe zi — sunt aproape mereu o țeapă.",
          "Pe rețelele sociale, conturile false de prieteni pot cere bani «urgent». Sună persoana sau întreabă un adult înainte să trimiți ceva.",
        ],
        quiz: [
          { question: "Cineva care spune că e de la bancă îți cere codul din SMS. Ce faci?", options: ["I-l dai repede", "Nu-l dai niciodată și închizi", "I-l trimiți pe email"], answer: 1 },
          { question: "Care e un semn de țeapă?", options: ["Te grăbesc să decizi acum", "Îți dau timp să te gândești", "Îți arată un contract clar"], answer: 0 },
          { question: "Un prieten îți scrie că are nevoie urgent de bani. Ce faci întâi?", options: ["Trimiți banii", "Îl suni ca să verifici că e chiar el", "Postezi pe rețele"], answer: 1 },
        ],
      },
      ru: {
        title: "Как распознать мошенника",
        summary: "Тревожные признаки денежных афер.",
        paragraphs: [
          "Мошенники давят на спешку и эмоции: «Ты выиграл iPhone!», «Твой счёт заблокируют через 10 минут!». Если тебя торопят — остановись.",
          "Ни один банк и ни один магазин никогда не попросит твой пароль, PIN-код или код из SMS. Кто их просит — мошенник.",
          "Предложения «слишком хорошие, чтобы быть правдой» — гарантированная прибыль, удвоение денег, работа за 5 000 лей в день — почти всегда обман.",
          "В соцсетях фейковые аккаунты друзей могут «срочно» просить деньги. Позвони человеку или спроси взрослого, прежде чем что-то отправить.",
        ],
        quiz: [
          { question: "Человек «из банка» просит код из SMS. Что делать?", options: ["Быстро сказать его", "Никогда не говорить и положить трубку", "Отправить по email"], answer: 1 },
          { question: "Какой признак мошенничества?", options: ["Тебя торопят решить прямо сейчас", "Тебе дают время подумать", "Тебе показывают понятный договор"], answer: 0 },
          { question: "Друг пишет, что ему срочно нужны деньги. Что сделать сначала?", options: ["Отправить деньги", "Позвонить и проверить, что это правда он", "Написать пост в соцсетях"], answer: 1 },
        ],
      },
      en: {
        title: "How to spot a money scam",
        summary: "The warning signs of money scams.",
        paragraphs: [
          "Scammers use rush and emotions: \"You won an iPhone!\", \"Your account will be blocked in 10 minutes!\". If someone rushes you, stop.",
          "No bank or shop will ever ask for your password, PIN or the code from an SMS. Anyone who asks for them is a scammer.",
          "Offers that are \"too good to be true\" — guaranteed profit, doubling your money, jobs paying 5,000 lei a day — are almost always scams.",
          "On social media, fake accounts of friends may ask for money \"urgently\". Call the person or ask an adult before you send anything.",
        ],
        quiz: [
          { question: "Someone \"from the bank\" asks for your SMS code. What do you do?", options: ["Tell them quickly", "Never share it and hang up", "Send it by email"], answer: 1 },
          { question: "Which one is a scam warning sign?", options: ["They rush you to decide now", "They give you time to think", "They show you a clear contract"], answer: 0 },
          { question: "A friend messages that they urgently need money. What do you do first?", options: ["Send the money", "Call them to check it's really them", "Post about it online"], answer: 1 },
        ],
      },
    },
  },
];
