# Этап 1 — провалы EdTech, низкое удержание и конфликт обучения с развлечением

Дата проверки: 20 июля 2026 года. Здесь «провал» не означает, что вся педагогическая идея была бесполезна. Различаются: финансовая реструктуризация, закрытие продукта, регуляторное нарушение, стратегический pivot, прекращение функции и низкий educational outcome.

## Краткий вывод

Уверенность: **высокая** в самом паттерне, **средняя** в переносе на Arena.

Повторяющиеся причины неудач — не «слишком мало функций», а разрыв между обещанием и проверяемым результатом, дорогая/долговая модель роста, отсутствие повторяемой дистрибуции, низкое доверие к данным, неясный unit of value и метрики активности вместо обучения. Для Arena особенно опасна комбинация: бесплатный широкий каталог + дорогой AI Coach + недоказанное portfolio promise + публичные данные несовершеннолетних.

## 1. Классификация кейсов

| Кейс | Подтверждённое событие | Чего источник не доказывает | Урок для Arena | Уверенность |
|---|---|---|---|---|
| 2U / edX | 2U прошла Chapter 11 в 2024 году и вышла после реструктуризации как private company; судебные документы подтверждают процесс | что MOOCs или edX педагогически неэффективны; единственную причину банкротства | нельзя субсидировать неопределённый B2C outcome сложным долгом/ростом; следить за contribution margin по продукту | высокая |
| BYJU'S | индийские судебные документы подтверждают insolvency proceedings по отдельным сущностям группы | единый простой causal story про рекламу или качество уроков; текущий статус всех юрлиц | aggressive growth, acquisition sprawl и opaque governance — отдельные риски; не переносить непроверенные обвинения как факт | средняя |
| BloomTech / Lambda School | CFPB установил deceptive financing и placement claims; публично звучало до 86%, внутренние показатели были ближе к 50% и иногда 30% | что все bootcamps не создают ценности | career outcome требует зафиксированных когорт, знаменателя, аудита и запрета гарантии найма | высокая |
| Career Step | FTC добилась более $15,5 млн компенсаций за deceptive job-placement/employer-partnership claims | точный learning effect программы | employer logos/partnerships нельзя превращать в обещание найма; incentivized reviews нужно раскрывать | высокая |
| inBloom | проект закрылся после потери партнёров и законодательных ограничений на фоне опасений о student-data privacy | что система была взломана или технически небезопасна | для несовершеннолетних perceived trust и consent — продуктовая зависимость, а не legal afterthought | высокая для события, средняя для причин |
| AltSchool → Altitude Learning | сеть школ и затем software были проданы; модель совмещала собственные школы, персонализацию и SaaS | какой один фактор определил исход | нельзя одновременно строить школу, marketplace, LMS, AI tutor и social graph; выбрать одну operating model | средняя |
| Edmodo | сервис закрылся в сентябре 2022 года; компания сообщила, что поддерживать должный уровень сервиса стало нежизнеспособно | детальную финансовую причинность | большая зарегистрированная база без устойчивой economics/ownership не является moat; нужен экспорт данных и exit plan | высокая для события |
| Knewton | Wiley купила assets Knewton в 2019 году за нераскрытую сумму | банкротство или неэффективность adaptive learning | «персонализация» — capability, не самостоятельный JTBD и не доказанная бизнес-модель | высокая для сделки, низкая для оценки провала |
| Udacity | Accenture приобрела Udacity в 2024 году и встроила в LearnVantage | что B2C-модель провалилась или что качество курсов низкое | enterprise distribution может оказаться устойчивее standalone paid content; acquisition — сигнал консолидации, не failure verdict | высокая для сделки |
| Quizlet Q-Chat | официальный сайт указывает, что Q-Chat недоступен с июня 2025 года | причину закрытия, economics или learning effect | нельзя делать core loop зависимым от экспериментальной AI-функции/одного провайдера без fallback и sunset policy | высокая для sunset |
| Массовые MOOCs | обзоры регулярно находят низкий nominal completion; часто приводится диапазон 3–15% | что 85–97% учеников «провалили обучение»: многие только исследуют материал и не намерены завершать | четыре знаменателя (`registered`, `started`, `activated`, `committed`) вместо одной completion rate | средняя/высокая |
| Публичные leaderboard/points | систематические обзоры находят смешанные эффекты; badges, leaderboards, competition и points чаще других элементов связаны с отрицательными эффектами | что любая геймификация вредна | измерять learning отдельно; давать relative/personal/team views; не связывать доступ/ценность с абсолютным местом | средняя |

## 2. Разбор сильнейших предупреждений

### 2.1 2U: масштаб и престижные партнёры не заменяют устойчивую экономику

**Факт.** 2U/edX прошла судебную реструктуризацию Chapter 11; после неё компания заявила об укреплении баланса. [SEC/court exhibit](https://www.sec.gov/Archives/edgar/data/1459417/000119312524216174/d897024dex991.htm), [сообщение 2U](https://2u.com/newsroom/2u-successfully-completes-transaction/).

**Осторожный вывод.** Партнёрства с университетами и большая библиотека не защищают от mismatch между обязательствами, ценой привлечения/обслуживания и денежным потоком. Это не приговор marketplace университетских программ.

**Arena-механизм контроля:** до инвестиций в B2B2C фиксировать валовую маржу каждой когорты, часы поддержки/проверки, payback, renewal и долю revenue, зависящую от одного партнёра.

### 2.2 BloomTech и Career Step: career promise становится регулируемым доказательством

**Факт.** CFPB установил deceptive statements BloomTech о nature/cost income-share agreements и placement rates; FTC отдельно выявила misleading job-placement/employer-partnership advertising Career Step. [CFPB](https://www.consumerfinance.gov/archive/newsroom/cfpb-takes-action-against-coding-boot-camp-bloomtech-and-ceo-austen-allred-for-deceiving-students-and-hiding-loan-costs/), [FTC](https://www.ftc.gov/news-events/news/press-releases/2025/03/ftc-sends-more-155-million-refunds-consumers-affected-career-steps-deceptive-job-placement-employer).

**Вывод.** Фраза «путь к первой ML-стажировке» допустима как программа подготовки, но placement claim появляется, как только Arena сообщает процент нанятых или показывает employer logo как гарантию.

**Минимальный стандарт Arena:**

- заранее опубликованное определение `eligible graduate`, `job seeking`, `placed`, role relevance и периода наблюдения;
- все исключения из знаменателя видимы;
- независимая выборочная проверка;
- salary и placement не показываются без размера выборки/медианы/диапазона;
- никакого обещания поступления, победы или трудоустройства.

### 2.3 inBloom: для продукта несовершеннолетних доверие предшествует персонализации

**Факт.** После privacy backlash, потери партнёров и ограничивающего законодательства Нью-Йорка inBloom прекратил работу. [Education Week](https://www.edweek.org/technology/inbloom-to-shut-down-amid-growing-data-privacy-concerns/2014/04).

**Вывод.** Даже защищённая система может потерпеть продуктовый провал, если родители/школы не понимают: какие данные собираются, зачем, кто их получает и как удалить.

**Arena-механизм контроля:** private-by-default; возраст/согласие; отдельная видимость каждого артефакта; data map человеческим языком; экспорт/удаление; никакого публичного exact school/расписания/контакта; AI training opt-in отдельно от service processing.

### 2.4 AltSchool: ширина operating model сжигает фокус

AltSchool одновременно строила сеть экспериментальных школ и software; позднее школы и технология были проданы. [EdSurge](https://www.edsurge.com/news/2021-01-15-the-edtech-company-formerly-known-as-altschool-sold-its-tech-so-what-s-left).

Перенос на Arena — **вывод, а не доказанный факт**: Learn + Arena + Labs + Projects + Portfolio + Opportunities + AI Coach — это шесть продуктов и минимум три разные operating models. На раннем этапе общая архитектурная совместимость разумна, параллельное строительство — нет.

### 2.5 Edmodo: user count не равен defensibility

Компания закрыла сервис, сославшись на невозможность поддерживать должный уровень. [официальное напоминание](https://www.linkedin.com/posts/edmodo_as-a-reminder-to-all-our-users-we-are-sunsetting-activity-6970457359890489344-UO52), [разбор EdSurge](https://www.edsurge.com/news/2022-08-16-popular-k-12-tool-edmodo-shuts-down).

**Arena-правило:** публичный профиль/портфолио должен быть экспортируемым; пользователь не должен терять доказательства навыков при pivot или закрытии. Long-term trust требует portable artifacts, signed verification metadata и read-only export.

### 2.6 Q-Chat: «AI tutor» — нестабильный feature class

Quizlet запустил Q-Chat в 2023 году; текущая официальная страница сообщает, что с июня 2025 года функция недоступна. [Quizlet](https://quizlet.com/blog/meet-q-chat).

**Неизвестно:** публичный источник не раскрывает, что решило судьбу продукта — learning quality, cost, usage, strategy, safety или provider dependency.

**Arena-правило:** AI Coach не должен быть обязательным для прохождения; контент/assessment доступны без него; prompt/model/version логируются; существует deterministic hint fallback; sunset не уничтожает историю mastery.

## 3. Почему пользователи не заканчивают онлайн-обучение

Систематические обзоры выделяют сочетание факторов, а не один универсальный dropout cause: неясное намерение при регистрации, слабая self-regulation, нехватка времени, несоответствие уровня, язык/technology barriers, плохая структура курса, отсутствие meaningful interaction, низкая relevance и отсутствие своевременной поддержки. [обзор motivation/retention](https://link.springer.com/article/10.1186/s41039-022-00181-3), [обзор engagement/dropout](https://www.sciencedirect.com/science/article/pii/S2405844023024271), [обзор social interaction](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1345205/full).

| Причина | Ранний сигнал | Проверяемое вмешательство Arena | Guardrail |
|---|---|---|---|
| Регистрация без намерения пройти | много signups, мало первых содержательных действий | спросить goal/commitment; отдельный explore mode | не считать explore-пользователей dropout |
| Слишком долгий time-to-value | выход до первой задачи | diagnostic → первая переносная задача ≤10 минут | задача не должна быть тривиальной ради activation |
| Несоответствие уровня | серия случайных ошибок или идеальных ответов | короткий adaptive diagnostic и выбор точки входа | возможность оспорить placement |
| Нехватка времени | пропуски после длинных сессий | 20–30 минут core task + resumable state | не дробить смысл на пустые клики |
| Слабая self-regulation | открытие материалов без retrieval/practice | weekly plan, implementation intention, error queue | напоминания opt-in, без shame |
| Низкая relevance | чтение без проекта/transfer | артефакт на каждом milestone | проект не подменяет deliberate subskill practice |
| Неясная ошибка | повторы одного misconception | error taxonomy + targeted worked example + retry variant | не раскрывать ответ до попытки |
| Isolation | исчезновение после первых затруднений | small cohort office hour / peer explanation | moderation и safe contact minors |
| Технический friction | падения на upload/environment | browser-based baseline, preflight | не снижать real-skill validity чрезмерно |
| Нет внешнего outcome | завершение модулей без применения | employer/olympiad-shaped capstone | не обещать признание до blind validation |

## 4. Когда геймификация проваливается

Доказательства неоднородны: meta-analysis в среднем может находить положительный эффект, но systematic mapping отрицательных эффектов чаще связывает проблемы с badges, leaderboards, competitions и points; типовые эффекты — отсутствие эффекта, ухудшение performance, motivational issues, непонимание и irrelevance. [negative-effects mapping](https://arxiv.org/abs/2305.08346), [online-learning review](https://doi.org/10.3390/informatics6030032), [meta-analysis](https://pubmed.ncbi.nlm.nih.gov/37876838/).

### Failure patterns

1. **Очки заменяют цель.** Оптимальная стратегия ученика — повторять дешёвые действия, а не решать transfer task.
2. **Leaderboard показывает фиксированную неспособность.** Нижние 80% видят недостижимый gap и прекращают попытки.
3. **Скорость конфликтует с глубиной.** Тайбрейкер по времени наказывает объяснение, проверку и рефлексию.
4. **Streak превращает пропуск в потерю идентичности.** После разрыва серии recovery cost становится выше ценности следующей сессии.
5. **Награда выдаётся за exposure.** Просмотр урока получает тот же статус, что delayed transfer.
6. **Pay-to-win.** Freeze, подсказки, дополнительные попытки или рейтинг продаются.
7. **Соревнование без readiness bands.** Новичок сравнивается с олимпиадником.
8. **Публичность по умолчанию.** Слабый результат несовершеннолетнего становится social penalty.
9. **Сезон обнуляет смысл.** Рейтинг сброшен без сохранения evidence/mastery.
10. **Внешняя награда вытесняет интерес.** Исследование превращается в checklist ради badge.

### Design constraints Arena

- XP только за effort/completion, никогда не называется навыком.
- Mastery определяется отдельными assessment evidence: unseen task, delayed retention, transfer и объяснение.
- Tournament rating имеет uncertainty, season/context и не конвертируется в mastery автоматически.
- Default leaderboard — local/nearby или readiness band; global top доступен отдельно.
- Статус можно скрыть; публичность несовершеннолетних — opt-in/consent.
- Streak допускает grace/recovery и измеряет meaningful session, а не login.
- Платёж не улучшает score, место, число ranked attempts или verification level.
- Retention experiment считается успешным только при non-inferior learning gain.

## 5. Конфликт образования и развлечения

Развлечение полезно, если удерживает внимание на **той же когнитивной операции**, которую нужно освоить. Оно вредно, если создаёт более простой замещающий loop.

| Механика | Полезное выравнивание | Конфликт |
|---|---|---|
| Турнир | unseen задачи требуют retrieval, diagnosis и transfer | скорость/угадывание важнее reasoning; один банк заучивается |
| XP | сигнализирует effort и открывает косметические элементы | пользователь фармит лёгкие повторы; XP выдаётся за правильность |
| Streak | напоминает о распределённой практике | минимальный клик сохраняет серию; пропуск вызывает churn |
| AI Coach | задаёт диагностические вопросы и дозирует hints | выдаёт решение, оптимизирует satisfaction, формирует dependency |
| Проект | интегрирует навыки в проверяемый artifact | копируется шаблон/LLM output без индивидуальной защиты |
| Leaderboard | создаёт bounded challenge среди сопоставимых участников | публично маркирует новичка как слабого |

**Критерий:** если убрать очки/анимацию, остаётся ли действие валидным способом научиться? Если нет, это entertainment layer, а не learning mechanic.

## 6. Checklist перед масштабированием

- Опубликованы определения activation, completion, mastery и career outcome.
- Есть cohort retention 1/4/8 недель и delayed learning retention.
- Измерено, кто проигрывает от leaderboard и подсказок, а не только средний эффект.
- Контент/портфолио экспортируются; есть план закрытия/миграции.
- Privacy/consent понятны родителю и школьному DPO без юридического перевода.
- AI Coach имеет evaluation set, fallback, budget cap и sunset path.
- Нет карьерных процентов без auditable denominator.
- Один narrow loop устойчив до запуска marketplace/social feed.

## 7. Вывод для этапа 1

Наиболее опасный failure mode Arena — **построить правдоподобно выглядящую систему статусов вокруг слабых доказательств обучения**. Она может дать высокий DAU, XP и красивые профили, но не delayed retention, transfer или внешнее доверие. Поэтому любой growth/retention сигнал должен иметь learning guardrail; портфолио запускается только после валидного assessment chain; AI Coach — только после baseline без AI.

