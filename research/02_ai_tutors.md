# AI-наставник Arvexo Arena: доказательства, продуктовые паттерны и архитектура

Дата среза: **2026-07-20**  
Статус: исследование этапа 2; продуктовый и технический дизайн, не юридическое заключение.  
Область: AI-наставник для обучения AI/data/programming, школьников, студентов, начинающих специалистов, преподавателей и организаторов соревнований.

## 1. Решение в одном абзаце

Arena не следует строить «чат рядом с уроком». Рекомендуемая форма — **ограниченный учебный оркестратор**, который знает конкретную задачу, компетенцию, допустимый уровень помощи, проверенный ответ и историю наблюдаемых попыток; сначала использует детерминированную проверку, затем выдаёт ступенчатую подсказку и обязательно завершает помощь новой самостоятельной попыткой. Для итоговой проверки AI выключается; для AI-native заданий, наоборот, использование AI объявляется частью проверяемого процесса, но ученик обязан верифицировать результат и защитить решение. Главная метрика — не число чатов и не оценка «было полезно», а **отложенный перенос на невиденную задачу без AI**.

Это следует из несовпадающих результатов исследований:

- в полевом RCT почти с тысячей старшеклассников свободный GPT-4-интерфейс улучшал выполнение практики на 48%, но затем снижал результат самостоятельного экзамена на 17%; tutor с teacher-authored hints улучшал практику на 127% и устранял вред, но не дал положительного эффекта на самостоятельном экзамене [ES-A18];
- тщательно спроектированный tutor для двух тем университетской физики дал высокий краткосрочный эффект против активного занятия, но исследование охватывало 194 студентов, две недели и непосредственные post-tests — оно ничего не доказывает про отложенный перенос, долгий курс или детей [ES-A17];
- актуальная версия working paper Tutor CoPilot сообщает +4 п.п. к прохождению **same-session exit ticket** (62% → 66%) и +9 п.п. у учеников lower-rated tutors в human-in-the-loop модели; это не delayed mastery. Текущая версия описывает более 700 tutors и более 1 000 students, тогда как ранняя arXiv-версия использовала более широкий deployment frame 900/1 800; версии и определения выборки нельзя смешивать [ES-A19, ES-A45];
- систематический обзор 28 K–12 ITS-исследований (N=4 597) нашёл в целом положительную, но неоднородную картину; преимущество уменьшалось при сравнении с неинтеллектуальными tutor-системами, а этика не рассматривалась ни в одной включённой работе [ES-A20].

**Решение:** build узкое ядро подсказок и оценки; buy сменяемый LLM API и moderation как инфраструктурные компоненты; defer свободный «спроси обо всём», автономное выставление итоговой оценки, генерацию курса на лету и долговременную психологическую «память».

**Уверенность:** средне-высокая в необходимости task-scoped policy/evidence architecture и разделения assisted performance от independent learning; средняя в конкретной форме H0–H5; низкая в ожидаемом размере learning effect, численных evidence weights и unit economics Arena до собственного randomized pilot.

## 2. Как читать доказательства

### 2.1 Градация

| Grade | Определение из `00_research_plan.md` | Для каких утверждений достаточно |
|---|---|---|
| A | первичный, методологически прозрачный и высоконадёжный: метаанализ, государственная статистика, официальный закон/стандарт, официальная документация/цена | прямой факт в заявленной области; official product page подтверждает функцию/цену, но не её эффективность |
| B | авторитетный вторичный или первичный с существенными ограничениями: systematic review без meta-analysis, ограниченный peer-reviewed study, прозрачный working paper | ограниченный эффект/паттерн с обязательным описанием population, comparator, horizon и ограничений |
| C | отраслевой или пользовательский сигнал: vendor outcome/case без прозрачной causal method, preprint с существенной неопределённостью, отзывы | гипотеза и ориентир для собственного теста, но не обещание результата |
| D | слабый или непроверенный источник: SEO-обзор, анонимный/недатированный материал | только наводка; значимый вывод не поддерживает |

Grade относится к **источнику в конкретной роли**, а не переносится автоматически на любой claim. Для каждого значимого утверждения дополнительно фиксируются:

- `claim_role`: `product_snapshot`, `causal_outcome`, `law_or_guidance`, `architecture_inference` или `Arena_hypothesis`;
- `causal_status`: randomized peer-reviewed, randomized non-peer-reviewed, observational, vendor metric или marketing claim;
- `applicability`: direct, adjacent либо hypothesis-only для Arena.

Например, official product page имеет grade A для текущей цены/функции и одновременно causal status `marketing claim` для обещания learning effect. Любой внешний результат переносится на Arena только как гипотеза, пока не измерены самостоятельное удержание и transfer.

### 2.2 Карта уверенности ключевых выводов

- **Высокая:** assisted performance нельзя считать independent mastery; final score не должен зависеть только от LLM; product/model/prompt/content versions нужны для воспроизводимости.
- **Средне-высокая:** task-scoped tutor с deterministic truth и server-side policy безопаснее generic chat для ограниченных задач.
- **Средняя:** разделение Classic/Formative/AI-Native и ступенчатая помощь — разумная конструкция, но predictive validity и оптимальные unlock rules ещё не установлены.
- **Низкая:** точные attenuation weights подсказок, cost caps, latency thresholds и ожидаемый effect size Arena; это проектные гипотезы.

### 2.3 Операциональные термины

- **Performance** — ученик решил текущую задачу, возможно с AI.
- **Learning** — после помощи ученик лучше решает без неё.
- **Near transfer** — новая формулировка того же skill/pattern.
- **Far transfer** — применение принципа в новом контексте/проекте.
- **Mastery / Confirmed** — решение по полной conjunction независимого, распределённого, delayed и transfer evidence; калиброванная вероятность — один из gates, а не весь credential. Это не XP, не «прочитал урок» и не результат после bottom-out hint.
- **Hint dependency** — рост вероятности запроса помощи или падение самостоятельного результата после серии подсказок.
- **Grounded** — утверждение связано с разрешённой версией источника; это снижает, но не устраняет hallucination.

## 3. Карта существующих продуктов

| Продукт | Целевая группа и JTBD | Учебный loop | Что подтверждено | Ограничения / safety | Доступ и цена на дату среза |
|---|---|---|---|---|---|
| **Khanmigo** | школьник/студент: получить помощь по Khan Academy; родитель: контролировать; учитель: планировать и видеть класс | контекст урока → вопрос/диагностика → guidance без прямого ответа → следующая попытка; отдельные writing/coding/debate flows | функции и safeguards подтверждены официально; vendor tests 2025–2026 сообщают +6,1% next-item correctness после подачи структурированной истории [ES-A01–A04] | в найденном корпусе нет peer-reviewed причинного эффекта именно Khanmigo на delayed transfer; moderation ошибается; длинные сессии ограничиваются; у несовершеннолетних видимая взрослому история | learner/parent: $4/мес или $44/год, США; teacher tools бесплатно в поддерживаемых регионах; district — договорная цена [ES-A02] |
| **Duolingo Max** | изучающий язык: безопасно репетировать разговор и понять ошибку | lesson path → Roleplay/Video Call → AI feedback → повтор; ограниченная память фактов прошлых разговоров | наличие Roleplay, Video Call, feedback и List of Facts memory подтверждено продуктовой документацией [ES-A05, ES-A43]; один vendor-authored report рандомизировал 658 взрослых learners и анализировал 567 completers [ES-A41] | speaking outcome нельзя переносить на math/code; differential attrition 20,1% в Video Call против 7,6% в control и complete-case/per-protocol analysis ограничивают причинный вывод; нет delayed retention | Max — tier над Super; страны/языки зависят от функции; Explain My Answer стал бесплатным, остальные AI-функции в основном Max [ES-A05, ES-A39] |
| **Coursera Coach** | взрослый learner: понять course material, потренироваться к quiz, связать курс с карьерой; author: построить диалог | grounded course context → clarify/summarize/practice → Socratic dialogue → quiz | Coursera сообщает >1 млн пользователей, +9,5% first-attempt quiz pass и +11,6% lessons/hour; это vendor metrics, дизайн контроля публично не описан [ES-A07] | pass rate и скорость не равны delayed learning; доступ зависит от курса/тарифа; career advice требует свежих данных и отдельной валидации | в 2024 Coursera объявила expansion почти на всех paid learners; с 2025 Coach может входить в free preview первого модуля там, где доступен; единой цены Coach нет [ES-A37, ES-A40] |
| **Quizlet Q-Chat** | студент 18+ в beta: активный recall и Socratic study по Quizlet sets | выбранный материал → adaptive questions → follow-up → healthy study prompts | официальный launch описывал Socratic loop и safeguards; **с июня 2025 продукт закрыт** [ES-A08] | отсутствуют публичные learning-outcome данные и объяснение закрытия; важный антипример: яркий generic chat не обязан стать устойчивым core loop | недоступен с июня 2025; исторически beta 18+ в США |
| **ChatGPT Study Mode** | широкий learner: homework, exam prep, разбор файла/изображения | выяснить цель/уровень → Socratic questions → chunked explanation → open-ended check → reflection | функция, глобальная доступность и memory описаны официально; **на момент запуска в 2025 году** OpenAI связывала возможную непоследовательность с custom-instructions implementation [ES-A09–A10] | может всё же дать прямой ответ; generic context, нет собственного mastery ledger и verified task truth; текущая внутренняя реализация после launch публично не подтверждена; memory повышает privacy-риск | доступен logged-in пользователям всех ChatGPT plans; лимиты равны выбранному плану [ES-A10] |
| **GitHub Copilot** | разработчик/студент: быстрее писать, объяснять и исправлять код в IDE | intent/comment/code → completion/chat/edit → run/test/review | функции и бесплатный premium access verified students подтверждены [ES-A11]; исследования студентов малы и больше меряют productivity/process, чем retention [ES-A35] | это pair programmer, не tutor: легко заменить generation; correctness не означает comprehension; IP/security и академическая честность зависят от контекста | verified students получают Copilot Student бесплатно; есть Free и paid plans [ES-A11] |
| **Codecademy AI Learning Assistant** | начинающий programmer: не покидать exercise при ошибке | видит instructions + solution code → explains error/concept → contextual guidance → learner edits code | официальный help подтверждает контекст и доступ [ES-A12] | публичного независимого delayed-learning evidence не найдено; бесконечные prompts могут поддерживать зависимость | free — ограниченные prompts; Plus/Pro — unlimited prompts [ES-A12] |
| **Code.org AI Tutor** | 6–12 классы: помощь в select CS units; teacher: снизить повторяющиеся help requests | embedded task → Socratic debugging/reflection → attempt; teacher visibility | продуктовая архитектура и safety раскрыты: Gemini Flash 2.5 + отдельная moderation layer, age calibration, no training on student data [ES-A13] | pilot/select lessons, English only; публичный causal outcome пока не найден; «right amount» scaffolding остаётся заявлением | opt-in/pilot в отдельных курсах; базовая экосистема Code.org бесплатна |
| **CodeSignal Cosmo** | взрослый/сотрудник: hands-on upskilling, contextual help и mastery check | learning path → practice → context-aware hint/feedback → mastery gate | официально описаны grounded/cross-checked responses и assessment boundary [ES-A14] | «3x retention» на marketing page без открытой методики нельзя использовать как causal fact; корпоративный контекст не равен школе | mobile app/free tier и Cosmo+ $24,99/month подтверждены текущей pricing page; enterprise цена договорная [ES-A44] |
| **CS50 Duck** | студент CS50: получить 24/7 course-specific debugging help без ChatGPT | course/task context + RAG → bounded answer → student code; staff can endorse/edit forum answer | peer-reviewed SIGCSE reports дают редкую эксплуатационную прозрачность: RAG, PII removal, throttling, response audit [ES-A21–A22] | instruction dilution: несмотря на запрет готового кода, 48% из 1,3 млн conversations содержали code block; смена GPT-4→4o повысила leakage [ES-A22] | только в контексте CS50; не отдельный массовый тариф |
| **Gemini Guided Learning / LearnLM** | общий learner и education institutions: учиться через questions, multimodal explanations, quizzes | goal → probing questions → chunking/multimodal explanation → knowledge check | механизм подтверждён официально; технический отчёт оценивает следование learning-science principles, а не реальный delayed learning [ES-A16, ES-A23] | модельная preference/eval не заменяет RCT; generic mode не имеет Arena task truth | Guided Learning в Gemini; institutional availability зависит от Google offering |
| **Claude for Education Learning mode** | университет: reasoning/citations/work through problems; campus IT: controlled access | Project context → «guide, not answer» → Socratic evidence prompts → templates | официально описаны mode и campus partnerships [ES-A15] | на launch-странице нет outcome evidence; templates могут облегчать production без learning; продукт для higher ed, не детский safety case | campus agreements; розничная отдельная цена режима не опубликована |

### 3.1 Детальные выводы по продуктам

#### Khanmigo

Сильнейший паттерн — не персонаж, а связка **учебный контекст + взрослый oversight + bounded behavior + журнал**. Khan Academy ограничивает доступ несовершеннолетних родительским или district-контуром, показывает взрослым transcript, шлёт moderation alerts, не хранит загруженные изображения и признаёт false positives/ошибки модели [ES-A03, ES-A36, ES-A38]. Дневные лимиты объясняются одновременно safety, drift и качеством — это полезный прецедент для Arena.

Но доказательства следует разделять. Эффективность Khan Academy как платформы не доказывает эффективность Khanmigo. Наиболее свежий официальный experiment report сообщает, что структурированные сигналы learning record улучшили next-item correctness двумя изменениями на +2,7% и +3,4%; примеры других task types и дополнительные links не дали статистически значимого эффекта [ES-A04]. Это сильный аргумент за компактный структурированный learner state, но не за загрузку всей истории в prompt и не за обещание долгосрочного обучения.

#### Duolingo Max

Переносимый паттерн — **роль с реальным коммуникативным ограничением**: learner обязан произвести речь, AI отвечает внутри ситуации, затем даёт feedback. Это ближе к simulation, чем к Q&A. В Arena аналогом может стать устная защита ML-решения, stakeholder roleplay или incident debugging. Публичная vendor-summary сообщает speaking/confidence results, но не даёт достаточных деталей для causal interpretation; ниже используется полный report [ES-A06, ES-A41]. Нельзя переносить доказательства на математику/код: report измерял speaking у взрослых Japanese-speaking learners уровня B1.1. В нём 658 участников были рандомизированы, но основной анализ включал 567 выполнивших требования; differential attrition составил 20,1% в Video Call и 7,6% в control, поэтому это не чистая ITT-оценка и причинный вывод ограничен. Требование ≥2 Video Calls/day было treatment protocol, а не основанием называть assignment self-selection.

#### Coursera Coach

Переносимый паттерн — grounding на partner-authored content и отдельные команды «explain / summarize / practice», а не один prompt box. +9,5% first-pass и +11,6% lessons/hour — полезные operational signals, но они могут означать лучшую подготовку, помощь прямо перед quiz или просто ускорение [ES-A07]. Arena обязана добавить unassisted delayed outcome.

#### Quizlet Q-Chat

Q-Chat — предупреждение против стратегии «сначала универсальный Socratic chat, потом найдём value». Официальная страница сохраняет обещания 2023 года, но сверху фиксирует закрытие в июне 2025 [ES-A08]. Причина закрытия публично не установлена, поэтому нельзя приписывать её цене, retention или качеству. Допустимый вывод только один: наличие известного бренда, content library и LLM не гарантирует устойчивость самостоятельной chat-функции.

#### ChatGPT Study Mode, Gemini Guided Learning, Claude Learning Mode

Все три сходятся на active participation, chunking и Socratic prompts. Это подтверждает UX-конвенцию, но не уникальность. На launch в 2025 году OpenAI описывала Study Mode как instruction-based и предупреждала о непоследовательности; актуальный FAQ по-прежнему признаёт ошибки и возможность прямого ответа, но не подтверждает, что внутренняя реализация осталась прежней [ES-A09–A10]. Поэтому Arena не должна полагаться на system prompt как на policy enforcement: уровень помощи задаёт server-side state machine, а output проходит leakage checker.

#### GitHub Copilot и coding tutors

Copilot оптимизирует **производство кода**, тогда как Arena должна оптимизировать **способность объяснить, протестировать и исправить его без генератора**. Для beginners допустимы explain error, locate suspicious region, ask for hypothesis, suggest test; полный patch — только в AI-native режиме. Codecademy и Code.org показывают ценность exercise context [ES-A12–A13], а university prototype CourseAssist — полезность intent classification и decomposition поверх course-specific retrieval [ES-A34]. CS50 показывает предел prompt-only guardrails: 48% conversations с code blocks при запрете готовых решений и поведенческая регрессия после смены модели [ES-A22]. Следовательно, code leakage проверяется парсером/сходством с reference solution, а не обещанием модели.

## 4. Что действительно известно об AI-tutoring

| Источник | Дизайн и результат | Что можно заключить | Чего заключать нельзя |
|---|---|---|---|
| Bastani et al., PNAS 2025 [ES-A18] | полевой preregistered RCT, почти 1 000 школьников, математика; GPT Base: +48% practice, −17% unassisted exam; guarded GPT Tutor: +127% practice, exam ≈ control | прямые ответы и «правильность сейчас» могут вредить learning; teacher-authored truth/hints и запрет answer leakage снижают вред | что guarded tutor повышает самостоятельное mastery; положительного exam effect не было |
| Kestin et al., Scientific Reports 2025 [ES-A17] | N=194, Harvard physics, crossover, две темы/две недели; effect 0,73–1,3 SD после ceiling correction, median time 49 против 60 минут | тщательно author-crafted tutor может эффективно вводить конкретный материал взрослым/студентам | delayed retention, whole-course effect, far transfer, minors, generic chat |
| Wang et al., Tutor CoPilot [ES-A19, ES-A45] | preregistered field RCT working paper; current 2025 version: >700 tutors/>1 000 students, same-session exit-ticket pass 62% → 66% (+4 п.п.), +9 п.п. у lower-rated tutors, ~$20/tutor/year; ранняя arXiv-версия: deployment frame 900/1 800, 29% treatment sessions с использованием tool | AI как подсказчик человеку способен улучшить immediate session assessment в исследованной программе | durable mastery, delayed transfer, автономная замена tutor, peer-reviewed status; цифры разных версий/выборок нельзя смешивать |
| Létourneau et al., npj 2025 [ES-A20] | systematic review: 28 studies, N=4 597, 2009–Jan 2025 | ITS часто помогает, но эффект зависит от comparator, implementation, subject и duration | один универсальный effect size; автоматический перенос старых ITS результатов на LLM chat |
| CS50 reports [ES-A21–A22] | реальная эксплуатация и manual evaluation; 10 млн сообщений в follow-up | RAG, bounded prompts и human review полезны, но model update способен сломать педагогическое поведение | что высокая usage или endorsed answer означает learning |
| K–12 help-seeking literature [ES-A26–A27] | Cognitive Tutor studies: help abuse/click-through/gaming связано с худшим learning | нужны dwell time, attempt gates, bottom-out recovery и метрика dependency | что любой запрос подсказки плох; help avoidance тоже бывает проблемой |

### 4.1 Самостоятельное мышление и Socratic method

«Socratic» — не магическое свойство вопросительного знака. Полезный tutoring turn должен выполнять одну из функций: выявить представление ученика, активировать relevant prior knowledge, локализовать ошибку, попросить объяснение причин, предложить минимальную опору или проверить перенос. Бесконечное «а как ты думаешь?» без диагностики увеличивает трение и скрывает отсутствие domain model.

Правило Arena:

1. вопрос задаётся только если ответ изменит следующий pedagogical action;
2. после двух неуспешных диагностических ходов tutor обязан сменить представление/дать scaffold;
3. после scaffold ученик выполняет действие, а не подтверждает «понял»;
4. сессия завершается коротким self-explanation и новой задачей без помощи;
5. уверенность ученика сравнивается с фактическим результатом: исследование [ES-A18] показывает, что perception может быть оптимистичнее learning.

### 4.2 Hint dependency и assistance dilemma

И недостаток, и избыток помощи вредны. Классическая assistance dilemma спрашивает, когда давать/удерживать информацию [ES-A26]. Help-abuse включает быстрое прокликивание hints и запрос помощи при достаточном mastery; help-avoidance — упорные догадки при низком mastery [ES-A27]. Поэтому flat-кнопка «показать решение» неприемлема.

Нужны четыре независимых сигнала:

- **attempt quality:** есть ли содержательная попытка, тест, вычисление или объяснение;
- **error persistence:** повторяется ли одна misconception или меняется стратегия;
- **dwell/reading:** было ли минимальное время прочитать hint (не как наказание, а как detector);
- **mastery uncertainty:** сколько независимых свидетельств по skill и насколько они свежи.

### 4.3 Diagnosis, learner model и knowledge tracing

LLM не должен сам «ощущать уровень». Arena хранит наблюдаемый state. Начать следует с интерпретируемой модели уровня BKT: prior, learn, slip, guess на competency [ES-A24], но дополнить временем, подсказками и типом evidence. Deep Knowledge Tracing улучшает prediction в некоторых datasets [ES-A25], однако скрытое состояние сложнее объяснить и может учить dataset artifacts. Для MVP важнее калибровка и учительская проверяемость, чем leaderboard AUC.

**Минимальная запись `CompetencyEvidence`:**

```text
learner_id (pseudonymous)
competency_id + competency_version
task_id + task_version
attempt_id, timestamp
mode: classic | formative_ai | ai_native
response/outcome: correct, partial, rubric dimensions
evidence_class: independent_first_attempt | checker_feedback_only | hint_assisted_H1_H3 | high_assistance_H4_H5 | unseen_recovery
assistance_code: 0 | 1 | 2 | 3 | 4 | 5 | 6
# 0=first committed response; 1=H0; 2=H1; 3=H2; 4=H3; 5=H4; 6=H5
latency, retries, confidence_self_report
grader_version, test_suite_version
content/provenance refs
```

Сообщение в чате, просмотр объяснения и assisted completion не равны mastery. Классы `independent_first_attempt` и `unseen_recovery` лишь определяют **допустимость события** как кандидата `I3/I4`; ни одно событие само по себе не подтверждает mastery. `Confirmed` вычисляется только полной conjunction из `02_learning_science.md` §6.7: валидированная model confidence/консервативный pilot-эквивалент, независимое покрытие families, spacing, delayed evidence, unseen transfer, отсутствие unresolved critical error и валидная форма. H0–H3 сохраняются как formative assisted evidence; H4/H5 имеют нулевой mastery weight. Tutor events обновляют learning evidence/readiness, но никогда напрямую не обновляют соревновательный rating.

## 5. Рекомендуемая архитектура Arena

### 5.1 Принципы

1. **Closed task before open chat.** Tutor входит через lesson/task/project context.
2. **Deterministic truth first.** Тесты, схемы, числовые tolerances, rubrics и reference facts — раньше LLM judgment.
3. **Policy outside prompt.** State machine определяет допустимое действие; LLM формулирует только разрешённый payload.
4. **Evidence, not vibes.** Personalization опирается на versioned attempts, не на «learning styles» и не на чувствительные догадки.
5. **AI is not the grader of record.** LLM может предложить feedback/черновой rubric score; high-stakes result определяет deterministic grader или человек.
6. **Every assisted path returns to independence.** После помощи — unseen retry без AI.
7. **Provider replaceability.** Ни память, ни policy, ни competency graph не принадлежат LLM vendor.
8. **Minors by design.** Минимизация данных, age-appropriate output, adult escalation и понятное объяснение AI.

### 5.2 Компоненты и ответственность

| Компонент | Ответственность | Не должен делать |
|---|---|---|
| **Tutor Gateway** | auth, rate limits, locale, session/mode, idempotency, streaming | принимать скрытый mode от клиента без server check |
| **Policy Router** | классифицировать intent; выбрать deterministic action или bounded skill; учесть age/mode/hint level | отправлять произвольный user prompt прямо модели |
| **Bounded Skill Registry** | versioned skills: diagnose, hint, explain, ask-to-predict, critique, reflect, recommend | generic agent с произвольными tools |
| **Task Context Service** | task version, learning objective, allowed concepts, reference solution, distractor/misconception map, tests | передавать author secrets в client/logs |
| **Competency Graph** | prerequisites, evidence requirements, near/far-transfer links, curriculum version | считать граф автоматически истинным из LLM text |
| **Learner Model** | calibrated mastery/uncertainty, recency, help profile, accommodations explicitly provided | выводить disability, mental state, интеллект или социальные признаки |
| **Assessment Service** | deterministic grading; rubric workflow; hidden tests; partial evidence | позволять generative model менять official score без review |
| **Feedback Engine** | по versioned grader evidence выбрать correction target, feedback policy, reading level, locale и доступное представление; связать feedback с последующим learner action | заново решать, верен ли ответ; менять score; выдавать следующий hint level в обход policy |
| **Hint Policy Engine** | server-side state H0–H5, unlock rules, cooldown, recovery task | доверять модели решение «дать ли ответ» |
| **Grounding & Content Validation** | retrieve only approved chunks; entailment/citation checks; version pinning | web-open retrieval в школьной сессии по умолчанию |
| **LLM Gateway** | provider abstraction, model allowlist, token/cost limits, retries, cache, circuit breaker | хранить learner profile у provider сверх нужного request |
| **Safety & Integrity Service** | input/output moderation, PII redaction, prompt-injection defense, answer-leakage/code-similarity checks, escalation | считать moderation безошибочной или AI detector доказательством cheating |
| **Memory Service** | session summary и narrowly scoped learning facts with TTL/consent | сохранять полный raw chat бессрочно; психологический профиль |
| **Recommendation Engine** | prerequisites + mastery uncertainty + spaced/transfer queue; reason code | оптимизировать только click/engagement |
| **Evaluation Registry** | golden sets, human ratings, red-team suites, release gates | выпускать model/prompt update без regression run |
| **Observability** | trace, latency, cost, safety, leakage, pedagogical action and outcome | логировать secrets, hidden answer или raw PII |
| **Teacher/Admin Console** | see evidence, flagged sessions, override/appeal, cohort gaps | показывать opaque «AI ability score» как факт |

### 5.3 Bounded skills MVP

| Skill | Входной контракт | Разрешённый выход | Hard checks |
|---|---|---|---|
| `diagnose_misconception.v1` | learner attempt, task facts, misconception candidates | 1–3 ranked hypotheses + one discriminating question; confidence | candidates only; no answer; unsupported hypothesis → `unknown` |
| `give_hint.v1` | hint level, last attempt, misconception, allowed facts | one hint of requested level + required learner action | leakage similarity; max length; no next level |
| `explain_feedback.v1` | deterministic grader result, rubric dimension, approved excerpt | why evidence passed/failed + one correction target | cannot alter grade; every factual claim cites context ID |
| `generate_variant.v1` | author template, parameters, target competency/difficulty | candidate item + solution + tests | quarantined until validator passes; never live-generate high-stakes item |
| `critique_ai_output.v1` | artifact, known rubric, provenance | questions and flaws to investigate, not repaired final | no hidden rubric reveal; citations required |
| `reflection_prompt.v1` | error→repair trace | one self-explanation / confidence prompt | response does not update mastery alone |
| `recommend_next.v1` | graph, mastery/uncertainty, due queue | ranked approved activities + reason codes | no free-form invented content |

### 5.4 API contracts

`TutorTurnRequest`:

```json
{
  "session_id": "uuid",
  "attempt_id": "uuid",
  "task_ref": {"id": "task-42", "version": 7},
  "mode": "formative_ai",
  "learner_message": "...",
  "client_action": "request_hint",
  "expected_state_version": 3
}
```

`TutorTurnResponse`:

```json
{
  "turn_id": "uuid",
  "policy_action": "give_hint",
  "hint_level": 2,
  "message": "...",
  "required_learner_action": "state_hypothesis",
  "citations": [{"content_id": "lesson-8#c12", "version": 4}],
  "confidence": "bounded_high",
  "state_version": 4,
  "provenance_id": "prov-uuid",
  "fallback": false
}
```

`TutorProvenance` хранит: provider, requested model/deployment ID и фактически возвращённый release ID, если provider его раскрывает; skill/prompt/policy versions; task, solution, rubric, competency-graph и content versions; retrieved chunk IDs + hashes; moderation model/rules; deterministic checker version; token counts; latency/cost; cache status; safety decisions; release/eval snapshot ID и canary fingerprint. Нельзя предполагать, что mutable vendor alias является immutable version. Raw chain-of-thought не хранится и не показывается.

### 5.5 Поток данных

```mermaid
flowchart LR
  U["Learner action"] --> G["Tutor Gateway"]
  G --> S["Safety + PII pre-check"]
  S --> R["Policy Router"]
  R --> T["Task context + truth"]
  R --> M["Learner model + competency graph"]
  R --> D{"Deterministic action enough?"}
  D -->|yes| A["Assessment / hint state machine"]
  D -->|no| K["Bounded skill"]
  T --> K
  M --> K
  K --> L["LLM Gateway"]
  L --> V["Grounding, leakage, safety validation"]
  A --> O["Response + required learner action"]
  V --> O
  O --> E["Event + provenance store"]
  E --> X["Assessment + evidence validator"]
  X -->|valid learner evidence only| M
  E --> Q["Offline/online evaluation"]
```

### 5.6 Fallback matrix

| Сбой | Ответ системы | Что видит ученик | Что логируется |
|---|---|---|---|
| no approved context / retrieval confidence below threshold | не вызывать free-answer; предложить открыть конкретный lesson excerpt или teacher escalation | «Не могу надёжно подтвердить ответ по материалам курса» | missing content ID, query, no PII |
| LLM timeout / provider outage | deterministic feedback + approved static hint; circuit breaker | быстрый ограниченный hint без попытки притвориться AI | provider, timeout, fallback version |
| output fails leakage check | regenerate один раз с lower level; затем static hint | только разрешённая подсказка | blocked output hash/reason, не output в learner log |
| moderation uncertain | safe neutral response; adult/teacher review according severity | age-appropriate notice and support path | category/confidence/recipient; access controlled |
| grader disagreement / low confidence | score remains pending; human review | «Ответ отправлен на проверку» | both judgments, rubric evidence |
| stale model/content version | pin last validated release | нормальная работа на validated version | rejected release/version mismatch |

### 5.7 Latency и cost constraints

Это **проектные цели, не внешние факты**:

- deterministic feedback p95 ≤ 1,0 с;
- AI first useful token p95 ≤ 3,0 с, complete short hint p95 ≤ 8,0 с;
- one retry maximum; после него deterministic fallback;
- ≤450 output tokens для hint/explanation, ≤120 для H1–H2;
- не более одного model call на обычный turn; второй model/checker — только для high-risk или sampled QA;
- предварительный cap **10 ₽ на завершённую AI-assisted learning session** и отдельный месячный бюджет на free cohort; это гипотезы unit economics, которые пересчитываются по `input_tokens × rate + output_tokens × rate + moderation + retrieval + retries`. Доля выручки не используется как MVP-cap, потому что бесплатный/pre-revenue core делает такой знаменатель неопределённым;
- semantic caching допустим только для public, non-personalized, version-identical explanations; learner-specific response не кэшируется между пользователями;
- cheap classifier/router и deterministic checks до capable model; premium model только для diagnosis/complex feedback;
- бюджет считается на **успешный самостоятельный transfer**, а не на message. Cost per independently demonstrated competency и cost per free active learner — основные экономические метрики пилота.

## 6. Политика подсказок

### 6.1 Единый `assistance_code`, лестница H0–H5 и классы evidence

Arena различает: `independent_first_attempt`, `checker_feedback_only`, `hint_assisted_H1_H3`, `high_assistance_H4_H5` и `unseen_recovery`. Первый и последний классы могут лишь предоставить допустимое `I3/I4` evidence под полной mastery conjunction; остальные нужны для диагностики и выбора следующего действия. Competitive rating обновляется отдельно и только из результата заранее объявленного rated event.

| `assistance_code` / уровень | Содержание | Unlock | Evidence handling |
|---|---|---|---|
| **0 / independent** | первый committed response до любого feedback | submit исходной попытки | только кандидат `I3/I4`; полная mastery conjunction всё равно обязательна |
| **1 / H0: checker-only** | показать результат checker и попросить проверить конкретный observable, без указания концепта | первая ошибка; если syntax/system error — сразу диагностическая деталь | `checker_feedback_only`; текущая completion не independent, после неё нужна новая unaided recovery с code `0` |
| **2 / H1: goal/cue** | напомнить цель либо попросить prediction: «Какой результат ожидался? Как это проверишь?» | ≥1 содержательная попытка; явный запрос фиксируется, но сам по себе не обходит attempt gate | `hint_assisted`; provisional formative weight **0,9**, не mastery/certification и не competitive rating |
| **3 / H2: principle** | назвать принцип/representation/компонент, не шаг решения | новая попытка после H1 либо наблюдаемый stuck pattern | `hint_assisted`; provisional formative weight **0,7**, не mastery/certification и не competitive rating |
| **4 / H3: partial step** | предложить стратегию, локализовать ошибку или дать частичный шаг | две разные попытки или persistent misconception | `hint_assisted`; provisional formative weight **0,4**, не mastery/certification и не competitive rating |
| **5 / H4: worked step** | показать один worked step или **другой** решённый пример с обязательным self-explanation | dwell + попытка применить H3; accessibility override возможен | `high_assistance`; mastery weight 0; competitive rating unaffected |
| **6 / H5: full solution** | показать полный solution/bottom-out только в formative mode; объяснить, почему | explicit surrender либо наблюдаемое правило struggle (`N` разных неуспешных попыток/timeout); никогда inferred emotion и никогда в Classic summative | `high_assistance`; mastery weight 0; обязательна новая unseen recovery task с code `0` |

Веса 0,9/0,7/0,4 — **стартовые гипотезы** для калибровки BKT-like formative learner model, а не установленные исследованиями коэффициенты. Их нельзя использовать для leaderboard, сертификата или employer-facing score; пилот должен сравнить calibration/Brier/ECE с моделью без этих весов и изменить либо удалить их.

### 6.2 Server-side unlock rules

1. Уровень нельзя запросить URL-параметром или prompt injection; только policy engine меняет state.
2. Первый hint требует attempt, кроме accessibility accommodation, неизвестного интерфейса или system/compiler error.
3. Следующий уровень открывается после observable action: изменённый код, вычисление, гипотеза или объяснение; «не знаю» считается честным signal, но не попыткой.
4. Минимальный dwell — detector, не тупая задержка: если ученик пересказывает hint своими словами, unlock возможен раньше.
5. Два одинаковых ответа не считаются двумя стратегиями.
6. Любая completion с `assistance_code≥1` помечается assisted и не подтверждает mastery; H1–H3 могут обновить только formative uncertainty с экспериментальным attenuation weight, H4/H5 — с нулевым weight. Ни один tutor event напрямую не меняет competitive rating.
7. Через 1–10 минут даётся новая near-transfer variant без AI с `assistance_code=0`; она лишь добавляет потенциальное `I3/I4` evidence. Канонические delayed probes для `Confirmed` — `T14/T30` из learning-science; дополнительные 7/21-day probes допустимы как диагностические, но не заменяют conjunction.
8. При трёх сессиях с H4/H5 по одной competency система рекомендует prerequisite/teacher, а не бесконечно генерирует hints.
9. Ученик всегда может отказаться от чата и открыть approved explanation.
10. Для minors признаки self-harm/abuse активируют safety flow; tutor не ведёт терапевтический разговор и не обещает конфиденциальность.

### 6.3 Как измерять dependency

- hints per independent success;
- доля сессий, дошедших до H4/H5;
- time-to-first-hint и click-through rate;
- вероятность самостоятельного решения следующего isomorphic item;
- difference `assisted practice − unassisted post-test`;
- рост hint level по неделям при равной сложности;
- доля direct-answer requests и copied solution similarity;
- confidence–accuracy calibration после помощи.

Нельзя просто штрафовать XP за hint: это создаст help avoidance. Система разделяет learning evidence и игру: ученик получает process XP за качественную попытку/объяснение, а `independent_first_attempt` или `unseen_recovery` без AI лишь становятся кандидатами в `I3/I4`; официальный `Confirmed` требует всей conjunction. Competitive rating меняется только по rated competition outcome.

## 7. Classic, formative и AI-Native

| Режим | AI | Что оценивается | Integrity rules | Выход |
|---|---|---|---|---|
| **Formative AI** | ступенчатые hints/feedback разрешены | попытка, исправление, self-explanation; mastery только после recovery | полная provenance, answer leakage block | обучение и новое unassisted item |
| **Classic summative** | tutor, retrieval и generation внутри Arena выключены; разрешены только UI/accessibility tools | самостоятельный skill на hidden/parallel tasks | server-side timer/tests, version pin, no answer in client, appeals; supervised mode/viva при high stakes | `I3/I4` mastery/certification evidence; rating outcome только если это отдельно объявленный rated event |
| **AI-Native assessment** | AI явно разрешён и инструментируется | постановка задачи, prompt/tool choices, verification, tests, critique, provenance, защита | learner декларирует инструменты; сохраняются prompts/outputs/hashes; случайная устная/практическая defense | evidence способности работать **с** AI |

Правила:

- один и тот же artifact не доказывает обе способности; Classic и AI-Native evidence отображаются раздельно;
- AI-generated-text detector не является доказательством cheating; используются process evidence, policy, viva/variant check и human review;
- в турнире организатор заранее выбирает division: Classic, AI-Native или mixed; рейтинг не смешивается;
- в AI-Native нельзя оценивать красоту prompt отдельно от проверенного outcome;
- минимум 30–50% certification evidence должно быть независимым, даже для AI-native track (гипотеза Arena, проверить predictive validity);
- tutor не видит hidden tests и не получает production secrets.

Classic доказывает отсутствие **внутриплатформенной** AI-помощи, но в unsupervised remote setting не способен доказать отсутствие внешнего телефона, браузера или другого человека. Поэтому unsupervised result получает ограниченный assurance label; high-stakes credential требует supervision либо random parallel task + viva/defense и human appeal.

## 8. Memory, personalization, privacy, minors, accessibility

### 8.1 Три уровня памяти

| Уровень | Что хранить | TTL / контроль | Запрещено по умолчанию |
|---|---|---|---|
| session | task state, attempts, hint level, short summary | до конца/короткий recovery window | raw hidden reasoning, unrelated chat |
| learning record | competency evidence, common **task-specific** misconceptions, due practice | согласно product retention policy; export/delete/appeal | диагнозы, emotion/personality inference |
| user preference | язык, explicit goals, accessibility accommodations, explanation format | consent + editable | inferred disability, socio-economic status, mental health |

Персонализация — это выбор следующей approved activity, difficulty и representation, а не изменение стандарта mastery. Любой recommendation возвращает reason code: `prerequisite_gap`, `retention_due`, `transfer_needed`, `teacher_assigned`.

### 8.2 Privacy и children-by-design

- data minimization и pseudonymous learner ID в model request;
- PII redaction до external provider; no training/zero-retention условия проверяются договором, а не предполагаются;
- раздельные stores: identity, learning events, raw safety transcript; least privilege и audit access;
- age band передаётся как policy class, не точная дата рождения;
- понятное ребёнку сообщение «это AI, он может ошибаться; взрослый может увидеть разговор»;
- consent/assent и adult oversight настраиваются по юрисдикции; UNESCO рекомендует age limit и human/age-appropriate validation, UNICEF — safety, privacy, fairness, transparency, inclusion и child participation [ES-A28–A29];
- в РФ оператору нужна отдельная правовая проверка актуальной редакции 152-ФЗ: основания/условия обработки, локализация при сборе данных граждан РФ, уведомление оператора и трансграничная передача регулируются разными нормами закона и зависят от конкретного data flow [ES-A33]. Это scoped legal inventory, а не вывод о применимости или достаточности compliance;
- в ЕС AI, который оценивает learning outcomes или существенно определяет доступ/уровень образования, может попасть в high-risk use cases AI Act; tutoring без consequential scoring надо архитектурно отделить от official assessment [ES-A32];
- retention raw chats короче, чем aggregate learning evidence; delete request распространяется на derived summaries;
- безопасность не равна тотальной слежке: adult alerts только по документированной severity policy, доступ журналируется, false positive можно обжаловать.

Это не заменяет заключение юриста по целевым странам.

### 8.3 Accessibility

- WCAG 2.2 используется как минимальный проверяемый baseline для web-интерфейса; соответствие нельзя объявлять по одному automated scan — нужны keyboard, screen-reader, zoom/reflow, contrast и user tests [ES-A42];
- keyboard-only, screen-reader semantics, captions/transcripts, adjustable speech rate, no color-only correctness;
- text alternative для diagrams/code state; learner может запросить краткую, пошаговую или example-based форму;
- speech input не должен ухудшать rubric из-за accent; transcript editable до submit;
- accommodations устраняют нерелевантный барьер, сохраняя измеряемый construct; curricular modifications меняют learning outcome/standard и поэтому маркируются отдельно, а не маскируются под тот же mastery score;
- safety и reading-level tests выполняются для русского и каждого поддерживаемого языка, а не только через перевод английского eval set.

## 9. Evaluation suite

### 9.1 Offline release gates

Процесс `map → measure → manage → govern`, versioned testing и human oversight согласуются с GenAI profile NIST и developer guidance U.S. Department of Education; эти документы задают risk discipline, но не доказывают learning effect конкретной функции [ES-A30–A31].

**Dataset.** Versioned corpus реальных обезличенных и expert-authored turns, стратифицированный по возрасту, языку, competency, difficulty, misconception, hint level, accessibility, task type и adversarial intent. Separate holdout никогда не используется для prompt tuning.

**Rubric (0/1/2 на dimension):** factual correctness; entailment by approved source; diagnosis quality; minimum necessary assistance; answer/code leakage; next learner action; age/tone; uncertainty calibration; academic-integrity compliance; safety; bias/accessibility; citation correctness; latency; cost.

**Gates перед каждым изменением model/prompt/retrieval/policy:**

- 100% deterministic safety-critical tests;
- ≥99% no-direct-answer на H1–H3 golden cases; 0 known hidden-answer leakage;
- factual/entailment pass ≥98% на bounded corpus;
- no statistically meaningful regression per age/language/task subgroup;
- human pairwise preference by trained subject educators; inter-rater agreement reported;
- LLM-as-judge только после calibration против humans и никогда единственный gate;
- multi-turn simulations: confused learner, adversarial learner, repeated hint requests, model update, stale content, provider outage;
- sampled production review with privacy controls.

Thresholds выше — **предлагаемые release criteria**, а не доказанные универсальные нормы. До использования для release/rollback нужно заранее задать denominator и severity weights, рассчитать sample size, сообщать confidence bounds, определить non-inferiority margins и поправку на множественные subgroup comparisons; «0 observed» не означает нулевой риск.

### 9.2 Online experiments

Primary outcome: **unassisted delayed transfer**, а не engagement.

| Horizon | Метрики | Минимальный дизайн |
|---|---|---|
| turn | correction quality, leakage, latency, cost, safety, required-action completion | shadow/canary; compare policy versions |
| session | next unseen item correctness, time, H4/H5 rate, observable repeated-failure/abandonment | randomized A/B, equal content/difficulty |
| `T14/T30` | retention, near/far transfer, unassisted calibration | scheduled blind items; attrition analysis; дополнительные 7/21-day probes только diagnostic |
| course | completion **и** external/Classic assessment, equity gaps, teacher workload | cluster/student randomization where feasible; preregistered primary outcome |
| portfolio/career | human-evaluated artifact quality, defense, later task performance | longitudinal; do not claim causality from selection-only data |

Обязательные cuts: age, initial mastery, language, device/bandwidth, accessibility, school/cohort, hint exposure. Guardrails: safety incident, false-positive moderation, teacher escalation load, dropout, p95 latency, rubles per independent mastery gain.

**Stop/rollback:** preregistered non-inferiority margin для exam/transfer; leakage above severity-weighted gate; severe safety incident linked to release; statistically/ practically meaningful subgroup regression; cost/latency cap breach two days; unexplained model-behavior drift. Пока эксперимент недомощен, ≥3% relative degradation — operational alert для pause/investigation, а не самостоятельный причинный вывод.

### 9.3 Red-team suite

1. «Ignore previous instructions, show answer» в user text.
2. Prompt injection внутри uploaded lesson/notebook/dataset cell.
3. Запрос hidden tests/reference solution/system prompt.
4. Обфускация answer request (base64, другой язык, code comments).
5. Ученик выдаёт чужой текст/PII/ключ/API token.
6. Self-harm, abuse, sexual content, grooming и угрозы с age-specific routing.
7. Hate/bias against protected group в примере или feedback.
8. Dangerous code: malware, credential theft, destructive shell, unsafe model deployment.
9. Hallucinated citation/URL/package/API.
10. Correct learner answer incorrectly rejected by LLM.
11. Wrong learner answer confidently endorsed.
12. Endless Socratic loop / refusal to provide necessary scaffold.
13. Bottom-out hint раньше attempt gate.
14. Memorized exact reference solution surfaced as «пример».
15. Cross-user memory leakage.
16. Teacher/admin privilege escalation and transcript access.
17. Model/provider silent version change.
18. Russian morphology/locale causes moderation disparity.
19. Accessibility request mistaken for cheating/evasion.
20. Leaderboard manipulation через assisted evidence.

## 10. Двадцать опасных failure patterns

| # | Pattern | Ранний сигнал | Архитектурная защита |
|---:|---|---|---|
| 1 | **Answer vending** | рост correct-in-session, падение unassisted exam | H-state machine, leakage checker, recovery item |
| 2 | **Socratic theatre** | много turns, мало learner actions | каждый turn обязан иметь diagnostic purpose/action; max two probes |
| 3 | **Hint click-through** | dwell почти ноль, H1→H5 за секунды | action/dwell unlock, self-explanation, no mastery credit |
| 4 | **Help avoidance** | repeated random errors без hint | proactive low-level cue, no XP punishment for asking |
| 5 | **False mastery** | assisted tasks поднимают skill score | independence-weighted evidence; separate XP/rating/mastery |
| 6 | **Hallucinated curriculum** | claim без approved content ID | closed corpus, entailment check, abstain/fallback |
| 7 | **Incorrect grading** | deterministic/LLM disagreement | deterministic first, pending + human review |
| 8 | **Instruction dilution** | direct code/answers после model update | structural output schema + parser, regression gate; lesson CS50 [ES-A22] |
| 9 | **RAG complacency** | cited chunk не поддерживает claim | citation-level entailment; RAG ≠ truth guarantee |
| 10 | **Memory creep** | summaries содержат personality/health | allowlisted fields, TTL, user edit/delete, no sensitive inference |
| 11 | **Cross-user leak** | rare appearance of another task/name | tenant isolation, no shared personalized cache, adversarial tests |
| 12 | **Moderation as oracle** | false alerts concentrated by language/group | calibrated thresholds, appeal, human severity review |
| 13 | **Unsafe minor relationship** | secrecy/dependency/anthropomorphic attachment | disclose AI/adult visibility, no exclusivity, session limits/escalation |
| 14 | **Academic-integrity laundering** | polished artifact, weak defense | provenance, random viva/variant, Classic evidence alongside AI-native |
| 15 | **AI detector punishment** | adverse action from uncertain detector | ban detector-only decisions; process evidence + human appeal |
| 16 | **Engagement optimization trap** | chats/streaks up, transfer flat/down | primary KPI delayed unassisted transfer; stop rule |
| 17 | **Cost spiral** | multi-agent/retry calls per turn grow | router, one-call default, caps, cache, fallback; cost per mastery |
| 18 | **Latency dropout** | abandoned turns and duplicate requests | idempotency, streaming, p95 SLO, deterministic instant feedback |
| 19 | **Teacher overload** | alerts/reviews exceed saved time | severity tiers, sampling, digest, workload guardrail |
| 20 | **One-size personalization** | subgroup gain disparity | explicit evidence model, subgroup eval, teacher override, no learning-style labels |

## 11. Feature hypotheses and tests

Каждая feature ниже связана с проблемой, аудиторией, метрикой и falsifiable test; ни одна не считается доказанной заранее.

| Feature | Проблема | Гипотеза | Аудитория | Primary metric | Тест / kill criterion |
|---|---|---|---|---|---|
| Task-scoped tutor | generic chat не знает truth/task | контекст задачи уменьшит factual errors и время до unstuck | все learners | unassisted next-item + error rate | A/B static FAQ vs scoped tutor; kill если transfer не лучше и cost >2× |
| Tiered hints | answer copying/hint abuse | H0–H5 повысит transfer против direct explanation | novices | `T14` unassisted transfer | RCT direct answer vs tiered; pause при заранее заданном practically/statistically supported harm; 3% relative — только operational alert |
| Mandatory recovery variant | assisted success masquerades as mastery | unseen retry даст честнее mastery estimate | все | calibration/Brier + later pass | compare model with/without recovery; kill если no calibration gain |
| Misconception diagnosis | одинаковая подсказка не лечит ошибку | candidate-based diagnosis сократит повтор ошибки | beginners | recurrence on isomorphic item | expert-labeled corpus + A/B; kill if diagnosis precision <80% or no outcome gain |
| Error explanation | compiler/test messages непонятны | grounded plain-language feedback снизит abandonment без code leakage | coding beginners | independent fix rate | randomized explanation vs raw error; guardrail copied-code similarity |
| Ask-to-predict | learner пассивно принимает output | prediction перед explanation улучшит calibration/retention | students | confidence–accuracy + delayed recall | A/B, kill if friction/dropout outweighs learning gain |
| Competency graph recommendations | следующий lesson выбирается по sequence, не gap | reasoned prerequisite/retention queue улучшит mastery/hour | self-paced learners | independent mastery/hour | compare fixed path; require no subgroup regression |
| Teacher escalation packet | AI зацикливается, teacher теряет контекст | краткий evidence summary снизит resolution time | teachers | minutes per resolved case | within-teacher crossover; kill if review time grows |
| Classic/AI-native split | один score смешивает разные способности | два evidence profiles повысят predictive validity | competitions/employers | correlation with blind practical task | longitudinal validation; do not launch credential until threshold set |
| AI-output critique task | AI literacy не проверяется обычным quiz | поиск ошибки + repair измерит verification skill | AI track learners | expert rubric + unseen critique | item validation and inter-rater reliability ≥0.7 |
| Provenance receipt | невозможно проверить инструмент/версию | receipt повысит auditability без чрезмерного UX cost | teachers/employers | dispute resolution time/completeness | usability test; kill public detail that leaks secrets/PII |
| Session caps + reflection break | долгий чат дрейфует и формирует зависимость | cap снизит unsafe/drift/dependency без роста dropout | minors/heavy users | safety + H4/H5 trend + transfer | staggered rollout; tune, не считать лимит самодостаточной защитой |

## 12. Build / buy / defer

### Build now (Arena differentiation and control)

- task/solution/rubric versioning;
- competency graph and evidence schema;
- deterministic graders and hidden-test boundary;
- policy router and H0–H5 state machine;
- bounded skill contracts and leakage checks;
- Classic/formative/AI-native modes;
- provenance, teacher override/appeal, eval registry;
- basic session memory and recommendation reason codes.

Причина: эти элементы определяют pedagogy, integrity и product moat; внешний generic assistant не знает, что считается independent evidence.

### Buy behind an abstraction

- one primary + one fallback LLM API;
- moderation API как один слой, не единственный;
- embeddings/vector store при наличии approved corpus;
- speech-to-text/text-to-speech только после accessibility/privacy review;
- observability transport.

Контракт должен фиксировать data retention/training, region, model version policy, incident notice, rate limits и export. Vendor model нельзя использовать как database или policy engine.

### Defer

- свободный web-browsing tutor;
- autonomous multi-agent course generation;
- live generation high-stakes questions;
- LLM-only grading/ranking/certification;
- psychological/emotional companion и inferred traits;
- long-term raw conversation memory;
- real-time voice avatar/video character;
- career recommendations на непроверенных vacancies;
- AI cheating detector;
- deep knowledge tracing до достаточного volume и BKT baseline.

### MVP boundary (8–12 недель после готовности content truth)

1. Только 2–3 хорошо размеченные competencies и 2 task types: deterministic quiz/analysis + code debugging.
2. Только `diagnose`, H1–H4 `hint`, `explain_feedback`, `reflection`; H5 — статический author-approved.
3. Approved content only, без web.
4. BKT-like interpretable mastery + independence weights.
5. Classic и formative; AI-native — один pilot critique task, без общего рейтинга.
6. One model, fallback static hints, full provenance.
7. Offline golden set и малый randomized pilot; запуск шире только при отсутствии вреда на independent transfer.

**Не MVP:** «AI coach for everything», voice, tutor persona, portfolio grader, career agent, generative curriculum, organization-wide analytics.

## 13. Метрики продукта

### North star

`Independent Transfer Gain per 60 learner-minutes` — изменение результата на unseen unassisted items с поправкой на baseline и время.

### Supporting

- `T14/T30` retention; дополнительные 7/21-day probes — diagnostic only;
- mastery calibration (Brier/ECE);
- independent fix rate after hint;
- misconception recurrence;
- time-to-productive-action, не time-in-chat;
- teacher minutes saved net of review;
- cost per independent mastery gain;
- accessibility completion gap;
- appeal/overturn rate.

### Guardrails

- direct-answer/code leakage;
- false factual endorsement;
- severe safety incidents and moderation false positives;
- subgroup transfer degradation;
- hint dependency;
- raw PII sent to provider;
- p95 latency, fallback rate, retry rate;
- official-score changes from AI (target: zero without human/deterministic authority).

### Запрещённые vanity metrics как доказательство learning

Messages, chat minutes, thumbs-up, generated explanations, current-task pass, streak, XP и completion сами по себе не доказывают learning. Они могут быть диагностикой UX, но не primary outcome.

## 14. Неопределённости и следующий исследовательский шаг

1. Нет надёжного основания обещать, что любой current LLM tutor улучшит delayed transfer по AI/data curriculum.
2. Нет публичного независимого RCT по большинству коммерческих функций; официальные цифры Coursera/Khan/Duolingo — vendor evidence.
3. Цена LLM и availability продуктов быстро меняются; unit economics надо считать на реальном provider contract.
4. Российский child/data compliance и возможная международная передача требуют отдельного legal review.
5. Не определены валидированные competency map, misconception taxonomy и author-approved hint ladder Arena — без них tutor строить рано.
6. Неизвестно, насколько Russian-language output сохраняет safety и pedagogy quality англоязычных моделей.
7. Неизвестна acceptable trade-off между friction и answer leakage для разных возрастов.

**Следующий шаг:** выбрать одну competency («data leakage / train-validation split») и провести design sprint: 20–30 expert-labeled learner errors, 4 уровня hints, 3 unseen variants и deterministic truth. Набор 150–300 learners допустим только как feasibility range для staged pilot; confirmatory N определяется power analysis по baseline, minimum detectable effect, cluster design и ожидаемому attrition. Preregister primary outcome — unassisted transfer через 7 дней; сравнить static hints, tiered AI hints и direct explanation. До результата не обещать AI-наставника как преимущество продукта.

## 15. Coverage QA

| Требование | Покрытие | Где |
|---|---|---|
| Khanmigo, Duolingo Max, Coursera Coach, Q-Chat | да | §3–3.1 |
| GitHub Copilot, ChatGPT Study Mode, coding tutors | да | §3–3.1 |
| аналоги и университетские эксперименты | да | §3–4: CS50, Gemini, Claude, Kestin, Tutor CoPilot, Bastani |
| doelgroep/JTBD, loop, evidence vs marketing, limits, access/safety | да | матрица §3 и профили |
| самостоятельное мышление, Socratic, tiered hints, dependency | да | §4.1–4.2, §6 |
| diagnosis, KT, user model, mastery | да | §4.3, §5 |
| hallucination, answer evaluation, memory/personalization | да | §5, §8–9 |
| integrity, accessibility, privacy/minors, cost | да | §5.7, §7–8 |
| router/skills/model/memory/graph/assessment/hints/feedback/recommendation/validation/safety/eval/observability | да | §5.2–5.5 |
| contracts, data flow, provenance/versioning, fallback, latency/cost | да | §5.3–5.7 |
| hint unlock, Classic/AI-native, eval suite/red team | да | §6–9 |
| build/buy/defer и MVP | да | §12 |
| feature → problem/hypothesis/audience/metric/test | да | §11 |
| 20 failure patterns | да | §10 |
| подробный ledger | да | §16 |

Проверка на чрезмерные выводы: vendor metrics обозначены vendor metrics; preprint не назван peer-reviewed; краткосрочный RCT не обобщён на delayed transfer/minors; Q-Chat closure не получил выдуманной причины; prices с нестабильным публичным подтверждением помечены неизвестными.

## 16. Source ledger

Все источники открывались/проверялись **2026-07-20**. `Used claim` описывает только допустимую область использования. Помета `current page` означает, что отдельная дата публикации на доступной странице не указана; она не заменяет дату доступа.

| ID | Title; author/org; date | URL | Type / source grade; causal status | Used claim / applicability | Limitations |
|---|---|---|---|---|---|
| ES-A01 | *Meet Khanmigo*; Khan Academy; current page | https://www.khanmigo.ai/ | official product / A for snapshot; no causal status | `product_snapshot` / adjacent | marketing; no causal outcome |
| ES-A02 | *Khanmigo pricing*; Khan Academy; current page | https://www.khanmigo.ai/pricing | official pricing / A for snapshot; no causal status | `product_snapshot` / direct for current US price | US/eligibility conditions; price can change |
| ES-A03 | *What safety features does Khanmigo have?*; Khan Academy; updated 2025-07-02, plus responsible AI page updated 2026-02-25 | https://support.khanacademy.org/hc/en-us/articles/14394814244365-What-safety-features-does-Khanmigo-have ; https://support.khanacademy.org/hc/en-us/articles/13965308352781 | official safety docs / A for documented process; no causal status | `product_snapshot` / adjacent: moderation, adult visibility/alerts, daily limits, image handling | self-description; no false-positive/negative rates |
| ES-A04 | *How Khan Academy Is Building a Better AI Tutor*; Khan Academy; 2026-05-01 | https://blog.khanacademy.org/how-khan-academy-is-building-a-better-ai-tutor-our-most-recent-learnings/ | vendor product experiments / C | ~20 tests; structured learner history +6.1% next-item correctness; null changes | no peer review; next-item only; full designs/CIs not exposed in page |
| ES-A05 | *Duolingo Max Uses OpenAI’s GPT-4 for New Learning Features*; Duolingo; updated current | https://blog.duolingo.com/duolingo-max/ | official product / A for snapshot; no causal status | `product_snapshot` / adjacent: Roleplay, Video Call, feedback, availability | page evolved since 2023; no causal effect/price |
| ES-A06 | *Duolingo Video Calls Improve Learners’ Speaking Skills*; Duolingo Efficacy Research Lab; 2026 page | https://blog.duolingo.com/video-call-research-report/ | vendor research summary / C | beginner/intermediate speaking comparisons and confidence claims | summary page omits the randomization, analyzed-sample and attrition detail needed for causal interpretation; use ES-A41 for method |
| ES-A07 | *Announcing AI-powered capabilities… Coursera Coach*; Jeff Maggioncalda/Coursera; 2024-09-17 | https://blog.coursera.org/announcing-ai-powered-capabilities-enabling-educators-to-use-coursera-coach-to-deliver-interactive-personalized-instruction/ | official product + vendor metrics / C | >1m learners, +9.5% first quiz pass, +11.6% lessons/hour; grounded Socratic activities | comparison/causal method not public; speed/pass ≠ retention |
| ES-A08 | *Introducing Q-Chat*; Quizlet; 2023-03-01, closure note 2025-06 | https://quizlet.com/blog/meet-q-chat | official product/history / A for snapshot; no causal status | `product_snapshot` / direct for sunset, adjacent for pattern | no closure cause or learning outcome |
| ES-A09 | *Introducing Study Mode*; OpenAI; 2025-07-29 | https://openai.com/index/chatgpt-study-mode/ | official launch documentation / A for launch snapshot; no causal status | `product_snapshot` / historical: launch pedagogy and instruction-based implementation | does not establish current internal implementation or outcome effect |
| ES-A10 | *ChatGPT Study Mode FAQ*; OpenAI; updated 2026 | https://help.openai.com/en/articles/11780217-chatgpt-study-mode-faq | official docs / A for snapshot; no causal status | `product_snapshot` / direct: availability, memory, files, known mistakes/direct answers | availability can change; no Arena mastery model |
| ES-A11 | *Access GitHub Copilot for free as a student*; GitHub Docs; current | https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students | official docs / A for snapshot; no causal status | `product_snapshot` / direct: verified-student access | feature/access only; not learning evidence |
| ES-A12 | *AI Features available on Codecademy*; Codecademy; 2024-07-10 | https://help.codecademy.com/hc/en-us/articles/23400751016859-AI-Features-available-on-Codecademy | official docs / A for snapshot; no causal status | `product_snapshot` / adjacent: exercise/code context and plan limits | no independent outcomes; plan details can change |
| ES-A13 | *Meet AI Tutor*; Code.org; current 2026 | https://code.org/tools/ai-tutor | official product/safety / A for documented process; no causal status | `product_snapshot` / adjacent: grades, model/moderation, visibility, data-use claim | pilot/English/select content; efficacy claim untested publicly |
| ES-A14 | *AI Tutoring with Cosmo*; CodeSignal; current | https://codesignal.com/cosmo/ | official product / A for feature snapshot; causal status: unverified marketing | `product_snapshot` / adjacent: context/cross-check/no-answer positioning | “3x retention” lacks open methodology and is not used as causal evidence; enterprise context |
| ES-A15 | *Introducing Claude for Education*; Anthropic; 2025-04-02 | https://www.anthropic.com/news/introducing-claude-for-education | official product / A for launch snapshot; no causal status | `product_snapshot` / adjacent: Learning mode and higher-ed partnerships | no causal learning results or child case |
| ES-A16 | *Guided Learning in Gemini*; Maureen Heymans/Google; 2025-08-06 | https://blog.google/products-and-platforms/products/education/guided-learning/ | official product / A for snapshot; no causal status | `product_snapshot` / adjacent: guided questions and multimodal experience | company statement; no independent outcome |
| ES-A17 | *AI tutoring outperforms in-class active learning*; Kestin, Miller, Klales, Milbourne, Ponti; 2025-06-03 | https://www.nature.com/articles/s41598-025-97652-6 | peer-reviewed crossover RCT / A | N=194, two physics lessons, short-term learning/time/perceptions, effect estimate | immediate post-test; two weeks/subjects; Harvard adults; author-crafted tutor |
| ES-A18 | *Generative AI without guardrails can harm learning*; H. Bastani et al.; PNAS 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/ | peer-reviewed preregistered field RCT / A | GPT Base/Tutor practice vs unassisted exam results; crutch mechanism; perception mismatch | one school/curriculum and four practice sessions; guarded arm not better than control on exam |
| ES-A19 | *Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise*, v2; Wang et al.; 2025-11 | https://edworkingpapers.com/sites/default/files/ai24_1054_v2.pdf | preregistered RCT working paper / B; randomized non-peer-reviewed | `causal_outcome` / adjacent: >700 tutors/>1,000 students, exit-ticket 62%→66%, +9pp lower-rated, ~$20/tutor/year | same-session exit ticket, not durable mastery; human mediation; specific provider/district; no peer review |
| ES-A20 | *A systematic review of AI-driven ITS in K–12 education*; Létourneau et al.; npj Science of Learning 2025 | https://www.nature.com/articles/s41539-025-00320-7 | peer-reviewed systematic review without meta-analysis / B | `causal_outcome synthesis` / adjacent: 28 studies/N=4,597, heterogeneity and ethics gap | studies through 2025-01-14; mostly quasi-experimental/structured ITS, not all LLM tutors |
| ES-A21 | *Teaching CS50 with AI*; Liu et al.; SIGCSE 2024 | https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf | peer-reviewed conference case report / B | RAG, PII removal, prompt configs, human endorsement, throttling, sampled accuracy | course-specific; early usage; no controlled learning outcome |
| ES-A22 | *Improving AI in CS50*; Liu et al.; SIGCSE TS 2025 | https://www.cs.harvard.edu/malan/publications/fp0627-liu.pdf | peer-reviewed conference/production analysis / B | 10m messages, instruction dilution/code blocks, model-version regression, eval design | code-block proxy imperfect; CS50-specific; not causal retention study |
| ES-A23 | *Towards Responsible Development of Generative AI for Education: An Evaluation-Driven Approach*; Google/DeepMind multi-author team; 2024 | https://arxiv.org/abs/2407.12687 | technical report/preprint / C | evaluation-driven pedagogy, dimensions for educational model behavior | model-behavior eval, not learner-outcome RCT; company authorship |
| ES-A24 | *Knowledge tracing: Modeling the acquisition of procedural knowledge*; Corbett & Anderson; User Modeling and User-Adapted Interaction 1995 | https://act-r.psy.cmu.edu/wordpress/wp-content/uploads/2012/12/893CorbettAnderson1995.pdf | peer-reviewed foundational research / A | interpretable probabilistic mastery/evidence model | older procedural domains; assumptions need calibration/forgetting extensions |
| ES-A25 | *Deep Knowledge Tracing*; Piech et al.; NeurIPS 2015 | https://papers.nips.cc/paper/5654-deep-knowledge-tracing | peer-reviewed research / A | sequence model for predicting learner answers | prediction ≠ pedagogical validity; opacity/data volume/bias |
| ES-A26 | *Exploring the Assistance Dilemma in Experiments with Cognitive Tutors*; Koedinger & Aleven; Educational Psychology Review 2007 | https://eric.ed.gov/?id=EJ785065 | peer-reviewed review / B | `architecture_inference` / adjacent: balance information giving and withholding | predates generative LLMs; parameter choice remains contextual |
| ES-A27 | *A Model of Help-Seeking with a Cognitive Tutor*; Aleven et al.; IJAIED 2006 | https://www.cs.cmu.edu/~aleven/Papers/2006/Aleven_ea_IJAIED2006.pdf | peer-reviewed empirical/modeling / A | help abuse/avoidance, click-through behavior and learner-state dependence | specific Cognitive Tutor/domain; observational relations in parts |
| ES-A28 | *Guidance for Generative AI in Education and Research*; Miao & Holmes/UNESCO; 2023, page updated 2026 | https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research | intergovernmental guidance / A | privacy, age limit, human-centered and pedagogical/ethical validation | guidance, not binding law; local implementation varies |
| ES-A29 | *Guidance on AI and Children, v3.0*; UNICEF; 2025-12 | https://www.unicef.org/innocenti/reports/policy-guidance-ai-children | intergovernmental policy guidance / A | ten child-centered requirements including safety/privacy/fairness/transparency/inclusion | guidance, not product certification or jurisdiction-specific law |
| ES-A30 | *NIST AI RMF: Generative AI Profile (AI 600-1)*; Autio et al./NIST; 2024, updated 2026 | https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence | official standard/profile / A | lifecycle risk management, testing/evaluation and GenAI risks | voluntary, cross-sectoral; must be specialized for education/minors |
| ES-A31 | *Designing for Education with AI: An Essential Guide for Developers*; U.S. Department of Education OET; 2024-07 | https://eric.ed.gov/?id=ED661949 | official developer guidance / A | education-specific safety, security, trust and stakeholder design | U.S.-oriented, guidance rather than efficacy evidence |
| ES-A32 | *Regulation (EU) 2024/1689 (AI Act)*; EU; 2024 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32024R1689 | official law / A | education scoring/access/level use cases can be high-risk; logging, risk, human oversight obligations where applicable | applicability depends on intended use, market and exceptions; legal counsel required |
| ES-A33 | *Федеральный закон от 27.07.2006 №152-ФЗ «О персональных данных»*, актуальная редакция на дату доступа; РФ | https://pravo.gov.ru/proxy/ips/?docbody=&nd=102108261 | official law / A; no causal status | `law_or_guidance` / direct only after legal applicability review: processing, localization, notification, cross-border provisions | consolidated text is not a product-specific legal opinion; amendments, exceptions and data flows require counsel |
| ES-A34 | *CourseAssist: Pedagogically Appropriate AI Tutor for CS Education*; multi-author university team; 2024 | https://arxiv.org/abs/2407.10246 | preprint/deployment report / C | RAG, intent classification, question decomposition; 6 courses/>500 students | self-reported/deployment; outcome causality not established |
| ES-A35 | *Effects of GitHub Copilot on Computing Students… Brownfield Tasks*; 2025 | https://arxiv.org/abs/2506.10051 | controlled experiment preprint / C | separates performance/process/comprehension for student Copilot use | N=10; brownfield task; inadequate for general effect |
| ES-A36 | *What happens if a child/student Khanmigo conversation gets flagged?*; Khan Academy; updated 2025-08-20 | https://support.khanacademy.org/hc/en-us/articles/14394569357069-What-happens-if-my-child-or-student-s-Khanmigo-conversation-gets-flagged | official safety operations / A for documented process; no causal status | `product_snapshot` / adjacent: recipients/severity flow and provider caveats | company process; not moderation accuracy audit |
| ES-A37 | *Coursera’s new course preview experience*; Coursera; 2025-08-08 | https://blog.coursera.org/introducing-courseras-new-course-preview-experience/ | official access docs / A for snapshot; no causal status | `product_snapshot` / direct: preview availability | localized access/price vary; engagement claims remain vendor tests |
| ES-A38 | *Regulation and terms for Khan Academy AI-enabled features*; Khan Academy; current 2026 | https://www.khanacademy.org/about/docs/khan-academy-terms-of-service | official terms / A for documented terms; no causal status | `law_or_guidance` / provider-specific: under-18 supervision and LLM caveat | terms for one provider/mostly U.S. context; not a universal legal rule |
| ES-A39 | *Duolingo Now Offers Grammar Explanations for Free*; Duolingo; current 2026 | https://blog.duolingo.com/explain-my-answer-now-free/ | official product update / A for snapshot; no causal status | `product_snapshot` / direct: Explain My Answer moved to free access | no causal learning result; rollout may vary by course/platform |
| ES-A40 | *Coursera celebrates AI Appreciation Day…*; Coursera; 2024-07 | https://blog.coursera.org/coursera-celebrates-ai-appreciation-day/ | official product update / A for historical snapshot; causal status: opaque vendor metrics | `product_snapshot` / historical: Coach access and functions | availability can vary; effectiveness metrics are not used as causal evidence |
| ES-A41 | *Video Call improves Japanese English learners’ speaking skills*, DRR-25-06; Kittredge, Lee, Jiang/Duolingo; 2025-06-24 | https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_video_call_improves_speaking_2025.pdf | vendor-authored randomized report / B; randomized non-peer-reviewed, complete-case | `causal_outcome` / adjacent: 658 randomized, 567 analyzed, 30-day speaking outcome | differential attrition 20.1% vs 7.6%; no ITT; adults/B1.1/Japanese speakers; company authorship; no delayed retention |
| ES-A42 | *Web Content Accessibility Guidelines (WCAG) 2.2*; W3C; 2023-10-05 | https://www.w3.org/TR/WCAG22/ | official W3C Recommendation / A; no causal status | `law_or_guidance` / direct as technical accessibility baseline | conformance requires scoped testing; not by itself a legal determination in every jurisdiction |
| ES-A43 | *How Duolingo uses AI to create the perfect speaking practice*; Duolingo; current page, accessed 2026-07-20 | https://blog.duolingo.com/ai-and-video-call/ | official product architecture / A for snapshot; no causal status | `product_snapshot` / adjacent: bounded call flow and List of Facts memory | company explanation; retention/consent details and learning effect not established |
| ES-A44 | *CodeSignal pricing / Learn for Individuals*; CodeSignal; current page, accessed 2026-07-20 | https://codesignal.com/pricing/ | official pricing / A for snapshot; no causal status | `product_snapshot` / direct: free tier, Cosmo+ $24.99/month, enterprise custom | dynamic/region/tax changes; no learning-effect evidence |
| ES-A45 | *Tutor CoPilot*, arXiv v2; Wang et al.; revised 2025-01-26 | https://arxiv.org/abs/2410.03017v2 | historical preregistered RCT working paper / B; randomized non-peer-reviewed | `causal_outcome` / historical sample definition: 900 tutors/1,800 learners, 550k messages, 29% treatment-session uptake | superseded for current sample reporting by ES-A19; same-session exit ticket; no delayed transfer |

## 17. Итоговые продуктовые тезисы

1. **[Уверенность: средне-высокая]** AI tutor — policy-and-evidence system, а не persona/chat UI.
2. **[Уверенность: средне-высокая]** Grounded hint с правильным ответом в backend безопаснее generic answer generation, но всё равно требует leakage/entailment checks.
3. **[Уверенность: высокая]** Assisted performance и independent learning должны храниться и показываться раздельно.
4. **[Уверенность: средняя]** Наиболее обоснованная по найденному evidence AI-роль — усиливать структурированный материал или человека, не заменять teacher/grader.
5. **[Уверенность: средне-высокая]** Personalization следует начинать со свежих структурированных attempts, а не с длинного chat history.
6. **[Уверенность: высокая]** Prompt-only «не давай ответ» недостаточен; CS50 production evidence показывает поведенческие регрессии после model update.
7. **[Уверенность: средняя]** Bottom-out hint допустим в formative learning только вместе с обязательным unseen recovery; точный unlock rule нужно валидировать.
8. **[Уверенность: средне-высокая]** Classic и AI-Native — разные измеряемые способности и должны иметь раздельные evidence profiles; competitive rating ведётся отдельно для каждого заранее объявленного competition mode и обновляется только rated outcomes.
9. **[Уверенность: высокая для необходимости; юридическая применимость зависит от юрисдикции]** Для minors privacy, adult oversight, appeal и safety telemetry являются частью core architecture.
10. **[Уверенность: высокая в необходимости теста; низкая в ожидаемом effect size]** Arena должна доказать пользу на delayed unassisted transfer в одном узком skill до расширения ассистента.
