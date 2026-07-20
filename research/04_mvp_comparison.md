# Этап 4A — сравнение семи MVP Arvexo Arena

**Дата решения:** 20 июля 2026 года  
**Статус:** pre-discovery design; сроки, баллы и go/stop thresholds — операционные гипотезы  
**Рекомендуемый вариант:** **M3 — узкая подготовка к первой ML/data-стажировке**, построенная вокруг diagnostic/error-repair/delayed-transfer loop  
**Связанная стратегия:** [04_product_strategy.md](./04_product_strategy.md)

## 1. Как читать сравнение

MVP здесь означает не «самый маленький набор экранов», а минимальный продукт, способный проверить главный риск варианта. Поэтому быстрый quiz/tournament может оказаться менее полезным MVP, если он проверяет только engagement, а не ценность самостоятельной практики.

Все семь обязательных вариантов рассмотрены отдельно:

1. M1 — теоретические AI-турниры;
2. M2 — Python/ML practice;
3. M3 — подготовка к ML-стажировке;
4. M4 — олимпиадная подготовка;
5. M5 — AI-наставник;
6. M6 — verified portfolio;
7. M7 — mini-Kaggle для школьников.

Общие правила:

- success/stop numbers — заранее предложенные decision rules для первого exploratory pilot, не market benchmarks;
- cohort `n=20` проверяет usability, voluntary behavior и instrument failures, но не даёт права на causal learning claim;
- эффективность требует powered active-control study с T14 unseen no-hint outcome, attrition/subgroup audit и preregistration [ES-L01–ES-L54];
- текущие A0 `code_text/code_fix` не исполняют код; MVP с claim о Python/ML coding требует A1 sandbox/hidden tests [S006; CUR-I03];
- XP, rating, tournament score, assisted pass и mastery остаются разными сущностями [ES-G01–ES-G33];
- AI-generated help не входит в high-stakes independent evidence [ES-A01–ES-A45].

## 2. Scoring model

Шкала `1–5`, везде `5` лучше. `L` — leverage текущих assets; `F` — feasibility; `S` — risk controllability. В карточках поле **сложность** использует обычную обратную шкалу `1=низкая, 5=очень высокая`, чтобы не скрывать объём работ.

| Код | Критерий | Вес | Что оценивается |
|---|---|---:|---|
| `D` | Demand/problem evidence | 15% | наблюдаемая срочность и частота проблемы |
| `E` | Learning-validity potential | 15% | способен ли MVP проверить самостоятельный delayed transfer |
| `L` | Current-asset leverage | 10% | сколько можно честно переиспользовать из current product |
| `F` | Implementation feasibility | 15% | ограниченность architecture/content/operations |
| `V` | Time-to-value | 10% | скорость первого содержательного результата |
| `X` | Differentiation | 10% | редкость связки, а не отдельной feature |
| `$` | Monetization plausibility | 8% | есть ли ясный payer/moment of value |
| `R` | Retention mechanism | 8% | естественный повод к повторной meaningful practice |
| `S` | Risk controllability | 9% | integrity, privacy, learning harm, legal и ops risk |

`Score = Σ(raw/5 × weight)`. Балл — prior для последовательности тестов; он не доказывает спрос или эффект.

## 3. Base scorecard

| ID | MVP | D | E | L | F | V | X | $ | R | S | Итог /100 | Решение |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| M3 | Подготовка к ML-стажировке | 5 | 5 | 2 | 3 | 5 | 4 | 4 | 4 | 3 | **79,2** | рекомендовать |
| M1 | Теоретические AI-турниры | 4 | 3 | 5 | 5 | 5 | 2 | 2 | 4 | 3 | **75,0** | fastest fallback / instrument pilot |
| M2 | Python/ML practice | 5 | 4 | 2 | 2 | 4 | 3 | 3 | 5 | 4 | **71,0** | возможный core, слишком широкий label |
| M4 | Олимпиадная подготовка | 4 | 4 | 4 | 3 | 4 | 3 | 3 | 4 | 2 | **69,8** | partner-dependent alternative |
| M6 | Verified portfolio | 4 | 4 | 1 | 2 | 2 | 5 | 4 | 3 | 2 | **60,8** | phase 2 / concierge research |
| M7 | Mini-Kaggle для школьников | 4 | 4 | 2 | 1 | 3 | 2 | 3 | 4 | 2 | **55,8** | defer infrastructure/network |
| M5 | AI-наставник | 3 | 3 | 1 | 2 | 4 | 2 | 2 | 3 | 2 | **49,6** | defer until content truth/static baseline |

M3 выше M1 всего на 4,2 пункта. Это не «победа с высокой точностью»: один raw score ±1 меняет максимум 3 пункта; две совместные ошибки могут перевернуть порядок.

## 4. Sensitivity

Векторы в порядке `D, E, L, F, V, X, $, R, S`: Base `[15,15,10,15,10,10,8,8,9]`; Learning-first `[10,30,5,10,5,10,3,10,17]`; Founder-speed `[5,5,20,25,25,5,5,5,5]`; Revenue-first `[10,10,5,10,5,10,30,15,5]`. Каждый вектор суммируется до 100%.

| Сценарий | Главный сдвиг весов | M1 | M2 | M3 | M4 | M5 | M6 | M7 | Победитель |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Base | §2 | 75,0 | 71,0 | **79,2** | 69,8 | 49,6 | 60,8 | 55,8 | M3 |
| Learning-first | learning 30%, safety 17% | 69,4 | 75,4 | **81,6** | 68,6 | 51,0 | 64,2 | 59,6 | M3 |
| Founder-speed | feasibility/TTV/current leverage 70% вместе | **88,0** | 62,0 | 73,0 | 71,0 | 49,0 | 46,0 | 47,0 | M1 |
| Revenue-first | monetization 30%, retention 15% | 65,0 | 71,0 | **80,0** | 68,0 | 48,0 | 68,0 | 59,0 | M3 |

Leave-one-criterion-out проверка сохраняет M3 первым в восьми из девяти случаев. Если полностью убрать `learning-validity potential`, первым становится M1. Это полезный конфликт целей: **если цель — быстрее показать работающий интерфейс, выбрать M1; если цель — проверить стратегическую гипотезу обучения/карьерной practice, выбрать M3.** Рекомендация M3 основана именно на второй цели.

## 5. Семь MVP: полные карточки по 14 полям

### M1 — Теоретические AI-турниры

1. **Узкая аудитория.** 14–18-летние участники школьного AI/информатического кружка с базовой AI literacy, но без обязательного Python; первая когорта только через взрослого организатора и private-by-default.
2. **Job To Be Done.** «Дай мне короткий безопасный challenge, чтобы понять, какие AI/data concepts я различаю, и что потренировать следующим».
3. **Core loop.** Readiness band → 8–12 committed concept/trace/table tasks → private result → error-family feedback → recovery variants → T14 probe → следующий event.
4. **Функции.** Versioned A0 bank; individual start window; no-answer-before-commit; readiness bands; deterministic scoring; appeal; private personal/error view; optional pseudonymous local standing после завершения; event debrief; T14 queue.
5. **Исключённые функции.** Python execution, live proctoring, global public leaderboard, prize economy, leagues/streak loss, AI Coach, public child profile, claim «турнир подтверждает mastery».
6. **Wow-момент.** Сразу после event участник видит не место, а точную карту двух misconception families и решает новый вариант лучше первого.
7. **Activation.** Первый committed содержательный ответ ≤10 минут после входа; event complete ≤25 минут. Pilot go target: ≥14/20 activated.
8. **Retention.** Один event раз в 1–2 недели + персональный error queue; не daily pressure. Возврат считается meaningful только при новой attempt, не login.
9. **Срок.** **4–6 недель, оценка**, если content truth, bank separation и attempt telemetry исправлены; иначе срок начинается после этих зависимостей.
10. **Сложность.** **2/5 технически, 4/5 контентно:** shell/task types близки к current product, но valid parallel bank/calibration дороже UI.
11. **Первые 20 пользователей.** Две группы по 10 из одного школьного/университетского кружка и existing Arvexo tester network; recruitment через преподавателя, consent/age flow до event.
12. **Критерий успеха.** Exploratory conjunction: ≥14 activate; ≥12 добровольно участвуют во втором event; ≥10 дают T14 data; нижний readiness band не имеет >2× withdrawal относительно верхнего; ни одного severe privacy/integrity incident. Learning efficacy не заявляется.
13. **Критерий остановки.** <8/20 возвращаются во второй event; результат главным образом объясняется speed/guessing; public comparison запрашивают сильные, но он повышает withdrawal слабых; parallel forms не проходят SME/response-process audit.
14. **Главный риск.** Быстрый activity win будет ошибочно принят за доказательство обучения, а «Arena» закрепит leaderboard-first архитектуру [ES-G01–ES-G33].

### M2 — Python/ML practice

1. **Узкая аудитория.** 17–23-летние learners, уже понимающие variables/functions и желающие перейти от видео/notebooks к регулярной самостоятельной practice; без обещания карьерного outcome.
2. **Job To Be Done.** «Дай мне короткие Python/data/ML-задачи с честной проверкой, чтобы я перестал только смотреть решения».
3. **Core loop.** Code/data task → sandbox + hidden tests → error diagnosis → minimal static hint → unseen recovery variant → spaced queue → skill evidence.
4. **Функции.** Один Python sandbox; resource/network limits; hidden tests; 30–45 reusable task instances из 5–7 structural families; committed response; static H1–H4; versioned runner/data; T14 queue; private skill/error map.
5. **Исключённые функции.** Notebooks, SQL и multiple languages одновременно; AI-generated hints; competitions; career claims; public portfolio; cloud deployment; social feed; full C01–C16.
6. **Wow-момент.** Код не просто проходит тесты: после подсказки learner исправляет новый скрытый case без неё и видит, какой invariant теперь удержан.
7. **Activation.** Первый code run ≤10 минут, первый hidden-test diagnosis ≤20 минут; target ≥14/20 complete one valid task.
8. **Retention.** Error queue, weekly mixed set и T14 refresh; no streak penalty. Retention event — new valid task family or delayed probe.
9. **Срок.** **10–14 недель, оценка**, включая runner threat model, quotas, observability и content QA; не включая notebooks/SQL.
10. **Сложность.** **4/5:** sandbox security, deterministic grading, task authoring, version/data leakage и support.
11. **Первые 20 пользователей.** Университетский Python/data club: 10 с базовым курсом, 10 self-taught; одинаковый readiness range подтверждается probe, а не self-report.
12. **Критерий успеха.** ≥14 activate; ≥12 возвращаются на новый family; ≥10 завершают T14; минимум 8 из этих 10 улучшают хотя бы одну заранее заданную rubric dimension на parallel unseen form. Это только сигнал для powered trial, не effect claim; 0 critical sandbox/data incidents.
13. **Критерий остановки.** Runner instability >5% valid sessions после stabilization week; median support >10 минут на completed task; variants сводятся к cosmetic changes; T14 attrition делает result неинтерпретируемым.
14. **Главный риск.** Банк окажется дорогим и неглубоким, а general label не создаст срочного reason-to-start среди бесплатных alternatives [S034–S035].

### M3 — Подготовка к ML-стажировке — рекомендуемый MVP

1. **Узкая аудитория.** Русскоязычные студенты/недавние выпускники 18–23 лет с базовым Python, планирующие подачу на data/ML internship через 3–6 месяцев; исключены zero-to-code и PhD research pipelines.
2. **Job To Be Done.** «Покажи мне конкретный пробел перед первой стажировкой, помоги исправить его самостоятельно и собери честное evidence, которое я могу объяснить reviewer».
3. **Core loop.** Employer-shaped diagnostic → error-family diagnosis → minimal static scaffold → new no-hint variant → T14 unseen transfer → short explanation/change request → private versioned evidence receipt.
4. **Функции.** Goal/date onboarding; readiness gate; ровно 3 competency families (`data/Python debugging`, `split/leakage`, `metric/validation reasoning`); 30–45 versioned instances; один Python runner для первого family и A0 table/graph/trace для остальных; static H1–H4; recovery; T14; one 12–20-min human defense; evidence export; transparent limitations.
5. **Исключённые функции.** Полный zero-to-career curriculum; все specialization branches; AI Coach; job board/matching; placement guarantee; public leaderboard; leagues/XP as access; public portfolio; employer-facing composite score; automated project grading; mobile notebook.
6. **Wow-момент.** Immediate: candidate после diagnosis решает structurally new case no-hint. Culminating: reviewer воспроизводит маленький artifact и видит independent/T14 evidence, assistance и limitations за ≤10 минут.
7. **Activation.** Baseline + первый committed employer-shaped task ≤20 минут. Target ≥14/20; readiness failures получают honest redirect, а не считаются churn.
8. **Retention.** 2 meaningful sessions/week, error queue и milestones `diagnosis → family recovery → T14 → defense`; application deadline задаёт bounded urgency, без daily shame.
9. **Срок.** **10–14 недель, оценка** для concierge-bounded build: 3 families, one runner, thin evidence receipt, manual defense. Employer integration и public verification не входят.
10. **Сложность.** **4/5:** меньше bank breadth, чем M2, но выше требования к validity, career claims, evidence/provenance и human review.
11. **Первые 20 пользователей.** 8 из университетского data/ML клуба, 6 из независимого русскоязычного internship/community канала, 6 через двух преподавателей/alumni; каналы хранятся отдельно для оценки founder-network bias. Дополнительно 8 внешних reviewers, не входящих в learner n.
12. **Критерий успеха.** Для перехода к controlled pilot: ≥14 activate; ≥12 добровольно возвращаются; ≥10 завершают core + T14; ≥8 из 10 показывают улучшение на pre-specified unseen dimensions без hints; ≥6/8 reviewers корректно различают assisted/independent evidence и понимают bundle ≤10 минут; ≥4 refundable paid deposits/time-costly commitments на следующую cohort. Ни один пункт не является employment-effect claim.
13. **Критерий остановки.** <8/20 возвращаются после diagnosis; reviewers не получают signal сверх ordinary repo/task transcript; median authoring+QA остаётся >8 часов на reusable family после третьей family; critical runner/privacy incident; lower-baseline users получают устойчивый negative transfer/withdrawal; positioning систематически воспринимается как placement guarantee.
14. **Главный риск.** Product окажется качественным учебным instrument, но не решит реальный bottleneck candidate (referral, experience, accountability или geography), а external evidence останется непризнанным [S023–S024, S037].

### M4 — Олимпиадная подготовка

1. **Узкая аудитория.** 15–18-летние кандидаты на конкретный AI/data-олимпиадный профиль, уже прошедшие базовый Python/readiness gate; cohort через преподавателя/партнёра.
2. **Job To Be Done.** «Диагностируй мои пробелы относительно конкретного формата и дай targeted задачи чуть выше уровня до следующего этапа».
3. **Core loop.** Anchor diagnostic → readiness band → targeted set → expert debrief → unseen anchor retry → weekly mock event → calibration update.
4. **Функции.** Blueprint конкретного соревнования; expert-authored/versioned bank; anchor items; partial-credit rubric; A0/A1 tasks по реальному формату; appeal; private readiness bands; teacher dashboard; T14 probes.
5. **Исключённые функции.** Claim официального партнёрства без договора; гарантия прохода/льготы; generic «все олимпиады»; global leaderboard; public child profile; live AI solutions; paid extra rated attempts.
6. **Wow-момент.** Learner получает не percentile, а точный readiness gap и через неделю решает новый anchor family, который раньше не мог начать.
7. **Activation.** 20–30-min anchor diagnostic completed; target ≥14/20 valid results, ambiguity/technical failures excluded transparently.
8. **Retention.** 4–6-недельный seasonal cycle, weekly mock + targeted practice; вне сезона — refresh, не искусственный streak.
9. **Срок.** **8–12 недель после** привлечения минимум двух domain SMEs и получения blueprint/rights; calendar season может быть главным constraint.
10. **Сложность.** **3/5 технически, 5/5 content/validity:** current tournament assets полезны, но calibration и expert supply — новая capability.
11. **Первые 20 пользователей.** Два кружка/школы по 10 через преподавателей; один сильный и один mixed-readiness cohort, результаты не объединяются без strata.
12. **Критерий успеха.** ≥14 valid diagnostics; ≥12 возвращаются на weekly mock; ≥10 дают T14; anchor score/diagnosis имеет заранее приемлемую expert agreement; lower band не показывает >2× withdrawal; teacher reports actionable value за ≤15 минут review.
13. **Критерий остановки.** Нет доступа к authentic blueprint/SME; calibration не воспроизводится между forms; teacher workload >30 минут/ученик/неделю; season заканчивается до повторного pilot; marketing требует обещать формальный outcome.
14. **Главный риск.** Без официального контекста и калибровки Arena оптимизирует свой искусственный benchmark, а не олимпиадную готовность [S014, S034–S035].

### M5 — AI-наставник

1. **Узкая аудитория.** Совершеннолетние learners 18–23 лет, уже решающие bounded validation/leakage tasks и регулярно застревающие после первой committed attempt; minors исключены из первого AI pilot.
2. **Job To Be Done.** «Помоги сделать следующий шаг, не выдавая решение и не скрывая, что помощь использовалась».
3. **Core loop.** Committed attempt → deterministic diagnosis candidates → H1–H4 scoped hint → recovery variant no-AI → T14 probe → dependency check.
4. **Функции.** 2–3 bounded competencies; approved content only; policy router; H0–H5 log, но H5 только author-approved static solution; one model behind abstraction; static fallback; prompt/model/task versioning; golden set; cost/latency/safety telemetry; appeal.
5. **Исключённые функции.** Free chat/web, persona/companion, voice/avatar, generative curriculum, autonomous grading/rating, long-term raw memory, career advice, psychological inference, AI cheating detector, public transcripts.
6. **Wow-момент.** Tutor называет проверяемую ошибку и задаёт минимальный вопрос; learner сам исправляет unseen variant, а не просто получает зелёный check.
7. **Activation.** После первой ошибки learner получает допустимый hint и completes recovery ≤15 минут; target ≥12/20 без direct-answer leakage.
8. **Retention.** Не chat streak; возвращение измеряется следующей самостоятельной task/T14. AI availability не должно быть обязательным для learning route.
9. **Срок.** **8–12 недель после content truth и static-hint baseline**, не от текущей даты; включает offline eval, provider abstraction и fallback.
10. **Сложность.** **5/5:** pedagogy, hallucination/leakage, safety/privacy, variable cost, model regressions и causal evaluation.
11. **Первые 20 пользователей.** 20 взрослых из уже прошедшего static-hint practice pilot; stratified by baseline, случайный порядок static/AI conditions для usability, не powered efficacy claim.
12. **Критерий успеха.** 0 critical factual/safety leaks на release golden set; ≥12/20 complete a recovery variant; AI condition не показывает worse descriptive T14 result/burden; provider cost within pre-set session cap. Затем — powered randomized test static vs AI.
13. **Критерий остановки.** Любой unresolved critical answer/safety leakage; >5% direct-solution leakage на adversarial set; static hints дают равный результат при существенно меньшей cost/latency; assistance data ошибочно попадает в independent mastery.
14. **Главный риск.** Удовлетворённость и current-task completion вырастут, а самостоятельный T14 transfer снизится; generic assistants обнулят differentiation [ES-A01–ES-A45].

### M6 — Verified portfolio

1. **Узкая аудитория.** Совершеннолетние internship candidates с уже существующим end-to-end ML/data project, tests/repo и готовностью к blind reproduction/change request.
2. **Job To Be Done.** «Сделай мой процесс и самостоятельность понятными внешнему reviewer, не превращая это в непрозрачный talent score».
3. **Core loop.** Import artifact → provenance/schema check → clean reproduction → rubric review → oral/change defense → appeal/adjudication → signed versioned evidence receipt.
4. **Функции.** Private artifact intake; task/data/code hashes; reproducible command; tests/CI evidence; assistance declaration; reviewer rubric/conflict; 12–20-min defense; change request; version/revocation; granular public fields for adults; export.
5. **Исключённые функции.** Job marketplace; employer ranking; composite employability score; automated authorship/lie detection; LLM-only grading; popularity/likes; public-by-default minors; salary/placement claims.
6. **Wow-момент.** Independent reviewer reproduces exact claimed result and candidate implements a small unseen change live; receipt shows both without exposing private transcript.
7. **Activation.** Existing repo passes preflight or receives actionable missing-evidence list ≤15 минут; target ≥16/20 complete intake/preflight.
8. **Retention.** Artifact milestones/version refresh, not daily use; expected lower frequency is acceptable if trust/value is high.
9. **Срок.** **8–12 недель, оценка** for concierge workflow + thin registry; scalable runner/reviewer marketplace is explicitly outside MVP.
10. **Сложность.** **5/5:** reproducibility across environments, reviewer operations/bias, privacy/licensing, appeals and trust bootstrapping.
11. **Первые 20 пользователей.** 10 projects from Arena/partner learners and 10 external GitHub/Kaggle-style projects; 8–15 reviewers across product/research/data roles, blinded to source group.
12. **Критерий успеха.** ≥16/20 complete preflight; ≥12 artifacts are reproducible or fail with a specific auditable reason; pilot reviewer reliability reaches pre-set `κ/ICC≈0,7` starting threshold; ≥6/8 core reviewers understand evidence ≤10 минут and report decision-relevant incremental information. Threshold требует дальнейшей validity work.
13. **Критерий остановки.** Reviewer cannot distinguish bundle from polished presentation; reliability remains <0,5 after rubric revision; median human cost >60 минут/artifact without payer; privacy/license prevents useful publication; change request does not add authorship/transfer signal.
14. **Главный риск.** Verification theatre: красивый tamper-evident receipt фиксирует данные, но не доказывает authorship, workplace performance или employer acceptance [CUR-L01–CUR-A01; S037].

### M7 — Mini-Kaggle для школьников

1. **Узкая аудитория.** 15–17-летние школьники с базовым Python/pandas в одном teacher-led cohort; одна безопасная предметная область и dataset с проверенными правами.
2. **Job To Be Done.** «Дай настоящий data challenge, в который я могу войти с baseline и понять, почему моя модель обобщается или ломается».
3. **Core loop.** Guided baseline → local experiment → capped submission → hidden holdout feedback → slice/leakage diagnosis → new submission → postmortem + individual defense.
4. **Функции.** One versioned dataset; data card/license; starter baseline; sandbox/notebook or controlled submission; public/private split + hidden shift; capped submissions; readiness bands; private class board; reproducibility check; individual explanation; teacher moderation.
5. **Исключённые функции.** Open global hosting; cash prizes; unrestricted datasets/uploads; unlimited submissions; public child identities; team score without individual evidence; live AI solution generation; multiple competitions; sponsor marketplace.
6. **Wow-момент.** Public-score improvement не является wow; wow — learner обнаруживает leakage/shift, меняет validation и видит, что hidden result теперь соответствует local reasoning.
7. **Activation.** Baseline submission ≤30 минут после preflight; target ≥14/20, при этом copied starter без explanation не считается activated learning.
8. **Retention.** 3–4-week challenge with capped iteration and debrief; no perpetual leaderboard. Individual T14 case after event checks transfer.
9. **Срок.** **12–16 недель, оценка** для secure minimal runner, dataset pipeline, holdout, submission limits, moderation и school privacy; sponsor/network scale excluded.
10. **Сложность.** **5/5:** compute/security, leakage, data rights, calibration, participant liquidity, team integrity и child safety.
11. **Первые 20 пользователей.** Один школьный кружок или два класса по 10 under one teacher owner; guardian/consent/legal basis и device/access audit before launch.
12. **Критерий успеха.** ≥14 valid baseline submissions; ≥12 make a reasoned second submission; ≥10 complete postmortem + T14 individual case; local/hidden gap shrinks for reasons confirmed in explanation; lower readiness band does not have >2× withdrawal; 0 data/privacy incidents.
13. **Критерий остановки.** Score gains explained by submission probing/copied code; hidden set compromised; teacher moderation >3 hours/week for 20; device/access gap excludes a subgroup; no dataset rights; leaderboard worsens wellbeing/cheating signals.
14. **Главный риск.** Product reproduces Kaggle's entry cliff and leaderboard optimization at smaller scale while bearing child/privacy and infrastructure risk [S025, S034–S035, ES-G01–ES-G33].

## 6. Почему M3, если M1 быстрее

M1 имеет реальное преимущество: он ближе к current assets и может проверить bank separation, committed attempts, error taxonomy, private results и T14 scheduling. Но сам по себе он слабо проверяет выбранный career JTBD, coding practice и external evidence value.

Поэтому разумная последовательность не равна запуску двух продуктов:

1. **Instrument slice внутри M3:** использовать M1-подобные A0 trace/table/validation tasks без публичного турнирного positioning, чтобы проверить diagnosis/recovery/T14.
2. **Coding gate:** добавить один безопасный Python runner и только один data/debug family; до этого говорить «reasoning diagnostic», не «coding readiness».
3. **Evidence gate:** thin private receipt + concierge reviewer test; не public portfolio.
4. **Только после результатов:** решить, усиливать ли M3 широким M2 bank, M6 verification или M4/P10 events.

Иными словами, M1 — хороший **implementation slice**, но M3 — более информативный **market/learning MVP**.

## 7. Build / concierge / defer для M3

| Build now | Concierge/manual | Defer |
|---|---|---|
| versioned 3-family bank; committed response; exposure/assistance log; static hint ladder; recovery variants; T14 queue; private evidence receipt; one bounded runner | readiness review; misconception adjudication; 12–20-min defense; reviewer comparison; artifact reproduction; payment/deposit test | AI Coach; open notebooks/uploads; tournaments/rating; public portfolio; employer dashboard; job matching; leagues/streak; multi-language runners; all 16 modules |

Эта граница сохраняет proposed wedge и одновременно не выдаёт будущую платформу за MVP.

## 8. Критические зависимости и kill order

| Порядок | Зависимость | Почему блокирует | Kill signal |
|---:|---|---|---|
| 1 | Content truth + separate banks | без этого unseen/transfer недостоверны | duplicate/exposed variants нельзя устранить |
| 2 | Instrument validity | плохой item превращает diagnosis в noise | SME disagreement/response-process failure |
| 3 | Voluntary return after diagnosis | проверяет реальную value, не signup curiosity | <8/20 return |
| 4 | Static scaffold + recovery | baseline перед AI и honest independence | assisted pass не предсказывает recovery |
| 5 | T14 follow-up | отделяет immediate performance | differential attrition/invalid parallel form |
| 6 | Runner security/reliability | нужен только для coding claim | critical incident или >5% invalid sessions |
| 7 | Reviewer incremental value | нужен для evidence positioning | no time/decision/reliability gain |
| 8 | Payment/commitment | нужен перед масштабом content | interest без deposit/time commitment |

Если зависимость не проходит, следующую дорогую capability не строить. Особенно: не добавлять LLM, portfolio marketplace или competitions поверх невалидного task bank.

## 9. Self-audit

- [x] Есть ровно семь обязательных MVP и ни один не подменён гибридом.
- [x] В каждой карточке ровно 14 нумерованных обязательных полей: narrow audience, JTBD, loop, functions, exclusions, wow, activation, retention, time, complexity, first 20, success, stop, main risk.
- [x] Сроки и numerical gates явно названы estimates/conventions, не evidence.
- [x] Base scoring раскрывает шкалу, веса, raw values и формулу.
- [x] Sensitivity показывает неудобный rank reversal: speed-first выбирает M1; learning/base/revenue выбирают M3.
- [x] Leave-one-criterion-out и score uncertainty описаны.
- [x] Current assets не перепутаны с отсутствующими runner/scheduler/AI/portfolio capabilities.
- [x] Первые 20 не используются для causal effect; путь к powered study указан.
- [x] Career, olympiad, mastery, AI и verification claims ограничены доказательствами.
- [x] Minor-facing варианты private-by-default и имеют teacher/consent/access guardrails.

**Остаточная неопределённость:** оценки сделаны до problem interviews, task-cost measurement и employer review. Первое действие — не 10–14-недельная разработка целиком, а Gate 0 + concierge prototype M3. Если candidate pain не подтверждается, M1 можно использовать как instrument/content pilot, но нельзя объявлять победой исходной стратегии.

## 10. Трассировка источников

- Current product/intent: `S001–S006`, [00_source_registry.md](./00_source_registry.md).
- Market, users, competitors and failure cases: `S007–S035`, [01_market_and_competitors.md](./01_market_and_competitors.md), [01_failure_cases.md](./01_failure_cases.md).
- Learning/measurement: `S036`, `ES-L01–ES-L54`, [02_learning_science.md](./02_learning_science.md).
- Gamification/safety: `ES-G01–ES-G33`, [02_gamification.md](./02_gamification.md).
- AI tutor/product/RCT evidence: `ES-A01–ES-A45`, [02_ai_tutors.md](./02_ai_tutors.md).
- Job/curriculum framework evidence: `S037`, `JS001–JS069`, `CUR-*`, [03_jobs_and_skills.md](./03_jobs_and_skills.md), [03_curriculum.md](./03_curriculum.md), [jobs_sources.md](./sources/jobs_sources.md).
