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


LESSONS = [
    ("Введение в искусственный интеллект", [
        ("Что такое искусственный интеллект", "AI — это программы, которые находят закономерности в данных и принимают решения без пошаговых инструкций от человека.", "Что отличает AI-систему от обычной программы с фиксированными правилами?", ["AI работает быстрее любого кода", "AI выводит правила из данных, а не получает их явно", "AI не может ошибаться", "AI работает только с текстом"], 1, "Главное отличие — обучение на примерах: система сама находит закономерности вместо жёстко заданных правил."),
        ("Как машина обучается на данных", "Обучение модели — это подбор параметров, при которых её предсказания на примерах максимально совпадают с правильными ответами.", "Что модель улучшает на каждой итерации обучения?", ["Скорость своей работы", "Размер датасета", "Разницу между предсказанием и правильным ответом", "Количество слоёв"], 2, "Обучение — это минимизация ошибки между предсказанием модели и истинным ответом."),
        ("Основные виды машинного обучения", "Есть supervised, unsupervised и reinforcement learning: разные способы получать закономерности или учиться через награды.", "Какой подход использует награды и штрафы вместо готовых правильных ответов?", ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Transfer learning"], 2, "Reinforcement learning обучает агента через награды за успешные действия."),
    ]),
    ("Данные и задачи машинного обучения", [
        ("Объекты, признаки и целевая переменная", "Признаки — входные данные, target — то, что нужно предсказать.", "Что является target в задаче предсказания цены квартиры?", ["Площадь квартиры", "Этаж", "Цена квартиры", "Год постройки"], 2, "Target — это то, что модель предсказывает, то есть сама цена."),
        ("Классификация, регрессия и кластеризация", "Выбрать класс — классификация. Предсказать число — регрессия. Найти группы без ответов — кластеризация.", "Какой тип задачи, если модель предсказывает цену квартиры?", ["Классификация", "Регрессия", "Кластеризация"], 1, "Цена — число, значит это регрессия."),
        ("Подготовка данных", "Перед обучением данные нужно очистить, привести к единому виду и разделить на признаки и target.", "Почему подготовка данных важна?", ["Алгоритмы все одинаковые", "Модель не научится на грязных данных", "Это всегда быстрее", "Так проще сделать презентацию"], 1, "Даже мощная модель плохо работает на плохих данных."),
    ]),
    ("Обучение и оценка модели", [
        ("Обучающая, валидационная и тестовая выборки", "Модель учится на train и проверяется на данных, которых не видела.", "Зачем нужна отдельная тестовая выборка?", ["Чтобы ускорить обучение", "Чтобы честно проверить работу на новых данных", "Чтобы уменьшить датасет", "Чтобы визуализировать данные"], 1, "Test показывает, как модель справится с новыми данными."),
        ("Метрики качества", "Accuracy, precision, recall и MAE отвечают на разные вопросы о качестве модели.", "Что важнее при поиске редкого заболевания?", ["Только accuracy", "Recall", "Размер модели", "Количество признаков"], 1, "Recall показывает, сколько реальных случаев модель нашла."),
        ("Переобучение и утечка данных", "Переобучение — когда модель запоминает train-данные, а не общие закономерности.", "Какой признак указывает на переобучение?", ["Высокая точность на train, низкая на test", "Одинаковая точность", "Медленный запуск", "Мало признаков"], 0, "Разрыв между train и test — классический признак переобучения."),
    ]),
    ("Ответственный искусственный интеллект", [
        ("Ошибки и ограничения AI", "Модель может ошибаться, а уверенный ответ не гарантирует правильность.", "Что верно про AI-системы?", ["Они всегда правы", "Качество зависит от данных", "Они не требуют проверки", "Они не ошибаются на новых данных"], 1, "Качество результата зависит от данных и постановки задачи."),
        ("Смещения, приватность и безопасность", "Если данные содержат исторический перекос, модель может его повторить и усилить.", "Откуда чаще всего берётся bias в модели?", ["Из перекоса в обучающих данных", "Из цвета интерфейса", "Из скорости ответа", "Из размера экрана"], 0, "Модель отражает закономерности и перекосы в данных."),
        ("Человек и искусственный интеллект", "AI помогает человеку, но в важных задачах нужен контроль и ответственность.", "Что является ответственным использованием AI?", ["Слепо доверять ответу", "Проверять важные выводы человеком", "Скрывать ограничения", "Собирать максимум данных"], 1, "В важных решениях должен сохраняться человеческий контроль."),
    ]),
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Track).filter(Track.slug == "ai").one_or_none()
        if existing:
            print("AI Track already seeded")
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
            for title, theory, prompt, options, correct_idx, explanation in lessons:
                from app.models.entities import Lesson

                lesson = Lesson(section_id=section.id, title=title, summary=theory[:140], theory=theory, order=lesson_order, pass_percent=70)
                db.add(lesson)
                db.flush()
                question = Question(
                    lesson_id=lesson.id,
                    title=title,
                    prompt=prompt,
                    type=QuestionType.single_choice,
                    options=options,
                    correct_answer={"option": correct_idx},
                    points=5,
                    explanation=explanation,
                    order=1,
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
        db.commit()
        print("Seeded AI Track and AI Basics Tournament")
    finally:
        db.close()


if __name__ == "__main__":
    main()
