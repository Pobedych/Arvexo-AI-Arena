# Вакансии США и Канады: первичная выборка

Дата среза: **2026-07-20**. Файл данных: [jobs_us_part.csv](./jobs_us_part.csv).

## Итог среза

В матрице 22 уникальные записи: **14 live**, **3 pipeline**, **5 archived**. География живого поднабора: 10 США, 3 Канада, 1 роль доступна в обеих странах. В выборке представлены big tech, AI- и hardware-стартапы, банки, индустриальные и университетские исследовательские центры.

Это целевая, а не вероятностная выборка. Она отвечает на вопрос «какие навыки работодатели явно называют в доступных первичных объявлениях», но не оценивает весь рынок вакансий.

## Правила доказательности и статусов

- Использовались только оригинальные страницы работодателей, университетов и их контролируемые ATS (Greenhouse, Lever, Ashby). Агрегаторы применялись лишь для discovery и не попали в `source_url`.
- `live` означает: на дату доступа есть исходная страница/форма подачи и дедлайн не истёк. `archived` означает явное закрытие, истёкший дедлайн или исчезновение конкретной вакансии. `pipeline` — действующая форма интереса, которую сам работодатель прямо не называет конкретной вакансией.
- Точная дата публикации записана только когда она видна на первичной странице или официальном career-index; иначе `not stated`.
- В skill-колонках `yes` означает только явное упоминание; `unknown` — отсутствие наблюдаемого утверждения. `no` не использован, поскольку ни одна страница явно не заявляет, что навык не нужен.
- `yes` не равно «обязательное требование»: обязательное и желательное разнесены по `required_skills` и `preferred_skills`.

## Ledger и live-check

### US001 — Amazon, Fall Research Science Internship

Статус: **live**; PhD; США; опубликовано 2026-04-13. [Первичная вакансия](https://www.amazon.jobs/en/jobs/10398392/2026-fall-research-science-internship-united-states-phd-student-science-recruiting).

Сигнал: статистические методы, анализ данных, ML и исследовательский цикл. Ограничение: конкретный язык программирования не указан.

### US002 — Amazon, Robotics Applied Scientist II Intern

Статус: **live**; PhD; несколько хабов США; опубликовано 2025-10-08. [Первичная вакансия](https://amazon.jobs/en/jobs/3104589/robotics-applied-scientist-ii-intern-co-op-2026-robotics-manipulation-perception-motion-planning-autonomous-mobile-robots-computer-vision-machine-learning-controls-and-more).

Сигнал: Python/C++/Java, алгоритмы, CV/robotics и минимум год академического либо индустриального опыта. Предпочтения: публикации и прототипы.

### US003 — Amazon, Fall Applied Science Canada

Статус: **live**; PhD; Vancouver; опубликовано 2026-04-13. [Первичная вакансия](https://amazon.jobs/en/jobs/10394248/fall-2026-applied-science-internship-canada-phd-student-science-recruiting).

Сигнал: ML/NLP/CV, end-to-end система и production deployment. Детальный стек в доступном первичном фрагменте не назван.

### US004 — Amazon, Recommender Systems / IR

Статус: **live**; PhD; США; опубликовано 2026-04-13. [Первичная вакансия](https://amazon.jobs/en/jobs/10391774/2026-fall-applied-science-internship-recommender-systems-information-retrieval-machine-learning-united-states-phd-student-science-recruiting).

Сигнал: recommendation, retrieval/ranking, NLP, deep learning и distributed systems. Неизвестный язык не был выведен по аналогии с другими вакансиями Amazon.

### US005 — Apple, AIML Undergrad Internships

Статус: **pipeline**, не конкретная вакансия; опубликовано 2026-05-21. [Первичная страница](https://jobs.apple.com/en-us/details/200664780-3810/machine-learning-and-artificial-intelligence-undergrad-internships).

Сигнал: доступный вход для бакалавров и работа над содержательной ML-задачей. Исключён из частот live-вакансий.

### US006 — Apple, AIML Masters Internships

Статус: **pipeline**; опубликовано 2026-05-22. [Первичная страница](https://jobs.apple.com/en-us/details/200664221-3810/machine-learning-and-artificial-intelligence-masters-internships).

Сигнал: Python/OO, PyTorch/TensorFlow/sklearn, линейная алгебра, статистика и эксперименты. Всё это preferred, а минимум — статус MS-студента.

### US007 — Apple, AIML PhD Internships

Статус: **pipeline**; опубликовано 2026-05-22. [Первичная страница](https://jobs.apple.com/en-us/details/200664223-3810/machine-learning-and-artificial-intelligence-phd-internships).

Сигнал: research/publication либо интеграция прототипа в production в зависимости от команды. Apple прямо предупреждает, что это не конкретное открытие.

### US008 — Microsoft Research, Self-Improving AI

Статус: **live**; Cambridge/New York; опубликовано 2026-05-18. [Первичная вакансия](https://apply.careers.microsoft.com/careers/job/1970393556867858).

Сигнал: language modeling и reinforcement learning. Детали, не отображённые первичной страницей, оставлены unknown.

### US009 — Microsoft Research Undergraduate Internship

Статус: **archived**: Summer 2026 applications closed. [Первичная программа](https://www.microsoft.com/en-us/research/academic-program/undergraduate-research-internship-computing/).

Сигнал: два года программирования плюс calculus/probability/statistics/ML; полноценный research deliverable. Не участвует в live-частотах.

### US010 — Google Student Researcher BS/MS, US

Статус: **archived**: дедлайн 2026-07-17 истёк до даты среза. [Первичная вакансия](https://www.google.com/about/careers/applications/jobs/results/140245524367188678-student-researcher-bsms-wintersummer-2026).

Сигнал: широкий вход по CS-направлениям; Python и исследовательский опыт — preferred. Наличие кнопки Apply после дедлайна не трактовалось как live.

### US011 — Google Student Researcher PhD, Canada

Статус: **archived**: дедлайн 2026-07-17; страница называет роль future vacancy. [Первичная вакансия](https://www.google.com/about/careers/applications/jobs/results/97480706799608518-student-researcher-phd-wintersummer-2026).

Сигнал: исследовательские проекты Google/DeepMind/Cloud и обязательный English. Архив отделён от актуального спроса.

### US012 — Cohere ML Intern / Co-op

Статус: **live**; Fall 2026; remote US/Canada. [Первичная вакансия](https://jobs.ashbyhq.com/cohere/36d1f52f-8270-4652-adf5-5303a0ff341b).

Сигнал: Python, JAX/TensorFlow, distributed training, transformers и model serving. CUDA/TPU и публикации — bonus.

### US013 — Faire Data Science Intern

Статус: **live**; San Francisco; primary page says existing vacancy. [Первичная вакансия](https://job-boards.greenhouse.io/faire/jobs/8376377002).

Сигнал: Python/sklearn/NumPy/pandas/SQL, статистика, A/B tests, search/recommendation и end-to-end доказательство работы.

### US014 — Toyota Research Institute, World Models

Статус: **live**; Fall 2026; Los Altos. [Первичная вакансия](https://jobs.lever.co/tri/63d61db3-ac43-4c0d-8b9b-5006e3b92149).

Сигнал: Python/PyTorch, deep learning, RL, probabilistic models, simulation и AWS; нужны публикации и ссылки на артефакты.

### US015 — Vector Applied AI Internship

Статус: **live**; Fall 2026 applications open; Toronto. [Первичная программа](https://vectorinstitute.ai/programs/internships/applied-ai-internships/).

Сигнал: 16–32 недели applied AI для студентов STEM/смежных дисциплин. Фиксированный стек не заявлен.

### US016 — Tenstorrent ML Applications & Benchmarking

Статус: **live**; Santa Clara. [Первичная вакансия](https://job-boards.greenhouse.io/tenstorrentuniversity/jobs/4532863007).

Сигнал: Python, PyTorch/TensorFlow, воспроизводимый код, benchmarking, debugging, software testing и release validation.

### US017 — Tenstorrent AI Compiler Software Intern

Статус: **live**; Toronto. [Первичная вакансия](https://job-boards.greenhouse.io/tenstorrentuniversity/jobs/4873659007).

Сигнал: C/C++ и алгоритмы обязательны; Python — bonus; работа соединяет ML compiler, runtime и hardware benchmarking.

### US018 — Bank of America QDAP Summer Analyst

Статус: **live**; Apply by 2026-11-08; четыре города США. [Первичная вакансия](https://careers.bankofamerica.com/en-us/students/job-detail/14420/quantitative-data-analyst-summer-analyst-program-multiple-locations).

Сигнал: Python/SQL/R/C++/MATLAB/Java, статистические модели и visualization; пример ML-adjacent входа вне tech-компании.

### US019 — BMO Audit Analytics and AI Analyst

Статус: **archived**: дедлайн 2026-06-18; recent-graduate contract. [Первичная вакансия](https://jobs.bmo.com/global/en/job/BOMOGLOBALR260015936EXTERNALENCA/Audit-Analytics-and-AI-Analyst-Data-Science-6-Month-Contract-New-or-Recent-Graduate-Opportunity-Immediate-Start-Date).

Сигнал: Power BI, Power Platform, GenAI workflows и continuous monitoring. Используется только как архивный банковский benchmark.

### US020 — UC Berkeley CHAI Internship

Статус: **archived**: applications for 2026 closed. [Первичная программа](https://chai.berkeley.edu/jobs).

Сигнал: ML/CS/math background, программирование и mentored research-проект; prior research strongly advantageous, но не обязательный.

### US021 — Center for AI Safety Research Engineer Intern

Статус: **live**; deadline 2026-07-31; San Francisco. [Первичная вакансия](https://jobs.lever.co/aisafety/e011814b-9a80-43d6-bb0c-cc153ea4bec4).

Сигнал: PyTorch, empirical research, benchmarking и минимум одна top-venue paper. Это не beginner role, несмотря на слово intern.

### US022 — Rivian/VW AI & Analytics Intern

Статус: **live**; Fall 2026; Palo Alto; employer labels open active vacancy. [Первичная вакансия](https://jobs.ashbyhq.com/rivianvw.tech/3864f83a-7b29-4c96-b00e-436d60c0508a).

Сигнал: build/train/evaluate/deploy для speech, vision, language и multimodal AI. JavaScript скрыл часть квалификаций, поэтому стек не восстановлен догадкой.

## Что видно только в live-поднаборе

Частоты ниже — число явных упоминаний среди 14 live-записей, а не доля всего рынка: Python 7/14, NLP 6/14, evaluation/metrics 5/14, CV 4/14, PyTorch 3/14, deployment 3/14, statistics 3/14, SQL 2/14, recommendation 2/14, software testing 1/14. Большая доля `unknown` означает «страница не сказала», а не «работодателю не нужно».

Для учебной программы надежнее использовать повторяющиеся связки, а не одиночные частоты: (1) Python + данные + статистика; (2) train/evaluate/deploy; (3) research artifact или end-to-end project; (4) специализация — NLP/CV/recommendation/systems — поверх общей основы.

## Ограничения выборки

1. Срез быстро устаревает; ATS может закрыть роль без сохранения полного архива.
2. Целевая выборка переоценивает исследовательские и AI-native роли и не является оценкой общего числа junior-вакансий.
3. Несколько программ рассчитаны на PhD и не описывают entry-level требования бакалавра.
4. Корпоративные umbrella-postings агрегируют разные команды; упоминание навыка не означает требование для каждого placement.
5. Некоторые страницы динамические; если квалификация не была наблюдаема в первичном рендере, она оставлена `unknown`.
6. Salary, visa/work authorization и длительность не нормализованы: они не входят в заданную CSV-схему.
