"""Seed the interactive Math Track using the existing lesson-step model."""

from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.entities import ContentStatus, Lesson, LessonStep, Question, QuestionType, Section, Track


MATH_LESSONS = [
    (
        "Алгебра и функции",
        [
            (
                "Линейные уравнения",
                "Научись переносить слагаемые и находить неизвестное.",
                [
                    ("step", "Как устроено уравнение", "Линейное уравнение имеет вид `ax + b = c`. Сначала переносим свободное число, затем делим обе части на коэффициент при `x`."),
                    ("question", {
                        "prompt": "Реши уравнение: 2x + 3 = 7. Чему равен x?",
                        "type": QuestionType.number,
                        "options": None,
                        "configuration": None,
                        "correct_answer": {"number": 2},
                        "tolerance": 0,
                        "explanation": "2x + 3 = 7, значит 2x = 4 и x = 2.",
                    }),
                    ("step", "Проверка решения", "Подставь найденное значение вместо `x`. Если левая и правая части равны, решение верное."),
                    ("question", {
                        "prompt": "Что лучше всего подтверждает правильность решения уравнения?",
                        "type": QuestionType.single_choice,
                        "options": ["Ответ получился целым", "После подстановки обе части равны", "В решении было два шага", "Коэффициент при x положительный"],
                        "configuration": None,
                        "correct_answer": {"option": 1},
                        "tolerance": None,
                        "explanation": "Подстановка возвращает исходное равенство и проверяет ответ напрямую.",
                    }),
                ],
            ),
            (
                "Порядок действий",
                "Разбирай выражения в правильной последовательности.",
                [
                    ("step", "Приоритет операций", "Сначала выполняются действия в скобках, затем степени, умножение и деление, после них сложение и вычитание."),
                    ("question", {
                        "prompt": "Расположи шаги вычисления 2 + 3 × (4 − 1) в правильном порядке.",
                        "type": QuestionType.sequence,
                        "options": ["Вычислить скобки: 4 − 1 = 3", "Выполнить умножение: 3 × 3 = 9", "Выполнить сложение: 2 + 9 = 11"],
                        "configuration": None,
                        "correct_answer": {"order": [0, 1, 2]},
                        "tolerance": None,
                        "explanation": "Скобки выполняются до умножения, а умножение до сложения.",
                    }),
                ],
            ),
            (
                "График линейной функции",
                "Связывай формулу функции с точками на координатной плоскости.",
                [
                    ("step", "Координаты точки", "Для функции `y = 2x − 1` подставь значение `x`, вычисли `y` и отметь пару координат `(x; y)`."),
                    ("question", {
                        "prompt": "Отметь точку графика y = 2x − 1 при x = 2.",
                        "type": QuestionType.graph_point,
                        "options": None,
                        "configuration": {"x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5},
                        "correct_answer": {"point": [2, 3]},
                        "tolerance": 0.6,
                        "explanation": "При x = 2 получаем y = 2 × 2 − 1 = 3, поэтому нужна точка (2; 3).",
                    }),
                ],
            ),
        ],
    ),
    (
        "Геометрия и координаты",
        [
            (
                "Площадь прямоугольника",
                "Применяй формулу площади к практическим задачам.",
                [
                    ("step", "Формула площади", "Площадь прямоугольника равна произведению длины и ширины: `S = a × b`. Единицы площади записываются с квадратом."),
                    ("question", {
                        "prompt": "Стороны прямоугольника равны 5 см и 3 см. Чему равна площадь в см²?",
                        "type": QuestionType.number,
                        "options": None,
                        "configuration": None,
                        "correct_answer": {"number": 15},
                        "tolerance": 0,
                        "explanation": "S = 5 × 3 = 15 см².",
                    }),
                ],
            ),
            (
                "Построение окружности",
                "Выстраивай геометрическое построение по шагам.",
                [
                    ("step", "Центр и радиус", "Перед построением окружности нужно выбрать центр и установить раствор циркуля, равный нужному радиусу."),
                    ("question", {
                        "prompt": "Расположи шаги построения окружности радиусом 3 см.",
                        "type": QuestionType.sequence,
                        "options": ["Отметить центр окружности", "Установить раствор циркуля 3 см", "Провести окружность вокруг центра"],
                        "configuration": None,
                        "correct_answer": {"order": [0, 1, 2]},
                        "tolerance": None,
                        "explanation": "Сначала выбирают центр, затем задают радиус и только после этого проводят окружность.",
                    }),
                ],
            ),
            (
                "Точки на координатной плоскости",
                "Читай координаты и находи положение точки.",
                [
                    ("step", "Оси координат", "Координата `x` задаёт движение по горизонтали, а `y` по вертикали. Отрицательное значение `y` находится ниже оси x."),
                    ("question", {
                        "prompt": "Отметь на плоскости точку (3; −2).",
                        "type": QuestionType.graph_point,
                        "options": None,
                        "configuration": {"x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5},
                        "correct_answer": {"point": [3, -2]},
                        "tolerance": 0.6,
                        "explanation": "Точка находится на 3 единицы правее начала координат и на 2 единицы ниже оси x.",
                    }),
                ],
            ),
        ],
    ),
]


def seed_math(db: Session) -> Track:
    existing = db.query(Track).filter(Track.slug == "math").one_or_none()
    if existing:
        return existing

    track = Track(
        slug="math",
        title="Math Track",
        description="Интерактивная подготовка по алгебре, функциям, геометрии и координатам",
        status=ContentStatus.published,
    )
    db.add(track)
    db.flush()

    lesson_order = 1
    for section_order, (section_title, lessons) in enumerate(MATH_LESSONS, start=1):
        section = Section(track_id=track.id, title=section_title, order=section_order)
        db.add(section)
        db.flush()
        for title, summary, blocks in lessons:
            lesson = Lesson(
                section_id=section.id,
                title=title,
                summary=summary,
                theory="",
                order=lesson_order,
                pass_percent=70,
                status=ContentStatus.published,
            )
            db.add(lesson)
            db.flush()
            for block_order, block in enumerate(blocks, start=1):
                kind = block[0]
                if kind == "step":
                    _, step_title, body = block
                    db.add(LessonStep(lesson_id=lesson.id, title=step_title, body=body, order=block_order))
                    continue
                _, payload = block
                db.add(
                    Question(
                        lesson_id=lesson.id,
                        title=title,
                        prompt=payload["prompt"],
                        type=payload["type"],
                        options=payload["options"],
                        configuration=payload["configuration"],
                        correct_answer=payload["correct_answer"],
                        tolerance=payload["tolerance"],
                        points=5,
                        explanation=payload["explanation"],
                        difficulty="easy",
                        order=block_order,
                        status=ContentStatus.published,
                    )
                )
            lesson_order += 1
    return track


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        track = seed_math(db)
        db.commit()
        print(f"Math Track ready: {track.id}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
