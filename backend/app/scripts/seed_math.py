"""Seeds Math Track: a small interactive curriculum demonstrating lesson mini-checks,
ordering questions and graph_point questions (§9 next-version item, ahead of full authoring).
"""

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.entities import ContentStatus, Lesson, LessonBlock, LessonBlockKind, Question, QuestionType, Section, Track

# Each lesson: (title, summary, [block, ...])
# A theory block: ("theory", "markdown text")
# A question block: ("question", {prompt, type, options, correct_answer, explanation, difficulty, tolerance?, chart_data?})
LESSONS = [
    (
        "Алгебра: уравнения и функции",
        [
            (
                "Линейные уравнения",
                "Решаем простые линейные уравнения шаг за шагом.",
                [
                    ("theory", "Линейное уравнение — это равенство вида `ax + b = c`, где нужно найти значение `x`. Чтобы решить его, переносим числа в одну сторону, а `x` — в другую."),
                    (
                        "question",
                        {
                            "prompt": "Реши уравнение: 2x + 3 = 7. Чему равен x?",
                            "type": QuestionType.number,
                            "options": None,
                            "correct_answer": {"number": 2},
                            "tolerance": 0,
                            "explanation": "2x + 3 = 7 → 2x = 4 → x = 2.",
                            "difficulty": "easy",
                        },
                    ),
                    ("theory", "Если в уравнении есть скобки, сначала раскрываем их, а потом переносим слагаемые."),
                    (
                        "question",
                        {
                            "prompt": "Какое действие нужно сделать первым при решении уравнения 3(x + 1) = 12?",
                            "type": QuestionType.single_choice,
                            "options": ["Разделить обе части на 3", "Раскрыть скобки: 3x + 3 = 12", "Вычесть 12 из обеих частей", "Умножить обе части на 3"],
                            "correct_answer": {"option": 1},
                            "explanation": "Сначала раскрываем скобки по распределительному закону: 3(x+1) = 3x + 3.",
                            "difficulty": "easy",
                        },
                    ),
                ],
            ),
            (
                "Порядок действий",
                "Правильный порядок вычислений — основа безошибочной алгебры.",
                [
                    ("theory", "Порядок действий: сначала скобки, затем степени, затем умножение и деление (слева направо), и в конце сложение и вычитание (слева направо)."),
                    (
                        "question",
                        {
                            "prompt": "Расставь шаги решения выражения 2 + 3 × (4 − 1) в правильном порядке.",
                            "type": QuestionType.ordering,
                            "options": ["Выполнить сложение: 2 + 9 = 11", "Вычислить скобки: 4 − 1 = 3", "Выполнить умножение: 3 × 3 = 9"],
                            "correct_answer": {"order": [1, 2, 0]},
                            "explanation": "Сначала скобки, потом умножение, потом сложение — итог 11.",
                            "difficulty": "medium",
                        },
                    ),
                ],
            ),
            (
                "Графики линейных функций",
                "Линейная функция y = kx + b задаёт прямую на координатной плоскости.",
                [
                    ("theory", "График функции y = 2x − 1 — это прямая линия. Чтобы найти точку на графике, подставь значение x и вычисли y."),
                    (
                        "question",
                        {
                            "prompt": "Отметь на графике точку, принадлежащую прямой y = 2x − 1, при x = 2.",
                            "type": QuestionType.graph_point,
                            "options": None,
                            "correct_answer": {"x": 2, "y": 3},
                            "tolerance": 0.6,
                            "explanation": "При x = 2: y = 2·2 − 1 = 3, значит точка (2, 3).",
                            "difficulty": "medium",
                            "chart_data": {"x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5, "x_label": "x", "y_label": "y", "curve": [[-5, -11], [5, 9]]},
                        },
                    ),
                ],
            ),
        ],
    ),
    (
        "Геометрия: фигуры и измерения",
        [
            (
                "Периметр и площадь прямоугольника",
                "Периметр — сумма всех сторон, площадь — произведение сторон.",
                [
                    ("theory", "Периметр прямоугольника P = 2(a + b). Площадь S = a × b, где a и b — длины сторон."),
                    (
                        "question",
                        {
                            "prompt": "Стороны прямоугольника 5 см и 3 см. Чему равна площадь в см²?",
                            "type": QuestionType.number,
                            "options": None,
                            "correct_answer": {"number": 15},
                            "tolerance": 0,
                            "explanation": "S = 5 × 3 = 15 см².",
                            "difficulty": "easy",
                        },
                    ),
                ],
            ),
            (
                "Порядок построения окружности циркулем",
                "Построение окружности заданного радиуса — базовый геометрический навык.",
                [
                    ("theory", "Чтобы построить окружность циркулем, нужно выполнить шаги в правильном порядке."),
                    (
                        "question",
                        {
                            "prompt": "Расставь шаги построения окружности радиусом 3 см в правильном порядке.",
                            "type": QuestionType.ordering,
                            "options": ["Провести окружность, вращая циркуль вокруг центра", "Отметить точку — центр окружности", "Установить раствор циркуля равным 3 см по линейке"],
                            "correct_answer": {"order": [1, 2, 0]},
                            "explanation": "Сначала отмечаем центр, затем задаём радиус, затем чертим саму окружность.",
                            "difficulty": "easy",
                        },
                    ),
                ],
            ),
            (
                "Точки на координатной плоскости",
                "Каждая точка плоскости задаётся парой координат (x, y).",
                [
                    ("theory", "Первая координата (x) откладывается по горизонтали, вторая (y) — по вертикали. Точка (3, −2) находится справа от начала координат и ниже оси x."),
                    (
                        "question",
                        {
                            "prompt": "Отметь на плоскости точку (3, −2).",
                            "type": QuestionType.graph_point,
                            "options": None,
                            "correct_answer": {"x": 3, "y": -2},
                            "tolerance": 0.6,
                            "explanation": "Точка (3, −2): 3 единицы вправо по x, 2 единицы вниз по y.",
                            "difficulty": "easy",
                            "chart_data": {"x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5, "x_label": "x", "y_label": "y"},
                        },
                    ),
                ],
            ),
        ],
    ),
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Track).filter(Track.slug == "math").one_or_none()
        if existing:
            print("Math Track already seeded")
            return

        track = Track(slug="math", title="Math Track", description="Интерактивные задания и мини-проверки по математике", status=ContentStatus.published)
        db.add(track)
        db.flush()

        lesson_order = 1
        for section_order, (section_title, lessons) in enumerate(LESSONS, start=1):
            section = Section(track_id=track.id, title=section_title, order=section_order)
            db.add(section)
            db.flush()
            for title, summary, blocks in lessons:
                lesson = Lesson(section_id=section.id, title=title, summary=summary, theory=summary, order=lesson_order, pass_percent=70)
                db.add(lesson)
                db.flush()

                block_order = 1
                question_order = 1
                for kind, payload in blocks:
                    if kind == "theory":
                        db.add(LessonBlock(lesson_id=lesson.id, order=block_order, kind=LessonBlockKind.theory, theory=payload))
                    else:
                        question = Question(
                            lesson_id=lesson.id,
                            title=title,
                            prompt=payload["prompt"],
                            type=payload["type"],
                            options=payload["options"],
                            correct_answer=payload["correct_answer"],
                            tolerance=payload.get("tolerance"),
                            points=5,
                            explanation=payload["explanation"],
                            difficulty=payload["difficulty"],
                            order=question_order,
                            chart_data=payload.get("chart_data"),
                        )
                        db.add(question)
                        db.flush()
                        db.add(LessonBlock(lesson_id=lesson.id, order=block_order, kind=LessonBlockKind.question, question_id=question.id))
                        question_order += 1
                    block_order += 1

                lesson_order += 1
        db.commit()
        print("Seeded Math Track")
    finally:
        db.close()


if __name__ == "__main__":
    main()
