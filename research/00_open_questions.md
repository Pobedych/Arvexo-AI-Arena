# Открытые вопросы и неизвестные

Этот файл отделяет неизвестное от предположений. При закрытии вопроса указывается источник и решение; незакрытые вопросы переходят в валидационный план.

## Критические — способны изменить решение

| ID | Вопрос | Почему критично | Как закрыть | Статус |
|---|---|---|---|---|
| Q01 | Какая первая аудитория испытывает частую и достаточно острую проблему: школьники, олимпиадники или кандидаты на первую ML-стажировку? | определяет весь wedge, curriculum, дистрибуцию и плательщика | 18–24 problem interviews по трём сегментам + поведенческий smoke test | открыт |
| Q02 | Улучшает ли текущий loop «урок → практика → турнир → разбор» delayed retention и transfer по сравнению с обычным курсом? | центральное образовательное обещание | pre-test/post-test, delayed test 14/30 дней, transfer tasks, сопоставимая контрольная группа | открыт |
| Q03 | Считают ли работодатели/университеты evidence bundle Arena более полезным, чем GitHub + Kaggle + резюме? | без внешнего доверия verified portfolio не имеет market value | 10–15 blind reviews профилей/артефактов реальными оценщиками | открыт |
| Q04 | Можно ли привлечь первые 100 целевых пользователей без платного CAC через один повторяемый канал? | founder-led distribution — основной ранний риск | три channel sprints по 2 недели с единым activation definition | открыт |
| Q05 | Какова недельная и восьминедельная retention при требовательной практике, а не только коротких тестах? | completion/retention — системный EdTech-риск | когортный пилот с 30–50 пользователями и обязательным end-to-end заданием | открыт |
| Q06 | Кто реально платит и за какой outcome, не разрушая бесплатную миссию? | определяет жизнеспособность | willingness-to-pay interviews + preorder/LOI без ложных обещаний | открыт |
| Q07 | Сколько авторского/ревьюерского времени стоит единица качественного задания и обновление curriculum? | контент может стать главным bottleneck | хронометраж 20 production-grade заданий и двух ревью-циклов | открыт |
| Q08 | Можно ли безопасно и экономично проверять код/SQL/файлы при росте? | может сделать выбранный MVP технически преждевременным | threat model + изолированный benchmark с лимитами и cost envelope | открыт |

## Вопросы текущего продукта

| ID | Вопрос | Наблюдение | Следующая проверка | Статус |
|---|---|---|---|---|
| Q09 | Сколько уроков и заданий фактически опубликовано после незакоммиченных изменений 18–20 июля? | production-аудит 18 июля: 14 заявлено/3 доступны; current seed: 12 уроков/16 вопросов; curriculum дрейфует в БД | повторный runtime/content audit после согласованного deploy + versioned content export | открыт |
| Q10 | Исправлены ли оборванный `predict_proba`, завершение урока и повторное прохождение? | зафиксированы как P0/P1 в курсовом аудите | regression checklist | открыт |
| Q11 | Есть ли валидированные события аналитики, а не только агрегаты профиля? | current branch не содержит продуктовой funnel/cohort/retention analytics; есть только операционные агрегаты XP/streak/activity | этап 6: event taxonomy и data contract | открыт |
| Q12 | Каков реальный baseline activation/funnel/retention? | production-метрики не предоставлены | анонимизированная выгрузка событий/БД с privacy review | открыт |

## Неизвестные этапа 2: обучение, игровые механики и AI-помощь

| ID | Вопрос | Почему критично | Как закрыть | Статус |
|---|---|---|---|---|
| Q13 | Какая лестница подсказок даёт лучший delayed unaided transfer для разных starting levels? | немедленный `AssistanceLift` может сосуществовать с ростом зависимости | randomized/yoked comparison static hint vs H0–H5; matched unaided probes через 7/14/30 дней; subgroup по baseline | открыт |
| Q14 | Даёт ли weekly rhythm с grace больше retention/transfer, чем нейтральные reminders? | streak может увеличить возвраты и одновременно anxiety/minimum-action gaming | кластерный 8-недельный trial + follow-up, transfer primary, anxiety/night activity/quit как guardrails | открыт |
| Q15 | Можно ли калибровать mastery на небольшом банке без ложной точности? | эвристические веса не дают валидную вероятность mastery | item pilot, blueprint/anchor, external criterion, double scoring, IRT/MFRM или консервативная conjunction до достаточного N | открыт |
| Q16 | Как преобразовать асинхронный tournament score в валидный rating input? | Glicko-2 не решает item difficulty, ties, multi-player и зависимые pairwise outcomes | replay simulation на откалиброванных tasks, rating period policy, readiness bands, calibration/fairness slices | открыт |
| Q17 | Какой AI-tutor design стабилен при смене model/provider/version? | product-level evidence быстро устаревает; regression может открыть answer leakage | immutable task/content version, deployment ID + canary fingerprint, offline pedagogy/safety suite, shadow/canary/rollback, quarterly revalidation | открыт |

## Неизвестные этапа 3: навыки, найм и curriculum

| ID | Вопрос | Почему критично | Как закрыть | Статус |
|---|---|---|---|---|
| Q18 | Какие навыки реально проверяют на screening/interview/work sample, хотя их не называют в публичной вакансии? | literal mention сильно занижает Python mechanics, leakage, testing, SQL windows и engineering practice | 20–30 структурированных интервью hiring managers + anonymized rubrics/work samples по role strata; не собирать персональные данные кандидатов | открыт |
| Q19 | Насколько июльский purposive corpus переносится на объём и структуру entry-level спроса? | sample пере представляет big tech/research, English ATS и публичные роли; archived/pipeline смешивают сезоны | повторные quarterly snapshots, employer cap/weights, отдельные undergrad/product/research strata и сравнение с официальной статистикой | открыт |
| Q20 | Каков входной уровень первой аудитории и где фактический prerequisite gap? | 16-модульная карта может быть слишком длинной или слишком простой без baseline cohort | diagnostic + response-process interviews у 30–60 целевых learners; анализ по возрасту/опыту, без high-stakes label | открыт |
| Q21 | Реалистичны ли оценки времени, порядок и `GMR` для C01–C16? | сейчас это design estimates, а не измеренный mastery latency | пилоты C01/C03/C09, time-on-task, T14/TX, hint burden, dropout и subgroup/accessibility guardrails | открыт |
| Q22 | Предсказывает ли предложенный capstone/defense выполнение новой рабочей задачи? | красивый репозиторий может не иметь predictive validity и легко скрывать помощь | blinded employer review + later unseen task; provenance audit, inter-rater agreement, false-positive/negative analysis | открыт |

## Неизвестные этапа 4: wedge, MVP и UX

| ID | Вопрос | Почему критично | Как закрыть | Статус |
|---|---|---|---|---|
| Q23 | Есть ли у русскоязычных кандидатов 18–23 повторяющаяся practice/feedback боль до показа концепта? | P4 может быть красивой формулировкой исследователя, а реальным bottleneck окажутся referral, опыт, accountability или география | H01: artifact-led interviews из ≥3 каналов + фактическая явка на diagnostic; контрпримеры сохранять | открыт |
| Q24 | Можно ли дать первый «исправил ошибку на новом варианте» wow через A0 без ложного обещания coding readiness? | native runner дорог и рискован, но только quiz loop может не решать career JTBD | F1/F2 usability + response-process pilot на debugging/table/leakage/validation; затем один A1 family только после security gate | открыт |
| Q25 | Надёжны ли error-family labels и parallel forms для `T14 Independent Transfer Confirmation Rate`? | north star бессмысленна при слабой разметке, неравных формах или differential attrition | double-label, form audit, calibration/uncertainty, follow-up по condition/subgroup, missingness bounds | открыт |
| Q26 | Добавляет ли evidence receipt signal сверх обычного repo/task transcript за ≤10 минут review? | без incremental value verified portfolio — дорогое оформление, не продуктовая ценность | blinded/crossover reviewer study, reproduction, later unseen task, reliability/time/decision change | открыт |
| Q27 | Возвращаются ли пользователи после diagnosis добровольно, если убрать streak/rank pressure? | core loop может быть полезен, но не иметь retention | 20-user concierge cohort; meaningful W2/W4, T14 completion, burden and exit interviews; login не считать | открыт |
| Q28 | Не создаёт ли positioning «к стажировке» ожидание placement guarantee? | regulatory/trust risk может сделать даже честный MVP неприемлемым | message comprehension tests, prohibited-claim checklist, complaints/refund reasons; reframe при систематическом misunderstanding | открыт |

## Рыночные и методологические неизвестные

- Сопоставимы ли публичные completion rates между платформами: определения знаменателя и «завершения» часто различаются.
- Представляют ли вакансии публичного рынка реальные entry-level роли или отфильтрованный остаток после referral/internal hiring.
- Насколько требования российских вакансий 2026 года переносятся на школьный curriculum без преждевременной профессионализации.
- Дают ли публичные цены конкурентов надёжный willingness-to-pay signal: скидки, региональные цены и enterprise contracts обычно непрозрачны.
- Как оценить Китай без смешения глобальных и локальных продуктовых версий и без недоступных страниц.

## Требующие решения владельца после исследования

- Допустимый основной сегмент: школьники как миссия или кандидаты на стажировку как ранний wedge.
- Язык первого международного запуска.
- Допустимая роль родителей/школ в consent и публичности профиля несовершеннолетних.
- Ресурсный предел на 90 дней: часы основателя, бюджет на инфраструктуру/LLM/контент и доступ к предметным экспертам.
