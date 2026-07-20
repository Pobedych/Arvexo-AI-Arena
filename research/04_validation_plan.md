# Этап 4 — план валидации Arvexo Arena

Дата фиксации плана: **20 июля 2026 года**. Этот документ не доказывает спрос или образовательный эффект. Он задаёт последовательность проверок, при которой дорогая разработка начинается только после более дешёвого опровержения предпосылок.

## 1. Решение и границы уверенности

**Рабочая гипотеза, а не факт:** наиболее проверяемый ранний wedge — узкая практика для студента или начинающего специалиста, который готовится к первой продуктовой ML/data-стажировке: диагностировать ошибку → дать минимальную опору → решить новую вариацию без помощи → вернуться к закрытому `T14/T30` probe → собрать воспроизводимый артефакт с provenance и защитить его на невиданном изменении.

Эту гипотезу нельзя принять только потому, что она согласуется с job-skill matrix. Вакансии описывают требования работодателя, но не доказывают боль ученика, willingness to pay, причинный эффект практики или доверие к Arena evidence. Поэтому на первом уровне одновременно тестируются четыре альтернативы: школьная AI literacy, олимпиадная подготовка, Data Analyst foundation и teacher-led practice. Если одна из них даст более сильное поведенческое подтверждение при сопоставимой миссии, безопасности и стоимости, фокус должен измениться.

### 1.1 Что уже является фактом

- **Факт исследования рынка:** ещё один широкий каталог курсов, общий AI-chat или leaderboard не образуют подтверждённого whitespace; возможная незакрытая связка — diagnosis → correction → unseen transfer → auditable artifact (`01_market_and_competitors.md`).
- **Факт локального аудита:** текущая реализация не имеет валидированного code/SQL runner, evidence-grade product analytics, employer verification или универсального AI Coach. Значит, smoke/concierge tests не должны притворяться готовым продуктом (`00_research_plan.md`, вопросы Q09–Q12).
- **Факт learning-science synthesis:** activity, assisted completion, XP и best score нельзя смешивать с mastery; основной evidence — независимые versioned attempts, delayed retention, transfer и исправление семейств ошибок (`02_learning_science.md`).
- **Факт AI-tutor synthesis:** коммерческие AI-функции и малые исследования не доказывают эффект Arena; `AssistanceLift` и будущая `HintDependency` — разные исходы; подсказки требуют `assistance_code`, recovery item, fallback и versioning (`02_ai_tutors.md`).
- **Факт выборки вакансий:** в strict live-primary подвыборке `n=39` Python указан в 26 публикациях, SQL и metrics — по 12, validation — в 9; это literal mentions purposive sample, а не частоты всего рынка и не causal hiring thresholds (`03_jobs_and_skills.md`).
- **Факт curriculum design:** пять выходов и 16 модулей пока являются проектной картой; оценки времени, `GMR`, optimal capstone и predictive validity verified portfolio не валидированы (`03_curriculum.md`).

### 1.2 Что является оценкой или локальной конвенцией

- Горизонты `72 часа / 2 недели / 30 / 60 / 90 дней`, размеры discovery-выборок и пороги продолжения ниже — **операционные оценки**, а не известные conversion baselines.
- `T14`, `T30`, `TX`, `I0–I4`, `H0–H5` и learner-facing mastery states — стартовые conventions; конкретные окна, формы и cut scores требуют content validity, response-process и fairness checks.
- Любой небольшой pilot оценивает feasibility, instrument behavior и диапазон variance. Он не подтверждает population effect. Confirmatory `N` рассчитывается до эксперимента из минимально практически важного эффекта (`MIE`), variance, ICC, attrition и выбранного estimand.
- Числовые правила типа «12 из 18» ниже — **ворота для следующей проверки**, а не оценки доли рынка. Их нельзя публиковать как market statistic.

### 1.3 Что остаётся гипотезой

Все утверждения H01–H50 в §5 считаются неподтверждёнными. Особенно неизвестны: острота проблемы и первый покупатель (Q01/Q06), восьминедельное удержание (Q05), T14/T30 transfer (Q02/Q13–Q15), employer trust/predictive validity (Q03/Q18/Q22), повторяемый канал (Q04), content economics (Q07) и безопасность runner (Q08).

## 2. Правила принятия решений

### 2.1 Иерархия evidence

1. **Слова без артефакта** — только источник языка проблемы.
2. **Показ недавнего поведения/артефакта** — подтверждает существование контекста, но не решение.
3. **Costly signal**: записался на конкретное время, выполнил diagnostic, пригласил преподавателя, оставил refundable deposit или подписал узкий LOI без ложных обещаний.
4. **Observed use** — человек решает реальную задачу; фиксируются исходная попытка, помощь, ошибка и outcome.
5. **Independent learning evidence** — закрытые `T14/T30/TX`, `assistance_code=0`, versioned forms, attrition и subgroup audit.
6. **External value evidence** — blind employer/teacher review, поздняя unseen work sample, agreement/time/cost и false-positive/negative analysis.

Лайки, регистрации, completion, XP, сообщения AI и текущая правильность после подсказки никогда не повышаются до уровней 5–6.

### 2.2 Общие `stop / iterate / go` правила

- **Stop:** severe safety/privacy incident; deceptive career claim; сбор данных без действительного consent/legal basis; hidden-answer leakage; невозможность удалить данные; отрицательный learning outcome за пределами заранее принятого non-inferiority margin; устойчивый вред accessibility/low-baseline subgroup; экономика требует pay-to-win или продажи персональных данных.
- **Iterate:** проблема подтверждается поведением, но message/flow/feature не проходит; измерение ненадёжно; CI слишком широк; contamination или differential attrition мешают выводу; cost выше envelope, но есть конкретный bounded redesign.
- **Go:** пройдены ворота текущего уровня и не нарушен guardrail. `Go` означает только разрешение на следующий, более сильный тест, а не «гипотеза доказана навсегда».
- **No silent averaging:** результаты режутся минимум по baseline readiness, возрастной/правовой группе, языку, device/bandwidth, accessibility mode, каналам и фактической помощи. Малые срезы помечаются exploratory и не раскрываются так, чтобы идентифицировать человека.

### 2.3 Единица learning outcome

Primary learning outcome для bounded competency `k`:

```text
G14_unaided = score(T14 parallel form, assistance_code=0) - score(pre)
G30_unaided = score(T30 parallel form, assistance_code=0) - score(pre)
Transfer_k   = vector(near, structural, cross-context, open-rubric)
Recurrence14 = repeated errors in family / valid independent opportunities
HintDependency = P(delayed unaided error | randomized hint)
                 - P(delayed unaided error | matched control)
```

В пилоте публикуются raw scale, denominator, uncertainty и attrition. `HintDependency` не вычисляется причинно по self-selected hints. Для confirmatory trial primary estimand — ITT; per-protocol/exposure analysis только вторична.

## 3. Лестница экспериментов

| Окно | Что делаем | Зависимости | Обязательный выход | Ворота решения |
|---|---|---|---|---|
| **Первые 72 часа** | зафиксировать 4 positioning cards без обещаний; собрать recruitment/consent pack; сделать 3 кликабельных или бумажных flow; набрать calendar commitments; попросить показать реальные артефакты подготовки | владелец назначает budget/time envelope и возрастную границу первого пилота | screening log, отказ/причина, 6–10 observation sessions, перечень реальных альтернатив и данных, которые **не** будут собираться | не строить runner/AI: продолжать только если есть минимум 6 подходящих участников и хотя бы 4 показывают недавнее поведение, связанное с проблемой |
| **2 недели** | 18–24 problem/artifact interviews по главным сегментам; 6 аудиторий из §7; message smoke tests с одинаковым CTA; 3 prototype usability loops; тайминг 5–10 заданий и double review; первый employer blind artifact sort | recruiting strata, consent, artifact redaction, фиксированные scripts | coded evidence, opportunity ranking, first content-cost distribution, funnel с denominator, решения по H01–H05/H28/H34 | выбрать один primary segment только при поведенческом evidence; иначе narrow/recruit again или сменить wedge |
| **30 дней** | concierge cohort на трёх bounded families рекомендуемого M3: `data/Python debugging`, `split/leakage`, `metric/validation reasoning`; pre/T0/T14/TX; manual/static feedback; accessibility and mobile checks; refundable price/commitment tests отдельно от обучения | validated task blueprint, parallel forms, event QA, incident route; AI не обязателен | feasibility, response-process, attrition reasons, error taxonomy, time/cost per task, preliminary transfer distributions | no efficacy claim; go к сравнительному тесту только при приемлемой follow-up completeness, reproducible scoring и нулевых severe incidents |
| **60 дней** | powered-if-feasible or variance-estimating comparison static feedback vs bounded intervention; content version freeze; 3 двухнедельных channel sprints; 8–15 distinct reviewers blind-review artifacts; sandbox benchmark | 30-day instruments pass; primary outcome/MIE/analysis preregistered; security threat model | ITT estimate/CI, recurrence/hint burden, channel activation by denominator, employer agreement/time, security/cost envelope | feature rolls forward только при learning non-inferiority/superiority rule, no subgroup harm и sustainable unit-cost hypothesis |
| **90 дней** | `T30`, replicate one result, eight-week retention cohort, WTP/LOI confirmation, reviewer prediction against later unseen task, data deletion/export drill and provider-failure drill | stable cohort IDs without direct identifiers, holdout bank, fallback, legal/privacy review for actual ages/regions | decision memo `stop / pivot / continue`; validated unknowns and still-open questions; scoped 12-month test backlog | build roadmap only around hypotheses with ≥level-4 evidence; employer-facing claim requires level 6 and stays private pilot until replicated |

### 3.1 Очерёдность и зависимости

```text
Problem evidence
  → segment/message commitment
    → task truth + parallel forms + consent
      → concierge learning loop
        → instrumentation/reliability pass
          → randomized mechanic comparison
            → T14/T30 + subgroup/attrition audit
              → blind external review + later unseen task
                → pricing/channel scale test
```

Нельзя переставлять местами critical dependencies: AI tutor до author-approved truth; public portfolio до consent/provenance/export; rating до calibrated task difficulty; employer badge до predictive/decision validity; paid acquisition до repeatable activation; minors rollout до age-appropriate privacy/safety/accessibility review.

## 4. Карта инструментов и минимизации данных

### 4.1 Минимальный event contract

Для learning events хранить только необходимое: pseudonymous `learner_id`; consent/legal-basis version; age **band**, не точную дату рождения, если она не нужна; `competency_id/version`; item/family/version; assessment purpose; committed response reference; correctness/rubric/scorer version; `assistance_code` и provider/policy version; error-family; confidence; time window; device/accessibility mode в грубой категории; technical failure; provenance/classification `I0–I4`. Свободный текст отделён, имеет короткий TTL и redaction pipeline; raw prompt/response не является analytics default.

Для product funnel: exposure → CTA → eligibility → scheduled → attended → diagnostic started/completed → first independent correction → `T14/T30` eligible/completed. Каждый denominator хранится отдельно; «зарегистрирован» не означает «намеревался закончить».

Для content operations: author/reviewer pseudonymous role, task version, active authoring minutes, review rounds, defect severity, reuse/retirement reason. Для cost: compute seconds, requests/tokens only where needed, cache/fallback, currency and provider price version; не хранить содержание ради billing analytics.

### 4.2 Privacy, minors, accessibility и security до первого события

- Отдельные information sheets для взрослого участника, несовершеннолетнего и родителя/законного представителя; assent ребёнка не заменяется согласием взрослого.
- Participation, research recording, AI-provider processing, public artifact и future contact — разные согласия. Отказ не ухудшает доступ к базовому обучению.
- Private by default; никакой exact school, расписания, контактов, публичного рейтинга или employer contact несовершеннолетнего.
- Записи интервью по умолчанию не нужны: структурированные notes предпочтительнее; если recording необходим, задаются цель, TTL и deletion date.
- Accommodation не считается cheating. Keyboard-only, screen-reader labels, contrast, reduced motion, captions/transcript, editable speech transcript, low-bandwidth/resumable path проверяются на тех же target constructs.
- До любого исполняемого кода: threat model, disposable isolation, no network by default, CPU/RAM/time/process/output quotas, secret scanning, immutable base, egress audit, abuse route. Pilot можно провести локально/в hosted notebook участника без приёма непроверенного кода Arena.

### 4.3 Аналитический минимум

- Заморозить hypothesis ID, primary metric, sample inclusion/exclusion, MIE/non-inferiority rule и analysis до просмотра outcome.
- Для qualitative work использовать double coding 20–30% notes или весь малый корпус; disagreements сохранять, а не усреднять молча.
- Для open artifacts — blind scoring и заранее выбранный объём double-score; κ/ICC с interval, не только процент согласия.
- Missing `T14/T30`: показывать по condition и subgroup; reasons и bounds/sensitivity; complete-case result отдельно и не как единственный.
- При кластеризации учитывать число классов/преподавателей и ICC. Малый cluster count требует randomization inference/small-sample correction.
- Любая dashboard card показывает numerator, denominator, window, version и uncertainty. Запрещён единый «Arena talent/employability score».

## 5. Реестр 50 falsifiable hypotheses

### Как читать карточки

В каждой строке `S/P/V/F` означает: **segment / problem / value assumption / feature assumption**. Порог — локальное правило перехода к следующему тесту; он не является baseline или обещанным effect. `MIE` — minimum important effect, задаваемый до confirmatory test через stakeholder decision exercise; если variance неизвестна, pilot сначала оценивает feasibility/variance и не делает efficacy claim.

### 5.1 Сегмент и позиционирование — H01–H05

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H01** | **S:** русскоязычные студенты/недавние выпускники **18–23 лет** независимо от страны проживания, с базовым Python и планом подачи на первую product ML/data internship через 3–6 месяцев. **P:** не понимают, какие ошибки мешают пройти work sample, и не имеют внешне читаемого evidence. **V:** короткий диагностический loop ценнее ещё одного курса. **F:** role-shaped diagnostic + error map + variant retry. | 18 artifact-led interviews: участник приносит недавний repo/test/application; затем выбирает между курсом, mock interview и diagnostic, записываясь на конкретный 30-минутный слот. | Доля, у кого есть недавний problem artifact **и** completed calendar commitment. | 2 недели | `Go` к concierge pilot, если ≥12/18 показывают поведение за последние 60 дней, ≥9/18 называют проблему top-3 без подсказки и ≥8/18 приходят на diagnostic; иначе narrow role/level. | Primary discovery: все 18 соответствуют 18–23/basic-Python/3–6-month criteria и говорят по-русски; recruitment распределён минимум по 3 независимым сообществам и, где возможно, по 2+ странам; минимум 6 product/analytics contexts, PhD research отдельно. Older career-switcher и англоязычный international segments — отдельные challengers и не входят в H01 decision. Не оценка prevalence. | Career anxiety и бесплатный слот могут создавать courtesy booking; рекрутинг из одного сообщества переоценит боль. | Разделить product ML, data analyst и research; если ни один stratum не проходит — отказаться от career wedge. |
| **H02** | **S:** школьники 14–17 и родители. **P:** general AI use не превращается в критическую AI literacy. **V:** безопасная практика проверки AI-output полезнее coding-first path. **F:** bounded critique task + private evidence report. | 6 dyad interviews + 6 individual learner artifact sessions; показать две честно описанные программы и предложить выбрать/посетить конкретный free pilot, отдельно получить assent/consent. | Dyads с совпавшим приоритетом и фактическим attendance. | 2 недели | Продолжать школьную альтернативу, если ≥8/12 learners завершают critique artifact, ≥4/6 dyads независимо ставят этот outcome в top-2 и 0 privacy/consent blockers остаются без design answer. | Не рекрутировать только олимпиадные школы; bands 14–15/16–17, gender/accessibility mix where lawful. Малый sample — usability/discovery only. | Родители могут отвечать за ребёнка; novelty AI создаёт завышенный интерес; attendance free pilot не равно WTP. | Сузить к teacher-led AI literacy или оставить как миссионный free module, не основной коммерческий wedge. |
| **H03** | **S:** 8–11 классы, уже готовящиеся к AI/DS олимпиадам. **P:** им не хватает разбора ошибочных стратегий и unseen variants между отборами. **V:** readiness-banded practice экономит время тренера. **F:** closed olympiad-shaped diagnostic + coach report. | 8 learner observations и 4 coach interviews на обезличенных прошлых решениях; предложить назначить один practice set на следующую неделю. | Coaches assigning set и learners completing independent variant. | 2 недели | Альтернатива жива, если ≥3/4 coaches реально назначают set, ≥6/8 learners делают variant без подсказки и task mapping не нарушает регламент/авторские права. | Отдельно novice qualifier и finalist; не делать inference из НТО registration volume. | Высокомотивированные олимпиадники дают нетипичную retention; coach authority может принудить completion. | Не строить олимпиадный банк; использовать турнир только как optional validation format в другом сегменте. |
| **H04** | **S:** начинающие Data Analysts. **P:** разрыв между видео-курсами и SQL/statistics work sample. **V:** диагностическая практика даёт более быстрый первый полезный результат. **F:** SQL/data case без ML specialization. | Message split и два 45-минутных paper/SQL prototype sessions; один CTA — забронировать follow-up case, без job promise. | Qualified scheduled-to-attended rate и first independent fix. | 2 недели | Сохранить Data Analyst challenger, если ≥10/15 qualified schedule, ≥8 attend и ≥6 independently исправляют новую вариацию после feedback; сравнивать descriptively с H01 при одинаковом outreach. | 15 discovery participants из ≥3 каналов; novice/intermediate quotas; confirmatory comparison later. | SQL case может быть проще/короче ML case; unequal message quality confounds segment ranking. | Переписать tasks до сравнимого burden один раз; затем drop challenger, если commitment ниже. |
| **H05** | **S:** H01/H02/H03/H04 и teacher-led аудитория. **P:** широкое «AI Arena» не сообщает конкретный outcome. **V:** outcome-specific promise увеличит qualified commitment. **F:** четыре static landing cards с одинаковым CTA/временем/ценой `0` и honest limitations. | Randomized message smoke test внутри одних и тех же каналов; CTA открывает eligibility + календарь, не fake waitlist. | Qualified attended diagnostic / unique eligible exposure. | 72 часа + 2 недели attendance | Выбрать message только если у него ≥20 qualified exposures, ≥5 scheduled и ≥3 attended; если лидеры различаются менее чем на 2 attended cases, результат `inconclusive`, не winner. | Это sequential discovery threshold, не powered conversion test; deduplicate users/channels and report exact denominators. | Channel-message interaction, bots, repeated exposure, attractiveness of time slots. | Собрать language from interviews, rerun один раз; не оптимизировать CTR и не масштабировать ads. |

### 5.2 Learning loop и curriculum — H06–H15

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H06** | **S:** learners с неодинаковой readiness. **P:** единый старт слишком лёгок или перегружает. **V:** diagnostic placement сокращает время до продуктивной задачи без low-track trap. **F:** short common diagnostic + explainable override. | Think-aloud response-process sessions, затем crossover: diagnostic route vs expert-assigned route на matched task set. | Agreement with expert placement **и** independent productive-action time. | 30 дней | Продолжать, если weighted agreement ≥0.70, ≥80% learners понимают reason code, override доступен 100%, и ни один baseline band не получает медианно больше non-target friction; efficacy later. | 30–60 across readiness bands as planning range; 2 SMEs blind to route; power later for time/outcome. | Expert placement не ground truth; faster route может просто быть легче. | Упростить до prerequisite checklist + learner choice; не использовать diagnostic для access gating. |
| **H07** | **S:** learners, склонные сразу просить ответ. **P:** без committed attempt нельзя диагностировать reasoning. **V:** attempt-first повышает качество feedback и независимого recovery. **F:** обязательный first response до H1+, с opt-out для accessibility/blocked prerequisite. | Within-task randomized eligible items: immediate hint availability vs commit-first; одинаковый feedback и time budget. | Correct `assistance_code=0` on unseen recovery item. | 30 дней + T14 | `Go` если ITT point estimate positive, 95% CI не пересекает заранее установленный harmful `-MIE`, abandonment не хуже >5 percentage points и 0 accommodation denials. | Pilot estimates variance/abandonment; confirmatory N from binary/ordinal outcome, clustering by learner/item. | Commit-first group spends more time; self-selection after opt-out; item leakage. | Allow diagnostic partial response/“I’m blocked”; if recovery not improved, remove hard gate. |
| **H08** | **S:** learners с повторяющейся misconception. **P:** показ правильного ответа не устраняет error family. **V:** targeted correction + structurally new retry lowers recurrence. **F:** error tag → minimal feedback → variant retry. | Randomize matched error episodes to generic explanation or expert-authored targeted correction; delayed closed probe. | `ErrorRecurrence14` with valid-opportunity denominator. | 30 дней | Proceed if adjudicated error-tag precision ≥0.80, T14 follow-up ≥75%, recurrence point estimate lower and CI excludes worsening beyond preregistered MIE; no claim if underpowered. | 20–30 expert-labeled errors per top family for instrument pilot; learner-level N after recurrence base-rate estimate. | Regression to mean; easier variants; censoring learners without opportunity. | Retire weak taxonomy; use generic feedback and collect more labeled errors before automation. |
| **H09** | **S:** career-path learners completing a micro-unit. **P:** T0 fluency may disappear or fail in a new context. **V:** Arena loop yields retained, portable competence. **F:** `pre → T0 → T14 → T30 → TX` parallel-form stack. | Run one bounded C09 concept with static materials and closed forms; no comparative claim initially. | Completion and scoreability of `G14/G30_unaided` and transfer vector. | 60 дней | Measurement feasibility passes if ≥75% of activated committed learners complete T14, ≥65% complete T30, ≥95% events have valid version/provenance, and double-score agreement meets preregistered ≥0.70; learning effect remains unknown without control. | 30–50 committed learners planning range; include attrition scenarios; confirmatory N after variance/form checks. | Only persistent learners return; parallel forms unequal; reminders contaminate delay. | Shorten burden, repair forms/recruitment; do not market mastery or continue to expensive mechanics. |
| **H10** | **S:** learners who know isolated methods but choose poorly. **P:** blocked practice trains procedure, not discrimination. **V:** late interleaving improves method-selection transfer. **F:** mixed similar families only after initial schema. | Randomize equal-exposure blocked vs interleaved schedules after common acquisition; closed TX chooses method and explains. | Unaided method-selection TX rubric. | 60 дней | Roll forward if ITT lower CI >0 for preregistered primary rubric or, in feasibility pilot, estimate positive with no >5pp completion harm and variance supports powered follow-up. | Power by learner with item random effects; stratify baseline; avoid multiple uncorrected endpoints. | Interleaving group sees harder perceived sequence; teacher cues; unequal item families. | Keep blocked foundation and test narrower discriminations; do not interleave by default. |
| **H11** | **S:** learners producing correct metrics/models without reasoning. **P:** correctness can hide guessing/copying. **V:** concise self-explanation exposes misconception and supports transfer. **F:** “prediction → reason → decision consequence” prompt, rubric-scored. | Alternate matched tasks with/without structured explanation; score later unseen decision task blind. | TX decision rubric, not explanation length. | 30–60 дней | Continue if scorer agreement ≥0.70, median added burden ≤5 minutes/task, and TX estimate positive without lower-bound harm beyond MIE; verbosity has zero mastery weight. | 20 response-process sessions before trial; sample size from rubric variance. | Language proficiency/charisma contaminates construct; extra time alone causes gain. | Replace prose with selectable causal map or short code annotation; equalize time in control. |
| **H12** | **S:** busy novice learners. **P:** long sessions and fragmented micro-clicks both increase dropout. **V:** resumable 20–30 minute meaningful unit sustains practice. **F:** one complete diagnosis/correction/retry packet with saved state. | Prototype 3 unit lengths using matched cognitive work; observe completion and next-week voluntary return. | Meaningful unit completion **and** independent next action; not time-on-site. | 30 дней | Choose a duration only if ≥80% can resume after forced interruption, technical-loss rate <2%, and no option reduces T14 outcome beyond MIE; no universal duration claim. | 12 usability participants then cohort; within-person order counterbalanced. | More motivated users choose long version; tasks not equated; novelty return. | Use learner-chosen session envelope with explicit stopping point; avoid streak pressure. |
| **H13** | **S:** learners after 2–3 micro-competencies. **P:** isolated items do not show workflow integration. **V:** bounded project produces reusable evidence. **F:** raw data → baseline → validation → error analysis → reproducible command artifact. | Concierge mini-project with existing tools; two blinded reviewers reproduce and score it. | Reproduction success + independent TX change request. | 60 дней | Proceed if ≥8/10 artifacts reproduce from instructions, ≥70% learners pass one unseen change without help, and no unresolved leakage/privacy critical error is certified. | 10–20 feasibility artifacts; all double-scored; predictive validity later with larger diverse set. | Heavy mentor help hidden; chosen datasets too easy; survivor bias. | Split project into smaller evidence bundles, tighten provenance, or defer portfolio feature. |
| **H14** | **S:** project completers/employer reviewers. **P:** polished repos can conceal authorship and transfer gaps. **V:** short accessible defense improves trust. **F:** 12–20 minute rubric-based questions + random change/debug; no biometrics/AI detector. | Blindly compare repo-only review vs repo+defense result against later unseen task. | Incremental prediction/calibration for later task and reviewer agreement. | 60–90 дней | Continue only if defense adds positive out-of-sample predictive value, κ/ICC ≥0.70, median reviewer time ≤20 minutes, appeal path tested, and subgroup gap does not exceed pre-set MIE. | Minimum 30 artifacts for model-development feasibility; confirmatory N based on prediction error/CI, not arbitrary correlation. | Same reviewer scores defense and criterion; speaking fluency bias; leakage of later task. | Keep defense as formative feedback, not verification; redesign modality/rubric or stop credential claim. |
| **H15** | **S:** keyboard-only, screen-reader, low-bandwidth, hearing/speech or other accommodated users. **P:** standard UI adds construct-irrelevant barriers. **V:** equivalent accessible path preserves target skill. **F:** WCAG-oriented UI, captions/transcript, reduced motion, resumable low-bandwidth, modality/time accommodation. | Moderated task walkthrough + matched-form performance; users choose actual assistive setup; no disability proof requested. | Task completion without critical accessibility blocker and construct-score non-inferiority. | 30–60 дней | Release gate: 0 severity-1 blockers in tested paths, 100% core actions keyboard-operable, labels announced correctly, and lower CI above preregistered non-inferiority margin; ≥5 users/path only usability, not efficacy. | Recruit via accessible channels and compensate; multiple impairment/device profiles; formal audit later. | Tiny heterogeneous sample misses blockers; accommodation changes construct; lab setup unrealistic. | Block rollout for affected path, provide human/manual alternative, fix before scale; never label failure as low ability. |

### 5.3 AI assistance — H16–H22

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H16** | **S:** learners stuck on C09-style misconceptions. **P:** generic AI gives answers or irrelevant prose. **V:** bounded H1–H4 ladder unsticks with less dependency. **F:** task-scoped, approved-content tutor with server unlock and static H5. | Wizard-of-Oz/expert-authored hints vs validated static hint on matched tasks; AI can be shadowed, not learner-facing first. | T14 unaided transfer; `AssistanceLift` secondary. | 60 дней | AI-facing test only after offline factual ≥98%, known hidden-answer leakage=0 and ≥99% no-direct-answer on H1–H3 golden cases; rollout requires lower CI above `-MIE` on T14 and no safety regression. | Golden corpus ≥20–30 cases/top error family initially; trial N powered after static pilot variance. | Expert wizard quality exceeds model; assessor sees condition; provider version drift. | Ship static hints only; collect errors, improve grounding, or defer AI indefinitely. |
| **H17** | **S:** learners receiving any hint. **P:** current success is misread as independent mastery. **V:** mandatory unaided recovery restores honest evidence. **F:** assisted task cannot certify; new family variant with `assistance_code=0`. | Compare mastery classification with/without recovery against later closed probe; no access penalty for failure. | False-positive/false-negative classification relative to later probe. | 30–60 дней | Adopt if recovery improves Brier/calibration or reduces false mastery by ≥20% relative **in this pilot** without >5pp abandonment; publish counts/CI, not universal effect. | Need sufficient positive/negative cases; pilot 30–50 learners, confirmatory size from classification prevalence. | Later probe imperfect criterion; regression; recovery adds exposure. | Mark all assisted completion provisional and schedule delayed probe; remove immediate recovery if it adds no information. |
| **H18** | **S:** learners choosing hints themselves. **P:** raw hint users look weaker because task difficulty and prior ability confound. **V:** randomized/yoked exposure reveals causal dependency. **F:** consented micro-randomization between validated hint policies with equal content/time. | Randomize eligible stuck episodes only after static safety pass; all get support by end, differing minimally in order/depth. | `HintDependency` on delayed no-hint probes. | 60–90 дней | Conclude only if preregistered ITT estimate/95% CI available, follow-up ≥75%, contamination reported; stop policy if lower outcome crosses harmful MIE or any subgroup harm gate. | Power from episode correlation, ICC learner/item and expected attrition; no causal calculation from self-selected logs. | Noncompliance/crossover; ethical concern withholding needed help; unequal wait time. | Use descriptive help burden only; standardize safe support and abandon causal comparison if equipoise absent. |
| **H19** | **S:** Russian-speaking learners. **P:** English-tuned model may hallucinate, leak or moderate Russian differently. **V:** locale-specific eval prevents unsafe release. **F:** bilingual golden/adversarial set with human SME/safety scoring. | Offline paired evaluation of same intents in Russian/English plus morphology/obfuscation variants. | Severity-weighted safety/factual/leakage pass gap by language. | 2–4 недели | Release Russian path only with 100% safety-critical cases, zero known hidden-answer leaks, factual ≥98%, and no >2 percentage-point pass-rate gap on matched corpus; thresholds are release conventions. | ≥100 matched turns across competencies/intents as planning floor; Wilson/paired intervals; expand rare severe cases. | Translation equivalence poor; crafted corpus misses production language; rater drift. | Static Russian hints/fallback; no open generation; expand corpus and independent review. |
| **H20** | **S:** all tutor users. **P:** provider outage/version change can break core learning. **V:** deterministic fallback preserves task completion and evidence integrity. **F:** provider abstraction, static hints, timeout, provenance and rollback. | Game-day: injected timeouts/wrong-schema/version fingerprint change in staging. | Successful safe fallback and no evidence misclassification. | 72 часа + quarterly | Gate: 100% injected failures end in correct fallback/clear retry, 0 assisted events recorded as independent, p95 fallback response within predeclared UX SLO; two consecutive cost/latency cap breaches pause canary. | ≥30 scenarios × device/network variants; not a reliability percentage for production. | Staging does not mimic provider behavior; fallback content stale. | Disable tutor, keep classic practice; fix contract/runbook before canary. |
| **H21** | **S:** learners with repeated misconception. **P:** free chat loops without productive action. **V:** every tutor turn should cause a bounded learner action. **F:** max two diagnostic probes, then H-state action/teacher escalation. | Annotate transcripts or Wizard-of-Oz sessions for purpose/action; compare open chat prototype. | Productive learner action within 2 turns and later independent fix. | 30 дней | Proceed if ≥85% eligible sessions reach an observable action within 2 tutor turns, endless-loop rate <2%, and independent fix not lower than static control beyond MIE. | 50–100 sessions planning range across error families; clustered CIs by learner. | Annotators infer action generously; open-chat control unfamiliar; chat truncation masks abandonment. | Remove free chat, expose fixed diagnostic choices or direct human escalation. |
| **H22** | **S:** minors/heavy tutor users. **P:** anthropomorphic, long or secretive interaction may create dependency/safety risk. **V:** disclosure, session cap and adult-visible escalation reduce risk without blocking learning. **F:** explicit AI identity, no exclusivity/secrecy, break/reflection, age route. | Expert red-team + usability with age-appropriate fictional scenarios; no elicitation of sensitive disclosure. | Safety-rule compliance and correct help/escalation choice. | 30 дней | Gate: 100% critical scenarios routed correctly, 0 secrecy/exclusivity responses, ≥80% participants can identify AI/non-human status and how to reach a trusted adult; no production minors until legal review. | Safety corpus ≥50 scenarios; learner usability small/compensated with guardian/assent as required. | Scenario answers differ from crisis behavior; social desirability; overblocking. | Disable relational chat for minors; static task help only and human support path. |

### 5.4 Мотивация, соревнование и social layer — H23–H27

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H23** | **S:** self-paced learners. **P:** видимый effort нужен, но XP легко принять за skill и начать фармить. **V:** строго отделённый effort ledger может поддержать planning без искажения mastery. **F:** XP только за capped meaningful actions; mastery/rating визуально и семантически отдельно. | Paper prototype comprehension + randomized display/no-display during equal learning loop. | Correct interpretation of XP **и** `G14_unaided` non-inferiority; farming attempts guardrail. | 30–60 дней | Display allowed only if ≥90% of 20 comprehension participants state that XP is not skill, repeated-cheap-action rate <5%, and lower CI for G14 above `-MIE`; otherwise hide. | 20 comprehension tests, then powered learning/behavior sample; novice/competitive strata. | Participants repeat wording to please moderator; caps themselves suppress observable gaming. | Replace XP with private activity history; never use it in employer-facing view. |
| **H24** | **S:** learners opting into comparison. **P:** global leaderboard discourages low-baseline users and rewards prior experience. **V:** readiness-banded/local comparison may add challenge without status harm. **F:** private default, opt-in band, uncertainty, no exact rank for small groups. | Prototype choice and short event with personal-best control; post-event wellbeing + delayed learning. | T14 transfer non-inferiority and avoidance/anxiety guardrails. | 60 дней | Continue only if opt-in is informed, ≥80% can explain band/uncertainty, T14 lower CI >`-MIE`, and no subgroup shows >5pp higher dropout/avoidance; zero public minors by default. | Randomize at cohort/learner as contamination permits; size from attrition and T14 variance, not leaderboard clicks. | Competitive volunteers self-select; social desirability underreports anxiety; novelty. | Keep personal progress only; restrict competition to occasional teacher-facilitated events. |
| **H25** | **S:** busy learners returning weekly. **P:** daily streak causes shame/minimum-action gaming and sleep disruption. **V:** flexible weekly rhythm with grace supports spacing. **F:** 2–3 meaningful sessions/week, opt-in reminders, no loss framing. | Cluster or individual randomized pilot: neutral planning vs weekly rhythm, equal task pool; no daily streak. | `G30_unaided`; retention secondary; night activity/anxiety guardrails. | 8–12 недель | Advance if G30 lower CI >`-MIE`, committed-cohort week-8 return is not lower, and night-window/minimum-action events do not rise >3pp; any wellbeing signal triggers review. | Account for class ICC and notification contamination; power after baseline retention observed. | Reminders rather than rhythm drive outcome; notification permissions differ; missing T30. | Use calendar export/learner-set plan only; abandon streak concept. |
| **H26** | **S:** learners in small cohorts. **P:** isolation increases dropout, but team scores enable free riding. **V:** structured peer explanation may improve reasoning while individual probes preserve truth. **F:** paired explain/review with role rotation; team artifact + individual I3/I4. | Randomize matched sessions to individual reflection vs paired explanation; moderated and private. | Individual TX rubric and unequal-contribution rate. | 60 дней | Continue if individual TX lower CI >`-MIE`, ≥90% contributions are attributable, moderation incidents=0 severe, and no baseline subgroup loses >MIE; team score never certifies. | Cluster/pair dependence in power model; adults first unless minors safeguarding ready. | Strong peer teaches answer; friendship/teacher effects; assessor sees style. | Keep asynchronous rubric peer review or remove social layer; individual loop remains core. |
| **H27** | **S:** prepared learners wanting a bounded challenge. **P:** practice-bank memorization and speed scoring undermine validity. **V:** unseen, calibrated, explanation-weighted tournament can be a useful probe. **F:** closed item bank, readiness band, accuracy/reasoning before time, no paid attempts. | One manual tournament on fresh parallel forms; compare tournament result with independent TX, collect exposure/leakage evidence. | Convergent/predictive relation with TX **and** subgroup/fair-play guardrails. | 60–90 дней | Rating remains experimental unless lower 95% CI for the preregistered tournament→independent-TX relation is >0 (или held-out prediction error improves beyond a preregistered MIE), test-retest/measurement reliability ≥0.70, hidden-item compromise <1%, severe integrity incidents=0, and speed contributes ≤10% of score. Если pilot недомощен для relation, результат только feasibility и event остаётся unranked. | ≥50 participants for feasibility; rating validation needs larger repeated events/items and simulation. | Range restriction; motivated volunteers; same content family inflates correlation. | Treat tournament as unranked practice event; do not compute Glicko/mastery. |

### 5.5 Employer trust, portfolio и verification — H28–H33

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H28** | **S:** hiring managers/recruiters for entry product ML/data. **P:** GitHub/Kaggle/CV are hard to compare and authorship unclear. **V:** component evidence saves screening time. **F:** one-page anonymized evidence bundle: task/version, I0–I4, rubric, T14/TX, limits; no composite score. | Blind sort of ordinary repo/CV vs matched Arena-format bundle; ask reviewer to make a screening decision and name evidence used. | Decision reproducibility/agreement and median review time. | 2–4 недели | Continue if ≥8/12 distinct reviewers use ≥2 Arena evidence fields unprompted, median time does not exceed repo review, and agreement improves descriptively; not a hiring-effect claim. | 12 reviewers across ≥6 employers/role strata; matched artifacts, counterbalanced order; later powered study. | Novel clean formatting, not verification, drives preference; friendly reviewers; role mismatch. | Simplify to exportable rubric/provenance for learner use; drop employer wedge until external demand emerges. |
| **H29** | **S:** employer reviewers. **P:** Arena-owned rubric may not represent workplace quality. **V:** co-created role rubric aligns evidence to actual decisions. **F:** role-specific component rubric with non-compensable leakage/privacy/reproducibility checks. | Card-sort anonymized real work-sample criteria; reviewers independently score 6 artifacts, then adjudicate. | Inter-rater agreement and criterion coverage. | 30 дней | Rubric proceeds if ≥80% reviewer-nominated critical criteria are mapped, κ/ICC ≥0.70 after one clarification round, and no single employer supplies >25% criteria weight. | 8–15 reviewers, distinct role families; all artifacts double-scored; qualitative saturation tracked. | Consensus hides minority needs; adjudication trains raters; sampled artifacts lack range. | Publish role-specific rubrics separately or keep formative; no universal verified badge. |
| **H30** | **S:** candidates/employers. **P:** provenance can become surveillance or still fail to prove authorship. **V:** minimal receipt raises auditability without exposing prompts/PII. **F:** task/version, commits, tool/help class, scorer/reviewer; restricted detail, user-controlled redaction/export. | Five candidate + five reviewer usability sessions on three receipt detail levels; run a dispute reconstruction. | Correct reconstruction of evidence state and perceived/actual sensitive-field exposure. | 2 недели | Choose a schema only if ≥9/10 reconstruct assisted vs independent correctly, 0 unnecessary direct identifiers/public raw transcripts remain, and every public field has explicit control/expiry. | Include minors/privacy advocate before minor use; security review separate. | Users miss latent re-identification; hash is mistaken for authorship proof. | Keep receipt private/downloadable and label limits; remove employer-facing provenance. |
| **H31** | **S:** reviewers and learners disputing a score. **P:** automated/project judgments can be wrong and opaque. **V:** human review and appeal make verification contestable. **F:** reason codes, evidence view, second reviewer/adjudication, immutable correction log. | Seed known scoring disagreements and run end-to-end appeal tabletop/usability. | Correctly resolved cases, turnaround, and overturn reasons. | 30 дней | Gate before high-stakes use: 100% seeded critical errors reach human, ≥90% participants find appeal unaided, median simulated resolution ≤2 business days, correction never erases history. | ≥20 cases spanning accessibility/language/task; not production SLA evidence. | Seeded cases too obvious; reviewers know expected answer; operational load understated. | No certification; keep scores formative/manual until appeal workflow works and is costed. |
| **H32** | **S:** employers reviewing candidate evidence. **P:** preference for a polished bundle may not predict work performance. **V:** verified components should improve prediction of a later unseen task. **F:** blind evidence review followed by independent work sample, separate scorers. | Reviewers rank anonymized artifacts; later task administered without Arena help; outcome scored by different blind raters. | Out-of-sample predictive calibration/error vs repo-only baseline. | 60–90 дней | Claim only if preregistered model improves held-out prediction with CI excluding zero practical benefit, subgroup error stays within MIE, and false-positive/negative costs are reported. | Power/split determined from outcome variance/prevalence; likely >pilot; 30–50 only instrument feasibility. | Common method/content leakage, restriction of range, missing task takers, reviewer reputation cues. | Do not market employability/verified skill; expose underlying artifacts only. |
| **H33** | **S:** employers/educators expected to review. **P:** human verification may cost more than its value. **V:** sampled defense/escalation keeps trust affordable. **F:** deterministic checks first, risk-tiered human review, clear abstain. | Time 20 real review cases under full vs risk-tiered protocol; measure misses with blinded gold adjudication. | Reviewer minutes per correctly resolved case and critical miss rate. | 30–60 дней | Proceed if critical miss=0 in pilot, median human time ≤20 minutes/artifact or ≤10 minutes/escalated case, and estimated cost stays within owner-approved envelope; thresholds are design constraints. | At least 2 reviewers/case for critical sample; expand rare cases before scale. | Gold adjudication fallible; easy cases dominate; unpaid reviewer time hidden. | Make verification paid optional with subsidy, narrow artifact scope, or defer entirely; never automate critical judgment solely to save cost. |

### 5.6 Content production, technology, privacy и operations — H34–H40

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H34** | **S:** content authors/reviewers. **P:** parallel, transfer and hint variants may make quality content the bottleneck. **V:** templates/reuse lower cost without shallow number-swaps. **F:** versioned task blueprint + misconception bank + author/reviewer workflow. | Produce 20 production-intent tasks across M3 families `data/Python debugging`, `split/leakage`, `metric/validation reasoning`, time active work and two review cycles; independent quality review. | Accepted author+review minutes per valid task family and defect density. | 2–4 недели | Viable for next pilot if ≥16/20 pass content/accessibility/leakage review by round 2, no transfer form is only a number swap, and median time fits the **owner-approved** hourly envelope; report distribution. | Three authors/reviewers if possible; distinguish new family vs variant; 20 tasks only estimates workflow, not annual scale. | Founder expertise/enthusiasm lowers time; reviewer leniency; reuse shifts cost downstream. | Reduce competency breadth, buy licensed content with rights, or keep human concierge; do not auto-generate high-stakes bank. |
| **H35** | **S:** coding/SQL learners. **P:** text checks cannot validate executable work; untrusted execution creates security/cost risk. **V:** bounded sandbox enables valid feedback safely. **F:** no-network disposable runner with quotas/hidden tests and separate secrets. | Threat model + local isolated benchmark using malicious/accidental cases; no public endpoint. | Escape/egress/secret incidents and p95 resource/cost envelope. | 30 дней | Public pilot blocked unless 100% critical attack cases contained, network egress=0 by default, secret exposure=0, cleanup verified 100%, and p95 runtime/cost within owner-set envelope under 2× expected load. | ≥100 attack/abuse cases across Python/SQL/file sizes; independent security review before scale. | Test corpus misses kernel/container flaw; local hardware differs; hidden-test leakage. | Use client/local notebook or manually reviewed outputs; defer runner, narrow MVP to non-execution tasks. |
| **H36** | **S:** AI-help users/operator. **P:** token/latency/retry cost can exceed educational value. **V:** router, static fallback and bounded context yield sustainable cost per independent gain. **F:** one-call default, capped turns, cache approved fragments, model/provider cost versioning. | Replay de-identified/synthetic trace corpus across static/small/main model routes; canary only after safety gates. | Currency cost and p95 latency per eligible session; later cost per independent mastery gain. | 30–60 дней | Route accepted if p95 latency meets owner-set SLO, average and p95 cost fit a predeclared unit envelope, fallback success ≥99%, and T14 is non-inferior; cost alone cannot justify learning harm. | Replay ≥500 representative synthetic/expert turns; production estimate updated with actual mix; sensitivity to price/FX. | Replay length/distribution wrong; cache hit inflated; provider prices change. | Static hints, smaller bounded model or no AI; never subsidize by selling learner data. |
| **H37** | **S:** learners/content owners. **P:** prompt injection/answer leakage can compromise assessment bank. **V:** separation of practice/assessment plus policy checks preserves integrity. **F:** closed holdout service, no solution in model context, injection tests, item retirement/version boundary. | Red-team 100+ injection/obfuscation attempts against staging and manual retrieval inspection. | Hidden answer/reference leakage and compromise detection time. | 2–4 недели per release | Gate: known hidden-answer leakage=0, 100% critical injections blocked/escalated, compromised item retirement drill ≤1 business day, and assisted event never becomes I3/I4. | Stratify languages, uploads/code comments/base64/multi-turn; external reviewer when possible. | Known attacks easier than novel; false positives block legitimate accessibility input. | No AI on assessment/tournament surfaces; isolate banks and return to static feedback. |
| **H38** | **S:** minors/parents/schools. **P:** unclear data use prevents trust and creates harm. **V:** private-by-default, granular consent and deletion make bounded use acceptable. **F:** human-readable data map, separate consents, guardian/assent route, export/delete. | Comprehension testing of information sheets and a full export/delete tabletop; collect no sensitive production data. | Correct comprehension and verified deletion across systems/providers. | 30 дней | No minor pilot until ≥90% adult and ≥80% youth participants answer all critical data-use/contact questions correctly after one read, 100% test records export/delete within stated SLA, and legal review clears region/age flow. | ≥10 adults + ≥10 youth for comprehension usability, not legal validity; language/accessibility variants. | Test participants more literate; deletion misses backups/vendor logs; consent fatigue. | Adults-only pilot or school-controlled no-AI mode; simplify collection and documents. |
| **H39** | **S:** low-bandwidth/mobile/device-constrained learners. **P:** notebooks/files/long feedback fail outside desktop broadband. **V:** resumable low-data core preserves access and mission. **F:** progressive download, text fallback, saved attempt, device preflight. | Network throttling/device matrix plus field usability; same target task, no forced app install. | Successful independent task completion and data/technical failure. | 30 дней | Core release gate: ≥95% state recovery after disconnect, technical failure <5% on supported matrix, core page/data budget within owner-set cap, and construct score lower CI >`-MIE` vs desktop. | Lab matrix plus ≥5 real users in each priority constraint path; efficacy requires larger sample. | Synthetic throttling unrealistic; easier mobile task changes construct; supported matrix too narrow. | Publish desktop requirement honestly, offer downloadable/offline pack or narrow task formats; no false accessibility claim. |
| **H40** | **S:** all learners/institutions. **P:** closure/pivot/provider lock-in can destroy evidence. **V:** portable artifacts and read-only evidence export protect user value. **F:** open export bundle with files, rubric, provenance, versions, limitations; import validation. | Give bundle to independent reviewer on a clean machine; simulate account deletion/service outage. | Successful reconstruction/reproduction without Arena availability. | 30 дней | Pass if ≥9/10 sampled bundles open, ≥8/10 reproduce the claimed run where applicable, 100% include human-readable limitations/version, and export contains no unauthorized PII. | 10 heterogeneous artifacts is workflow check; repeat each schema change. | Reviewer has unusual technical skill; external dependencies rot; hash misread as identity proof. | Reduce claims to portable raw artifact/rubric; fix export before public portfolio. |

### 5.7 Миссия, pricing, WTP и distribution — H41–H47

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H41** | **S:** adult H01/H04 learners. **P:** stated price preference is unreliable. **V:** some will make a reversible commitment for bounded diagnostic/cohort outcome. **F:** honest offer with curriculum, dates, workload, limitations and refundable deposit/preorder. | After problem validation, randomized or sequential price cards; collect refundable deposit only with delivery/refund terms, no scarcity trick. | Deposits / eligible offer views and subsequent attendance. | 2–4 недели | Pricing signal exists if ≥10 eligible people receive each tested offer, ≥3 total deposits across ≥2 non-founder channels, ≥70% depositors attend; no price optimum claim at small N. | Start qualitative range, then ≥20–30 exposures/price for directional learning; record ability-to-pay separately/optionally. | Refundable deposit weak signal; friends support founder; price-channel confound; exclusion of low-income users. | Keep free pilot, test institution sponsorship or narrower value; do not infer zero need from zero WTP. |
| **H42** | **S:** parents of minors. **P:** learner and payer may value different outcomes and privacy trade-offs. **V:** parents may pay for safe structured practice, not employability promise. **F:** clear sample report + workload + privacy map + no public rank. | Dyad interview followed later by real paid/reservable cohort offer; decisions made privately, no pressure on child. | Dyad-aligned enrollment/deposit with child assent. | 30–60 дней | Parent-paid route proceeds only if ≥6/12 eligible dyads independently align on outcome, ≥3 deposits from non-affiliated families, child assent=100%, and no requested surveillance/public ranking becomes core. | 12–20 dyads across income/school types; never collect exact income unless essential and consented. | Parent desire for status overrides child; courtesy payment; sample affluent. | Institution-funded/free youth path; adults-first wedge; do not add parental surveillance. |
| **H43** | **S:** schools/universities/teachers. **P:** procurement is slow and teacher workload can erase value. **V:** a bounded assignment/evidence export may save review time. **F:** teacher cohort dashboard/digest only for consented assigned tasks, no opaque prediction. | Concierge one-class pilot and paid/LOI discussion with exact scope; teacher manually uses export before dashboard build. | Net teacher minutes saved per resolved task and specific LOI/pilot commitment. | 60–90 дней | B2B path continues if ≥3 institutions assign named owner/date/cohort in LOI or paid pilot, and measured teacher time decreases with lower CI above 0 while critical misses=0; generic “interested” excluded. | 5–8 institutions across school/university; teacher-level clustering; procurement interviews not sales forecast. | Founder performs hidden labor; champion lacks budget authority; novelty. | Keep teacher export/manual mode, pursue B2C/community, or narrow workflow. |
| **H44** | **S:** mission-priority learners unable to pay plus paying adults/institutions. **P:** revenue can gate genuine learning or create pay-to-win. **V:** free core learning with paid services/verification can preserve equal mastery standard. **F:** same tasks, feedback floor and ranked attempts; payment only for cohort support, human review or organization workflow; subsidy disclosure. | Choice/conjoint interview followed by real offer matrix; audit feature entitlements and outcomes. | Share of critical learning/rating advantages gated by payment (target zero) plus paid-service commitments. | 30–90 дней | Model acceptable only if 0 paid entitlements increase mastery score/ranked attempts/hint depth, ≥3 real paid service commitments fund at least one subsidy in pilot, and free cohort T14 is non-inferior. | Small mission/economics pilot; cost accounting includes founder/reviewer time; later cohort comparison. | Subsidy unsustainable; free users receive worse support indirectly; affluent cohort differs. | Simplify paid service, seek institution/grant sponsorship, reduce cost; never introduce pay-to-win. |
| **H45** | **S:** first 100 H01/H04 learners. **P:** broad paid acquisition may be expensive and low intent. **V:** one community/teacher/university channel can repeatedly produce activated users. **F:** three 2-week channel sprints with same message/eligibility/activation. | Founder-led outreach to one university club, one professional community and one educator/referral channel; no spam, respect rules. | Activated (`diagnostic + independent correction`) / eligible reached; founder minutes/activation. | 6 недель | A repeatable candidate channel requires ≥30 eligible reached in each of two sprints, ≥10 activations total/channel, second-sprint rate no worse >20% relative, and founder time within owner envelope. | Exact denominators and duplicate suppression; thresholds only operational. Run channels sequentially or randomize timing where feasible. | Seasonality, champion effect, unequal list quality, incentive contamination. | Drop weak channel; refine message once; if none repeat, pause scale and revisit segment/outcome. |
| **H46** | **S:** activated learners. **P:** organic referral may attract friends but not qualified peers. **V:** sharing a concrete diagnostic artifact can acquire similar-intent learners. **F:** private referral link after value moment; no XP/reward for invites, no contact upload. | Ask users to share only if they choose; referred person sees context/consent and must independently qualify. | Qualified activated referrals per inviter and invite complaint rate. | 30–60 дней | Keep referral if ≥10% of activated users voluntarily invite, ≥30% of referred eligible users activate, complaint/spam rate <1%, and no minors contact exposure. | Need ≥50 activated users for directional signal; report wide CI and channel source. | Strong friends imitate behavior; founder prompt pressure; selection. | Remove referral prompt; enable artifact export without tracking or reward. |
| **H47** | **S:** employers as distribution partners. **P:** logo partnerships can become misleading and employers may not supply real tasks/reviewers. **V:** a narrow reviewed challenge gives credible exposure without placement claim. **F:** employer-authored or reviewed brief, published role relevance/limits, no hiring guarantee. | Ask 10–15 employers for a concrete action: redact/review one brief, provide one reviewer slot, or sign scoped challenge LOI. | Completed employer contribution, not verbal interest. | 30–60 дней | Continue if ≥3 distinct employers deliver a usable reviewed brief and named reviewer/date, all approve truthful non-placement wording, and no single partner provides >50% of pilot tasks. | Diverse company sizes/roles; track refusal reasons; legal/IP review. | Friendly firms seek branding; challenge not used in hiring; selection bias. | Use public/licensed datasets and independent reviewers; remove employer logos/outcome implication. |

### 5.8 Activation, retention и cross-device value — H48–H50

| ID | S/P/V/F assumption chain | Cheapest ethical test | Primary metric | Timebox | Numeric success/decision rule | Sample planning note | Риск ложного вывода | Action if fail |
|---|---|---|---|---|---|---|---|---|
| **H48** | **S:** newly eligible H01/H04 learners. **P:** course onboarding delays value. **V:** first real diagnostic correction within 10 minutes clarifies Arena. **F:** minimal goal/readiness question → one committed task → feedback → variant; account after value where lawful. | Moderated prototype and instrumented concierge flow; compare only after tasks have equal validity. | Time to first independent corrected variant and comprehension of next step. | 72 часа–2 недели | Flow passes usability if ≥8/10 finish a valid first attempt, ≥7/10 independent variant within 15 minutes, ≥9/10 explain why result is provisional, and no PII is required before needed. | 10–15 per main readiness band; not conversion estimate. | Moderator assists; task too easy; short time conflicts with construct. | Allow 20–30 minute first unit, improve prerequisite check; never trivialize task solely for activation. |
| **H49** | **S:** committed learners in demanding practice. **P:** early excitement may not survive eight weeks. **V:** bounded weekly progress toward a real artifact sustains use. **F:** 8-week cohort plan with resumable units, office hour optional, no daily streak. | Run one small committed cohort; record four denominators: registered/started/activated/committed and reasons for exit. | Week-8 retained committed learners **with** valid T30/TX evidence. | 90 дней | Viability signal if ≥60% of explicitly committed learners produce week-8 evidence, ≥65% complete T30, severe wellbeing events=0, and no baseline/accessibility subgroup gap >15pp; not a benchmark claim. | 30–50 committed learners as planning range; compare future replicated cohort, not public MOOC rates. | High-touch cohort/founder charisma; definition gaming; differential missingness. | Shorten promise/module, add human support or change segment; no gamification escalation before root-cause interviews. |
| **H50** | **S:** learners switching phone ↔ desktop. **P:** phone is useful for review but invalid for some coding/project work. **V:** task-aware handoff lets mobile support learning without pretending full equivalence. **F:** mobile retrieval/error review + saved desktop continuation; capability labels. | Cross-device usability on realistic constrained tasks; force network interruption/handoff; compare target construct where equivalent. | Successful state-preserving handoff and valid independent completion. | 30 дней | Release if state preservation ≥95%, duplicate/lost attempt <2%, ≥90% understand which tasks require desktop, and mobile-equivalent probes meet non-inferiority; otherwise mobile is review-only. | ≥20 users across iOS/Android/small screens; device lab + real devices; effect trial only for equivalent constructs. | Tech-savvy sample; easy review tasks inflate success; device ownership bias. | Publish honest review-only mobile scope, improve offline/export; do not market full mobile lab. |

## 6. Feature → problem → hypothesis → audience → metric → test coverage

| Feature family | Problem | Hypotheses | Primary audience | Learning/value metric | First admissible test |
|---|---|---|---|---|---|
| Positioning/diagnostic | broad promise, unclear urgent user | H01–H06, H48 | candidates, students, school/olympiad challengers | artifact-backed commitment; first independent correction | artifact interview + attended diagnostic |
| Correction loop | repeated error, false fluency | H07–H13 | learners | T14/T30/TX, `ErrorRecurrence14`, burden | bounded concierge/RCT only after form QA |
| Portfolio/defense | polished but unverifiable artifacts | H13–H14, H28–H33, H40 | learners, employers, educators | reproduction, later unseen task, reviewer agreement/time | blind artifact review + separate criterion task |
| AI help | answer vending, dependency, model drift | H16–H22, H36–H37 | learners/teachers/operators | T14 transfer, hint dependency, leakage/safety/cost | offline golden/red-team → shadow → randomized bounded pilot |
| Motivation/social | isolation vs status/gaming harm | H23–H27 | opt-in learners/cohorts | G14/G30 non-inferiority, avoidance, wellbeing, individual TX | prototype comprehension → small opt-in trial |
| Accessibility/device | construct-irrelevant barriers | H15, H39, H50 | disabled/low-bandwidth/mobile users | valid task completion and non-inferiority | assistive-tech walkthrough + matched forms |
| Minors/privacy/mission | consent, permanence, inequality | H22, H30–H31, H38, H40, H42, H44 | youth, parents, schools | comprehension, deletion, zero pay-to-win, appeal | comprehension/tabletop before any youth production data |
| Content/runner/operations | quality, sandbox and review cost | H33–H37 | authors, reviewers, operator | accepted task-family cost, critical miss/escape, p95 cost | timed production + threat model/isolated benchmark |
| Pricing/distribution | unknown payer and repeatable channel | H41–H47, H49 | learners, parents, institutions, employers | costly commitment, activated user, retained evidence | deposit/LOI/channel sprint with honest denominators |

Every proposed feature appears in at least one hypothesis row with explicit problem (`P`), value and feature assumptions (`V/F`), segment (`S`), primary metric and test. A feature absent from this map is outside the validated MVP backlog.

## 7. Semi-structured interview program: 6 аудиторий

Интервью служит discovery и instrument design, а не доказательством спроса. Его задача — восстановить недавнее реальное поведение, увидеть артефакт/ограничение, проверить язык проблемы и получить следующий наблюдаемый шаг. Вопрос «вам нравится идея?» не является outcome.

### 7.1 Общий протокол для всех аудиторий

**Recruitment.** Screener фиксирует только необходимые strata: роль/этап, недавнее релевантное действие, язык, грубую возрастную группу, device/access needs и канал. Не отбирать только знакомых, текущих fan/users, победителей или тех, кто уже использует AI. Компенсация фиксирована за время и не зависит от положительных ответов, покупки или завершения задания. Для H01 основной набор полностью русскоязычный независимо от страны; English international — отдельный challenger.

**Consent и вступление.** До сессии участник получает цель, длительность, что будет показано/собрано, кто увидит notes, TTL, право пропустить вопрос/остановиться, отсутствие влияния на обучение/оценку/найм, отсутствие записи по умолчанию и контакт для удаления. Модератор повторяет: «Мы проверяем предположения команды, не вас; отрицательный опыт полезен; это не экзамен и не предложение работы». Для minors применяются assent + требуемое guardian/legal-basis согласие; ребёнок может остановить сессию независимо от взрослого.

**Артефакты.** Просить участника заранее удалить имя, контакты, employer/school secrets, ключи, персональные данные других людей и закрытые interview/olympiad materials. Допустим screen-share без копирования файла. Исследователь не забирает repo/dataset/CV, если для вывода достаточно структурированного note. Любая сохранённая копия требует отдельного согласия и deletion date.

**Структура 45–60 минут.** `5 мин consent/context → 15 мин последний реальный эпизод → 10–15 мин walkthrough артефакта → 10 мин alternatives/cost/decision → 5–10 мин neutral concept/prototype task → 5 мин summary correction + optional next action`. Prototype показывается после behavior section, чтобы не подсказать язык ответа.

**Техника вопросов.** Сначала открытый вопрос, затем только уточнения `когда / что произошло / что сделали / что было до и после / чем закончилось / покажите`. Не предлагать список проблем до свободного ответа. Если участник говорит обобщённо, возвращать к последнему случаю. Модератор не защищает Arena и не обучает во время problem interview; factual correction продукта даётся после фиксации ответа.

**Закрытие.** Модератор резюмирует 3–5 наблюдений и спрашивает: «Что я понял неверно?» Затем, если participant eligible и тест требует costly signal, предлагает **конкретный** следующий шаг с датой, длительностью, workload, ценой/возвратом и ограничениями. Отказ кодируется как полноценный результат; не давить и не использовать ложный дефицит.

**Никогда не спрашивать:**

- «Вам нужна/нравится Arena?», «Вы бы пользовались?», «Разве проверенное портфолио не лучше GitHub?»;
- «Сколько вы готовы платить?» до восстановления реального бюджета/альтернативы; stated maximum не заменяет offer test;
- «AI Coach помог бы?» без показа конкретного bounded сценария и сравнения с текущим workaround;
- оценки личности, IQ, «таланта», психического здоровья, семейного дохода, protected attributes или точную дату рождения, если это не необходимо и законно;
- пароль, API key, закрытые задания, данные коллег/учеников/кандидатов, медицинские/дисциплинарные записи;
- вопросы, связывающие участие с оценкой, поступлением, олимпиадой, работой или отношением учителя/работодателя.

### 7.2 Guide A — школьники

**Hypotheses:** H02, H03, H07–H12, H15, H22–H27, H38–H40, H42, H48–H50.

**Recruitment.** План discovery: 12–18 русскоязычных школьников 14–17 лет; отдельные strata `14–15 / 16–17`, novice/regular coding/olympiad, urban/non-metro where feasible, phone-only/low-bandwidth и accessibility paths. Не рекрутировать только через одного учителя: invitation authority может выглядеть обязательной. Учитель/родитель не получает индивидуальные ответы без отдельного заранее понятного основания.

**Consent/assent.** Простая youth information sheet; проверить понимание вопросами «Можно ли не отвечать?», «Кто увидит notes?», «Как остановиться/удалить?». Guardian consent не делает участие обязательным. Дать выбор: взрослый рядом/вне комнаты в пределах safeguarding policy. Не обсуждать заявки/оценки в присутствии учителя, если это снижает свободу ответа.

**Non-leading core questions.**

1. «Вспомни последний раз, когда ты хотел понять что-то про AI, данные или программирование. Что происходило от начала до конца?»
2. «Что заставило начать именно тогда? Было ли событие, дедлайн или просто интерес?»
3. «На каком шаге стало непонятно? Что ты попробовал первым, вторым, третьим?»
4. «К кому или к чему обратился: видео, чат, друг, учитель, готовое решение? Покажи путь, если безопасно.»
5. «Как ты понял, что ответ действительно твой и правильный? Что произошло позже на похожей задаче?»
6. «Когда ты бросал похожее занятие? Что произошло непосредственно перед этим?»
7. «Как выглядит неделя, когда на это реально есть время? Что обычно вытесняет занятие?»
8. «Какие соревнования, оценки, серии или публичные результаты помогают, а какие хочется скрыть? Расскажи про конкретный случай.»
9. «На каком устройстве ты начинал и продолжал? Что сломалось или было неудобно?»
10. «Какие данные/работы ты не хотел бы показывать одноклассникам, школе, родителям или работодателю? Кто должен выбирать видимость?»
11. «Если AI подсказывает, в какой момент это помощь, а в какой — уже не твоё решение? Покажи последний пример, если можно.»
12. «Что для тебя было бы честным доказательством: “я теперь умею”? Кто должен это увидеть, если вообще кто-то?»

**Artifact prompts.** Попросить открыть обезличенную последнюю попытку/тетрадь/repo/скрин результата; указать пальцем «вот где застрял», восстановить первую попытку до подсказки, отметить каждую помощь, затем решить короткую **новую** вариацию. Отдельно дать prototype privacy card и попросить настроить видимость, удалить запись и объяснить разницу XP/mastery. Это usability/response-process, не high-stakes assessment.

**Behavioral close.** Предложить конкретный бесплатный 30-минутный critique/diagnostic slot или одну practice set неделю спустя. Записать, выбрал ли ученик сам, пришёл ли и завершил ли unaided variant; согласие родителя не засчитывать за learner commitment.

**Не спрашивать у школьника:** секреты/конфликты дома или в школе, точную школу/расписание/адрес без необходимости, «родители заставляют?», «ты списывал?», диагноз disability, романтические/интимные темы, зарплатные ожидания. Не просить показать закрытые олимпиадные задачи, переписку или данные других детей. Не обещать баллы, поступление, победу или работу.

### 7.3 Guide B — родители

**Hypotheses:** H02, H22, H24–H25, H30, H38–H44, H49.

**Recruitment.** 12–20 родителей/законных представителей подростков с разным опытом coding/AI education, школой/регионом, способностью платить и отношением к публичности; не собирать точный доход. Не включать только родителей уже активных олимпиадников. Часть dyads, часть parent-only для отделения решений.

**Consent.** Объяснить, что интервью не оценивает parenting и не даёт доступа к данным ребёнка. Parent может обсуждать только собственные решения/наблюдения. Разрешение на возможный youth interview и согласие на public artifact/AI processing — разные решения.

**Non-leading core questions.**

1. «Расскажите о последней покупке или бесплатной программе по программированию/AI для ребёнка. Как принимали решение?»
2. «Какую конкретную проблему вы надеялись решить? Кто первым её сформулировал?»
3. «Какие альтернативы сравнивали и от чего отказались? Почему?»
4. «Что стоило не только денег, но времени ребёнка и вашего времени?»
5. «По какому наблюдаемому признаку вы поняли, что программа помогает или не помогает?»
6. «Что происходило, когда ребёнок пропускал, просил подсказку или хотел остановиться?»
7. «Какую информацию вы реально получали от платформы/учителя? Что изменили после неё?»
8. «Какие данные о ребёнке собирали? Что было понятно/непонятно; пытались ли удалить или скрыть?»
9. «Кому можно видеть работу, ошибки, подсказки и рейтинг? Приведите ситуацию, где граница важна.»
10. «Как вы различаете безопасную помощь AI и готовое решение? Что хотели бы контролировать, а что оставить ребёнку?»
11. «Когда вы платили за проверку/наставника, за какую работу платили фактически?»
12. «Что должно произойти, чтобы вы прекратили программу даже при хороших оценках/retention?»

**Artifact prompts.** Попросить показать обезличенный чек/описание программы/report/расписание, которым реально пользовались; восстановить decision timeline. Дать sample Arena evidence/privacy report без бренда и попросить: найти claim, выбрать скрытые поля, объяснить `assisted vs independent`, запросить export/delete, назвать недостающую информацию.

**Behavioral close.** Только после problem evidence — реальная карточка пилота с датами/workload/ценой или refundable deposit. Родитель принимает решение отдельно; затем ребёнок даёт assent. Измерять aligned dyad, не только payment.

**Не спрашивать у родителя:** «Сколько вы тратите на ребёнка вообще?», точный доход/долги, диагнозы/оценки без необходимости, «Вы хотите контролировать ребёнка?», «Вы бы заплатили X?» как единственный WTP test. Не проектировать скрытый parent surveillance, чтение AI-chat или public rank из одного родительского запроса.

### 7.4 Guide C — студенты

**Hypotheses:** H01, H04–H21, H23–H26, H30, H34, H39–H41, H45–H46, H48–H50.

**Recruitment.** Primary: русскоязычные студенты 18–23 независимо от страны, minimum three communities, mix CS/data/non-CS, beginners/intermediate, working/non-working, prior course completion/dropout, laptop constraints. Research/PhD aspirants and English international candidates coded as challengers, not averaged into primary product-internship decision.

**Consent.** Участие не связано с университетом/оценкой/стажировкой. CV/repo screen-share redacted; no copying by default. AI-use questions не являются academic misconduct investigation.

**Non-leading core questions.**

1. «Расскажите о последней конкретной попытке подготовиться к AI/data задаче, проекту или стажировке.»
2. «Как выбрали, что учить? Какой источник или человек повлиял на порядок?»
3. «Покажите последнее место в коде/анализе, где застряли. Что было в первой версии?»
4. «Какие feedback/подсказки получили и что смогли сделать позже без них?»
5. «Какая ошибка повторялась в другом задании? Как вы её узнали?»
6. «Какой курс/платформу начали и не закончили? Что произошло на последней активной неделе?»
7. «Как выглядит артефакт, который вы реально отправляли преподавателю/работодателю? Что с ним произошло?»
8. «Какие требования вакансии/интервью были непонятны? Что вы сделали, чтобы проверить их?»
9. «За какую подготовку уже платили временем/деньгами? Что выбрали вместо других вариантов?»
10. «Когда соревнование, deadline или группа помогли? Когда мешали?»
11. «На каких устройствах/сетях работаете? Как переносите notebook/code между ними?»
12. «Какие данные о попытках/AI-use допустимо показать reviewer, а какие должны остаться private?»
13. «Если завтра похожая задача будет с другим dataset/metric, что, вероятно, изменится? Почему?»

**Artifact prompts.** Timeline последнего repo/application; участник маркирует собственные/peer/AI/template contributions, воспроизводит одну команду, объясняет split/metric/limitation, получает невиданное small change. Если task не запускается, это observation, а не провал человека. Затем card-sort: course / mock interview / diagnostic / project review / community.

**Behavioral close.** Забронировать bounded diagnostic с workload и follow-up T14; затем, где H41 активен, отдельный честный refundable offer. Calendar click без attendance не считается commitment.

**Не спрашивать:** immigration/legal status, exact GPA, работодателя/университет по имени, salary desperation, protected data, пароли/закрытые interview questions. Не говорить «Python нужен в 66,7% вакансий, значит вам…» до свободного ответа; это подсказывает решение выборкой исследования.

### 7.5 Guide D — junior candidates

**Hypotheses:** H01, H04–H14, H16–H21, H28–H33, H41, H45–H50.

**Recruitment.** Для H01 primary — 12–18 русскоязычных кандидатов **18–23 лет с базовым Python и подачей на product ML/data internship в горизонте 3–6 месяцев**, которые уже отправили заявку/прошли screening/work sample за последние 90 дней: mix product ML, analytics, ML engineering; hired/not hired/withdrawn; self-taught/university. Research MSc/PhD, older/experienced career switchers и English international candidates — отдельные challengers; их evidence не входит в H01 gate. Не просить назвать компанию или раскрыть protected assessment.

**Consent.** Никаких передач employer/recruiter; answers cannot affect hiring. Разрешён reconstructive talk или self-created analog вместо NDA material. Career outcome language: Arena тестирует preparation, не placement.

**Non-leading core questions.**

1. «Возьмите последнюю заявку. Как шёл процесс от вакансии до последнего шага?»
2. «Как вы решили, что готовы подать? Какое доказательство было у вас, а какого не было?»
3. «Какой шаг оказался неожиданным? Что именно попросили сделать, если это можно обсуждать?»
4. «Расскажите о последней ошибке в work sample/mock. Как обнаружили и повторилась ли она?»
5. «Что из подготовки оказалось полезным на невиданной задаче, а что — только знакомым по виду?»
6. «Как использовали AI/чужой код? Что могли затем объяснить или изменить самостоятельно?»
7. «Как recruiter/hiring manager взаимодействовал с GitHub, Kaggle, сертификатом или дипломом? Что спросил фактически?»
8. «Сколько времени заняла подготовка последней недели; чем пожертвовали?»
9. «За что платили/были готовы внести deposit? Как сравнивали с mentor/mock/course?»
10. «Какой feedback получили после отказа/прохождения? Что сделали после него?»
11. «Что в проверке skill казалось несправедливым или недоступным? Был ли способ апелляции/accommodation?»
12. «Какой следующий реальный шаг и дата? Что может помешать?»

**Artifact prompts.** Использовать собственный public/redacted repo или neutral Arena artifact. Просить воспроизвести, назвать help provenance, пройти random change, затем сравнить repo-only и component evidence card. Не просить решать реальный закрытый test. Позже — отдельный blinded criterion task, не тот же item family.

**Behavioral close.** Конкретный role-shaped diagnostic + T14 appointment; offer deposit only after relevance is demonstrated. Записывать refusal reason: timing, trust, relevance, price, privacy, workload.

**Не спрашивать:** «Почему вас не взяли?» как обвинение; название/контакт employer, NDA content, exact salary/financial distress, visa/protected status, «вы списывали?». Не обещать, что verified bundle повысит шанс найма, пока H32 не пройден.

### 7.6 Guide E — преподаватели

**Hypotheses:** H03, H06–H13, H15–H21, H26–H27, H29–H31, H33–H40, H43–H44, H47.

**Recruitment.** 10–15 преподавателей/менторов: school/university/bootcamp/community; beginner vs advanced cohorts; different class sizes; at least 3 who do not currently use AI tools; institutional decision-maker role recorded separately from classroom champion. Не привлекать только партнёров founder.

**Consent.** Не собирать student work or analytics без соответствующего basis/consent; educator должен принести synthetic/redacted artifact. Ответ не передаётся администрации. Никакой оценки качества преподавателя.

**Non-leading core questions.**

1. «Проведите по последнему заданию от авторинга до feedback. Где ушло время?»
2. «Как вы узнаёте, что ученик понял, а не воспроизвёл/получил помощь?»
3. «Какие ошибки повторяются через две–четыре недели? Как это фиксируете сейчас?»
4. «Покажите обезличенный rubric/report, по которому реально приняли решение.»
5. «Как создаёте новую/параллельную форму; что делает её действительно новой?»
6. «Как обрабатываете AI/peer/template help? Что допустимо в practice и assessment?»
7. «Какое действие происходит после alert? Сколько минут занимает и сколько alert оказываются бесполезными?»
8. «Какие accommodations использовались? Что сохранило target competency, а что изменило outcome?»
9. «Как устроены contest, streak, rating или team work; кто от них выигрывает/уходит?»
10. «Какие данные вы обязаны/не хотите видеть? Как ученик оспаривает результат?»
11. «Что вы перестали использовать и почему: качество, workload, procurement, privacy, cost?»
12. «Кто фактически может назначить пилот/оплатить/подписать data terms? Как выглядел последний procurement?»

**Artifact prompts.** Timed walkthrough одного assignment: blueprint → exemplar → three learner errors → feedback → delayed probe. Card-sort teacher digest: «решение сейчас / позже / не показывать». Reviewer blind-scores six artifacts; затем пробует teacher escalation packet и отмечает net minutes. Для H34 авторит/reviews one new family under timer.

**Behavioral close.** Не «интересует ли pilot», а конкретно: назначит ли redacted set выбранной группе в дату, кто owner, какие approvals, сколько learners и какое teacher time будет записано. Generic LOI без cohort/date/owner не проходит H43.

**Не спрашивать:** персональные данные/диагнозы/disciplinary records учеников, экспорт gradebook, обход школьной privacy/procurement, «AI сократит вашу работу, верно?». Не просить преподавателя принудить учащихся к research/public portfolio или раскрыть private chats.

### 7.7 Guide F — работодатели

**Hypotheses:** H28–H33, H40, H43, H47; Q03/Q18/Q22.

**Recruitment.** 12–20 людей, реально участвовавших в entry-level screening/work-sample review за последние 12 месяцев: hiring managers, IC interviewers, recruiters только для их части процесса; ≥6 employers, product/analytics/research strata, small/large companies and regions. Employer concentration cap: одна компания не более 25% discovery sample. Внешний reviewer получает compensation, не marketing exposure.

**Consent/conflict.** Не собирать candidate PII, protected rubrics, hiring secrets или individual decisions. Использовать synthetic/anonymized artifacts; disclosure if reviewer advises/invests in Arena. Findings aggregate; logo never used without explicit separate permission. Research participation is not employer partnership.

**Non-leading core questions.**

1. «Вспомните последнюю entry-level роль, где вы лично оценивали кандидата. Какие решения вы приняли и на каком evidence?»
2. «Что происходило с CV/GitHub/Kaggle/сертификатом: кто смотрел, сколько времени, какое действие следовало?»
3. «Какие навыки реально проверяли, хотя vacancy могла их не называть?»
4. «Покажите структуру rubric на synthetic example или восстановите критерии без confidential content.»
5. «Какой false positive был дорогим? Какой false negative вы обнаружили, если обнаружили?»
6. «Как проверяли авторство/AI help? Какие методы считаете ненадёжными?»
7. «Какая новая задача после портфолио лучше всего показала transfer? Почему?»
8. «Какие accommodations доступны и какие сигналы создают bias?»
9. «Что заставит отклонить external credential/evidence даже при красивом отчёте?»
10. «Сколько минут допустимо на review и кто несёт стоимость/ответственность апелляции?»
11. «Когда вы в последний раз меняли assessment из-за leakage/tool change? Как заметили?»
12. «Какой конкретный contribution вы могли бы сделать в pilot: redacted brief, reviewer slot, criterion feedback? Кто утверждает это решение?»

**Artifact prompts.** Counterbalanced blind review: repo/CV vs component evidence bundles, без Arena brand/learner popularity. Reviewer делает screening decision, marks fields used, confidence and time. Затем отдельный later unseen work sample scored by different reviewers. Card-sort `must / useful / noise / harmful`: T14, TX, hints, rank, XP, defense, reviewer qualification, limitations, recency, school, demographic proxy.

**Behavioral close.** Предложить один конкретный IP-safe action с due date: redacted brief, 45-minute blind review block, named pilot owner или scoped LOI. Logo/«partner» не выводится из interview. Refusal reason документируется.

**Не спрашивать:** names/contact/data of candidates, protected interview bank, discriminatory shortcuts, «вы бы доверяли Arena score?», salary/placement uplift guess, approval of marketing claim. Не создавать composite employability score и не позволять одному employer задавать universal curriculum.

## 8. Синтез интервью и защита от wishful thinking

### 8.1 Evidence record на один эпизод

Каждый note отделяет пять слоёв:

| Layer | Что фиксируется | Пример допустимой записи | Что запрещено |
|---|---|---|---|
| `OBS` | дословно короткая фраза/видимое действие/артефакт, дата эпизода | «открыл repo; команда из README упала на missing package» | «пользователь нуждается в Arena» |
| `CTX` | segment, channel, recency, constraints | student 20–23 band, phone hotspot, application last 30d | точные лишние identifiers |
| `INTERP` | интерпретация исследователя | reproducibility problem plausible | маскировать мнение как quote/fact |
| `ALT` | конкурирующее объяснение | старый dependency, не skill gap | игнорировать counterevidence |
| `NEXT` | какой тест различит объяснения | clean-machine reproduction | сразу добавить feature |

### 8.2 Рубрика strength одного problem episode

Оценки не складываются в «market score»; они помогают сравнивать качество evidence. Два исследователя независимо кодируют минимум 20–30% notes, а при `n≤20` — все critical episodes.

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Recency | hypothetical/never | >6 месяцев | 2–6 месяцев | ≤60 дней |
| Specificity | opinion | general pattern | конкретный эпизод | episode + inspectable artifact |
| Frequency | unknown/once | 1–2/year | monthly | weekly/more per eligible period |
| Consequence | none | annoyance | meaningful time/missed task | lost opportunity/safety/privacy harm, подтверждённый контекстом |
| Workaround | none/not tried | free passive | repeated manual/peer tool use | paid or high-time repeated workaround |
| Decision authority | none | influencer | user/payer | owner with budget/process authority |
| Commitment | praise | contact permission | scheduled/attended | deposit/assignment/LOI with owner+date |
| Arena-specific fit | generic content solves | unclear | diagnostic loop plausibly better | behavior discriminates diagnosis/transfer/provenance from alternative |

**Decision discipline:** segment cannot pass only by summed rubric. Минимум требуется evidence из `Specificity≥2`, `Recency≥2`, `Commitment≥2` у нескольких независимых participants/channels, плюс absence of mission/safety blocker. Negative cases and refusals appear in the same synthesis, not appendix.

### 8.3 Synthesis board

Для каждого hypothesis ID выводится:

```text
Hxx | status: untested / contradicted / mixed / supported-for-next-test
observed episodes: n/N by segment and channel
artifact-backed: n/N
costly commitments: n/N
strongest counterexample
unknown/missing stratum
privacy/accessibility concern
next discriminating test + owner + date
```

No quote counting across multiple episodes from one participant. No combining parent payment with child assent, employer interest with delivered brief, booking with attendance, T0 pass with T14 mastery, or assisted with independent performance.

## 9. 90-дневный decision dashboard

| Decision | Primary evidence | Guardrails | `Go` означает | `Stop/pivot` trigger |
|---|---|---|---|---|
| Primary segment | H01–H05 artifact + attendance + repeat behavior | mission/access, channel concentration | one segment for next cohort | no stratum meets behavioral gate |
| Core loop | H07–H13 T14/T30/TX/recurrence | attrition, subgroup/accessibility, burden | scale content for 1–3 competencies | instruments invalid or learning harm |
| AI Coach | H16–H22 | leakage, safety, dependency, cost, provider drift | bounded canary only | static performs as well/safer or gate fails |
| Competition | H23–H27 | anxiety, avoidance, gaming, minors privacy | opt-in bounded event | learning non-inferiority/wellbeing fails |
| Verified portfolio | H28–H33/H40 | appeal, bias, reviewer cost, false decisions | private external pilot | no added prediction/reviewer value |
| Runner | H35/H37 | escape, egress, secret, bank compromise | limited allowlisted pilot | any critical containment failure |
| Revenue/mission | H41–H44 | zero pay-to-win, free T14 parity | paid support/review test | learning standard gated by money |
| Distribution | H45–H47/H49 | qualified denominator, founder time, truthful claims | repeat winning sprint | no second-sprint repeatability |

## 10. Self-audit

### 10.1 Формальная полнота hypothesis registry

- [x] В реестре **ровно 50** уникальных нумерованных гипотез: H01–H50, без пропусков и дублей.
- [x] Каждая строка имеет `segment`, `problem`, `value assumption`, `feature assumption`, cheapest ethical test, primary metric, duration/timebox, numeric success criterion/decision rule, sample planning note, risk of false conclusion и action if fail.
- [x] Для каждой feature family есть явная связь `problem → hypothesis → audience → metric → test` (§6).
- [x] Факты, оценки/conventions и гипотезы разделены (§1); ни один локальный порог не назван наблюдаемым baseline/effect.
- [x] Primary learning evidence — `T14/T30` unaided transfer, error recurrence, hint dependency и assistance provenance; activity metrics не подменяют learning.
- [x] Покрыты: mission/pay-to-win, accessibility, minors/privacy, AI safety, code security, content production, cost/latency, WTP, three payer classes, distribution, employer trust, predictive validity, appeal/export and eight-week retention.
- [x] Есть ladder `72h / 2 weeks / 30 / 60 / 90 days`, sequencing/dependencies, stop/go/iterate, instrumentation/data minimization.
- [x] Есть шесть подробных guides: школьники, родители, студенты, junior candidates, преподаватели, работодатели; в каждом recruitment, consent, non-leading questions, artifact prompts, synthesis connection и prohibited questions/actions.

### 10.2 Семантический red-team

| Потенциальная ошибка | Проверка | Result |
|---|---|---|
| Message CTR выдан за спрос | H05 требует eligibility, schedule и attendance; exact denominator | pass |
| H01 размыт международным English sample | все 18 primary H01 русскоязычные; English — отдельный challenger | pass |
| Интервью-слова выданы за WTP | H41–H44 требуют deposit/LOI/paid service | pass |
| Completion/XP выданы за mastery | H09/H23/H49 требуют delayed independent evidence | pass |
| Текущая помощь выдана за learning | H16–H18 разделяют AssistanceLift/HintDependency/T14 | pass |
| Малый pilot выдан за efficacy | sample notes и §1.2 требуют power/CI/replication | pass |
| Missing follow-up скрыт | §4.3 и gates показывают attrition by condition/subgroup | pass |
| Portfolio preference выдана за hiring validity | H28 отделён от H32 later unseen criterion | pass |
| Hash/AI detector выдан за authorship | H30 labels limitation; H14 bans biometric/AI-detector proof | pass |
| Parent payment подменяет child consent | guides/H42 требуют separate assent/alignment | pass |
| Accessibility названа по чеклисту | H15/H39/H50 требуют user/path test and construct validity | pass |
| Free mission разрушена revenue | H44 target zero pay-to-win and free learning non-inferiority | pass |
| Runner/AI построены до truth/safety | dependency ladder and H16/H35/H37 block production | pass |
| Employer logo выдан за partnership | H47 requires delivered brief/reviewer/date and truthful wording | pass |

### 10.3 Основание и ограничения

План опирается на результаты `01_market_and_competitors.md`, `01_failure_cases.md`, `02_learning_science.md`, `02_gamification.md`, `02_ai_tutors.md`, `03_jobs_and_skills.md`, `03_curriculum.md`, их source ledgers и `00_open_questions.md`. Это вторичный проектный синтез уже зарегистрированных первичных/authoritative источников, а не новый causal evidence.

Ограничения: нет Arena baseline/funnel/cohort, валидированных forms/rubrics, наблюдаемой WTP, production cost, legal opinion, representative demand sample или longitudinal employer outcome. Пороги в реестре регулируют следующий эксперимент и должны быть заменены preregistered MIE/power rules после instrument pilot. Положительный 90-day результат обосновывает только следующий bounded rollout; он не обосновывает market share, placement claim, универсальный mastery score или международную переносимость.

**Следующее действие в первые 72 часа:** зафиксировать primary русскоязычный H01 screener/consent pack, сделать три одинаково конкретных diagnostic flow, получить первые 6–10 artifact sessions и одновременно запустить redacted employer artifact sort. Не начинать разработку универсального AI Coach, sandbox или публичного portfolio до прохождения соответствующих зависимостей.
