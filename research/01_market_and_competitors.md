# Этап 1 — рынок, пользователи и конкурентная среда

Дата отсечения изменяющихся данных: 20 июля 2026 года.  
Статус утверждений: `Факт`, `Оценка`, `Гипотеза`, `Вывод`.  
Подробные источники: `sources/market_sources.md`, `sources/competitor_sources.md`, `sources/source_notes.md`.

## 1. Главный вывод этапа

**Вывод, уверенность высокая:** рынок переполнен на уровне «курсы + задачи + AI-помощник». У Arvexo нет доказуемого whitespace как у ещё одной общей AI/ML-платформы. Бесплатные материалы закрывают discovery и content access; Kaggle/Codeforces/LeetCode-подобные продукты закрывают соревнование или практику; Stepik/Coursera/DataCamp/Практикум закрывают структурированный путь; ChatGPT/Khanmigo/Coursera Coach закрывают general AI assistance.

**Вывод, уверенность средняя:** возможный wedge находится в разрыве между обучением и доверенным доказательством самостоятельного навыка: короткие диагностические ML-задачи → исправление конкретной ошибки → unseen transfer task → небольшой end-to-end artifact → прозрачное evidence bundle. Это пока гипотеза: внешний спрос работодателей/вузов на формат Arena не подтверждён.

**Что рынок подтверждает:**

- AI literacy стала массовой образовательной темой; существуют международные competency frameworks и высокая фактическая распространённость GenAI среди молодых людей.
- Узкий спрос на школьные AI-соревнования наблюдаем: профиль НТО AI получил более 7,5 тыс. регистраций в 2024/25.
- Профессиональные AI/ML-навыки ценятся, но general AI use нельзя смешивать с разработкой ML: в российской ОРС продвинутый уровень self-reported AI skills был только у 3,2% занятых, тогда как базовый — у 22,7%.
- Completion и persistence — структурная проблема open online learning; одна цифра completion без исходного намерения вводит в заблуждение.

**Чего рынок не подтверждает:**

- что школьники массово хотят глубокий ML curriculum;
- что родители готовы платить именно за verified ML portfolio;
- что работодатели доверят внутреннему рейтингу новой платформы;
- что AI Coach улучшит delayed learning, а не только удовлетворённость;
- что широкая миссия даёт повторяемую дистрибуцию.

## 2. Определение рынка без ложного TAM

Arena пересекает девять рынков, но их нельзя складывать: один пользователь одновременно может учитываться в EdTech, coding, AI literacy, competitions и career education.

| Контур | Job / единица ценности | Основные альтернативы | Почему это не отдельный TAM Arena |
|---|---|---|---|
| AI literacy | понять возможности, ограничения, риски и responsible use | школа, UNESCO/OECD frameworks, Khan Academy, Google/Code.org, ChatGPT | часто финансируется государством/школой и доступен бесплатно |
| Python/data foundations | написать и объяснить работающий код/запрос | Stepik, freeCodeCamp, Codecademy, DataCamp, Hyperskill | зрелая категория с низкими switching costs |
| ML education | построить и честно оценить модель | Coursera, DeepLearning.AI, fast.ai, Google MLCC, Практикум | контента много; дефицит чаще в feedback/application |
| Practice | быстро закрыть skill gap | LeetCode, Exercism, Codewars, StrataScratch, Kaggle Learn | incumbents имеют большой банк и usage data |
| Competitions | проверить себя на unseen challenge | Kaggle, Codeforces, NTO, Tianchi, Zindi, DrivenData | сеть участников и sponsor problems трудно запустить с нуля |
| Olympiad preparation | получить льготу/победить/попасть в финал | НТО, Сириус, кружки, Codeforces, школы тренеров | требуется точное соответствие регламенту и экспертный контент |
| Career preparation | пройти screening/interview и получить первую роль | Практикум, Interview Query, HackerRank, CodeSignal, GitHub/Kaggle | результат зависит от рынка найма, английского, географии и опыта |
| Verified evidence | дать внешнему оценщику достоверный work sample | GitHub, Kaggle profile, CodeSignal, Credly, диплом/олимпиада | доверие возникает только после внешней валидации и anti-cheat |
| Institutional learning | назначать, видеть mastery, снижать нагрузку преподавателя | LMS, Stepik, Yandex Textbook, Uchi.ru, Coursera for Campus | длинный procurement и требования privacy/integration |

### Рабочий bottom-up рынок для первого пилота

**Не TAM; операционная оценка.** Первая достижимая когорта — 30–50 русскоязычных учеников/студентов одного уровня, привлечённых из одной школы, университетского сообщества, олимпиадного канала или Telegram/community. Следующая ступень — 3–5 когорт / 100 активированных учеников. До доказанного повторяемого канала глобальные рыночные миллиарды неинформативны.

Наблюдаемые demand proxies:

- 7,5 тыс.+ регистраций школьников 8–11 классов на профиль НТО AI в 2024/25; 94 финалиста — интерес высокий, но funnel чрезвычайно селективен ([Минобрнауки](https://www.minobrnauki.gov.ru/press-center/news/nauka-i-obrazovanie/97242/)).
- 63,8% людей 16–24 лет в ЕС использовали GenAI в 2025 году, 39,3% — для формального образования; это usage, не purchase intent ([Eurostat](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/edn-20260210-1)).
- OECD/EC в 2026 году выпустили отдельную AI literacy framework для primary/secondary education; институциональная потребность существует, но curriculum должен охватывать критическую оценку и этику, а не только model APIs ([OECD](https://www.oecd.org/en/publications/empowering-learners-for-the-age-of-ai_65cd27d4-en.html)).
- В российском обследовании 314 тыс. респондентов, репрезентативном для 46,7 млн занятых, self-reported AI skills имели 37,5%, но необходимость в текущей работе отмечали 4,9%; авторы считают это нижней оценкой и описывают measurement caveats ([НИУ ВШЭ/Росстат](https://issek.hse.ru/news/1170639437.html)).

## 3. Аудитории: карта решений

Готовность платить ниже — **гипотеза**, пока нет транзакционного теста. Для несовершеннолетних пользователь и плательщик часто разные лица.

| Аудитория | Главный JTBD | Альтернатива сегодня | Desired evidence | Time-to-value target | Самое рискованное предположение |
|---|---|---|---|---|---|
| Школьник-новичок | безопасно понять AI и сделать первую вещь своими руками | видео, ChatGPT, школьный кружок | объяснённый мини-проект/transfer task | 10 минут до первой осмысленной задачи; 2 недели до artifact | интерес к AI переживёт момент, когда появятся данные/код и ошибки |
| Родитель | выбрать безопасное и полезное занятие с видимым прогрессом | репетитор, олимпиадная школа, крупный бренд | понятный progress report, privacy, работа ребёнка | 1 сессия до понимания; 4 недели до наблюдаемого результата | родитель заплатит за доказательство навыка, а не за бренд/экзамен |
| Студент | превратить теорию в самостоятельную ML-практику | вуз, Kaggle, Stepik/Coursera, GitHub | end-to-end project + diagnostic skill map | 15 минут до gap diagnosis; 4–8 недель до проекта | студенту нужен ещё один guided layer, а не только дедлайн/команда |
| Junior developer | добавить data/ML competency без смены всей траектории | docs, fast.ai, work tasks | reproducible service/project | 1 день до useful task; 6–10 недель до production-shaped artifact | роль действительно требует ML, а не API use |
| Junior analyst | закрыть SQL/statistics/experimentation gaps | DataCamp, StrataScratch, interview banks | SQL + analysis memo + experiment reasoning | 15 минут до diagnosis; 3–6 недель до evidence | Arena может быть лучше специализированных SQL-платформ |
| Junior ML candidate | пройти screening и доказать самостоятельность | Kaggle, Практикум, Interview Query, GitHub | unseen work sample, project defense, verified process | первая employer-shaped task в день 1; 6–8 недель до bundle | работодатели отличат и признают формат Arena |
| Олимпиадник | понять gap, тренироваться на валидных задачах, попасть дальше | НТО, Сириус, кружок/тренер, архивы | результат по readiness band + разбор | diagnosis в 20 минут; турнир в 1–2 недели | Arena получит экспертный банк, соответствующий реальным олимпиадам |
| Преподаватель | дать практику и видеть misconceptions без ручной рутины | LMS, Stepik, notebooks, Google Forms | class mastery/error map | назначение за 10 минут; signal после 1 занятия | authoring/analytics экономят больше времени, чем требуют настройки |
| Школа | безопасно запустить измеримый AI literacy/кружковый модуль без редкого эксперта | Яндекс Учебник/Лицей, федеральные программы, vendor/LMS | class pre/post/retention report + teacher control | пилот 4–8 недель | procurement/privacy/teacher workload не превысят ценность пилота |
| Университет | выровнять фундамент и дать applied ML/work sample в существующей дисциплине | собственная LMS/лабы, Stepik, ODS, Kaggle, contest platform | reproducible artifacts + rubric + LMS export | один модуль/семестр | преподаватель примет внешний assessment и найдётся faculty owner |
| Работодатель | дёшево увидеть валидный entry-level signal | CV, GitHub, Kaggle, HackerRank/CodeSignal | work sample с provenance, rubric, anti-cheat | review ≤10 минут | новый сигнал улучшит решение по сравнению с существующим funnel |

## 4. Подробные audience cards

### 4.1 Школьник 7–11 классов, новичок

- **JTBD:** «Когда AI везде обсуждают, помоги мне понять, как он работает, и создать что-то настоящее без высшей математики».
- **Мотивация:** любопытство, статус среди сверстников, будущая профессия, проект/олимпиада; относительная сила мотивов неизвестна.
- **Боли:** абстрактные термины; резкий переход к математике/среде; ошибка воспринимается как «я не способен»; трудно выбрать путь.
- **Барьеры:** слабая self-regulation, устройство/интернет, английский, нагрузка школы, отсутствие взрослой поддержки, возрастные правила AI.
- **Причины старта:** яркий пример, приглашение друга/учителя, турнир, видимый проект.
- **Причины прекращения:** длинная теория, ложная лёгкость первых тестов и резкий cliff, публичное низкое место, сломанная среда, потеря streak.
- **WTP:** пользователь обычно не плательщик; бесплатный core обязателен. Гипотеза оплаты родителем — за cohort/mentor/project review, не за контент.
- **Доверие:** известный партнёр/учитель, безопасность, отсутствие агрессивных продаж, понятная демонстрация работ.
- **Результат:** ученик своими словами объясняет model/data/evaluation, находит очевидную leakage и делает маленький reproducible проект.
- **Time-to-value:** первая победа ≤10 минут; первая новая transfer-задача ≤30 минут; shareable artifact ≤14 дней.
- **Риск:** массовый интерес к GenAI может не конвертироваться в терпение к ML practice.

### 4.2 Родитель

- **JTBD:** «Помоги понять, что ребёнок действительно учится в безопасной среде и это полезнее случайных роликов».
- **Мотивация:** развитие, поступление/олимпиада, цифровая безопасность, структурированное время.
- **Боли:** непрозрачное качество EdTech; маркетинговые обещания; непонятные XP/score; риск данных/контактов; трудно оценить AI-generated work.
- **Барьеры:** цена, доверие к новому бренду, перегруз ребёнка, необходимость consent, отсутствие гарантированного формального outcome.
- **Старт/отсев:** начинает после рекомендации; прекращает после скрытой оплаты, пустого progress report, pressure tactics или отсутствия результата.
- **WTP-гипотеза:** платный pilot возможен за живую поддержку/проверку/малую группу; цена должна тестироваться preorder, не опросом.
- **Доверие:** sample lesson, curriculum/rubric, квалификация reviewer, privacy summary, refund/cancellation, реальные артефакты без выборочной витрины.
- **Time-to-value:** понять программу за 5 минут; увидеть первую содержательную работу за 1–2 недели.
- **Риск:** родитель выбирает экзаменационный бренд/репетитора, а verified skill остаётся абстракцией.

### 4.3 Студент

- **JTBD:** «Преврати разрозненную теорию в последовательную практику и покажи, что я могу сделать сам».
- **Мотивация:** стажировка, проект для CV, закрытие пробелов, peer benchmark.
- **Альтернативы:** вуз, Kaggle, ODS, Stepik/Coursera, fast.ai, pet project, студенческое сообщество.
- **Боли:** tutorial hell; dataset/idea selection; leakage/validation mistakes; нет feedback; трудно довести проект до deploy/story.
- **Барьеры:** время, бесплатные альтернативы, неодинаковый фундамент, skepticism к certificate.
- **Старт/отсев:** стартует перед набором на стажировку; бросает при generic контенте, неработающей среде или слабом feedback.
- **WTP-гипотеза:** выше за review/interview simulation/verified assessment, ниже за записанный curriculum.
- **Доверие:** employer-shaped rubric, reviewer identity, transparent sample, alumni outcomes с cohort definitions.
- **Результат/TTV:** gap map в первой сессии; законченный artifact за 4–8 недель.
- **Риск:** accountability/community, а не продуктовые функции, может быть реальным дефицитом.

### 4.4 Начинающий разработчик

- **JTBD:** «Научись интегрировать и оценивать ML/AI-компоненты инженерно, не становясь исследователем».
- **Боли:** различие demo/production, tests/data contracts/monitoring, выбор build-vs-API, hallucination/security.
- **Альтернативы:** official docs, work project, cloud/vendor courses, GitHub examples.
- **Барьеры:** Arena выглядит школьной; time cost; rapidly changing stack.
- **WTP-гипотеза:** возможна за production lab/mentor review, но сегмент смежный и не первый.
- **Trust/result:** актуальный stack, versioned lab, deployable service и evaluation report.
- **Риск:** расширение в AI engineering размоет beginner ML wedge.

### 4.5 Начинающий аналитик

- **JTBD:** «Потренируй SQL, статистическое мышление и объяснение решения на реалистичных данных».
- **Боли:** пассивное знание; window functions/A-B tests; business interpretation; нет review текста.
- **Альтернативы:** DataCamp, StrataScratch, SQL simulators, Практикум, interview tasks.
- **Барьеры:** специализированные продукты сильнее; AI легко генерирует SQL; validation authorship трудна.
- **WTP-гипотеза:** проверяемый mock-screening может иметь ценность; broad subscription — слабее.
- **Result/TTV:** diagnosis 15 минут; несколько unseen cases + analysis memo за 2–4 недели.
- **Риск:** это отдельный curriculum/brand, который не нужно включать в первый MVP.

### 4.6 Junior ML / Data Science candidate

- **JTBD:** «Покажи мне и работодателю, что я самостоятельно решаю типичные entry-level задачи».
- **Боли:** вакансии требуют опыт; одинаковые Titanic-проекты; слабое объяснение decisions; leakage; неясная готовность к interview.
- **Альтернативы:** Kaggle profile, GitHub, Практикум, Interview Query, referrals, internships.
- **Барьеры:** узкий рынок entry-level; regional requirements; английский; AI-assisted authorship; employer distrust.
- **Старт/отсев:** высокий urgency перед набором; churn после пропущенного hiring cycle или если задачи не похожи на screening.
- **WTP-гипотеза:** strongest individual payer, но бесплатный mission/core должен сохранить entry path; платными могут быть review/cohort/interview.
- **Trust/result:** unseen timed + untimed tasks, provenance, oral defense, reproducibility, rubric, external reviewers.
- **TTV:** readiness gap в день 1; один credible bundle за 6–8 недель.
- **Риск:** Arena может готовить к искусственному benchmark, который работодатели не используют.

### 4.7 Олимпиадник

- **JTBD:** «Дай валидную диагностику и серию задач чуть выше моего уровня с разбором ошибок».
- **Мотивация:** льготы поступления, достижение, community/status, сложные задачи.
- **Боли:** архивы без scaffold; скрытый prerequisite; мало качественного feedback; разный формат этапов.
- **Альтернативы:** НТО/Сириус, тренер, кружки, Codeforces, школьные команды.
- **Барьеры:** экспертный контент, сезонность, узкий top cohort, negative social comparison.
- **WTP-гипотеза:** родитель/школа платит за coach/cohort; бесплатные задачи — acquisition.
- **Trust/result:** авторы/партнёры, соответствие регламенту, historical calibration, readiness band.
- **TTV:** diagnostic ≤20 минут; targeted set сразу; рост на anchor tasks за 4 недели.
- **Риск:** без формального статуса/партнёра Arena — лишь ещё один банк задач.

### 4.8 Преподаватель

- **JTBD:** «Назначь хорошую практику, покажи misconception map и сократи ручную проверку, не отнимая контроль».
- **Боли:** authoring cost, heterogeneity, plagiarism/AI, неудобные notebooks, privacy, разрозненные данные.
- **Альтернативы:** LMS/Forms, Stepik, notebooks, собственные задачи, auto-graders.
- **Барьеры:** onboarding, интеграция roster/SSO, недоверие к AI feedback, curriculum mismatch.
- **WTP:** плательщик часто организация; individual teacher может не иметь бюджета.
- **Trust/result:** preview/override, rubric, export, class privacy, accessibility, no training on student data by default.
- **TTV:** импорт/назначение ≤10 минут; actionable misconception report после одного занятия.
- **Риск:** teacher workflow — отдельный B2B product; premature admin features поглотят команду.

### 4.9 Школа

- **JTBD:** «Запусти безопасный измеримый AI literacy/кружковый модуль без найма редкого специалиста».
- **Боли:** shortage экспертов, procurement, consent, accessibility, blocked devices, обучение учителя, support, vendor continuity.
- **Альтернативы:** штатный преподаватель, Яндекс Учебник/Лицей, Сбер AI Academy, федеральные олимпиады, LMS/vendor.
- **WTP:** лицензия/пилот при наличии owner, budget и evidence; не оценивать без procurement interviews.
- **Trust/result:** DPA/security, parental consent flow, class learning report, teacher control, SLA, export, standards map.
- **TTV:** 4–8-недельный пилот; решение о renewal по learning + teacher time, не logins.
- **Риск:** длинный sales cycle несовместим с ранним solo-founder темпом.

### 4.10 Университет

- **JTBD:** «Выровняй входной уровень и дай студентам applied AI/ML practice, не создавая новый autograder с нуля».
- **Мотивация:** employability, современная дисциплина, снижение ручной проверки, партнёрские проекты.
- **Боли:** неоднородный фундамент, LMS/SSO, academic integrity, faculty ownership, procurement и maintenance.
- **Альтернативы:** собственные notebooks/лабы, Stepik, ODS, Kaggle/Tianchi, Яндекс Contest, хакатоны.
- **Старт/отсев:** стартует с преподавателем-владельцем и конкретным модулем; останавливается при интеграции дольше семестра или непрозрачном scoring.
- **WTP:** кафедра/вуз/партнёр платит за cohort только при экономии grading time или доказанном outcome.
- **Trust/result:** reproducible artifacts, calibrated rubric, преподавательский override, export/API, research/ethics terms.
- **TTV:** запуск одного модуля в семестре; actionable report после первой работы.
- **Риск:** faculty не примет внешний score, даже если студентам нравится продукт.

### 4.11 Работодатель

- **JTBD:** «Сократи false positives/false negatives при отборе junior и дай work sample, который быстро проверить».
- **Боли:** CV inflation, одинаковые проекты, LLM assistance, review cost, слабая связь puzzle score с работой.
- **Альтернативы:** referrals, internships, GitHub/Kaggle, HackerRank/CodeSignal, take-home/live interview.
- **Барьеры:** новый vendor, legal/fairness, integration, adverse impact, маленькая выборка Arena.
- **WTP:** только после доказанной predictive/incremental validity или снижения reviewer time.
- **Trust/result:** standardized rubric, identity/provenance, permitted-AI mode, human explanation, calibration, appeals.
- **TTV:** recruiter/reviewer понимает evidence ≤10 минут; pilot compares hiring decisions.
- **Риск:** employers не хотят ещё один score; им нужен доступный artifact и контекст.

## 5. Cross-audience tensions

1. Школьнику нужна безопасная поддержка; работодателю — независимость и жёсткая проверка.
2. Родитель ценит понятную структуру; продвинутый ученик — autonomy и сложность.
3. Бесплатная миссия требует low-cost core; AI tutor и mentor review имеют переменную стоимость.
4. Соревнование создаёт статус сильным и threat слабым.
5. Публичное портфолио повышает opportunity surface и одновременно privacy risk.
6. Универсальный curriculum облегчает бренд, но ухудшает relevance каждой цели.

Решение не в одном режиме для всех: `Learn`, `Practice`, `Classic Assessment` и `AI-Native Project` должны иметь разные правила, evidence labels и метрики.

## 6. Конкурентная карта: структурные паттерны

Полная проверяемая матрица находится в `01_competitor_matrix.csv`. В ней **59 уникальных product families**: 32 глобальных и 27 региональных/азиатских продуктов. Сравнение охватывает Россию, США, Европу, Китай, Японию, Южную Корею и Индию; недоступные цены и функции помечены `unknown`, а не восстановлены по старым обзорам. Детали и первичные URL находятся в `sources/competitor_sources.md` и `sources/market_sources.md`.

### Пять устойчивых archetypes

1. **Open content:** freeCodeCamp, fast.ai, Hugging Face Course, Google MLCC, D2L.ai. Сильны доступностью/авторитетом; слабы персональной диагностикой и completion support.
2. **Structured subscription/course:** Coursera, edX, DataCamp, Codecademy, Hyperskill, Практикум, Skillbox, Нетология. Сильны curriculum/brand; риск — стоимость, generic credential, пассивное прохождение.
3. **Practice/screening:** LeetCode, HackerRank, CodeSignal, Codewars, Exercism, StrataScratch, Interview Query. Сильны повторяемой задачей и bank; ML work менее дискретен и дороже проверять.
4. **Competition/community:** Kaggle, Codeforces, NTO, Tianchi, AIcrowd, Zindi, DrivenData. Сильны статусом, data/network и real problems; новичку трудно войти, а competition rank не равен curriculum mastery.
5. **AI tutor/bundled coach:** Khanmigo, Coursera Coach, Duolingo Max, ChatGPT Study Mode, coding assistants. Быстрый feedback и персонализация; hallucination, answer leakage, dependency, cost и unstable product scope.

### Где incumbents трудно атаковать

- объём и SEO контента;
- глобальная узнаваемость сертификата;
- банк задач и telemetry;
- liquidity соревнований;
- employer integrations;
- creator/university supply;
- subsidized/free official curricula;
- general-purpose AI capability.

### Возможная незащищённая связка

Не отдельная функция, а протокол:

> диагностированная ошибка → минимальный scaffold → вариативная повторная попытка → delayed unseen transfer → объяснение решения → versioned evidence artifact

Каждый элемент существует у конкурентов, но связка между beginner-safe learning, real-skill measurement и shareable evidence встречается реже. Уверенность средняя-низкая до matrix validation и user/employer tests.

## 7. 20 главных проблем рынка

1. Доступ к контенту перестал быть главным дефицитом; трудно выбрать последовательность.
2. Completion rate маскирует разные исходные намерения.
3. Recognition-based quizzes создают иллюзию знания.
4. Tutorial projects копируются и слабо доказывают самостоятельность.
5. Практика ML плохо дробится на дешёвые автоматически проверяемые units.
6. Новички не понимают leakage, validation и metric choice до позднего этапа.
7. Ошибка получает объяснение, но не превращается в spaced error-repair loop.
8. XP/streak/rank смешиваются с mastery.
9. Global leaderboard демотивирует большую часть новичков.
10. General AI assistants легко выдают ответ и разрушают assessment validity.
11. Запрет AI невозможно надёжно обеспечить вне controlled environment.
12. AI tutors имеют hallucination, hint dependency и variable cost.
13. Entry-level вакансии часто требуют опыт, создавая catch-22.
14. Сертификаты без прозрачного assessment плохо дифференцируют кандидатов.
15. GitHub/Kaggle показывают output, но не всегда process/authorship.
16. Учителю дорого создавать и поддерживать качественные variational tasks.
17. Школы требуют privacy/consent/accessibility и надёжность, а не только feature demo.
18. Карьерные claims часто используют непрозрачные знаменатели и создают regulatory risk.
19. Технологический stack и curriculum быстро устаревают; фундамент меняется медленнее.
20. Широкая платформа требует одновременно content, community, trust, distribution и infrastructure — слишком много для ранней команды.

## 8. 10 наиболее привлекательных ниш

Оценки — **гипотезы**, шкала 1–5: `P` pain/frequency, `D` differentiation, `T` time-to-test, `M` mission fit, `E` economic plausibility. Итог — сумма без претензии на математическую точность.

| # | Ниша | P | D | T | M | E | Итого | Главная проверка |
|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Leakage/validation/metrics diagnostic practice для начинающих ML | 5 | 4 | 5 | 4 | 3 | 21 | improves unseen transfer vs explanation-only |
| 2 | Bridge «школьная AI literacy → первый настоящий data artifact» | 4 | 4 | 4 | 5 | 3 | 20 | 30-user cohort completes/defends artifact |
| 3 | Classic vs AI-Native dual-mode skill evidence | 4 | 5 | 3 | 4 | 4 | 20 | employers correctly interpret and prefer evidence |
| 4 | Error replay и mastery map поверх коротких ML-задач | 4 | 4 | 5 | 4 | 3 | 14-day delayed error recurrence falls |
| 5 | Небольшие readiness-banded AI турниры для школ/вузов | 4 | 3 | 4 | 5 | 3 | weak students retain; teacher saves time |
| 6 | Verified end-to-end junior ML work sample + oral defense | 5 | 4 | 3 | 4 | 4 | improves blind employer decisions |
| 7 | Олимпиадный diagnostic → targeted practice, не полный курс | 4 | 3 | 4 | 4 | 3 | calibration predicts anchor-set result |
| 8 | Teacher assignment + misconception map для AI literacy | 4 | 3 | 3 | 5 | 4 | assignment/report workflow <10 min and renewal |
| 9 | Employer-authored microcases с 공개 rubric | 4 | 4 | 2 | 4 | 4 | employers contribute/review repeatedly |
| 10 | Accessible Russian-language AI literacy with applied ethics/data | 3 | 3 | 4 | 5 | 2 | schools/parents choose it over free alternatives |

## 9. 10 наиболее опасных конкурентных угроз

1. **ChatGPT и другие general assistants:** бесплатная/дешёвая персональная помощь обесценивает generic AI Coach.
2. **Stepik:** русскоязычный creator ecosystem, известный формат и distribution.
3. **Kaggle:** datasets, notebooks, competition status, Learn и профиль в одной экосистеме.
4. **Yandex Practicum / крупные карьерные школы:** бренд, marketing funnel, mentors и career services.
5. **DataCamp / Codecademy:** polished in-browser practice, large content bank и subscription economics.
6. **LeetCode/HackerRank/CodeSignal:** habitual practice, employer-recognized screening и огромный task telemetry.
7. **NTO/Сириус/Сбер AI programs:** официальный статус, льготы, партнёры и прямой olympiad demand.
8. **DeepLearning.AI/fast.ai/Hugging Face/Google:** авторитетный бесплатный или недорогой актуальный контент.
9. **Khan Academy/Code.org/Яндекс Учебник:** доверие школ/родителей и готовые classroom workflows.
10. **Incumbent bundling:** Coursera, GitHub, JetBrains и LMS могут добавить tutor/portfolio/assessment без отдельного acquisition cost.

## 10. 10 вопросов без надёжного ответа

1. Какой сегмент имеет highest problem frequency: олимпиадник, ML candidate или школьник-новичок?
2. Увеличивает ли proposed loop delayed transfer, а не только completion?
3. Какой evidence employer реально просмотрит за ≤10 минут?
4. Может ли Arena доказать authorship в AI-native режиме без surveillance theatre?
5. Какой процент слабых учеников churn после первого публичного турнира?
6. Кто платит: родитель, ученик, школа, вуз или работодатель — и за какой момент ценности?
7. Какова полная стоимость одного качественного variational ML task и его поддержки?
8. Доступен ли repeatable organic channel за пределами личной сети основателя?
9. Можно ли сохранить бесплатный core при variable LLM/reviewer cost?
10. Имеет ли Arena право на олимпиадное позиционирование без официальной калибровки/партнёра?

## 11. Решение этапа 1

Не строить «AI-университет» или общий каталог. Продолжать исследование только с узкими кандидатами:

- beginner ML diagnostic/error-repair;
- school-to-real-artifact bridge;
- independently interpretable skill evidence.

На этапах 2–4 их нужно проверить через learning science, актуальные вакансии, стоимость assessment и smoke tests. Если внешний оценщик не видит дополнительной ценности evidence bundle, portfolio/opportunities следует убрать из ближней стратегии.
