# Журнал исследования

Все даты и время — Europe/Moscow. Статусы: `planned`, `in_progress`, `complete`, `limited`.

| Дата | Этап | Статус | Выполнено | Проверка и ограничения |
|---|---|---|---|---|
| 2026-07-20 | Подготовка | complete | Полностью прочитан исходный восьмиэтапный бриф. Изучены Master TZ v1.7, текущая ветка, seed/local DB, production-аудиты, рабочее дерево и граф. Созданы план, реестр и список открытых вопросов. Проведено разделение ТЗ / current branch / production / stale graph. | Репозиторий имеет пользовательские незакоммиченные изменения; исследование ограничено `research/`, продуктовый код не изменяется. Graph `main@b8019b2` содержит примеси feature-ветки и не используется как единственный источник текущего состояния. Current branch не содержит Math Track, scheduler и audit log, хотя §18 ТЗ заявляет обратное. |
| 2026-07-20 | Этап 1 | complete | Собраны market/demand anchors России, США, ЕС и Азии; 11 audience/JTBD cards; 59 уникальных глобальных/региональных product families; failure/closure, completion и gamification cases; 20 проблем, 10 ниш, 10 угроз и 10 неизвестных. | Strict CSV audit: 59 rows, 28 columns, 59 unique names, 0 blank cells, 0 malformed rows, URL/date/evidence grade в каждой строке. Все mandatory competitors покрыты. Широкий EdTech TAM, company outcomes и WTP не считаются доказанными; динамические/недоступные цены помечены. |
| 2026-07-20 | Этап 2 | complete | Разобраны 32 обязательных learning methods (33 карточки), 18 gamification mechanics, 12 AI-tutor/product archetypes, H0–H5, architecture/eval/safety, 20 learning principles, 30 gamification dangers + 20 AI failures и real-learning measurement model. В едином ledger 132 уникальных источника. | Проведены три file-level red-team аудита и финальный cross-file audit; исправлены Duolingo RCT attrition, Tutor CoPilot outcome, hint-dependency, statistical level mixing, false Bayesian precision, rating/team/XP логика и source-grade drift. Final cross-audit: P0=0/P1=0/P2=0; 132 ledger rows, 9 fields, 0 malformed. Все Arena thresholds — design conventions до локальных trials. |
| 2026-07-20 | Этап 3 | complete | Собраны 63 уникальные официальные job/program pages: после повторной live-проверки 40 live, 3 pipeline, 20 archived; строгий vacancy denominator — 39 (исключена pooled program). Проанализированы 39 skill flags, required/preferred text, регионы/role families/concentration; построены 16 модулей × 15 полей, 5 треков, internship minimum, capstone и verified-portfolio evidence contract. | Strict QA: CSV 63×58, 63 unique IDs/URLs, 0 blank, only yes/no/unknown; ledger 63 job rows + 6 framework cross-checks. Исправлены 6 ошибочных live statuses и explicit flags; Amazon 8/63, top-5 33,3%, поэтому выборка не census. Curriculum триангулирован с ACM/NASEM/O*NET/ESCO; часы и hiring value остаются гипотезами. |
| 2026-07-20 | Этап 4 | complete | Сопоставлены 10 позиционирований и 7 MVP; выбраны provisional P4/M3 для русскоязычных 18–23 с basic Python и горизонтом подачи 3–6 месяцев. Спроектированы все UX surfaces, 6 journeys, 26 task formats, 50 falsifiable hypotheses и 6 interview guides. | Independent audit PASS: P0/P1/P2=0; exact counts 10/7/6/26/50/6, score/sensitivity and Markdown/link checks. Speed-first сценарий выбирает theoretical tournaments, но base/learning/revenue — M3. P4/M3/T14 — решение о следующем тесте, не PMF/learning/employer evidence. |
| 2026-07-20 | Этап 5 | in_progress | Начаты сравнение 21 revenue model, 21 acquisition channel, staged GTM и проверка реальных/слабых/ложных network effects. | Цены/ARPU/unit economics не будут выдаваться за наблюдаемые данные; free learning core и отсутствие pay-to-win — design constraints. |

## Правило закрытия этапа

Этап получает `complete` только после четырёх проверок:

1. все обязательные deliverables существуют;
2. обязательные численные минимумы выполнены;
3. ключевые выводы имеют источники/уровень уверенности;
4. ограничения и открытые вопросы перенесены в соответствующие файлы.

## История критических решений

- Не использовать общий размер глобального EdTech как доказательство доступного рынка Arena: сначала определить wedge и наблюдаемый demand proxy.
- Не считать текущее ТЗ подтверждением пользовательской потребности: это внутренний первичный источник о продукте, но не о рынке.
- Не смешивать активность, XP, турнирный рейтинг и mastery; это отдельные конструкты с отдельными метриками.
- Не строить финальную рекомендацию вокруг AI-наставника до проверки learning gain, hint dependency, стоимости и безопасности.
