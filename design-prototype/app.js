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
    { threshold: 0.14 },
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
