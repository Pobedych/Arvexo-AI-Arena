# Asia/China vacancy evidence slice

Snapshot: **2026-07-20**, with the last status check at **20:23 KST**. This file is an evidence companion to `jobs_asia_part.csv`, not a claim about the whole Asian labour market.

## Result

- 21 unique primary employer/university pages: 6 China/Hong Kong, 5 Singapore, 4 India, and 6 Japan/South Korea/Malaysia.
- 14 records were live (`Apply`, `I'm interested`, or explicit `open until filled`) and 7 were archived because the source itself said closed/expired or its exact deadline had passed.
- Sector balance: big tech/platforms, three banks, automotive/industrial R&D, government and industrial research labs, university research, and AI/startup-scale platforms.
- Explicit-only counts in this selected sample: Python 13/21, classical ML 14/21, deep learning 14/21, CV 9/21, NLP 8/21, deployment 8/21, SQL 3/21, A/B testing 2/21, monitoring 2/21. Unknown does **not** mean absent.

## Status and coding rules

1. `yes` means the posting explicitly names the skill in requirements, preferred requirements, stack, or responsibilities. A title such as “Data Scientist” is never enough.
2. `no` is used only for an explicit exclusion. The sole such flag is LY Corporation's requirement that applicants have no full-time employee experience. Every other unmentioned cell is `unknown`.
3. `live_open` requires an active employer application control and no closed/expired marker. ASTRI is separately marked `live_open_until_filled` because the page says so.
4. `archived_*` records remain useful as 2025-2026 curriculum evidence, but must not be presented to learners as open applications.
5. Publication date is `not stated` unless the primary page gives an exact date. Relative labels such as “30+ days ago” were not converted.

## Evidence notes and source ledger

### ASIA001 — HSBC, Data Analytics Intern, Guangzhou — live

Chinese-only official posting dated 16 Jul 2026. It explicitly names Python/R/SAS, SQL, dashboards, regression/classification/clustering/time series, model evaluation, English, cloud as preferred, and GitHub work as preferred.
[Primary posting](https://apply.careers.hsbc.com/job/Guangzhou-Data-Analytics-Intern-GD-510620/1366812457/)

### ASIA002 — NVIDIA, Machine Learning Intern, Hong Kong — live

Official Workday page names Python, Linux, ML/deep-learning experience and English; responsibilities include SDK demos, experimentation and AI software. It does not expose an exact post date.
[Primary posting](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Machine-Learning-Intern---2026_JR2016444)

### ASIA003 — NVIDIA, AI Developer Technology Engineer Intern, China — live

The explicit core is C/C++, CUDA/parallel programming, AI algorithms, GPU optimization, MS/PhD status and 2027 graduation. Python is deliberately `unknown` for this record.
[Primary posting](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/China-Beijing/AI-Developer-Technology-Engineer-Intern--CUDA---2026_JR2006910)

### ASIA004 — ASTRI, Multimodal AI Engineer, Hong Kong — live until filled

Fresh graduates are welcomed. The page explicitly covers ASR, LLMs, multimodal systems, fine-tuning, benchmarking, deployment, monitoring, MLOps, cloud, English and Cantonese.
[Primary posting](https://careers.astri.org/job/Senior-Engineer-Engineer-Engineering-Associate-%28PI%29%2C-Multimodal-AI-Engineer/55060144/)

### ASIA005 — ASTRI, Machine Learning & System Integration, Hong Kong — live until filled

Bachelor's holders can enter as Engineering Associates. Explicit signals are Python/C/C++, CV and language models, deep-learning training, analytics, and data collection/cleaning.
[Primary posting](https://careers.astri.org/job/Senior-Engineer-Engineer-Engineering-Associate-%28PI%29%2C-Machine-Learning-%26-System-Integration/52619244/)

### ASIA006 — ASTRI, Software Development and ML Engineer, Hong Kong — live until filled

Requires an advanced degree but says less-experienced applicants can be considered. Python, TensorFlow/PyTorch/OpenCV and computer vision are explicit; C/C++/Java and data collection are advantages.
[Primary posting](https://careers.astri.org/job/Senior-Engineer-Engineer-%28PI%29%2C-Software-Development-and-Machine-Learning/47082144/)

### ASIA007 — Western Digital, CV/GenAI/Software Intern, Singapore — live

Masters-level R&D internship spanning Python, PyTorch/TensorFlow, OpenCV, LLM/RAG, Git, Docker, FastAPI/Flask, cloud, dashboards, deployment and edge work. Project/research experience is preferred.
[Primary posting](https://jobs.smartrecruiters.com/WesternDigital/744000097986094-intern-computer-vision-gen-ai-and-software-development)

### ASIA008 — NCS, AI Strategy & Planning Intern, Singapore — live

This is strategy rather than model engineering: AI roadmaps, use cases, governance, business cases and dashboards. Python/R and AI/data-science projects are advantages, not hard requirements.
[Primary posting](https://jobs.smartrecruiters.com/NCS3/6000000001077122-ai-strategy-planning-intern)

### ASIA009 — AUMOVIO, CV and ML Intern, Singapore — live

Explicit practical stack: Python, NumPy, Pandas, scikit-learn, PyTorch, OpenCV and Git. Work concerns image-feature extraction and CV proof-of-concept development.
[Primary posting](https://jobs.smartrecruiters.com/Aumovio/744000096569888-computer-vision-and-machine-learning-intern-ida-00073-)

### ASIA010 — Bosch, AI Research Intern, Singapore — live

Six-month placement from Jul 2026 onward. It names statistical analysis, ML/DL, Python/C++, PyTorch/TensorFlow, preprocessing and proof-of-concept validation; CI/CD is preferred.
[Primary posting](https://jobs.smartrecruiters.com/BoschGroup/744000127134264-intern-ai-research-)

### ASIA011 — DBS, AI & Data Science Internship 2026, Singapore — archived

The primary page explicitly says applications are closed. Its curriculum signal is unusually concrete: Python, algorithms, PyTorch, AI agents, testing/guardrails, model evaluation, MLOps, deployment and monitoring.
[Primary program page](https://www.dbs.com/careers/internships/dsi)

### ASIA012 — Amazon, Applied Scientist Intern, India — live

Official page shows `Apply now` for Job ID 3038934. It explicitly covers statistical modelling, ML, NLP, DL, CV, large datasets and possible production delivery; Python is not named in the visible qualification block.
[Primary posting](https://amazon.jobs/en/jobs/3038934/applied-scientist-intern-amazon-university-talent-acquisition)

### ASIA013 — Microsoft Research India, Research Fellows 2026 — archived

Applications ran 7 Jan-15 Feb 2026 and fellows start in July. The 1-2 year role emphasizes development/research aptitude and the full research lifecycle; project-specific stacks vary and were not inferred.
[Primary program page](https://www.microsoft.com/en-us/research/academic-program/research-fellows-program-at-microsoft-research-india/)

### ASIA014 — IIIT Hyderabad / Amgen Scholars, India — archived

The 7 Jun-6 Aug 2026 program places Asian undergraduates in mentored AI/ML work in health, drug discovery and science, ending in a report and poster/oral presentation. Assigned-lab stack is not stated.
[Primary program details](https://amgenscholars.iiit.ac.in/details.html)

### ASIA015 — Deutsche Bank, Technology/Data/Innovation Graduate Programme, India — archived campus channel

The employer page says Pune/Bengaluru hiring occurred through partner campuses and the 2026 cohort starts in July. It is retained to show a bank hiring channel, but offers no role-level stack evidence.
[Primary early-career page](https://careers.db.com/students-graduates/your-application/?language_id=1)

### ASIA016 — Preferred Networks, 2026 AI R&D Internship, Japan — archived

Applications closed 19 Apr 2026. The program requires fundamental CS, deep-learning interest, Japanese or English, and legal eligibility to work in Japan; themes span LLMs, CV, systems and scientific ML.
[Primary internship page](https://www.preferred.jp/en/careers/internship)

### ASIA017 — LY Corporation, GenAI × large-scale ads R&D, Japan — archived

Japanese posting with exact requirements: Python, Spark/SQL, Linux, Docker/GitHub, statistics/ML/optimization, algorithms, LLM/VLM research and online A/B tests. Deadline was 25 May 2026.
[Primary posting](https://www.lycorp.co.jp/ja/recruit/newgrads/internship/detail/MLE-6-34/)

### ASIA018 — NAVER, Efficient World Models Research Intern, South Korea — archived

The Korean posting required a relevant bachelor's and at least one top AI publication; CUDA, multi-node training and model/demo deployment were preferred. The deadline, 20 Jul 2026 10:00 KST, had passed before the 20:23 KST check.
[Primary posting](https://recruit.navercorp.com/rcrt/view.do?annoId=30005100&lang=en)

### ASIA019 — Grab, Machine Learning Engineer Intern, Malaysia — live

Paid onsite Petaling Jaya role. It explicitly names Python, PyTorch/TensorFlow, foundation and multimodal models, compression, evaluation frameworks, integration, testable code and MLOps exposure.
[Primary posting](https://jobs.smartrecruiters.com/Grab/744000125022409-intern-machine-learning-engineer)

### ASIA020 — Grab, Data Scientist (Analytics) Intern, Malaysia — live

Paid onsite role beginning Aug 2026. SQL/Python/R, product metrics, statistics, controlled experimentation, dashboards, models and data pipelines are explicit.
[Primary posting](https://jobs.smartrecruiters.com/Grab/744000128207779-intern-data-scientist-analytics-)

### ASIA021 — NielsenIQ, Data Science Intern, Malaysia — live

The employer ATS names Python, Power BI, English, data cleaning/validation/extraction and basic analysis; Mandarin is only an advantage. Exact city and publication date are not stated.
[Primary posting](https://jobs.smartrecruiters.com/NielsenIQ/744000131589861-data-science-intern)

## Language and translation caveats

- ASIA001 was available only in Simplified Chinese, ASIA017 in Japanese, and ASIA018 primarily in Korean. Translations preserve the source's required/preferred distinction; ambiguous phrases were left `unknown`.
- ASTRI uses English pages but ASIA004 explicitly requires spoken/written Cantonese. Preferred Networks accepts either Japanese or English but separately requires legal work eligibility in Japan.
- English is marked `yes` only where named. An English-language posting is not evidence that English is an explicit requirement.

## Sampling limitations

- This is a purposive curriculum sample, not a random vacancy census. It intentionally balances regions, sectors and job families, so count ratios must not be treated as Asian-market prevalence.
- Mainland Chinese employer pages are often poorly indexed or JavaScript/login-gated; Hong Kong and multinational ATS pages are therefore overrepresented.
- India has only one live public role in this slice. Three archived programs were retained to cover industrial research, university research and campus-only banking channels.
- Four ASTRI/NVIDIA records increase Hong Kong/China concentration; they were retained because their official pages exposed unusually precise entry-level requirements.
- Salary, visa and nationality constraints are inconsistently published. Absence from a row means unknown, not unrestricted.
- ATS state can change without notice. Recheck every `live_*` URL immediately before presenting it as an application opportunity.

## CSV QA

Validated with Python's strict CSV reader on 2026-07-20: 21 data rows, 58 columns in every row, 21 unique IDs, zero blank cells, and 21 HTTPS primary-source URLs. Distribution constraints are met: China/Hong Kong 6, Singapore 5, India 4, Japan/South Korea/Malaysia 6.
