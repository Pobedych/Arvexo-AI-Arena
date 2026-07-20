const root = document.documentElement;
let storedTheme = null;

try {
  storedTheme = localStorage.getItem("arena-prototype-theme");
} catch {
  storedTheme = null;
}

if (storedTheme === "dark" || storedTheme === "light") {
  root.dataset.theme = storedTheme;
}

requestAnimationFrame(() => {
  document.body.classList.add("is-ready");
});

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("arena-prototype-theme", next);
    } catch {
      // The prototype also works when opened directly from the filesystem.
    }
    button.setAttribute("aria-label", next === "dark" ? "Включить светлую тему" : "Включить тёмную тему");
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && button.animate) {
      button.animate(
        [
          { transform: "rotate(0deg) scale(1)" },
          { transform: "rotate(160deg) scale(0.86)", offset: 0.55 },
          { transform: "rotate(360deg) scale(1)" },
        ],
        { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    }
  });
});

const menuButton = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

const goalForm = document.querySelector("[data-goal-form]");

if (goalForm) {
  const goalInput = goalForm.querySelector("textarea[name='learning_goal']");
  const goalResult = goalForm.querySelector("[data-goal-result]");
  const goalTitle = goalForm.querySelector("[data-goal-title]");
  const goalCopy = goalForm.querySelector("[data-goal-copy]");
  const goalLink = goalForm.querySelector("[data-goal-link]");

  const fitGoalInput = () => {
    goalInput.style.height = "auto";
    goalInput.style.height = `${Math.min(goalInput.scrollHeight, 150)}px`;
  };

  const routes = {
    "track.html": {
      title: "Начни с AI Track",
      copy: "Короткий маршрут поможет собрать базу и перейти к практике.",
      label: "Открыть AI Track",
    },
    "practice.html": {
      title: "Проверь себя на практике",
      copy: "Три вопроса покажут, какие темы стоит повторить перед турниром.",
      label: "Начать практику",
    },
    "tournament.html": {
      title: "Открой ближайший турнир",
      copy: "Посмотри формат, темы и время старта, затем оцени готовность.",
      label: "Смотреть турниры",
    },
  };

  const chooseRoute = (value) => {
    const normalized = value.toLowerCase();
    if (normalized.includes("турнир") || normalized.includes("соревн")) return "tournament.html";
    if (normalized.includes("провер") || normalized.includes("задач") || normalized.includes("практи")) return "practice.html";
    return "track.html";
  };

  const showRoute = (route) => {
    const recommendation = routes[route] || routes["track.html"];
    goalTitle.textContent = recommendation.title;
    goalCopy.textContent = recommendation.copy;
    goalLink.textContent = recommendation.label;
    goalLink.href = route;
    goalResult.hidden = false;
    goalResult.classList.remove("is-entering");
    requestAnimationFrame(() => goalResult.classList.add("is-entering"));
  };

  goalForm.querySelectorAll("[data-goal-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      goalInput.value = button.dataset.goalSuggestion;
      fitGoalInput();
      showRoute(button.dataset.goalTarget || chooseRoute(goalInput.value));
    });
  });

  goalInput.addEventListener("input", fitGoalInput);

  goalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!goalInput.value.trim()) {
      goalInput.focus();
      return;
    }
    showRoute(chooseRoute(goalInput.value));
  });
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll("[data-reveal]");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -7%" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const practice = document.querySelector("[data-practice]");

if (practice) {
  const answers = Array.from(practice.querySelectorAll("[data-answer]"));
  const checkButton = practice.querySelector("[data-check-answer]");
  const feedback = practice.querySelector("[data-feedback]");
  let selected = null;

  answers.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (practice.dataset.checked === "true") return;
      selected = answer;
      answers.forEach((item) => item.setAttribute("aria-pressed", String(item === answer)));
      checkButton.disabled = false;
    });
  });

  checkButton.addEventListener("click", () => {
    if (!selected) return;
    if (practice.dataset.checked === "true") {
      feedback.textContent = "В рабочем продукте здесь загрузится следующий вопрос.";
      return;
    }
    practice.dataset.checked = "true";
    const isCorrect = selected.dataset.correct === "true";
    selected.classList.add(isCorrect ? "correct" : "incorrect");
    const correct = answers.find((answer) => answer.dataset.correct === "true");
    if (correct) correct.classList.add("correct");
    const score = practice.querySelector("[data-score]");
    const firstQuestion = practice.querySelector("[data-question-one]");
    if (isCorrect && score) score.textContent = "1/3";
    if (firstQuestion) firstQuestion.classList.add("done");
    feedback.textContent = isCorrect
      ? "Верно. Метод возвращает предсказания для новых данных."
      : "Почти. model.predict() применяет обученную модель к новым данным.";
    checkButton.textContent = "Следующий вопрос";
    checkButton.disabled = false;
  });
}
