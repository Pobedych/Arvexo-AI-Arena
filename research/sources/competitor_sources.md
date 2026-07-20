# Глобальные конкуренты Arvexo Arena: продукты, механики и первичные источники

**Срез:** 20 июля 2026 года. **Охват:** 32 глобальных продукта и продуктовых семей. **Цель:** не рейтинг компаний, а разбор того, как разные продукты закрывают звенья пути «обучение → практика → соревнование → проект → доказательство навыка → карьера».

## Как читать этот файл

- Использованы преимущественно официальные страницы продукта, документация, help-центры и публичные тарифы. Официальная страница надёжна для факта существования функции и объявленной цены, но не доказывает эффективность, качество или карьерный результат.
- Цены ниже — публично отображённые цены на дату доступа, до налогов, если сайт не сообщил иное. Валюта сохранена как на странице. Региональные цены, app-store цены, скидки и checkout могут отличаться.
- Если цена была скрыта динамическим checkout, противоречила другой официальной странице или подтверждалась только старой публикацией, указано **«не подтверждено»**. Цена не восстанавливалась по обзорам и форумам.
- `✓` — функция подтверждена официальным источником; `△` — частичная/смежная функция; `—` — не подтверждена в изученных первичных источниках, что не доказывает полного отсутствия.
- В колонке `Рейтинг` имеется в виду публичный соревновательный/skill score, лига или ранг, а не звёздочный рейтинг курса.
- Наблюдаемые ограничения и рекомендации помечены как **вывод**: это продуктовый анализ по публичной механике, а не измеренный пользовательский эффект.
- Маркетинговые численные заявления компаний не считаются независимым доказательством; в реестре они помечены `marketing claim`.

## Быстрая карта возможностей

| № | Продукт | Основная аудитория и позиционирование | Практика | Соревнования | Рейтинг | Проекты | Публичное портфолио/профиль | AI-наставник | Карьера | Бесплатный вход | Публичная цена на 20.07.2026 |
|---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|---|
| 1 | Kaggle | ML/data-практики; открытая экосистема данных, ноутбуков и соревнований | ✓ | ✓ | ✓ | ✓ | ✓ | — | △ | Да | $0 для участника; B2B-hosting зависит от типа конкурса |
| 2 | LeetCode | Кандидаты в software engineering; интервью и алгоритмическая практика | ✓ | ✓ | ✓ | — | △ | △ | ✓ | Да | $35/мес.; $159/год, USD |
| 3 | HackerRank | Разработчики, кандидаты и работодатели; practice-to-hire | ✓ | ✓ | △ | △ | ✓ | ✓ | ✓ | Да | Community $0; B2B Starter $1,990/год, Pro $4,490/год, USD |
| 4 | Codewars | Программисты, совершенствующие язык через kata | ✓ | △ | ✓ | — | △ | — | — | Да | Red $5/мес.; $24/6 мес.; $40/год, USD |
| 5 | Exercism | Изучающие языки; бесплатная практика и добровольное менторство | ✓ | — | — | △ | △ | △ | — | Да | $0, «100% free, forever» |
| 6 | Coursera | Студенты и взрослые; курсы/credentials университетов и компаний | △ | — | — | △ | △ | ✓ | ✓ | Частично | Для показанной локали €50/мес. или €343/год за Plus |
| 7 | edX | Университетские MOOCs и verified credentials | △ | — | — | △ | △ | — | ✓ | Audit | Audit $0; verified track примерно от $50, USD |
| 8 | Udacity | Карьерные tech-программы с проектной проверкой | ✓ | — | — | ✓ | △ | ✓ | ✓ | Отдельные free courses | Текущий checkout цену не раскрыл; старые $249/$846 не считаются текущими |
| 9 | DataCamp | Data/AI-навыки; единый цикл assess-learn-practice-apply | ✓ | ✓ | △ | ✓ | ✓ | ✓ | ✓ | Да | Официальный конфликт: promo $14/мес. annual vs $27.50/мес. annual |
| 10 | Codecademy | Новички и career switchers; интерактивное обучение коду | ✓ | — | △ | ✓ | △ | ✓ | ✓ | Да | Plus $14.99/мес. annual или $29.99 monthly; Pro $19.99/$39.99, USD |
| 11 | freeCodeCamp | Глобальные новички; бесплатный project-based curriculum | ✓ | — | — | ✓ | ✓ | — | △ | Да | $0 |
| 12 | Khan Academy + Khanmigo | K–12, родители, учителя; mastery learning и безопасный AI tutor | ✓ | — | △ | △ | — | ✓ | — | Да | Core $0; Khanmigo $4/мес. в США по help-странице; District Starter $10/ученик/год |
| 13 | Brilliant + Koji | Школьники 10+, взрослые; визуальное интерактивное STEM-мышление | ✓ | ✓ | ✓ | — | — | ✓ | — | Да, с лимитом | Цена Premium не раскрылась публично; unknown |
| 14 | Duolingo + Max | Смежный benchmark удержания; микролёрнинг и AI roleplay | ✓ | ✓ | ✓ | — | △ | ✓ | — | Да | Региональная/app-store цена не подтверждена; unknown |
| 15 | Hyperskill / JetBrains Academy | Новички и junior-разработчики; project-first обучение в IDE | ✓ | — | △ | ✓ | ✓ | ✓ | △ | Да, лимиты | €49.90/мес.; €399/12 мес. |
| 16 | StrataScratch | Кандидаты на data-роли; реальные interview tasks + portfolio labs | ✓ | △ | ✓ | ✓ | ✓ | ✓ | ✓ | Да | Текущая цена не получена с pricing/checkout; unknown |
| 17 | Interview Query | Data/analytics/ML interview prep | ✓ | — | △ | ✓ | — | ✓ | ✓ | Ограниченно | $79/мес.; $199/год; $299 lifetime, USD; официальный FAQ содержит опечатку |
| 18 | DeepLearning.AI | AI builders и профессионалы; foundation + hands-on portfolio | ✓ | — | — | ✓ | ✓ | — | △ | Видео | Free $0; Pro $50/мес. или $300/год, USD |
| 19 | fast.ai | Программисты с базовым coding; practical deep learning top-down | ✓ | — | — | ✓ | △ | — | △ | Да | $0 |
| 20 | Hugging Face Learn | ML/LLM-разработчики; ecosystem-native open courses | ✓ | — | — | ✓ | ✓ | — | △ | Да | Курсы $0 и без рекламы |
| 21 | Google ML Crash Course | Новички/практики с Python и математической базой; компактный ML foundation | ✓ | — | — | △ | — | — | — | Да | $0 |
| 22 | CodeSignal Learn | Learners, кандидаты, университеты, работодатели; learning-to-assessment ontology | ✓ | — | ✓ | △ | ✓ | ✓ | ✓ | Да | Cosmo+ $24.99/мес., USD; B2B отдельно |
| 23 | Dataquest | Career switchers в data; text-first, projects-first | ✓ | △ | △ | ✓ | ✓ | — | ✓ | Ограниченно | $49/мес. или $399/год, USD по официальному материалу 2026 |
| 24 | Educative | Профессиональные разработчики и interview prep; text + in-browser code | ✓ | — | △ | ✓ | △ | ✓ | ✓ | Несколько курсов | Promo Standard $149/год; Premium $199/год, USD |
| 25 | Scrimba | Frontend/coding beginners; редактируемые скринкасты и career paths | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | 25 курсов | $49/мес. или $294/год, USD по официальной публикации 2026 |
| 26 | Sololearn + Kodie | Mobile-first новички; bite-sized coding/AI и community | ✓ | ✓ | ✓ | △ | △ | ✓ | △ | Да | Pro/Max существуют, но стабильная цена не раскрылась; unknown |
| 27 | Mimo | Mobile/web coding beginners; career path, projects, AI tutor | ✓ | — | △ | ✓ | ✓ | ✓ | ✓ | Да | Собственный материал: Pro $9.99/мес., Max $39.99/мес.; live pricing скрыт |
| 28 | LabEx + Labby | Linux/DevOps/cyber/programming learners; browser VMs, 100% hands-on | ✓ | △ | △ | ✓ | △ | ✓ | △ | Да | Pro $99.90/год; limited 2-year $149, USD |
| 29 | GitHub Skills + Copilot | Студенты/разработчики; обучение в реальном repo workflow | ✓ | — | — | ✓ | ✓ | ✓ | △ | Да | Skills $0; Copilot Free $0; Pro $10, Pro+ $39, Max $100/мес., USD |
| 30 | ChatGPT Study Mode | Учащиеся любого предмета; универсальный диалоговый tutor | ✓ | — | — | — | — | ✓ | △ | Да | Study Mode доступен на всех планах, включая Free |
| 31 | Credly | Issuers, earners, employers; portable verified badges/profile | — | — | — | — | ✓ | — | ✓ | Для earner | Issuer pricing — quote/custom, не подтверждён публично |
| 32 | Accredible | Образовательные providers; verifiable credentials и pathways | — | — | — | — | ✓ | — | ✓ | Для recipient | Launch от $45/мес., 12-месячный срок, 50 recipients, USD |

## 1. Платформы практики и соревнований

### 1. Kaggle

- **Аудитория и позиционирование.** Начинающие и опытные data scientists/ML-инженеры, исследователи, компании-спонсоры. Kaggle называет себя крупнейшим онлайн-сообществом ML-практиков; цифры аудитории на презентации — собственное маркетинговое заявление, не независимая метрика.
- **Core loop и форматы.** Пользователь выбирает dataset/notebook/course/competition → исследует данные и обучает модель в облачном notebook → публикует код или отправляет submission → получает metric/leaderboard feedback → обсуждает решение, объединяется в команду и накапливает medals/tier. Форматы: реальные датасеты, public notebooks, micro-courses, соревнования, модели, benchmarks, discussions.
- **Practice / competition / rating / projects / portfolio / AI / career.** Практика, соревнования, публичные лидерборды, medals и tiers подтверждены. Public notebooks, datasets, models и профиль образуют сильное наблюдаемое портфолио. Отдельный педагогический AI-tutor не подтверждён. Карьерная ценность косвенная: репутация, публичный код, sponsored problems; гарантии найма нет.
- **Free tier, цена, монетизация.** Для learner/community доступ бесплатный. Монетизация — sponsored/featured competitions, custom services и экосистемные цели Google. Официальная презентация показывает разные fee-модели для sponsors, но они зависят от типа конкурса; универсальную B2B-цену нельзя переносить на Arena.
- **Сильные стороны.** Реальные данные и внешний metric; сетевой эффект вокруг datasets/notebooks; высокая видимость лучших решений; естественная связка «artifact + benchmark + discussion».
- **Ограничения и удержание — вывод.** Новичок может оптимизировать leaderboard без системного понимания; public/private leaderboard допускает overfitting стратегии; medals измеряют узкий соревновательный результат, а не полный ML skill. Удерживают новые contests/datasets, medals, tiers, followers, upvotes и командная работа.
- **Незакрытая потребность.** Мост между основами, разбором ошибок, самостоятельным проектом и валидируемой профессиональной компетенцией; безопасная junior-лига без доминирования экспертов.
- **Адаптировать.** Submission-to-metric loop, реальные datasets, public artifact, отдельные учебные и рейтинговые попытки, post-competition solution review. **Не копировать:** один глобальный leaderboard как «навык», медали без competency map и конкурсную оптимизацию вместо обучения.
- **Источники:** [Kaggle datasets](https://www.kaggle.com/datasets/), [Meta Kaggle](https://www.kaggle.com/datasets/kaggle/meta-kaggle), [Kaggle competitions](https://www.kaggle.com/competitions), [Meet Kaggle / sponsor deck](https://www.kaggle.com/static/slides/meetkaggle.pdf).

### 2. LeetCode

- **Аудитория и позиционирование.** Студенты и разработчики, готовящиеся к coding interview, а также competitive/problem-solving аудитория. Главный promise — систематическая практика DSA и company-specific interview simulation.
- **Core loop и форматы.** Study Plan/Daily Challenge/problem → решение в browser IDE → deterministic judge → editorial/solutions/discussion → повторение или timed contest/mock assessment → progress/badge/leaderboard. Есть алгоритмы, структуры данных, SQL, company tags, weekly contests, mock assessments.
- **Возможности.** Практика, contests и публичный ranking сильны; профиль показывает solved counts и contest history, но это не проектное портфолио. Premium даёт video solutions, debugger, autocomplete, company filters, mock assessments и priority judge; это assistance, но не подтверждённый сократический tutor. Career-функция — interview preparation, не job placement.
- **Free tier и цена.** Значимая часть задач и обсуждений бесплатна. Premium: **$35 USD/месяц** или **$159 USD/год** (на странице также показан эквивалент $13.25/мес. при annual billing). Монетизация — B2C subscription и корпоративные продукты.
- **Сильные стороны.** Мгновенная объективная проверка, огромная задача-библиотека, высокая целевая мотивация «следующее интервью», регулярные timed events.
- **Ограничения и удержание — вывод.** Слабый мост от syntax/CS basics к самостоятельным продуктам и ML workflow; company tags и повторяемые patterns могут стимулировать memorization; solved count не доказывает способность работать с грязными данными, требованиями и командой. Удерживают Daily Challenge, plans, weekly leaderboard, contests, badges, calendars и premium company content.
- **Незакрытая потребность.** Встроенная диагностика причин ошибки, объяснение переноса паттерна, role-realistic projects и портфолио с provenance.
- **Адаптировать.** Надёжный judge, topic/difficulty map, timed practice без pay-to-win, editorial после самостоятельной попытки. **Не копировать:** количество решённых задач как единый skill score, непрозрачные company-question claims и grind без проектов.
- **Источники:** [Premium pricing](https://leetcode.com/subscribe/), [Study Plans](https://leetcode.com/studyplan/), [официальное описание механики Study Plan и weekly leaderboard](https://leetcode.com/discuss/post/3482910/feature-updates-plan-your-coding-journey-to-achieve-more/), [Premium FAQ](https://support.leetcode.com/hc/en-us/articles/360011884094-What-will-I-get-with-a-premium-subscription).

### 3. HackerRank

- **Аудитория и позиционирование.** Разработчики/кандидаты, университеты и работодатели. Платформа соединяет practice, certification, mock interview, job discovery, screening и live interview.
- **Core loop и форматы.** Candidate: practice challenge → auto-check/certification или AI mock interview → skills/profile → job/application. Employer: выбрать validated question/real-world project → assessment/proctoring → scorecard → interview/hire. Есть coding, SQL, role assessments, projects, hackathons и pair-programming.
- **Возможности.** Практика, certificates, hackathons и hiring funnel подтверждены. Community включает AI Mock Interviewer; SkillUp рекламирует AI Tutor. Бесплатно доступны по одной Software Engineer coding mock и Technical Screen mock, каждую можно пройти один раз; остальные mock interviews требуют credits, цена credits публично не подтверждена.
- **Free tier и цена.** Developer Community имеет бесплатный вход. B2B annual: Starter **$1,990 USD/год** (эквивалент $165/мес., 120 attempts), Pro **$4,490 USD/год** (эквивалент $375/мес., 300 attempts), Enterprise custom; additional attempt — $20. Это цена hiring-продукта, не learner subscription.
- **Сильные стороны.** Самая ясная связка practice → assessed evidence → employer workflow; role-specific assessment; реальная среда интервью; несколько типов AI mock.
- **Ограничения и удержание — вывод.** Employer-first incentives создают риск «обучения под тест»; proctoring и surveillance уместны в high-stakes assessment, но вредны как default learning experience; сертификат и assessment score не заменяют long-form project. Удерживают jobs, certifications, interview deadlines, hackathons и повторная подготовка.
- **Незакрытая потребность.** Прозрачный learner-owned skill model, объяснение score, formative practice без слежения и проектное доказательство между quiz и hiring test.
- **Адаптировать.** Отдельные режимы learn/practice/verified assessment; employer-readable rubrics; AI mock с feedback. **Не копировать:** прокторинг в повседневной практике, employer score как собственность платформы, скрытые credit costs.
- **Источники:** [HackerRank product overview](https://www.hackerrank.com/), [B2B pricing](https://www.hackerrank.com/work/pricing), [AI Mock Interview help, обновлено 22.04.2026](https://help.hackerrank.com/articles/8988753946-introduction-to-mock-interview).

### 4. Codewars

- **Аудитория и позиционирование.** Программисты от новичков до опытных, желающие совершенствовать язык и problem solving через community-authored kata.
- **Core loop и форматы.** Выбрать kata по language/rank → написать код и пройти tests → посмотреть/обсудить чужие решения → получить kyu/dan progress и Honor → позже создавать, переводить и модерировать kata. Задания короткие, алгоритмические и language-centric.
- **Возможности.** Practice, rank, honor, leaderboards и contribution loop подтверждены. Это не система long-form projects, verified portfolio или career matching. AI-tutor не подтверждён.
- **Free tier и цена.** Основная практика бесплатна. Codewars Red: **$5 USD/месяц**, **$24 USD за 6 месяцев**, **$40 USD/год**; premium даёт enhanced statistics, ad-free, peer comparison, beta access и badge.
- **Сильные стороны.** Просмотр разных idiomatic solutions после собственной попытки; community creation; раздельные сигналы rank и Honor.
- **Ограничения и удержание — вывод.** Community task quality неоднородна; Honor вознаграждает активность и вклад, а не только skill; короткие kata почти не проверяют design, debugging чужого кода, data workflow и завершение проекта. Удерживают kyu/dan, Honor, percentiles, leaderboards и авторство.
- **Незакрытая потребность.** Curated learning sequence, объяснение misconceptions и мост к real-world artifact.
- **Адаптировать.** Разделить `skill rating` и `community contribution reputation`; показывать альтернативные решения после сдачи. **Не копировать:** uncurated kata как curriculum и reward economy, позволяющую легко фармить activity signal.
- **Источники:** [Codewars Red pricing](https://www.codewars.com/subscription), [Honor docs](https://docs.codewars.com/gamification/honor), [Ranks docs](https://docs.codewars.com/gamification/ranks).

### 5. Exercism

- **Аудитория и позиционирование.** Изучающие и практикующие programming languages, которым нужны exercises и feedback. Позиционирование — «learning, practice and mentoring», 100% free.
- **Core loop и форматы.** Join language track → Concept Exercise/Practice Exercise → tests локально или online → automated analyzer feedback → при желании request mentoring → итерация решения → позже mentoring/contribution. Learning Mode последовательно разблокирует упражнения; Practice Mode открывает весь набор.
- **Возможности.** 83 language tracks, practice и human mentoring подтверждены. Public submitted solutions и profile частично работают как evidence, но formal verified portfolio, contests и career funnel не заявлены. Analyzers — автоматизированный feedback, не обязательно generative AI tutor.
- **Free tier, цена, монетизация.** **$0**, некоммерческая/volunteer модель и пожертвования; платного learner tier в изученных источниках нет.
- **Сильные стороны.** Code review от человека, несколько корректных approaches, open-source/community ownership, редкие языки, отсутствие paywall.
- **Ограничения и удержание — вывод.** Скорость mentoring зависит от соотношения volunteers/learners; сами docs предупреждают, что ответ может занять дни и mentors не проходят полноценный vetting. Короткие exercises не дают цельного production project. Удерживают track progression, unlocks, mentoring conversation и переход learner → mentor.
- **Незакрытая потребность.** Гарантированное время обратной связи, безопасная moderation, проекты и внешне проверяемая итоговая компетенция.
- **Адаптировать.** Async code-review loop, mentor notes, разные approaches, возможность «отдать долг» как mentor. **Не копировать:** критическую зависимость от бесплатного труда без SLA, quality calibration и escalation.
- **Источники:** [Tracks/docs](https://exercism.org/docs/building/product/tracks), [Unlocking Exercises](https://exercism.org/docs/building/product/unlocking-exercises), [Mentor Feedback](https://exercism.org/docs/using/feedback/mentor), [Guide to being mentored](https://exercism.org/docs/using/feedback/guide-to-being-mentored).

## 2. Массовые курсы, credentials и project-based learning

### 6. Coursera

- **Аудитория и позиционирование.** Студенты, взрослые learners, career switchers, сотрудники компаний и университеты. Aggregator курсов, Specializations, Professional Certificates и degrees от университетов/компаний.
- **Core loop и форматы.** Search/enroll → video/readings → quizzes, peer/auto-graded assignments, labs/guided project → certificate → следующая ступень specialization/professional certificate/degree. Coursera Coach объясняет материал, проводит practice и даёт career guidance; interactive instruction может быть grounded в course content.
- **Возможности.** Практика и projects зависят от конкретного provider; единого competition/rating layer нет. Certificates/Accomplishments shareable, но исходные project artifacts не всегда публичны. Career resources и job-oriented credentials сильны; Coach — подтверждённый AI tutor.
- **Free tier и цена.** Создание аккаунта бесплатно; конкретный курс может иметь preview, «full course, no certificate», free trial или financial aid — условия course-specific, поэтому «весь каталог можно бесплатно audit» утверждать нельзя. Для отображённой локали Coursera Plus: **€50/месяц** или **€343/год**, 7-day trial/14-day money-back на странице. Цена локализуется.
- **Монетизация.** B2C subscription и individual programs, degrees/tuition, Enterprise/Government/Campus contracts и revenue share с content providers.
- **Сильные стороны.** Institutional brands, широкий каталог, stackable credentials, enterprise distribution, AI Coach grounded в курсе.
- **Ограничения и удержание — вывод.** Качество и активность неоднородны между providers; video-heavy flow допускает пассивное completion; сертификат чаще подтверждает выполнение курса, а не независимый skill exam; каталог может перегружать выбором. Удерживают multi-course credentials, deadlines, subscription economics, recommendations, certificates и Coach.
- **Незакрытая потребность.** Единая competency map, comparable assessment across providers, публичные artifacts с provenance и прозрачная связь certificate → job task.
- **Адаптировать.** Партнёрские credentials, grounded course tutor, stackable short milestones. **Не копировать:** бесконечный catalog как навигацию, смешение completion и verified mastery, subscription pressure без ясного outcome.
- **Источники:** [Coursera Plus pricing](https://www.coursera.org/courseraplus), [Terms, effective 01.01.2026](https://www.coursera.org/about/terms), [Coursera Coach / interactive instruction](https://blog.coursera.org/announcing-ai-powered-capabilities-enabling-educators-to-use-coursera-coach-to-deliver-interactive-personalized-instruction/), [Coach learning loop](https://blog.coursera.org/coursera-coach-leveraging-genai-to-empower-learners/).

### 7. edX

- **Аудитория и позиционирование.** Learners, которым нужен университетский контент, verified certificate, professional program или degree; также enterprise/university customers.
- **Core loop и форматы.** Enroll → lecture/readings → practice/graded assignment в зависимости от track → verified certificate/program. Форматы и project depth задаются provider/course.
- **Возможности.** Audit и verified tracks подтверждены; graded assignments относятся к paid verified track. Единого competition/rating, публичного project portfolio и AI tutor в изученных общих страницах не подтверждено. Career value строится на branded credentials.
- **Free tier и цена.** Audit track **$0** с ограниченным content access и без graded assignments/certificate. Verified track — **примерно от $50 USD**; точная цена зависит от курса/программы.
- **Монетизация.** Verified certificates, professional programs, boot camps/degrees и B2B institutional offerings.
- **Сильные стороны.** Университетский brand trust, понятное разделение audit/verified, доступ к академическому контенту.
- **Ограничения и удержание — вывод.** Бесплатный track часто исключает assessment, то есть миссия access не равна доступу к доказательству навыка; course quality/project realism неоднородны; public portfolio отсутствует как общий layer. Удерживают program sequences, deadlines и credential completion.
- **Незакрытая потребность.** Бесплатная formative practice, низкозатратная проверка навыка, единый профиль artifacts и карьерная обратная связь.
- **Адаптировать.** Бесплатный content audit + платный high-integrity assessment, если бесплатная практика остаётся полной. **Не копировать:** paywall на feedback/assessment как единственный способ понять, научился ли пользователь.
- **Источники:** [How edX works / free vs verified](https://www.edx.org/about-us/how-it-works).

### 8. Udacity

- **Аудитория и позиционирование.** Career switchers и работающие специалисты в technology; employer-aligned Nanodegree и project review.
- **Core loop и форматы.** Выбор skill/Nanodegree → lessons/quizzes → hands-on workplace-like project → human project feedback/code review → resubmit → certificate + career coaching/interview preparation. В Individual plan заявлен 24/7 AI-powered learning assistant.
- **Возможности.** Реальные проекты, expert feedback, certificates и career services подтверждены. Leaderboard/cohort есть только в некоторых enterprise contexts, не в individual. Публичный portfolio layer не является общей функцией, хотя проекты можно переносить наружу.
- **Free tier и цена.** Отдельный free content доступен. Текущая plans-страница 20.07.2026 показала Monthly/4-Month, но числовые цены загрузились динамически и не были доступны. Старый официальный FAQ 2023 указывает $249/месяц или $846/4 месяца; **эти цифры не считаются подтверждённой текущей ценой**.
- **Монетизация.** Individual All Access subscription, team/enterprise contracts, отдельные/новые program purchases по условиям.
- **Сильные стороны.** Human review с resubmission, цельные projects, career support, ясное «сделал работу — получил feedback».
- **Ограничения и удержание — вывод.** Высокая и непрозрачная цена создаёт access barrier; time-based subscription на длинных проектах наказывает медленный темп; нет competition/community reputation layer. Удерживают project milestones, feedback loop, weekly progress updates, mentors/AI assistant и career coaching.
- **Незакрытая потребность.** Бесплатный foundation до платной специализации, portable evidence/rubrics и low-cost peer review.
- **Адаптировать.** Обязательный resubmission после feedback, reviewer rubric и карьерный review итогового проекта. **Не копировать:** дорогой all-access до доказанной ценности и оплату за время как давление на novice learner.
- **Источники:** [Current plans page](https://www.udacity.com/plans), [Checkout/free content help](https://support.udacity.com/hc/en-us/articles/26727182855693-Checkout-Process), [старый All Access FAQ — только исторический price signal](https://www.udacity.com/blog/your-udacity-all-access-questions-answered/).

### 9. DataCamp

- **Аудитория и позиционирование.** Новички и практики в data/AI/analytics, студенты, teams/enterprise. Позиционирование — browser-based «learn by doing» для job-ready data skills.
- **Core loop и форматы.** Официальный цикл: **Assess → Learn → Practice → Apply**. Skill assessment → короткое video/text объяснение → in-browser code exercise/daily challenge → guided project/competition/DataLab workbook → certificate/certification/professional profile.
- **Возможности.** Courses, 10k+ exercises, tracks, projects, competitions, certifications, professional profile и shareable analysis portfolio подтверждены. DataLab включает AI prompts/chat/fix/explain; AI Tutor courses могут использовать credits.
- **Free tier.** Basic: первый chapter каждого курса, skill assessments, cheat sheets/tutorials, professional profile, live code-alongs и competitions; practice/projects ограничены.
- **Цена и противоречие.** Main pricing на дату доступа показывал promotional **$14 USD/месяц при annual billing** для Premium и Teams. Отдельная официальная B2C-страница одновременно показывала **$27.50 USD/месяц при annual billing**. Student plan: **$164/год** или **$24/месяц**. Это официальный конфликт/сегментация; checkout надо перепроверять для конкретного региона.
- **Монетизация.** B2C Premium, DataLab subscription/compute, Teams/Enterprise licenses, AI course credits.
- **Сильные стороны.** Наиболее полный среди course platforms data-loop: diagnostic, practice, project, competition, profile и certification в одном продукте; нулевой setup.
- **Ограничения и удержание — вывод.** Сильное scaffolding может научить проходить fill-in exercise без самостоятельной постановки задачи; guided projects не равны open-ended production work; promotional price ambiguity снижает доверие. Удерживают tracks, progress, daily 5-minute mobile challenges, certificates, portfolio и competitions.
- **Незакрытая потребность.** Scaffold fading, независимый capstone, external dataset ambiguity и доказательство вклада пользователя при AI assistance.
- **Адаптировать.** Единый assess-learn-practice-apply graph и бесплатный professional profile. **Не копировать:** completion certificate как skill proof, вечные guided blanks и неясную скидочную цену.
- **Источники:** [Main pricing](https://www.datacamp.com/pricing), [B2C pricing](https://www.datacamp.com/pricing/b2c), [Student pricing](https://www.datacamp.com/pricing/student), [subscription overview, обновлено 16.06.2026](https://support.datacamp.com/hc/en-us/articles/360011266593-DataCamp-Learn-Subscription-Plans-An-Overview).

### 10. Codecademy

- **Аудитория и позиционирование.** Absolute beginners, skill upgraders, career switchers и teams; обещание писать real code с первого дня в браузере.
- **Core loop и форматы.** Короткое explanation → in-browser coding task → instant check/quiz → skill path/career path → real-world/portfolio project → assessment/professional certification/interview preparation. AI Learning Assistance объясняет concepts/errors и проверяет solution; Pro добавляет AI interview simulator и job-readiness checker.
- **Возможности.** Practice, projects, course certificates, select professional certifications, career paths и AI tools подтверждены. Единого competition/leaderboard нет; portfolio — набор проектов, но не общий verified public artifact graph.
- **Free tier и цена.** Basic **$0**, но quizzes/projects и многие courses ограничены. Plus: **$14.99 USD/мес. при annual billing** или **$29.99 monthly**. Pro: **$19.99 USD/мес. annual** или **$39.99 monthly**. B2B — quote.
- **Сильные стороны.** Очень низкий setup friction, immediate feedback, ясное разделение «learn a skill» и «build a career», широкая beginner funnel.
- **Ограничения и удержание — вывод.** Free tier показывает syntax, но закрывает значимую часть assessment/project value; guided projects и provider certificates могут переоцениваться как job readiness; нет соревнований и peer review. Удерживают paths, progress, app practice, AI help, certificates и career milestone.
- **Незакрытая потребность.** Открытые проекты с real users/data, independent verification и community critique.
- **Адаптировать.** Мгновенная проверка в контексте урока, role-based paths и отдельный career readiness diagnostic. **Не копировать:** резкий paywall до проекта и «профессиональная сертификация» без публичной task/rubric evidence.
- **Источники:** [Codecademy pricing/features](https://www.codecademy.com/pricing), [Plus/Pro explanation](https://www.codecademy.com/pro/offer), [Pricing help](https://help.codecademy.com/hc/en-us/articles/360022052834-Price-of-Codecademy).

### 11. freeCodeCamp

- **Аудитория и позиционирование.** Глобальные beginners и self-taught career switchers; nonprofit, open-source, полностью бесплатный curriculum.
- **Core loop и форматы.** Theory lesson → guided workshop → lab с самостоятельной задачей → review/quiz → certification projects → exam → free verified certificate; community/forum/study group и contribution к open source расширяют путь.
- **Возможности.** Interactive challenges, projects, exams и verified certification links/QR подтверждены. Formal competitions/rating и embedded AI tutor не являются центральными. Публичный профиль/certification — сильный portfolio signal, но employer acceptance не гарантирована.
- **Free tier и монетизация.** Все аспекты freeCodeCamp заявлены как **100% free**. Nonprofit funding: donations, community и media ecosystem.
- **Сильные стороны.** Самый сильный mission benchmark для Arena: бесплатны и content, и projects, и verified credential; open curriculum; крупное community support.
- **Ограничения и retention — подтверждённый product lesson.** В официальном объявлении 2025 founder признал, что 1,800-часовой full-stack capstone отталкивал learners: они продолжали выбирать старые 300-hour certificates. Команда вернула stackable 300-hour credentials. Удерживают project milestones, сертификаты, exams, forum/community и публичные ссылки.
- **Незакрытая потребность.** Более короткий time-to-value, персонализированный feedback, AI/ML competition layer и независимое подтверждение authorship.
- **Адаптировать.** Бесплатные stackable verified credentials, QR/verification URL, required projects и public curriculum. **Не копировать:** многосотчасовой первый meaningful credential, отсутствие быстрых wins и длинный путь без персонального review.
- **Источники:** [About / 100% free](https://opensource.freecodecamp.org/about/), [current curriculum formats](https://contribute.freecodecamp.org/how-to-work-on-coding-challenges/), [официальный разбор ошибки с 1,800-часовым credential](https://forum.freecodecamp.org/t/introducing-new-freecodecamp-certifications/762070), [2026 certification update](https://forum.freecodecamp.org/t/christmas-gifts-for-you-from-the-freecodecamp-community-learn-python-sql-spanish-and-more/771234).

## 3. Mastery learning, микролёрнинг и AI-наставники

### 12. Khan Academy + Khanmigo

- **Аудитория и позиционирование.** Ученики K–12, родители, учителя и школьные округа; бесплатная базовая академическая платформа с mastery learning. Khanmigo — контролируемый AI-помощник для learner/parent и отдельный набор teacher tools.
- **Core loop и форматы.** Диагностика/выбор unit → короткое видео или объяснение → practice set → мгновенная обратная связь → mastery progress → повтор слабых skills. Учитель назначает задания и видит class-level progress. Khanmigo ведёт диалог, помогает рассуждать, писать и планировать, а не является отдельным курсом.
- **Возможности.** Practice, mastery points/levels, teacher dashboard и AI assistance подтверждены. Формальные соревнования, карьерная воронка и публичное project portfolio отсутствуют в основном продукте; mastery level — учебный статус, а не глобальный рейтинг.
- **Free tier и цена.** Основной learner/teacher product бесплатен. Help-страница, обновлённая в марте 2025 года, указывает learner/parent Khanmigo **$4 USD/мес.** и доступность только в США; из-за возраста страницы это цена средней уверенности. Teacher tools заявлены бесплатными. Schools Enterprise Starter — **$10 USD за ученика в год** при объёме до 1,000; Enterprise — custom.
- **Сильные стороны.** Чёткая карта mastery, низкий финансовый барьер, понятная роль teacher oversight и развитая школьная safety/admin рамка для AI.
- **Ограничения и удержание — вывод.** Академическая mastery-модель мало доказывает способность завершить открытый data/AI-проект; нет публичной профессиональной репутации. Удерживают skill map, mastery progress, assignments и учительская accountability.
- **Незакрытая потребность.** Переход от освоенного concept к реальному артефакту, командной задаче и доказательству для работодателя.
- **Адаптировать.** Competency map, короткая диагностика перед задачей, mastery-based review и видимый прогресс наставнику. **Не копировать:** приравнивание mastery процента к workplace readiness и AI-диалог без артефакта/рубрики.
- **Источники:** [Khan Academy approach](https://www.khanacademy.org/about/our-approach), [Khan Academy product](https://www.khanacademy.org/), [Khanmigo plan features](https://support.khanacademy.org/hc/en-us/articles/25921448458893-What-features-are-available-in-the-Learner-Parent-and-Teacher-Khanmigo-subscription-plans), [schools pricing](https://www.khanacademy.org/schools/pricing), [mastery practice](https://support.khanacademy.org/hc/en-us/articles/360007253831-Using-self-paced-practice-and-Mastery-in-the-classroom).

### 13. Brilliant + Koji

- **Аудитория и позиционирование.** Школьники 10+, студенты и взрослые, которым нужны визуальные интерактивные уроки по math, science, computer science и data; акцент на problem-solving intuition.
- **Core loop и форматы.** Интерактивное объяснение → несколько визуальных задач → подсказка/объяснение → completion → XP/streak/weekly league → следующий последовательный урок. Koji задаёт направляющие вопросы и должен помогать дойти до ответа, а не просто выдавать его.
- **Возможности.** Интерактивная практика, XP, streak, weekly leagues и AI tutor подтверждены. Нет project portfolio, карьерного трека и сертификатов; лига отражает недельную активность, а не валидированную компетенцию.
- **Free tier и цена.** Free account получает весь каталог последовательно, но не более **двух lessons/practice sets в день**, с рекламой и ограниченным Koji. Публичная numeric Premium price на дату доступа не отобразилась; официальная help-страница прямо говорит, что цена зависит от выбранного плана/региона и показывается на subscribe page — **unknown**.
- **Сильные стороны.** Исключительно быстрый «aha moment», визуализация абстрактных идей, маленький ежедневный объём и tutoring, встроенный в конкретную задачу.
- **Ограничения и удержание — вывод.** Puzzle fluency не равна способности работать с messy dataset/codebase; нет самостоятельных проектов или portable credential. Удерживают streak, streak charges, XP, leagues, daily goal и последовательное unlocking.
- **Незакрытая потребность.** Превратить conceptual understanding в самостоятельный код, проект и проверяемый outcome.
- **Адаптировать.** Интерактивные ML-визуализации, Socratic hint ladder и две короткие бесплатные daily tasks. **Не копировать:** XP как proxy навыка, искусственную последовательность без placement test и retention pressure, не связанный с meaningful work.
- **Источники:** [Brilliant subscribe/features](https://brilliant.org/subscribe/), [free access limits](https://brilliant.org/help/using-brilliant/what-can-i-learn-on-brilliant-without-a-premium-subscription/), [pricing policy](https://brilliant.org/help/pricing-and-plans/how-much-does-brilliant-premium-cost/), [streak](https://brilliant.org/help/features/what-is-a-streak/), [XP and weekly leagues](https://brilliant.org/help/features/what-is-xp/), [general product/Koji/certificates](https://brilliant.org/help/using-brilliant/).

### 14. Duolingo + Max

- **Аудитория и позиционирование.** Массовый mobile-first language learning; для Arena это не прямой curriculum-конкурент, а сильный adjacent benchmark привычки, social retention и AI conversation practice.
- **Core loop и форматы.** Короткий lesson → immediate correction → XP/goal → streak → league/friends quest → personalized practice. Max добавляет AI Roleplay и Video Call: сценарный разговор, transcript и feedback, а персонаж может помнить часть контекста прошлых разговоров.
- **Возможности.** Practice, XP, leagues, streaks, quests, hearts/gems, personalized practice и generative AI conversations подтверждены. Project portfolio, career credential и доказательство production skill не входят в loop.
- **Free tier и цена.** Основное обучение доступно бесплатно с ограничениями/рекламой. Super и Max имеют динамические региональные, семейные и app-store prices; стабильная публичная цена для выбранной локали не была подтверждена — **unknown**.
- **Сильные стороны.** Низкий порог сессии, ясный next action, социальные обязательства, forgiving streak mechanics и practice по слабым темам. AI используется в безопасном узком сценарии, а не как пустой чат.
- **Ограничения и удержание.** XP/leagues измеряют активность; hearts и loss aversion могут подменять учебную мотивацию. Эффекты streak, опубликованные Duolingo по внутренним A/B tests, являются self-reported, не независимым доказательством. Удерживают streak, freeze/repair, league movement, friend quests, notifications и variable rewards.
- **Незакрытая потребность для Arena.** Habit loop, который ведёт не к повторению микрозадач, а к накоплению полезного проекта и доказательства компетенции.
- **Адаптировать.** Сессия 5–10 минут, один очевидный next action, мягкая защита streak, peer quest и role-play для интервью/защиты проекта. **Не копировать:** punitive hearts, бесконечный XP treadmill и публичную лигу активности как skill rating.
- **Источники:** [Duolingo Max](https://blog.duolingo.com/duolingo-max/), [product loop and currencies](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/), [streak design](https://blog.duolingo.com/how-duolingo-streak-builds-habit/), [internal streak experiments](https://blog.duolingo.com/improving-the-streak/), [practice hub](https://blog.duolingo.com/guide-to-duolingo-practice-hub/).

### 15. Hyperskill / JetBrains Academy

- **Аудитория и позиционирование.** Beginners и junior developers, желающие освоить язык/роль через работающий проект в IDE; связка curriculum, JetBrains tooling и professional practice.
- **Core loop и форматы.** Выбор role/project → диагностика и персональный knowledge map → короткая theory topic → quiz/coding problem → этап проекта в IDE → tests/code quality feedback → повтор слабых тем/spaced repetition → GitHub/certificate. AI coding assistant даёт explanations/hints по контексту.
- **Возможности.** Practice, многоэтапные проекты, IDE integration, GitHub artifacts, certificates, AI assistance, hints и spaced repetition подтверждены. Глобальных competition leagues нет; карьерная функция косвенная через portfolio/certificate.
- **Free tier и цена.** Free plan позволяет идти по любому course, но ограничивает **7 wrong submissions/day, 1 hint/problem и 1 solution/problem**; проекты, certificate и code-quality features требуют Premium. Premium: **€49.90/мес.** или **€399/12 мес.** (€33.25 effective monthly); итоговая локальная цена может отличаться. Annual включает JetBrains product pack по условиям страницы.
- **Сильные стороны.** Лучший прямой benchmark project-first sequencing: теория появляется «just in time» к этапу проекта; работа происходит в настоящей IDE; можно показать GitHub artifact.
- **Ограничения и удержание — вывод.** Высокая цена и ограничения wrong attempts/hints могут наказывать продуктивное экспериментирование; качество evidence зависит от самостоятельности выполнения. Удерживают long-lived project, knowledge map, streak/spaced review, progress и ecosystem bundle.
- **Незакрытая потребность.** Соревновательная проверка, external reviewer и устойчивое доказательство authorship/decision-making.
- **Адаптировать.** Project stages, prerequisite graph, IDE/Git integration, tests + rubric + resubmission и интервальные review. **Не копировать:** лимит ошибок как monetization lever и дорогой обязательный tooling bundle.
- **Источники:** [Hyperskill pricing](https://hyperskill.org/pricing), [subscription plans and free limits](https://support.hyperskill.org/hc/en-us/articles/16378065753236-Subscription-plans), [project-based/IDE guide](https://hyperskill.org/guide).

## 4. Data/AI career preparation и verified interview practice

### 16. StrataScratch

- **Аудитория и позиционирование.** Кандидаты на data analyst, data scientist, analytics engineer и related roles; «реальные» interview questions, cloud data labs, AI mock interviews и career-oriented profile.
- **Core loop и форматы.** Выбор role/company/topic → SQL/Python/statistics/system design question → code в browser/notebook → expected result/solution/explanation → performance profile → mock interview или Data Lab project → публичная публикация. Free structured SQL/Python paths содержат lessons и practice.
- **Возможности.** 1,000+ questions, AI mock interviews, Data Labs, public portfolio, performance profile и StrataTools/MCP заявлены официально; количество и «real interview» provenance — provider marketing claim, не независимо проверенная полнота. Competition-like challenges есть, но постоянная массовая лига не ядро.
- **Free tier и цена.** Freemium подтверждён; about-страница указывает первые 50 questions бесплатно, а current learning paths — по 6 modules/36 lessons/160+ exercises для SQL и Python. Публичный pricing/checkout не отдал устойчивую numeric price — **unknown**. Student discount существует, размер не раскрыт.
- **Сильные стороны.** Высокая близость к role task, один workspace для code и explanation, performance evidence и редкое сочетание interview prep с publishable data project.
- **Ограничения и удержание — вывод.** Interview-question corpus тренирует узнавание паттернов и не заменяет production lifecycle; сам help/contact канал предусматривает сообщения об ошибках, то есть quality curation остаётся операционной задачей. Удерживают large question bank, company tags, profile metrics, AI mocks и новые role paths.
- **Незакрытая потребность.** Надёжная provenance/версия задачи, assessment integrity, longitudinal mentorship и проверка production trade-offs.
- **Адаптировать.** Role-tagged tasks, reproducible notebook, mock defense, public project page и transparent performance dimensions. **Не копировать:** расплывчатое «asked by company» без provenance и question count как основную ценность.
- **Источники:** [StrataScratch product](https://www.stratascratch.com/), [official FAQ/contact](https://www.stratascratch.com/contact-us), [free question statement](https://www.stratascratch.com/about).

### 17. Interview Query

- **Аудитория и позиционирование.** Data analyst/scientist/engineer, ML и product analytics candidates; all-in-one preparation по SQL, Python, statistics, ML, product sense, case и take-home.
- **Core loop и форматы.** Диагностика/role study plan → lesson/course → tagged interview question в IDE → run/tests → explanation/solution → повтор по плану → take-home/mock practice. Форматы включают question bank, company guides, 40+ hours courses и take-homes.
- **Возможности.** Practice, study plans, code runs, solution library, take-home projects, AI-related assistance и career/company guides заявлены. Публичный verified portfolio и соревнования не являются ядром.
- **Free tier и цена.** Free user существует, но full library платная; free trial нет. Current official pages согласуются на **$79 USD/мес., $199/год, $299 lifetime**. FAQ от 27.03.2026 содержит строку «Yearly $199 per month billed monthly» — очевидно внутренне противоречивую; отдельная официальная comparison page показывает $199/year. Перед покупкой нужен checkout verification.
- **Сильные стороны.** Единый role plan для разнородных data-interview skills, включая product/case/take-home, которые часто отсутствуют у чистых coding judges.
- **Ограничения и удержание — вывод.** Высокая monthly price, слабый beginner foundation и риск pattern memorization; ценовая опечатка снижает доверие. Удерживают structured plans, company/topic filters, progress и большой corpus.
- **Незакрытая потребность.** Free on-ramp, реальный portfolio artifact, peer/expert review и measured transfer к новой задаче.
- **Адаптировать.** Multi-domain role rubric, readiness diagnostic, timed mock и take-home defense. **Не копировать:** $79 paywall до доказанного value и quantity-led catalog messaging.
- **Источники:** [pricing/features](https://www.interviewquery.com/pricing), [FAQ, 27.03.2026](https://www.interviewquery.com/p/faq), [official comparison with annual price](https://www.interviewquery.com/p/data-interview), [study plans, 27.03.2026](https://www.interviewquery.com/p/interview-study-plans).

### 18. DeepLearning.AI

- **Аудитория и позиционирование.** AI beginners, working developers и professionals, которым нужны foundation, короткие topical courses и applied GenAI/ML skills от узнаваемых instructors/partners.
- **Core loop и форматы.** Видео/reading → knowledge check → hosted lab/notebook → assignment/project → professional certificate/portfolio → следующий тематический short course. Community и newsletters поддерживают discovery новых fast-moving topics.
- **Возможности.** Course videos, labs, projects, professional certificates, saved workspace и portfolio подтверждены. Соревнований, единого рейтинга и встроенного persistent AI tutor в membership proposition не подтверждено.
- **Free tier и цена.** Free **$0**: все course videos, community и newsletters. Pro **$50 USD/мес.** либо **$300/год** ($25 effective monthly): labs, assessments, certificates, saved work, portfolio и exclusive courses. «150+ courses» — текущий marketing/catalog claim, не оценка качества.
- **Сильные стороны.** Очень быстрый выпуск актуальных AI topics, сильные instructor/industry partnerships, бесплатное video layer и paid hands-on differentiation.
- **Ограничения и удержание — вывод.** Каталог short courses может фрагментировать learning path; ключевое practice/certificate value за paywall; нет external competition or independent project review. Удерживают frequent releases, partner brands, certificates и subscription access к labs.
- **Незакрытая потребность.** Единая prerequisite/mastery карта, longitudinal capstone, public benchmark и проверка, что learner может работать без notebook scaffolding.
- **Адаптировать.** Бесплатная теория, платная compute/review без блокировки базовой практики, актуальные partner tasks и stackable topical badges. **Не копировать:** коллекцию несвязанных short courses как достаточный career path.
- **Источники:** [DeepLearning.AI membership and current pricing](https://learn.deeplearning.ai/membership).

## 5. Открытые и ecosystem-native AI/ML curricula

### 19. fast.ai

- **Аудитория/позиционирование.** Программисты с некоторым coding experience; бесплатный top-down курс practical deep learning, ориентированный на быстрый реальный результат, а не сначала на полный математический фундамент.
- **Loop и форматы.** Видео/ноутбук → запустить и изменить working model → experiment → deploy/share → изучить лежащую ниже теорию → обсудить на форуме. Текущий Part 1 — девять примерно 90-минутных lessons; уже ко второму lesson learner строит и deploys model.
- **Возможности, цена, монетизация.** Hands-on notebooks и проекты ✓; competitions/rating/formal certificate/AI tutor — не подтверждены; портфолио возможно через внешнюю публикацию. **$0**, open educational mission; используются бесплатные/open tools.
- **Сильные стороны / ограничения / удержание.** Сильный time-to-first-model и честная production orientation. Требуются Python/coding basics; core course датирован 2022 годом; нет formal assessment, review или portable credential. Удерживают видимый ранний результат, teacher narrative и forum.
- **Пробел и решение для Arena — вывод.** Нужны current tasks, rubric и independently checked mastery. Адаптировать top-down first win и «build before theory»; не копировать зависимость от self-assessment и один длинный instructor-led поток без competency checks.
- **Источники:** [Practical Deep Learning for Coders](https://course.fast.ai/).

### 20. Hugging Face Learn

- **Аудитория/позиционирование.** Python/ML developers, researchers и builders, входящие в open-source AI ecosystem; courses по LLM, agents, RL, audio, diffusion, CV, robotics и другим domains.
- **Loop и форматы.** Chapter/read/video → notebook/Colab exercise → train/use model or agent → publish model/dataset/demo в Hub/Spaces → community collaboration. LLM Course бесплатен и без рекламы; предполагает хороший Python и introductory deep learning.
- **Возможности, цена, монетизация.** Practice/projects/public Hub artifacts ✓; competitions/rating/embedded tutor — не ядро; career signal косвенный через open artifacts. Курсы **$0**; monetization лежит в более широкой platform/cloud ecosystem. FAQ LLM Course говорит, что certification currently нет, хотя навигация Learn содержит отдельный certification exam — состояние credential неоднозначно.
- **Сильные стороны / ограничения / удержание.** Настоящие models/datasets/Spaces, open collaboration и быстрый мост от lesson к deployable artifact. Высокий prerequisite, ecosystem/tool bias и неоднородная глубина курсов. Удерживают новые domains, Hub publishing, likes/downloads/community.
- **Пробел и решение для Arena — вывод.** Нужна beginner bridge и vendor-neutral assessment. Адаптировать public model card/demo и contribution loop; не копировать экосистемную метрику popularity как компетенцию и двусмысленную certification messaging.
- **Источники:** [Hugging Face Learn catalog](https://huggingface.co/learn), [LLM Course introduction/FAQ](https://huggingface.co/learn/llm-course/chapter1/1).

### 21. Google Machine Learning Crash Course

- **Аудитория/позиционирование.** Learners и practitioners с Python, NumPy/pandas и базовой algebra/statistics; компактный бесплатный ML foundation от Google.
- **Loop и форматы.** Self-contained module → video/text → interactive visualization → knowledge checks → Colab programming exercise → следующий concept. Темы включают regression, classification, data, neural nets, embeddings, LLM, production ML, AutoML и fairness.
- **Возможности, цена, монетизация.** Concept practice и hands-on exercises ✓; full projects △; competitions/rating/public portfolio/mentor/certificate — не подтверждены. **$0**, брендовый developer education/top-of-funnel.
- **Сильные стороны / ограничения / удержание.** Ясный, хорошо ограниченный syllabus и сильные visual explanations без setup. Сам сайт подчёркивает concepts, не обучение конкретным APIs; нет long-lived artifact, human feedback или accountability. Retention почти целиком intrinsic/course progress.
- **Пробел и решение для Arena — вывод.** После concepts learner нужен authentic task и review. Адаптировать компактные prerequisite modules и Colab checks; не копировать тупиковое завершение курса без next project, evidence или community.
- **Источники:** [ML Crash Course](https://developers.google.com/machine-learning/crash-course), [prerequisites and prework](https://developers.google.com/machine-learning/crash-course/prereqs-and-prework).

## 6. AI coding education и skills platforms

### 22. CodeSignal Learn

- **Аудитория/позиционирование.** Individual learners, students/candidates, universities и employers; единая skills ontology от персонального learning path до assessment/hiring. Cosmo — AI guide.
- **Loop и форматы.** Goal/diagnostic → personalized path → bite-sized explanation → coding practice/module assessment → Cosmo hint/feedback → skills profile → practice assessment или employer-certified assessment. Academy добавляет assigned paths и instructor visibility.
- **Возможности, цена, монетизация.** Practice, scores/profile, AI guide, assessment и career/hiring bridge ✓; public projects/competitions ограничены. Individual starts free; **Cosmo+ $24.99 USD/мес.** Hire B2B: Build **$79/мес. annual или $99 monthly**, Grow **$479/$599**, higher tier custom.
- **Сильные стороны / ограничения / удержание.** Общая taxonomy между learning и assessment, быстрый diagnostic feedback и естественный B2B channel. Совмещение coach и gatekeeping assessment создаёт конфликт восприятия; opaque score может стать proxy вместо evidence. Удерживают personalized next skill, streak/progress, profile и hiring stakes.
- **Пробел и решение для Arena — вывод.** Нужны explainable scores, open artifacts и разделение formative AI от summative assessment. Адаптировать skill graph и diagnostic-to-path; не копировать непрозрачный proprietary score или разрешение AI в измерении, которое должно быть independent.
- **Источники:** [CodeSignal pricing](https://codesignal.com/pricing), [assessment practice, обновлено 16.07.2026](https://support.codesignal.com/hc/en-us/articles/21025134150423-How-do-I-practice-coding-questions-on-CodeSignal), [Learn Academy FAQ, обновлено 18.06.2026](https://support.codesignal.com/hc/en-us/articles/41329274118167-Learn-Academy-FAQ-for-Learners).

### 23. Dataquest

- **Аудитория/позиционирование.** Career switchers и aspiring data analysts/scientists/engineers; text-first, in-browser coding и project-led portfolio вместо video-heavy course consumption.
- **Loop и форматы.** Reading/mission → write code against data → instant feedback → guided then independent project → portfolio/career path → challenge/community. Community events добавляют points, streaks, team goals и publishing.
- **Возможности, цена, монетизация.** Practice, projects, portfolio, paths и career guidance ✓; event competition/rating △; embedded AI tutor не подтверждён. Limited free content; **$49 USD/мес. или $399/год** по собственным материалам 2026, поскольку current checkout не был доступен. Subscription-funded.
- **Сильные стороны / ограничения / удержание.** Active coding без video passivity и последовательное накопление portfolio. Длинный self-directed path, limited live review; catalog/outcome comparisons на собственном блоге — marketing. Удерживают mission progress, projects, streak/badges, team challenges и portfolio milestones.
- **Пробел и решение для Arena — вывод.** Нужны external evaluation, peer review и real-time competition. Адаптировать text-to-code density и каждую крупную unit завершать artifact; не копировать self-reported superiority и badges за volume.
- **Источники:** [official 2026 comparison/pricing](https://www.dataquest.io/blog/dataquest-vs-datacamp/), [official course roundup with price/projects](https://www.dataquest.io/blog/best-data-science-courses/), [March Madness 2026 challenge](https://support.dataquest.io/en/articles/853-dataquest-march-madness-challenge-2026), [DataFest retention mechanics](https://support.dataquest.io/en/articles/843-datafest-2025-4-weeks-to-accelerate-your-learning).

### 24. Educative

- **Аудитория/позиционирование.** Professional software developers, interview candidates и teams; text-based interactive courses, in-browser code, cloud labs и projects без local setup.
- **Loop и форматы.** Roadmap/skill assessment → concise text lesson → embedded code/quiz → project/cloud lab → AI feedback → certificate; Premium добавляет interview mocks. Каталог заявляет 1,700+ courses — marketing count.
- **Возможности, цена, монетизация.** Practice, projects/labs, certificates, AI feedback, roadmaps и career/interview prep ✓; competitions/public portfolio — не ядро. Limited free courses. Current promotion: Standard **$149 USD/год** (list $248), Premium **$199/год** (list $362); checkout 16.07.2026 подтверждал $149 renewal and 40% «lifetime discount». Enterprise **$299/user/year**, team page **$199/user/year**. Отдельный certificate для eligible free/scholarship course — $19.
- **Сильные стороны / ограничения / удержание.** Высокая information density, executable environment и широкий professional catalog. Promo complexity, catalog overload и provider certificate без public rubric; три Premium mocks/month ограничивают high-intent practice. Удерживают roadmaps, completion, projects, certificate и subscription breadth.
- **Пробел и решение для Arena — вывод.** Нужны discoverability by competency, external artifacts и competitive feedback. Адаптировать concise text + executable cell + cloud task; не копировать endless catalog и perpetual-discount framing.
- **Источники:** [Unlimited pricing](https://www.educative.io/unlimited), [checkout snapshot URL](https://www.educative.io/checkout/subscription-buy?plan=200-12-6000), [business pricing](https://www.educative.io/enterprise-pricing), [certificate FAQ](https://www.educative.io/faq/certificates-faq).

### 25. Scrimba

- **Аудитория/позиционирование.** Frontend/coding beginners и career switchers; interactive screencasts, которые можно паузить и редактировать как code environment.
- **Loop и форматы.** Смотреть/слушать короткий scrim → в любой момент изменить code → challenge → solution/AI feedback → project → career path/community review → certificate/job-prep. Это сочетает instructor narrative и active editor.
- **Возможности, цена, монетизация.** Practice, projects, public portfolio support, AI feedback, certificates/community и career paths ✓; competition/rating — не ядро. 25 free courses; **$49 USD/мес. или $294/год** ($24.50 effective monthly) по официальной comparison publication 2026, а live pricing page не отдала numeric text. Subscription-funded.
- **Сильные стороны / ограничения / удержание.** Очень низкий переход от watching к editing, human-feeling instruction и community career support. Frontend skew, price not directly inspectable, certificates не independently verified. Удерживают cohort/community, projects, streak/progress, career milestones и feedback.
- **Пробел и решение для Arena — вывод.** Нужны data/ML-native environments, rubric-based evidence и standardized benchmark. Адаптировать interruptible editable explanation; не копировать instructor-led comfort без самостоятельного blank-page task.
- **Источники:** [Scrimba pricing redirect](https://scrimba.com/pricing), [official 2026 Scrimba comparison with price/features](https://scrimba.com/articles/scrimba-vs-udemy-for-learning-to-code-which-platform-is-right-for-you/).

### 26. Sololearn + Kodie

- **Аудитория/позиционирование.** Mobile-first beginners и hobbyists, изучающие coding, AI и data короткими сессиями; Kodie позиционируется как conversational AI coding mentor.
- **Loop и форматы.** Bite-sized lesson → quiz/code task → instant check → XP/streak/league/community discussion → следующий unit; Kodie объясняет ошибки, даёт personalized quiz/hint и может написать/debug code.
- **Возможности, цена, монетизация.** Practice, leagues/XP, community, certificates и AI tutor ✓; projects/portfolio/career △. Basic entry бесплатный; Pro/Max открывают unlimited learning/certificates/AI, но стабильная numeric price на live pages не раскрылась — **unknown**. Marketing audience/course counts не использованы как доказательство качества.
- **Сильные стороны / ограничения / удержание.** Мобильность, почти нулевой setup и community answer loop. Широкий catalog рискует быть shallow; AI, способный писать решение, размывает authorship. Удерживают streak, XP/league, notifications, social discussion и locked certificates.
- **Пробел и решение для Arena — вывод.** Нужен путь от micro-task к substantial artifact. Адаптировать mobile review, error-specific hint и community explanations; не копировать XP race и AI ghostwriting в assessed task.
- **Источники:** [Sololearn catalog/product](https://www.sololearn.com/en/Learn/), [Kodie / Learn with AI](https://www.sololearn.com/en/learn-with-ai).

### 27. Mimo

- **Аудитория/позиционирование.** Coding beginners, особенно mobile learners и career switchers; progressive paths, guided projects и AI tutor на web/mobile.
- **Loop и форматы.** Daily micro-lesson → code/quiz → streak/progress → guided project/playground → certificate; Max добавляет AI tutor, live sessions, guided portfolio projects и professional certificates.
- **Возможности, цена, монетизация.** Practice, paths, projects, certificates, portfolio support, AI и career layer ✓; competition — не ядро. Basic free ограничивает courses/paths/AI. Live pricing скрыт; официальный материал от 08.01.2026 указывает **Pro $9.99 USD/мес., Max $39.99/мес.** — средняя уверенность, до checkout. Subscription-funded.
- **Сильные стороны / ограничения / удержание.** Хороший daily entry и ясная лестница от microlearning к project. Сильные функции вынесены в дорогой Max; provider credential и AI assistance не подтверждают independent skill. Удерживают streak, progression, project/certificate milestones и live touchpoints.
- **Пробел и решение для Arena — вывод.** Нужны public rubric, real dataset и observed defense. Адаптировать micro-to-project escalation и mobile revision; не копировать hidden live price или credential, который нельзя раскрыть до evidence.
- **Источники:** [Mimo plans/features](https://mimo.org/pro), [official 2026 price comparison](https://mimo.org/blog/coding-apps-for-beginners), [Python path/projects description](https://mimo.org/blog/best-python-courses-for-beginners).

### 28. LabEx + Labby

- **Аудитория/позиционирование.** Learners Linux, DevOps, cybersecurity, programming и data tools; «100% hands-on» browser VMs и auto-verified labs. Labby — context-aware AI assistant.
- **Loop и форматы.** Skill tree → launch isolated VM → follow lab or solve challenge → automatic verification → hint/explanation from Labby → project/certificate → next skill. Exercises and projects run in disposable real environments.
- **Возможности, цена, монетизация.** 6,000+ labs/30 skill trees and 2,000+ exercises — current provider catalog claims; practice, VM, projects, challenges, certificates и AI ✓. Free: **3 VMs/day**. Pro **$99.90 USD/year**; limited two-year offer **$149**. Subscription-funded.
- **Сильные стороны / ограничения / удержание.** Authentic terminal/browser environment, deterministic verification and minimal setup. Instruction-following lab can yield completion without transfer; domain coverage skews infrastructure/security; AI hints can shortcut. Удерживают daily VM allowance, tree progress, projects, challenge solutions и certificate.
- **Пробел и решение для Arena — вывод.** Нужны open-ended tasks, review of reasoning and external artifacts. Адаптировать one-click reproducible sandbox + auto-check; не копировать lab completion as mastery or solution unlock as primary paid value.
- **Источники:** [LabEx pricing](https://labex.io/pricing), [LabEx product](https://labex.io/), [welcome/skill trees/Labby](https://support.labex.io/en/using-labex/welcome), [exercises](https://labex.io/exercises).

### 29. GitHub Skills + Copilot

- **Аудитория/позиционирование.** Students and developers learning GitHub workflows in real repositories; Copilot adds general coding agent/assistant. Это benchmark authentic portfolio infrastructure, а не полный curriculum provider.
- **Loop и форматы.** Create course repository from template → read Issue instructions → commit/branch/PR → GitHub Action checks event and posts feedback → complete real project/public repo. Copilot can explain, complete, chat and act in the same workflow.
- **Возможности, цена, монетизация.** Practice, projects and public artifacts ✓; competition/rating/structured career curriculum — нет. GitHub Skills **$0**. Copilot Free: **$0**, 2,000 completions/month plus limited chat/agent; Pro **$10**, Pro+ **$39**, Max **$100 USD/month**. Verified students can access Copilot Student free. Monetization — developer subscription/platform adoption.
- **Сильные стороны / ограничения / удержание.** Evidence lives in ordinary repo history, Actions provide event-driven feedback, artifacts portable. There is no coherent ML prerequisite map or independent assessment; Copilot may solve the exercise; activity graph is not skill. Удерживают real workflow, contribution graph, collaboration and tool habit.
- **Пробел и решение для Arena — вывод.** Need rubric, authorship disclosure, controlled AI policy and task progression over Git infrastructure. Адаптировать repo/PR/Action feedback and portable artifact; не копировать contribution count as rating or allow hidden agent completion in credentialed work.
- **Источники:** [GitHub Skills repositories](https://github.com/skills), [Skills quickstart](https://skills.github.com/quickstart), [Copilot plans](https://github.com/features/copilot/plans), [Copilot Student eligibility](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students).

### 30. ChatGPT Study Mode

- **Аудитория/позиционирование.** Learners of any subject using ChatGPT as an adaptive tutor; cross-domain substitute for explanations, guided problem solving and study planning, not a fixed course catalog.
- **Loop и форматы.** State goal/level → tutor asks calibration/Socratic questions → scaffolded explanation using uploaded image/PDF/context → learner answers → knowledge check/feedback → personalization through memory. User can switch Study Mode off.
- **Возможности, цена, монетизация.** AI tutoring, file-based learning and knowledge checks ✓; curriculum/mastery rating/competition/projects/verified portfolio — not inherent. Available globally on all ChatGPT plans, including **Free**, and with any model per help page; paid ChatGPT plans monetize broader service.
- **Сильные стороны / ограничения / удержание.** Flexible, immediate and personalized dialogue over learner materials. OpenAI explicitly warns that behavior can be inconsistent and mistakes occur; no ground-truth course map, authorship evidence or summative integrity. Удерживают conversational continuity, memory, low-friction file upload and broad utility.
- **Пробел и решение для Arena — вывод.** Need tutor grounded in versioned task/rubric/data, citations, mastery state and a separately secured assessment. Адаптировать Socratic calibration and artifact-aware coaching; не копировать ungrounded universal chat or togglable scaffolding inside high-stakes assessment.
- **Источники:** [Study Mode announcement and limitations](https://openai.com/index/chatgpt-study-mode/), [Study Mode FAQ, обновлено в июле 2026](https://help.openai.com/en/articles/11780217-chatgpt-study-mode-faq), [ChatGPT plans/features](https://chatgpt.com/pricing).

## 7. Verified portfolio и credential infrastructure

### 31. Credly

- **Аудитория/позиционирование.** Credential issuers, learners/earners and employers; portable Open Badges with issuer, criteria and verification metadata plus shareable profile/wallet.
- **Loop и форматы.** Learner earns elsewhere → issuer issues badge → earner accepts → badge/profile exposes criteria/evidence metadata → share to social/CV → employer verifies in real time; recommendations surface next credentials/jobs.
- **Возможности, цена, монетизация.** Public verified badges/profile and career sharing ✓; learning/practice/projects/competition/AI tutor are outside core. Earner account and mobile app **$0**; issuer pricing public numeric not confirmed, **custom/quote**. B2B issuer/network services fund platform.
- **Сильные стороны / ограничения / удержание.** Portable verification, structured metadata, issuer identity and easy sharing. It verifies that issuer made an assertion, not that underlying assessment was rigorous; badge inflation and issuer quality remain. Удерживают credential wallet, sharing, recommendations and accumulated identity.
- **Пробел и решение для Arena — вывод.** Need transparent task version, rubric, raw artifact, assessor and revocation/expiry attached to each badge. Адаптировать Open Badge compatibility and free learner wallet; не копировать badge issuance without public evidence or imply verification equals competency.
- **Источники:** [Credly product](https://info.credly.com/), [Credly FAQ / verification](https://support.credly.com/hc/en-us/articles/5079101828891-Credly-FAQ-s), [mobile app/wallet](https://support.credly.com/hc/en-us/articles/13064089314075-Credly-Mobile-App).

### 32. Accredible

- **Аудитория/позиционирование.** Universities, training providers, associations and employers issuing digital certificates/badges; credential pathways, wallet, verification, sharing and analytics.
- **Loop и форматы.** Provider maps achievement → issues credential → recipient receives free wallet/share page → verifier inspects issuer/criteria/status → learner follows pathway to next credential; provider monitors engagement/analytics.
- **Возможности, цена, монетизация.** Verified public credentials, pathways, integrations and career sharing ✓; learning/tasks/competition/rating/AI tutor are not core. Recipient pays **$0**. Launch starts **$45 USD/month**, 12-month term billed monthly, 50 recipients and unlimited credentials per recipient; Connect/Growth custom. B2B SaaS monetization.
- **Сильные стороны / ограничения / удержание.** Issuance lifecycle, revocable/trackable credential, pathways and many integrations. Blockchain availability does not itself improve assessment validity; marketing completion/engagement outcomes are not independent evidence. Удерживают pathway progression, wallet, share analytics and issuer integrations.
- **Пробел и решение для Arena — вывод.** Arena must own valid assessment/evidence while credential layer transports it. Адаптировать criteria/evidence URL, expiry/revocation and stackable pathway; не копировать blockchain theatre, credential volume pricing logic or completion badge as skill proof.
- **Источники:** [Accredible pricing](https://www.accredible.com/pricing), [higher education / pathways and integrations](https://www.accredible.com/solutions/higher-education).

## Синтез: свободная позиция для Arvexo Arena

### 1. Ни один изученный продукт не замыкает весь цикл

Рынок распадается на пять сильных, но неполных архетипов:

1. **Judge/competition:** Kaggle, LeetCode, HackerRank, Codewars — сильны во внешнем feedback и status, но слабы в guided mastery и широком project transfer.
2. **Course/path:** Coursera, edX, DataCamp, Codecademy, DeepLearning.AI, Educative — хорошо упаковывают контент и progression, но provider completion/certificate редко раскрывает реальное evidence.
3. **Project/sandbox:** Hyperskill, Dataquest, LabEx, GitHub Skills, fast.ai, Hugging Face — создают artifacts, но не всегда дают independent rating, review и career verification.
4. **Habit/tutor:** Duolingo, Brilliant, Khanmigo, Kodie, Mimo, ChatGPT Study Mode — снижают friction и удерживают, но activity/AI dialogue не равны доказанному навыку.
5. **Credential rail:** Credly, Accredible — хорошо транспортируют assertion, но не создают валидность underlying task.

**White space — вывод:** единый путь `диагностика → короткое обучение → самостоятельная задача → grounded AI coaching → reproducible submission → benchmark + rubric + review/defense → public evidence credential → релевантная следующая задача`. В выборке нет продукта, который убедительно совмещает все звенья и явно разделяет обучение, соревнование и аттестацию.

### 2. Что должно стать единицей ценности

Completion, XP, streak, badge и один leaderboard score недостаточны. Более сильная evidence ladder:

`просмотрел материал < прошёл закрытую задачу < создал воспроизводимый artifact < достиг benchmark на unseen/private data < объяснил решения < прошёл rubric review < получил versioned verified credential`.

Для каждой Arena submission полезно сохранять dataset/task version, environment, commit/code, metric и uncertainty, model/data card, AI-use disclosure, reviewer/rubric, resubmission history и постоянную verification URL. Rating лучше разделить на **skill dimensions** (data, modeling, engineering, reasoning, communication), **competition performance** и **community contribution**; Codewars показывает ценность разделения rank и Honor, а Kaggle — риск превращения одного leaderboard в универсальный skill signal.

### 3. Какие механики адаптировать

- Из Kaggle — reproducible submission, public/private evaluation, team work и post-event solution review; добавить novice cohorts и competency rubric.
- Из Hyperskill/Udacity/Dataquest — проект по этапам, review-resubmit loop и artifact milestones; первый meaningful project должен появляться рано.
- Из Khan/CodeSignal — diagnostic skill graph и personalized next action, но score должен быть explainable.
- Из Brilliant/Duolingo — короткая ежедневная сессия, Socratic hints, social quest и forgiving streak; награда должна продвигать artifact, а не только счётчик активности.
- Из GitHub Skills/Hugging Face — работа в настоящем workflow и portable public artifact.
- Из Credly/Accredible/freeCodeCamp — stackable credentials с criteria/evidence URL, expiry/revocation и бесплатным learner verification.
- Из ChatGPT Study Mode/Khanmigo — tutor, который спрашивает уровень и ведёт рассуждение; для Arena он должен быть grounded в конкретных task/data/rubric и выключен либо раскрыт в summative assessment.

### 4. Чего не копировать

- Paywall до первого реального project outcome, punitive limits на ошибки/hearts и непрозрачные checkout prices.
- Глобальную лигу, где novice конкурирует с expert, XP/streak как skill score или course completion как professional certification.
- AI, который незаметно пишет assessed solution; marketing claim «real company question» без provenance; badge без evidence.
- Огромный catalog как substitute для curated path, многосотчасовой первый credential и employer-facing score без объяснимой рубрики.

### 5. Retention, совместимый с обучением

Наиболее здоровый compounding loop — не «вернись ради streak», а `следующая маленькая задача улучшает долгоживущий проект → улучшенный artifact повышает competency profile → profile открывает более релевантную команду/соревнование/карьерную возможность`. Streak, league и notification допустимы как вспомогательный слой; главный возвращающий объект — незавершённый meaningful artifact, peer obligation, scheduled review и новая observable capability.

## Реестр источников и надёжности

**Шкала.** `A` — текущая официальная product/help/pricing page: первична для объявленной функции/цены, но не для эффективности. `B` — официальный, но старый, динамически неполный, внутренне противоречивый или self-comparison source. `M` — численное/результативное marketing claim: фиксируется только как заявление провайдера. Все URL проверены **20.07.2026**, если в строке не указана отдельная дата публикации/обновления. Независимые outcome claims в выводы не переносились.

| № | Продукт | Ключевые первичные источники | Дата/класс | Что подтверждает и оговорка |
|---:|---|---|---|---|
| 1 | Kaggle | [Competitions](https://www.kaggle.com/competitions), [datasets](https://www.kaggle.com/datasets/), [sponsor deck](https://www.kaggle.com/static/slides/meetkaggle.pdf) | live A; deck Feb-2025 B/M | Механика и ecosystem — A; 25M+ users и sponsor examples — собственная презентация. |
| 2 | LeetCode | [Premium pricing](https://leetcode.com/subscribe/), [Study Plans](https://leetcode.com/studyplan/), [Premium features](https://support.leetcode.com/hc/en-us/articles/360011884094-What-will-I-get-with-a-premium-subscription) | live A | $35/$159 и функции; не доказывает hiring effect. |
| 3 | HackerRank | [Community/product](https://www.hackerrank.com/), [Work pricing](https://www.hackerrank.com/work/pricing), [Mock Interview](https://help.hackerrank.com/articles/8988753946-introduction-to-mock-interview) | live A; help updated 22.04.2026 A | Practice/AI/hiring и B2B цены; community scale — M. |
| 4 | Codewars | [Red pricing](https://www.codewars.com/subscription), [Honor](https://docs.codewars.com/gamification/honor), [Ranks](https://docs.codewars.com/gamification/ranks) | live A | Тариф и разделение activity Honor/skill rank. |
| 5 | Exercism | [Tracks](https://exercism.org/docs/building/product/tracks), [unlocking](https://exercism.org/docs/building/product/unlocking-exercises), [mentoring](https://exercism.org/docs/using/feedback/guide-to-being-mentored) | live A; track count M | Free model, exercises и честные ограничения volunteer mentoring. |
| 6 | Coursera | [Plus pricing](https://www.coursera.org/courseraplus), [terms](https://www.coursera.org/about/terms), [Coach](https://blog.coursera.org/coursera-coach-leveraging-genai-to-empower-learners/) | live/local A; terms effective 01.01.2026 A; blog A/M | €50/€343 только для показанной локали; Coach functions official; outcomes/self metrics — M. |
| 7 | edX | [How it works / audit vs verified](https://www.edx.org/about-us/how-it-works) | live A | Audit $0 и verified примерно от $50; конкретный course price varies. |
| 8 | Udacity | [Plans](https://www.udacity.com/plans), [checkout help](https://support.udacity.com/hc/en-us/articles/26727182855693-Checkout-Process), [2023 All Access post](https://www.udacity.com/blog/your-udacity-all-access-questions-answered/) | live A for features; 2023 B | Current numeric price скрыта; $249/$846 приведены только как historical, не current. |
| 9 | DataCamp | [Main pricing](https://www.datacamp.com/pricing), [B2C pricing](https://www.datacamp.com/pricing/b2c), [plans help](https://support.datacamp.com/hc/en-us/articles/360011266593-DataCamp-Learn-Subscription-Plans-An-Overview) | live B; help updated 16.06.2026 A | Official price conflict $14 vs $27.50 annual effective; catalog counts — M. |
| 10 | Codecademy | [Pricing/features](https://www.codecademy.com/pricing), [pricing help](https://help.codecademy.com/hc/en-us/articles/360022052834-Price-of-Codecademy) | live A | Free/Plus/Pro price and feature gates. |
| 11 | freeCodeCamp | [About](https://opensource.freecodecamp.org/about/), [curriculum formats](https://contribute.freecodecamp.org/how-to-work-on-coding-challenges/), [credential redesign](https://forum.freecodecamp.org/t/introducing-new-freecodecamp-certifications/762070) | live A; founder post 2025 A | 100% free and stackable credential decision; audience/outcome scale — M. |
| 12 | Khan Academy | [Approach](https://www.khanacademy.org/about/our-approach), [Khanmigo plans](https://support.khanacademy.org/hc/en-us/articles/25921448458893-What-features-are-available-in-the-Learner-Parent-and-Teacher-Khanmigo-subscription-plans), [schools pricing](https://www.khanacademy.org/schools/pricing) | live A; Khanmigo help Mar-2025 B | Mastery/school price current; $4 Khanmigo medium freshness and US-only. |
| 13 | Brilliant | [Free limits](https://brilliant.org/help/using-brilliant/what-can-i-learn-on-brilliant-without-a-premium-subscription/), [streak](https://brilliant.org/help/features/what-is-a-streak/), [XP](https://brilliant.org/help/features/what-is-xp/) | updated May–Jun 2026 A | Free limits and retention mechanics; numeric Premium price remains unknown. |
| 14 | Duolingo | [Max](https://blog.duolingo.com/duolingo-max/), [product loop](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/), [streak experiment](https://blog.duolingo.com/improving-the-streak/) | official blog A; experiment M | Functions are primary product evidence; retention uplift is internal/self-reported. |
| 15 | Hyperskill | [Pricing](https://hyperskill.org/pricing), [free limits](https://support.hyperskill.org/hc/en-us/articles/16378065753236-Subscription-plans), [guide](https://hyperskill.org/guide) | live A | EUR prices, limits, projects/IDE/AI. |
| 16 | StrataScratch | [Product](https://www.stratascratch.com/), [FAQ/contact](https://www.stratascratch.com/contact-us), [about](https://www.stratascratch.com/about) | live A/M; about B | Feature existence A; 1,000+/«real interview» M; price unknown, 50-free statement may be older. |
| 17 | Interview Query | [FAQ](https://www.interviewquery.com/p/faq), [official comparison](https://www.interviewquery.com/p/data-interview), [study plans](https://www.interviewquery.com/p/interview-study-plans) | published 27.03.2026 B/M | Price triangulated across official pages; FAQ annual line contains typo; counts/results — M. |
| 18 | DeepLearning.AI | [Membership](https://learn.deeplearning.ai/membership) | live A/M | $0/$50/$300 and gates A; 150+ catalog count M. |
| 19 | fast.ai | [Course](https://course.fast.ai/) | course version 2022 A/B | Official syllabus/free status; current pedagogical effectiveness not inferred. |
| 20 | Hugging Face | [Learn catalog](https://huggingface.co/learn), [LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | live A | Free/prereqs/artifact loop; certification state ambiguous across pages. |
| 21 | Google MLCC | [Course](https://developers.google.com/machine-learning/crash-course), [prerequisites](https://developers.google.com/machine-learning/crash-course/prereqs-and-prework) | live A | Current modules, Colab format and prerequisites. |
| 22 | CodeSignal | [Pricing](https://codesignal.com/pricing), [practice help](https://support.codesignal.com/hc/en-us/articles/21025134150423-How-do-I-practice-coding-questions-on-CodeSignal), [Academy FAQ](https://support.codesignal.com/hc/en-us/articles/41329274118167-Learn-Academy-FAQ-for-Learners) | live A; 16.07/18.06.2026 A | Cosmo+/B2B prices, practice and learner path. |
| 23 | Dataquest | [official comparison](https://www.dataquest.io/blog/dataquest-vs-datacamp/), [March 2026 challenge](https://support.dataquest.io/en/articles/853-dataquest-march-madness-challenge-2026) | 2026 B/M | Own blog supplies price/features because checkout unavailable; superiority/outcomes not accepted. |
| 24 | Educative | [Plans](https://www.educative.io/unlimited), [checkout](https://www.educative.io/checkout/subscription-buy?plan=200-12-6000), [business pricing](https://www.educative.io/enterprise-pricing) | live A/M; checkout seen 16.07.2026 | Promo/renewal and feature gates; 1,700+ is marketing count. |
| 25 | Scrimba | [Pricing redirect](https://scrimba.com/pricing), [official comparison](https://scrimba.com/articles/scrimba-vs-udemy-for-learning-to-code-which-platform-is-right-for-you/) | 2026 B/M | Price/features from self-comparison, not readable checkout; outcomes not inferred. |
| 26 | Sololearn | [Learn catalog](https://www.sololearn.com/en/Learn/), [Kodie](https://www.sololearn.com/en/learn-with-ai) | live A/M | AI and product formats A; audience/catalog superlatives M; price unknown. |
| 27 | Mimo | [Plans](https://mimo.org/pro), [official price article](https://mimo.org/blog/coding-apps-for-beginners), [Python path](https://mimo.org/blog/best-python-courses-for-beginners) | live A for gates; 08.01.2026 B/M | Numeric price only own article, not live checkout; project counts M. |
| 28 | LabEx | [Pricing](https://labex.io/pricing), [welcome](https://support.labex.io/en/using-labex/welcome), [exercises](https://labex.io/exercises) | live A/M | Current price/free VM limit; 6,000+/2,000+ are catalog claims. |
| 29 | GitHub | [Skills](https://github.com/skills), [Copilot plans](https://github.com/features/copilot/plans), [Student](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students) | live A | Repo learning loop and current plan limits/prices. |
| 30 | ChatGPT Study Mode | [announcement](https://openai.com/index/chatgpt-study-mode/), [FAQ](https://help.openai.com/en/articles/11780217-chatgpt-study-mode-faq) | 29.07.2025 A; FAQ updated Jul-2026 A | Features/all-plan access; official limitations explicitly retained. |
| 31 | Credly | [Product](https://info.credly.com/), [verification FAQ](https://support.credly.com/hc/en-us/articles/5079101828891-Credly-FAQ-s) | live A/M | Free earner verification and metadata; network/value claims M; issuer price unknown. |
| 32 | Accredible | [Pricing](https://www.accredible.com/pricing), [pathways/integrations](https://www.accredible.com/solutions/higher-education) | live A/M | $45 starting plan and credential features; completion uplift/case outcomes M. |

## Проверяемые ограничения исследования

- Это feature/positioning audit, не usability test и не cohort outcome study. Официальные sources систематически завышают salience сильных сторон и редко публикуют churn, completion quality, false-positive assessment или hiring conversion.
- `—` в матрице означает «не подтверждено изученными официальными источниками», а не доказанное отсутствие.
- Dynamic/region/app-store prices особенно нестабильны; перед финансовой моделью нужны checkout captures для целевых стран. Не подтверждены current numeric prices Udacity, Brilliant, Duolingo, StrataScratch, Sololearn и issuer pricing Credly; DataCamp содержит официальный конфликт.
- Каталожные размеры, audience numbers, «real company questions», learner outcomes и vendor comparisons отмечены `M`; они не используются как доказательство product-market fit.
- Следующий validation layer для продукта: 12–20 интервью с learners/hiring managers, 5–8 task-based usability tests конкурентов и проверка public artifacts/credentials реальными reviewers.
