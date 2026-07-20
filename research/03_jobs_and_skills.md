# Вакансии и навыки: что действительно видно в entry-level AI/ML/Data

Срез: **2026-07-20**. Матрица: [03_job_skill_matrix.csv](./03_job_skill_matrix.csv). Построчные доказательства: [jobs_sources.md](./sources/jobs_sources.md).

## Главный вывод

Наблюдаемое ядро первой AI/ML/Data-роли — не «как можно больше нейросетевых библиотек», а связка **Python → данные/SQL → статистическое рассуждение → базовый ML → метрики и честная валидация → воспроизводимый артефакт**. Deep learning, NLP, CV и deployment встречаются часто, но это уже ветви конкретных ролей. Названия функций/classes/decorators, leakage, window functions и MLflow почти не попадают в текст карточек; это не доказательство ненужности, а свойство вакансий, которые называют capability крупнее её составляющих.

**Факт:** в строгом live-primary поднаборе Python назван в 26/39 (66,7%), deep learning — 16/39 (41,0%), NLP и CV — по 14/39 (35,9%), SQL/metrics/algorithms — по 12/39 (30,8%), а **строго названные методы classical ML — лишь в 5/39 (12,8%)**. Generic `ML/machine learning`, название роли и DL/CV/NLP/RL без conventional method не засчитывались как classical ML. **Вывод:** основу стоит строить по переносимому workflow и нормативной полноте, специализацию — после него; vacancy frequency сама по себе не задаёт порядок основ. Источники: JS001–JS063; внешняя directional-сверка JS064–JS069. Уверенность: высокая для арифметики этой выборки, средняя для переноса на рынок, низкая для причинности найма.

## 1. Что именно измерено

Всего **63 уникальные записи и 63 уникальных первичных URL**:

- нормализованный status: **40 live, 3 pipeline, 20 archived**;
- строгий основной знаменатель: **39 live primary vacancies**;
- из 40 live исключён RUEU016: это открытая pooled Student Researcher Program, а не одна конкретная вакансия;
- US005–US007 — ongoing expressions of interest и остаются pipeline;
- US015 и пять ранее считавшихся live Asia-карточек (ASIA007, ASIA009, ASIA010, ASIA019, ASIA021) при критической перепроверке оказались closed/expired и перенесены в archived;
- archived и pipeline участвуют только в sensitivity-колонке all n=63.

Строка — единица публикации, а не уникальный работодатель и не человек, принятый на работу. Частота — доля карточек с **явным** упоминанием. Unknown означает «не написано»; no — только явное отрицание. Источники: JS001–JS063. Уверенность: высокая.

Формулы:

    live_primary = status == "live" and job_id != "RUEU016"
    yes_rate(skill, S) = count(row[skill] == "yes" for row in S) / len(S)
    unknown_rate(skill, S) = count(row[skill] == "unknown" for row in S) / len(S)
    cooccur(a, b, S) = count(a == "yes" and b == "yes")
    jaccard(a, b) = cooccur / (yes_a + yes_b - cooccur)

Никакой semantic inference из заголовка не делалось: Machine Learning Intern без явно указанного Python не получает Python=yes. Источники: методика JS001–JS063. Уверенность: высокая.

## 2. Покрытие и состав выборки

| Срез | Все n=63 | Live primary n=39 |
|---|---:|---:|
| Азия | 21 | 9 |
| Россия | 8 | 6 |
| Европа | 12 | 11 |
| США/Канада | 22 | 13 |
| Intern/student | 55 | 34 |
| Junior/entry/graduate | 8 | 5 |
| Research/science title | 30 | 16 |
| Product/engineering/analytics title | 33 | 23 |

Правило региона основано на префиксе job_id; RUEU001–008 — Russia, RUEU009–020 — Europe. Research/science — position содержит research, scientist, science, R&D, world model или scholar; остальные — product/engineering/analytics. Это аналитические ярлыки, а не самоидентификация работодателя. Источники: JS001–JS063. Уверенность: высокая для воспроизводимости, средняя для смысловой границы role family.

Live-primary по employer type после фиксированного rule-based mapping: large tech/platform 14; public/academic/independent R&D 10; startup/scale-up 8; bank/finance 6; industrial/other 1. Правило применяется в порядке bank → public/research/university/nonprofit → big-tech/platform → startup → остаток. Источники: JS001–JS063. Уверенность: средняя: исходные employer_type неоднородны.

### Концентрация работодателей

После объединения Amazon/Amazon Robotics и Microsoft/Microsoft Research, но без слияния прочих брендов: Amazon — 8/63; top-5 работодателей — 21/63 (33,3%); top-10 — 33/63 (52,4%); HHI долей строк — 0,0431. Это **HHI состава выборки**, не концентрация рынка труда.

Sensitivity без восьми Amazon-строк в live-primary (n=31): Python 71,0% вместо 66,7%; strict classical ML 12,9% вместо 12,8%; deep learning 35,5% вместо 41,0%; CV 25,8% вместо 35,9%; algorithms и deployment по 19,4% вместо 30,8% и 28,2%. Следовательно, classical-method signal почти не меняется, а specialization/lifecycle доли заметно зависят от одного работодателя. Источники: JS001–JS063. Уверенность: высокая для расчёта, низкая для market-wide extrapolation.

## 3. Все 39 навыков: exact mention count

| Skill | Live primary yes (n=39) | % | Live unknown | Live no | All yes (n=63) | % all |
|---|---:|---:|---:|---:|---:|---:|
| `python` | 26 | 66.7% | 13 | 0 | 38 | 60.3% |
| `functions_classes` | 0 | 0.0% | 39 | 0 | 0 | 0.0% |
| `decorators` | 0 | 0.0% | 39 | 0 | 0 | 0.0% |
| `typing` | 1 | 2.6% | 38 | 0 | 1 | 1.6% |
| `testing` | 7 | 17.9% | 32 | 0 | 9 | 14.3% |
| `numpy` | 3 | 7.7% | 36 | 0 | 5 | 7.9% |
| `pandas` | 3 | 7.7% | 36 | 0 | 5 | 7.9% |
| `eda` | 4 | 10.3% | 35 | 0 | 5 | 7.9% |
| `visualization` | 7 | 17.9% | 32 | 0 | 10 | 15.9% |
| `sql` | 12 | 30.8% | 27 | 0 | 14 | 22.2% |
| `window_functions` | 0 | 0.0% | 39 | 0 | 0 | 0.0% |
| `probability` | 3 | 7.7% | 36 | 0 | 4 | 6.3% |
| `statistics` | 10 | 25.6% | 29 | 0 | 15 | 23.8% |
| `ab_testing` | 3 | 7.7% | 36 | 0 | 4 | 6.3% |
| `linear_algebra` | 0 | 0.0% | 39 | 0 | 2 | 3.2% |
| `classical_ml` | 5 | 12.8% | 34 | 0 | 7 | 11.1% |
| `metrics` | 12 | 30.8% | 27 | 0 | 18 | 28.6% |
| `validation` | 9 | 23.1% | 30 | 0 | 16 | 25.4% |
| `leakage` | 0 | 0.0% | 39 | 0 | 0 | 0.0% |
| `feature_engineering` | 1 | 2.6% | 38 | 0 | 2 | 3.2% |
| `ranking` | 2 | 5.1% | 37 | 0 | 3 | 4.8% |
| `recommendation` | 3 | 7.7% | 36 | 0 | 4 | 6.3% |
| `nlp` | 14 | 35.9% | 25 | 0 | 21 | 33.3% |
| `cv` | 14 | 35.9% | 25 | 0 | 21 | 33.3% |
| `deep_learning` | 16 | 41.0% | 23 | 0 | 27 | 42.9% |
| `pytorch` | 8 | 20.5% | 31 | 0 | 15 | 23.8% |
| `git` | 4 | 10.3% | 35 | 0 | 8 | 12.7% |
| `linux` | 2 | 5.1% | 37 | 0 | 3 | 4.8% |
| `docker` | 0 | 0.0% | 39 | 0 | 2 | 3.2% |
| `api` | 2 | 5.1% | 37 | 0 | 3 | 4.8% |
| `fastapi` | 0 | 0.0% | 39 | 0 | 1 | 1.6% |
| `deployment` | 11 | 28.2% | 28 | 0 | 19 | 30.2% |
| `monitoring` | 2 | 5.1% | 37 | 0 | 4 | 6.3% |
| `mlflow` | 0 | 0.0% | 39 | 0 | 0 | 0.0% |
| `cloud` | 5 | 12.8% | 34 | 0 | 6 | 9.5% |
| `english` | 10 | 25.6% | 29 | 0 | 14 | 22.2% |
| `algorithms` | 12 | 30.8% | 27 | 0 | 21 | 33.3% |
| `commercial_experience` | 2 | 5.1% | 37 | 0 | 2 | 3.2% |
| `portfolio` | 7 | 17.9% | 32 | 0 | 12 | 19.0% |

**Как читать таблицу.** Live no равен нулю для всех 39 навыков: отсутствие требования почти никогда не формулируют как запрет. Во всех 63 строках единственный no относится к commercial_experience у archived ASIA017 («не иметь full-time employee experience»). Поэтому нулевой yes не означает нулевую потребность. Источники: JS001–JS063. Уверенность: высокая.

### Нулевые и почти нулевые упоминания — тоже результат

- Functions/classes: 0/39; decorators: 0/39. Работодатели пишут Python, OOP, maintainable code или software design, а не синтаксические темы курса. **Вывод:** functions нужны в первом блоке, базовые classes — после процедурного кода; decorators не должны быть входным барьером. Источники: JS001–JS063, JS067–JS069. Уверенность: высокая для non-mention, средняя для curriculum sequencing.
- Typing: 1/39; testing: 7/39. Один прямой typing-сигнал не делает typing бесполезным; тестирование встречается достаточно, чтобы проверять минимум unit/regression tests в проектах. Источники: JS001–JS063. Уверенность: высокая для частот, средняя для порога.
- Window functions, linear algebra и leakage: по 0/39. SQL назван 12 раз, statistics 10, validation 9. **Вывод:** window functions — второй SQL-слой; linear algebra — концептуальная опора без раннего формализма; leakage — обязательная внутренняя проверка качества именно потому, что vacancy text её скрывает. Источники: JS001–JS063, JS067–JS069. Уверенность: высокая для non-mention, средняя для педагогического решения.
- Docker, FastAPI и MLflow: 0/39 live-primary; при all sensitivity Docker 2, FastAPI 1, MLflow 0. Deployment при этом 11/39. **Вывод:** сначала интерфейс и доставка модели как capability, затем конкретный framework/tool. Источники: JS001–JS063. Уверенность: высокая для частот, средняя для curriculum choice.

## 4. Required, preferred или просто работа роли

Для top skills сделан консервативный lexical audit только полей required_skills и preferred_skills. «Elsewhere» означает, что yes пришёл из stack/responsibilities/experience. Категории взаимоисключающие; both — термин есть в обоих полях.

| Skill | Yes total | Required only | Preferred only | Both | Elsewhere only |
|---|---:|---:|---:|---:|---:|
| Python | 26 | 19 | 3 | 1 | 3 |
| Classical ML | 5 | 2 | 2 | 0 | 1 |
| Deep learning | 16 | 3 | 1 | 0 | 12 |
| NLP | 14 | 6 | 1 | 0 | 7 |
| CV | 14 | 4 | 2 | 0 | 8 |
| SQL | 12 | 7 | 3 | 0 | 2 |
| Metrics/evaluation | 12 | 0 | 0 | 0 | 12 |
| Algorithms | 12 | 3 | 4 | 0 | 5 |
| Deployment | 11 | 1 | 0 | 0 | 10 |
| Statistics | 10 | 3 | 3 | 1 | 3 |
| English | 10 | 5 | 0 | 0 | 5 |
| PyTorch | 8 | 7 | 1 | 0 | 0 |
| Testing | 7 | 0 | 1 | 0 | 6 |
| Visualization | 7 | 2 | 2 | 2 | 1 |
| Portfolio/project evidence | 7 | 2 | 4 | 1 | 0 |

Паттерны опубликованы в псевдокоде ниже; audit не пытается понять синонимы семантически. Главный сигнал: Python, SQL и PyTorch часто являются gate-like текстом; metrics, validation, deployment и testing чаще описывают работу, а не формальный фильтр. Это не доказывает, что их не проверяют на интервью. Источники: JS001–JS063. Уверенность: высокая для lexical counts, средняя для интерпретации gate-like.

## 5. Образование и опыт

В live-primary n=39 rule-based разбор education дал:

| Минимальный наблюдаемый уровень | Count |
|---|---:|
| Bachelor/undergraduate/current university accepted | 19 |
| Master minimum (or PhD) | 7 |
| PhD-only/in progress | 5 |
| Higher degree preferred, not minimum | 1 |
| Not stated/flexible | 7 |

Категории взаимоисключающие и основаны только на тексте education. Сильная доля graduate-level ролей объясняется intentional research/big-tech sampling и не означает, что рынок junior в целом требует PhD. Источники: JS001–JS063. Уверенность: высокая для кодирования, низкая для рынка.

Commercial experience явно отмечен yes лишь в 2/39 и unknown в 37/39; прямого no в live-primary нет. Portfolio/project evidence — 7/39. В двух yes по commercial experience академический research или personal project может быть альтернативой/предпочтением, поэтому эти 2 нельзя читать как «обязательны годы работы». **Вывод:** для первого найма проверяемый проект рациональнее симулированного стажа в резюме, но сам корпус не оценивает causal lift портфолио. Источники: JS001–JS063. Уверенность: высокая для counts, средняя для recommendation, низкая для causal claim.

## 6. Различия по региону

| Skill | Asia n=9 | Russia n=6 | Europe n=11 | US/Canada n=13 |
|---|---:|---:|---:|---:|
| Python | 6 (66,7%) | 3 (50,0%) | 9 (81,8%) | 8 (61,5%) |
| SQL | 2 (22,2%) | 4 (66,7%) | 4 (36,4%) | 2 (15,4%) |
| Statistics | 3 (33,3%) | 2 (33,3%) | 2 (18,2%) | 3 (23,1%) |
| Classical ML | 1 (11,1%) | 1 (16,7%) | 3 (27,3%) | 0 |
| Metrics | 3 (33,3%) | 0 | 4 (36,4%) | 5 (38,5%) |
| Validation | 1 (11,1%) | 1 (16,7%) | 3 (27,3%) | 4 (30,8%) |
| NLP | 4 (44,4%) | 0 | 4 (36,4%) | 6 (46,2%) |
| CV | 4 (44,4%) | 1 (16,7%) | 5 (45,5%) | 4 (30,8%) |
| Deep learning | 6 (66,7%) | 1 (16,7%) | 6 (54,5%) | 3 (23,1%) |
| PyTorch | 1 (11,1%) | 0 | 4 (36,4%) | 3 (23,1%) |
| Testing | 0 | 1 (16,7%) | 5 (45,5%) | 1 (7,7%) |
| Deployment | 2 (22,2%) | 1 (16,7%) | 5 (45,5%) | 3 (23,1%) |
| Algorithms | 2 (22,2%) | 2 (33,3%) | 4 (36,4%) | 4 (30,8%) |
| Portfolio | 2 (22,2%) | 0 | 4 (36,4%) | 1 (7,7%) |

Эти различия нельзя называть региональными market rates: n=6–13, разные employer mix и role mix. Например, Asia после live recheck содержит много applied ML, а US/Canada — несколько science roles с краткими pooled-style qualification blocks. Источники: JS001–JS063. Уверенность: высокая для sample arithmetic, низкая для регионального обобщения.

## 7. Internship vs junior; research vs product

| Skill | Intern/student n=34 | Junior/entry n=5 | Product/eng/analytics n=23 | Research/science n=16 |
|---|---:|---:|---:|---:|
| Python | 23 (67,6%) | 3 (60,0%) | 18 (78,3%) | 8 (50,0%) |
| SQL | 11 (32,4%) | 1 (20,0%) | 9 (39,1%) | 3 (18,8%) |
| Statistics | 10 (29,4%) | 0 | 4 (17,4%) | 6 (37,5%) |
| Classical ML | 4 (11,8%) | 1 (20,0%) | 3 (13,0%) | 2 (12,5%) |
| Metrics | 10 (29,4%) | 2 (40,0%) | 6 (26,1%) | 6 (37,5%) |
| Validation | 7 (20,6%) | 2 (40,0%) | 5 (21,7%) | 4 (25,0%) |
| NLP | 11 (32,4%) | 3 (60,0%) | 5 (21,7%) | 9 (56,2%) |
| CV | 12 (35,3%) | 2 (40,0%) | 7 (30,4%) | 7 (43,8%) |
| Deep learning | 13 (38,2%) | 3 (60,0%) | 10 (43,5%) | 6 (37,5%) |
| PyTorch | 7 (20,6%) | 1 (20,0%) | 5 (21,7%) | 3 (18,8%) |
| Testing | 6 (17,6%) | 1 (20,0%) | 6 (26,1%) | 1 (6,2%) |
| Deployment | 9 (26,5%) | 2 (40,0%) | 4 (17,4%) | 7 (43,8%) |
| Algorithms | 12 (35,3%) | 0 | 5 (21,7%) | 7 (43,8%) |
| Portfolio | 7 (20,6%) | 0 | 5 (21,7%) | 2 (12,5%) |

Junior n=5 слишком мал: его проценты — иллюстрация, не ranking. Research/science classifier по title даёт больше NLP/algorithms/statistics, product — больше Python/SQL/testing; deployment неожиданно выше в research/science из-за applied-scientist responsibilities. Это показывает, что research/product — не «теория против production». Источники: JS001–JS063. Уверенность: высокая для counts, низкая/средняя для смысловой интерпретации.

## 8. Co-occurrence: какие связки появляются вместе

Live-primary n=39, пары yes/yes:

| Pair | Co-mentions | Jaccard |
|---|---:|---:|
| Python + classical ML | 4 | 0,148 |
| Python + CV | 11 | 0,379 |
| Python + deep learning | 11 | 0,355 |
| Python + SQL | 10 | 0,357 |
| NLP + deployment | 9 | 0,563 |
| CV + deep learning | 9 | 0,429 |
| NLP + CV | 8 | 0,400 |
| NLP + deep learning | 8 | 0,364 |
| Classical ML + CV | 2 | 0,118 |
| Metrics + validation | 6 | 0,400 |
| SQL + statistics | 7 | 0,467 |
| Deep learning + PyTorch | 6 | 0,333 |
| Python + testing | 6 | 0,222 |

Практические кластеры, **выведенные**, а не объявленные рынком:

1. **Data/analytics:** Python + SQL + statistics + visualization.
2. **ML evaluation:** classical ML + metrics + validation; leakage добавляется как обязательная quality guard, хотя literal mention = 0.
3. **Vision:** Python + CV + deep learning + PyTorch.
4. **Language/product AI:** NLP + evaluation + deployment.
5. **Engineering evidence:** Python + tests + Git + runnable delivery.

Co-occurrence не доказывает prerequisite или causal effect на найм. Источники: JS001–JS063. Уверенность: высокая для pair counts, средняя для labels, нулевая для причинности.

## 9. Карта приоритетов: факт против вывода

| Категория | Наблюдение | Решение для Arena | Тип / confidence |
|---|---|---|---|
| Фундамент | Python 26, SQL 12, statistics 10, strict classical ML 5, metrics 12, validation 9, algorithms 12 | Общий обязательный ствол задаётся совместно vacancy signals и frameworks; задания с данными, baseline, split, metric и объяснением | Fact high; curriculum inference medium |
| Частые role signals | Deep learning 16, NLP 14, CV 14, deployment 11, PyTorch 8 | Ветки после ствола, а не старт для всех | Fact high; sequencing medium |
| Специализации | A/B 3, ranking 2, recommendation 3, API 2, cloud 5 | Выбор трека по типу задачи/роли | Fact high; grouping medium |
| Advanced | DL/PyTorch, research algorithms, CUDA/distributed/LLM из raw text | Поздние advanced labs с требованиями к математике/валидации | Fact medium; sequencing medium |
| Часто пишут, но «редко проверяют» | Корпус не содержит интервью и не позволяет доказать «редко проверяют» | Не публиковать такой claim без interview rubrics; English/general ML/project можно лишь гипотезировать как screening signals | Evidence absent; confidence low |
| Важно на interview | Вероятные кандидаты: Python, SQL, algorithms, probability/statistics, metric/validation reasoning | Сделать диагностические интервью-задачи, но пометить как гипотезу до сбора rubrics | Inference low/medium |
| Важно в работе | Testing, Git, leakage guards, deployment, monitoring, documentation/ethics недоописаны карточками | Проверять в capstone как engineering quality | Normative inference medium, supported directionally by JS067–JS069 |
| Не market need | Commercial experience yes 2, portfolio evidence 7 | Не обещать найм; выдавать проверяемые work samples | Fact high; causal impact unknown |

O*NET 2025 для всех US Data Scientists даёт Python 66%, SQL 51%, AWS 17%, PyTorch 10%, Git 5%, Docker 3%, Linux 2%. Совпадение направления Python/SQL поддерживает фундамент, но O*NET denominator — все уровни и только США; сравнивать проценты напрямую нельзя. ESCO даёт общий язык occupations↔skills, ACM/NASEM — нормативную полноту workflow, не vacancy frequencies. Источники: JS064–JS069. Уверенность: высокая для содержания источников, средняя для cross-check.

## 10. Minimum skill set для первой стажировки

**Рекомендация, не измеренный hiring threshold:**

1. Python: данные, control flow, functions, modules, ошибки; базовые classes для чтения/расширения кода; typing только простых API; pytest-style tests.
2. NumPy/pandas + EDA + одна библиотека визуализации: загрузить, очистить, проверить типы/пропуски, объяснить график.
3. SQL: SELECT/JOIN/GROUP BY/CTE; window functions вторым слоем.
4. Probability/statistics: распределения, sampling, confidence/uncertainty, hypothesis tests; A/B только после основ.
5. Classical ML: baseline, preprocessing, feature handling, train/validation/test, metrics, cross-validation, leakage checks.
6. Один specialization slice: CV **или** NLP **или** recommender/experimentation; не все сразу.
7. Engineering evidence: Git, reproducible environment, tests, CLI/notebook boundary, простой API или batch pipeline, README и limitations.
8. Communication: короткое English/Russian explanation of result, data limitations и trade-offs.

Источники: sample JS001–JS063; completeness cross-check JS064–JS069. Уверенность: средняя; порядок должен проверяться на performance/transfer metrics, не на completion alone.

## 11. Оптимальный graduation project

**Проект:** «из сырого набора данных в проверяемое решение», один domain и одна specialization ветка.

Обязательные артефакты:

- problem statement, user/decision и non-goals;
- immutable raw data reference, data dictionary, split strategy;
- EDA с двумя проверяемыми гипотезами;
- simple baseline до complex model;
- минимум две metrics с объяснением trade-off;
- leakage test, unseen holdout и error slices;
- reproducible training/evaluation command;
- tests для data contract и одной model invariant;
- Git history, pinned environment, CI run;
- API/batch demo и минимальная observability check;
- model/data card: ограничения, privacy/ethics, known failure cases;
- двухминутная демонстрация и короткий postmortem «что не сработало».

Если track — NLP/CV, deep model сравнивается с простым baseline. Если analytics — SQL, statistics и experiment decision обязательны. Если recommender — offline metric, negative sampling и cold-start limitation. Источники: repeated workflow signals JS001–JS063; curriculum frameworks JS067–JS069. Уверенность: средняя.

## 12. Что считать verified portfolio

Portfolio считается проверенным, если внешний reviewer может:

1. воспроизвести результат одной documented командой;
2. увидеть commit history и авторские решения;
3. запустить tests/CI;
4. проверить dataset provenance и license;
5. отделить train/validation/test и увидеть anti-leakage check;
6. сопоставить claim с metric/artifact, а не со скриншотом;
7. открыть demo/API/dashboard либо записанный deterministic run;
8. прочитать limitations и failure analysis;
9. увидеть вклад автора в командном проекте;
10. получить tamper-evident Arena verification record с rubric и версией задания.

Последний пункт — продуктовая гипотеза Arena; рынок из 63 карточек не требует именно Arena credential. Источники: JS001–JS063, JS067–JS069. Уверенность: средняя для quality rubric, низкая для employer acceptance.

## 13. Что не ставить первым в curriculum

- decorators/metaprogramming и сложные class hierarchies;
- MLflow как обязательный инструмент;
- FastAPI-specific syntax до понимания API/data contract;
- Docker/Kubernetes/cloud-vendor certification до runnable local pipeline;
- advanced transformer/diffusion/RL training до baseline, metrics и validation;
- ranking/recommendation до supervised-learning и evaluation base;
- leaderboard optimisation без hidden holdout и leakage guard;
- пять фреймворков вместо одного воспроизводимого проекта;
- обещание работы/зарплаты на основе completion badge;
- hard gate по PhD-oriented papers для beginner path.

Причина — sequencing и transfer, а не утверждение, что эти темы «не нужны». Источники: non-mention/role segmentation JS001–JS063; normative breadth JS067–JS069. Уверенность: средняя.

## 14. Воспроизводимость анализа

Псевдокод:

    header = metadata[0:16] + skills[16:55] + source_fields[55:58]
    rows = csv.DictReader(matrix)
    assert len(rows) == 63
    assert unique(job_id) == 63
    assert unique(source_url) == 63
    assert every skill in {"yes", "no", "unknown"}
    primary = [r for r in rows if r.status == "live" and r.job_id != "RUEU016"]

    for skill in skills:
        yes = sum(r[skill] == "yes" for r in primary)
        unknown = sum(r[skill] == "unknown" for r in primary)
        rate = yes / len(primary)

    required_hit = regex(skill_pattern, required_skills.lower())
    preferred_hit = regex(skill_pattern, preferred_skills.lower())
    elsewhere = skill_yes and not required_hit and not preferred_hit

Lexical patterns: Python; deep learning/DL/neural network; NLP/natural language/language model/LLM/speech/text; computer vision/CV/vision; SQL; metric/evaluate/benchmark; deploy/deployment/production; statistic/hypothesis/probability; algorithm/data structure; project/publication/paper/GitHub/portfolio/track record. Для `classical_ml` действует отдельный строгий codebook: literal `classical/traditional ML`, named conventional family (`linear/logistic regression`, classification, clustering, trees/forests, bagging/boosting, SVM, kNN, Naive Bayes) либо conventional library (`scikit-learn/sklearn`, CatBoost, XGBoost, LightGBM). Generic ML/AI, statistical modeling, predictive analytics, model tuning, ranking/recommendation и DL/CV/NLP/RL без названного conventional method остаются `unknown`; title не является evidence. Pattern audit — sensitivity tool, не replacement для ручного source review.

Employer concentration:

    normalized_company = merge(Amazon, Amazon Robotics)
                         + merge(Microsoft, Microsoft Research)
                         + keep_other_brand_labels
    HHI = sum((company_rows / 63) ** 2)

Источники: сам CSV и JS001–JS063. Уверенность: высокая.

## 15. QA и ограничения

- Strict CSV parse: 64 physical lines, 63 data rows, 58 columns в каждой строке.
- Header order: 16 metadata + 39 skill flags + source_url/evidence_grade/notes.
- 63 unique IDs, 63 unique HTTPS URLs, 0 blank cells.
- Status vocabulary: live/pipeline/archived; distribution 40/3/20.
- Skill vocabulary: yes/no/unknown only.
- Original detailed status retained in notes; critical rechecks appended, not silently overwritten.
- No part rows dropped; three source part CSV/MD remain.
- Main denominator excludes archived, pipeline and pooled RUEU016.

Ключевые ограничения: purposive sample; июльская сезонность; public-ATS, English, big-tech и research bias; 46/63 publication dates not stated; role titles and employer_type are imperfect; employer frequency is not hiring volume; postings omit many implementation details; required/preferred lexical audit can miss synonyms; no interview outcomes, hires, salaries or causal link from skill to offer. В выборке нет точных заголовков `MLOps Intern` и `Python Intern`: соседние engineering/deployment и Python-heavy роли дают лишь косвенный curriculum signal, а не полноценное покрытие этих двух role families. Источники: JS001–JS069. Уверенность: высокая для audit, средняя/низкая for external validity.

## Решение этапа 3

1. Утвердить общий curriculum spine: Python/data/SQL/statistics/classical ML/evaluation/validation/reproducibility.
2. Разделить после spine минимум три ветки: analytics/experimentation, NLP/GenAI, CV/deep learning; recommendation как более позднюю ветку.
3. Проверять не просмотр контента, а unseen task + reproducible artifact + explanation.
4. Не выдавать vacancy-frequency за список interview questions.
5. Повторить snapshot минимум в трёх сезонах и добавить mid-size/local employers до product prioritization.

Источники: JS001–JS069. Уверенность: средняя; пункты 1–3 — synthesis, пункт 5 — mitigation.
