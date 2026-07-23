from datetime import timedelta

from app.db.base import Base
from app.db.session import SessionLocal
from app.db.session import engine
from app.models.entities import (
    ContentStatus,
    Question,
    QuestionType,
    Section,
    Tournament,
    TournamentQuestion,
    TournamentStatus,
    Track,
    now_utc,
)
from app.scripts.seed_math import seed_math
from app.services.notifications import backfill_content_notifications


# Each lesson: (title, theory, [question, ...])
# Each question: dict with prompt, type, options, correct_answer, explanation, difficulty
LESSONS = [
    ("Введение в искусственный интеллект", [
        (
            "Что такое искусственный интеллект",
            (
                "Искусственный интеллект (AI) — это программы, которые учатся находить закономерности в данных "
                "и на основе этого принимают решения, вместо того чтобы следовать заранее прописанным человеком "
                "правилам «если — то».\n\n"
                "Обычная программа делает ровно то, что в неё заложил разработчик: разработчик пишет правило "
                "«если сумма покупки больше 5000 ₽ — дать скидку 10%», и программа всегда следует этому правилу. "
                "AI-система работает иначе: ей показывают много примеров (например, тысячи фотографий кошек и "
                "собак с подписями), и она сама находит признаки, по которым можно отличить одно от другого — "
                "без того, чтобы кто-то явно написал «у кошки такие-то уши».\n\n"
                "Примеры AI-систем вокруг нас: голосовые помощники (Siri, Алиса), рекомендации фильмов и музыки, "
                "фильтр спама в почте, распознавание лиц для разблокировки телефона, переводчик текста. Общее у "
                "всех этих систем — они обучены на большом количестве примеров и применяют найденные "
                "закономерности к новым, ещё не виденным данным.\n\n"
                "Ключевая идея: AI не «понимает» мир, как человек — он находит статистические закономерности "
                "в данных, которые ему показали при обучении."
            ),
            [
                {
                    "prompt": "Что отличает AI-систему от обычной программы с фиксированными правилами?",
                    "type": QuestionType.single_choice,
                    "options": ["AI работает быстрее любого кода", "AI выводит правила из данных, а не получает их явно от человека", "AI не может ошибаться", "AI работает только с текстом"],
                    "correct_answer": {"option": 1},
                    "explanation": "Главное отличие — обучение на примерах: система сама находит закономерности вместо жёстко заданных правил.",
                    "difficulty": "easy",
                },
                {
                    "prompt": "Какие из перечисленных систем являются примерами AI? (выберите все подходящие)",
                    "type": QuestionType.multiple_choice,
                    "options": ["Голосовой помощник, распознающий речь", "Калькулятор, который складывает два числа", "Фильтр спама, который учится отличать спам от обычных писем", "Часы, показывающие точное время"],
                    "correct_answer": {"options": [0, 2]},
                    "explanation": "Голосовой помощник и фильтр спама учатся на примерах и подстраиваются под новые данные — это и есть признак AI. Калькулятор и часы всегда работают по одному и тому же жёсткому алгоритму.",
                    "difficulty": "easy",
                },
                {
                    "prompt": "Разработчик написал программу: «если клиент потратил больше 5000 ₽ — дать скидку 10%». Это пример:",
                    "type": QuestionType.single_choice,
                    "options": ["AI-системы, потому что программа принимает решение", "Обычной программы с фиксированным правилом", "Обучения с подкреплением", "Кластеризации"],
                    "correct_answer": {"option": 1},
                    "explanation": "Правило задано человеком напрямую и не меняется от данных — значит, это не AI, а обычная логика.",
                    "difficulty": "medium",
                },
                {
                    "prompt": "Одним словом: как называется способность AI-системы находить закономерности в данных без явных правил от человека?",
                    "type": QuestionType.short_text,
                    "options": None,
                    "correct_answer": {"text": "обучение"},
                    "explanation": "Этот процесс называется обучением (training) — модель подбирает параметры так, чтобы её предсказания совпадали с примерами.",
                    "difficulty": "medium",
                },
                {
                    "prompt": "Голосовой помощник плохо распознал непривычный акцент и ответил неправильно. Это говорит о том, что:",
                    "type": QuestionType.single_choice,
                    "options": ["Голосовые помощники — это не AI, а обычная программа", "AI-система может ошибаться на данных, непохожих на те, что были при обучении", "Систему нужно перезагрузить", "Это баг в микрофоне"],
                    "correct_answer": {"option": 1},
                    "explanation": "AI-модель обобщает закономерности из обучающих данных; на нетипичных примерах (редкий акцент) она может ошибаться сильнее — это нормальное ограничение, а не признак того, что система «не AI».",
                    "difficulty": "easy",
                },
            ],
        ),
        ("Как машина обучается на данных", "Обучение модели — это подбор параметров, при которых её предсказания на примерах максимально совпадают с правильными ответами.", [
            {"prompt": "Что модель улучшает на каждой итерации обучения?", "type": QuestionType.single_choice, "options": ["Скорость своей работы", "Размер датасета", "Разницу между предсказанием и правильным ответом", "Количество слоёв"], "correct_answer": {"option": 2}, "explanation": "Обучение — это минимизация ошибки между предсказанием модели и истинным ответом.", "difficulty": "easy"},
        ]),
        ("Основные виды машинного обучения", "Есть supervised, unsupervised и reinforcement learning: разные способы получать закономерности или учиться через награды.", [
            {"prompt": "Какой подход использует награды и штрафы вместо готовых правильных ответов?", "type": QuestionType.single_choice, "options": ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Transfer learning"], "correct_answer": {"option": 2}, "explanation": "Reinforcement learning обучает агента через награды за успешные действия.", "difficulty": "easy"},
        ]),
    ]),
    ("Данные и задачи машинного обучения", [
        ("Объекты, признаки и целевая переменная", "Признаки — входные данные, target — то, что нужно предсказать.", [
            {"prompt": "Что является target в задаче предсказания цены квартиры?", "type": QuestionType.single_choice, "options": ["Площадь квартиры", "Этаж", "Цена квартиры", "Год постройки"], "correct_answer": {"option": 2}, "explanation": "Target — это то, что модель предсказывает, то есть сама цена.", "difficulty": "easy"},
        ]),
        ("Классификация, регрессия и кластеризация", "Выбрать класс — классификация. Предсказать число — регрессия. Найти группы без ответов — кластеризация.", [
            {"prompt": "Какой тип задачи, если модель предсказывает цену квартиры?", "type": QuestionType.single_choice, "options": ["Классификация", "Регрессия", "Кластеризация"], "correct_answer": {"option": 1}, "explanation": "Цена — число, значит это регрессия.", "difficulty": "easy"},
        ]),
        ("Подготовка данных", "Перед обучением данные нужно очистить, привести к единому виду и разделить на признаки и target.", [
            {"prompt": "Почему подготовка данных важна?", "type": QuestionType.single_choice, "options": ["Алгоритмы все одинаковые", "Модель не научится на грязных данных", "Это всегда быстрее", "Так проще сделать презентацию"], "correct_answer": {"option": 1}, "explanation": "Даже мощная модель плохо работает на плохих данных.", "difficulty": "easy"},
        ]),
    ]),
    ("Обучение и оценка модели", [
        ("Обучающая, валидационная и тестовая выборки", "Модель учится на train и проверяется на данных, которых не видела.", [
            {"prompt": "Зачем нужна отдельная тестовая выборка?", "type": QuestionType.single_choice, "options": ["Чтобы ускорить обучение", "Чтобы честно проверить работу на новых данных", "Чтобы уменьшить датасет", "Чтобы визуализировать данные"], "correct_answer": {"option": 1}, "explanation": "Test показывает, как модель справится с новыми данными.", "difficulty": "easy"},
        ]),
        ("Метрики качества", "Accuracy, precision, recall и MAE отвечают на разные вопросы о качестве модели.", [
            {"prompt": "Что важнее при поиске редкого заболевания?", "type": QuestionType.single_choice, "options": ["Только accuracy", "Recall", "Размер модели", "Количество признаков"], "correct_answer": {"option": 1}, "explanation": "Recall показывает, сколько реальных случаев модель нашла.", "difficulty": "medium"},
        ]),
        ("Переобучение и утечка данных", "Переобучение — когда модель запоминает train-данные, а не общие закономерности.", [
            {"prompt": "Какой признак указывает на переобучение?", "type": QuestionType.single_choice, "options": ["Высокая точность на train, низкая на test", "Одинаковая точность", "Медленный запуск", "Мало признаков"], "correct_answer": {"option": 0}, "explanation": "Разрыв между train и test — классический признак переобучения.", "difficulty": "medium"},
        ]),
    ]),
    ("Ответственный искусственный интеллект", [
        ("Ошибки и ограничения AI", "Модель может ошибаться, а уверенный ответ не гарантирует правильность.", [
            {"prompt": "Что верно про AI-системы?", "type": QuestionType.single_choice, "options": ["Они всегда правы", "Качество зависит от данных", "Они не требуют проверки", "Они не ошибаются на новых данных"], "correct_answer": {"option": 1}, "explanation": "Качество результата зависит от данных и постановки задачи.", "difficulty": "easy"},
        ]),
        ("Смещения, приватность и безопасность", "Если данные содержат исторический перекос, модель может его повторить и усилить.", [
            {"prompt": "Откуда чаще всего берётся bias в модели?", "type": QuestionType.single_choice, "options": ["Из перекоса в обучающих данных", "Из цвета интерфейса", "Из скорости ответа", "Из размера экрана"], "correct_answer": {"option": 0}, "explanation": "Модель отражает закономерности и перекосы в данных.", "difficulty": "easy"},
        ]),
        ("Человек и искусственный интеллект", "AI помогает человеку, но в важных задачах нужен контроль и ответственность.", [
            {"prompt": "Что является ответственным использованием AI?", "type": QuestionType.single_choice, "options": ["Слепо доверять ответу", "Проверять важные выводы человеком", "Скрывать ограничения", "Собирать максимум данных"], "correct_answer": {"option": 1}, "explanation": "В важных решениях должен сохраняться человеческий контроль.", "difficulty": "medium"},
        ]),
    ]),
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Track).filter(Track.slug == "ai").one_or_none()
        if existing:
            print("AI Track already seeded")
            math_track = seed_math(db)
            notifications_created = backfill_content_notifications(db)
            db.commit()
            print(f"Math Track ready: {math_track.id}")
            print(f"Content notifications ready: {notifications_created} created")
            return

        track = Track(slug="ai", title="AI Track", description="12 уроков от основ AI до responsible AI", status=ContentStatus.published)
        db.add(track)
        db.flush()

        all_questions: list[Question] = []
        lesson_order = 1
        for section_order, (section_title, lessons) in enumerate(LESSONS, start=1):
            section = Section(track_id=track.id, title=section_title, order=section_order)
            db.add(section)
            db.flush()
            for title, theory, questions in lessons:
                from app.models.entities import Lesson

                lesson = Lesson(section_id=section.id, title=title, summary=theory[:140], theory=theory, order=lesson_order, pass_percent=70)
                db.add(lesson)
                db.flush()
                for question_order, q in enumerate(questions, start=1):
                    question = Question(
                        lesson_id=lesson.id,
                        title=title,
                        prompt=q["prompt"],
                        type=q["type"],
                        options=q["options"],
                        correct_answer=q["correct_answer"],
                        points=5,
                        explanation=q["explanation"],
                        difficulty=q["difficulty"],
                        order=question_order,
                    )
                    db.add(question)
                    all_questions.append(question)
                lesson_order += 1

        starts_at = now_utc() - timedelta(minutes=5)
        tournament = Tournament(
            track_id=track.id,
            title="AI Basics Tournament",
            description="Проверка знаний по AI Track: данные, ML-задачи, метрики и responsible AI.",
            starts_at=starts_at,
            ends_at=starts_at + timedelta(days=7),
            duration_minutes=60,
            status=TournamentStatus.active,
        )
        db.add(tournament)
        db.flush()
        for order, question in enumerate(all_questions, start=1):
            db.add(TournamentQuestion(tournament_id=tournament.id, question_id=question.id, order=order))
        math_track = seed_math(db)
        notifications_created = backfill_content_notifications(db)
        db.commit()
        print(f"Seeded AI Track, AI Basics Tournament and Math Track {math_track.id}")
        print(f"Content notifications ready: {notifications_created} created")
    finally:
        db.close()


if __name__ == "__main__":
    main()
