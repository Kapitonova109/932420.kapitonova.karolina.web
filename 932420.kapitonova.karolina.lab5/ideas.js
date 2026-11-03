// Лабораторная работа 5, вариант 16 - список идей

// Поиск элементов страницы
var ideaForm = document.getElementById("idea-form");
var ideaList = document.querySelector("#ideas .ideas-list");
var ideaBlock = document.getElementById("idea-block");
var ideaCount = document.getElementById("idea-count");
var ideaMessage = document.getElementById("idea-message");
var themeButton = document.getElementById("theme-button");
var removeLastButton = document.getElementById("remove-last");
var toggleIdeasButton = document.getElementById("toggle-ideas");
var nameInput = document.getElementById("idea-name");
var audienceInput = document.getElementById("idea-audience");
var metricInput = document.getElementById("idea-metric");

// Идеи из прошлой работы с примерами аудитории и метрик
var ideas = [
    { name: "Приложение для заметок", audience: "Студенты", metric: "Активные пользователи за месяц" },
    { name: "Обмен учебными материалами", audience: "Студенты и преподаватели", metric: "Материалы, добавленные за неделю" },
    { name: "Сайт-визитка для бизнеса", audience: "Малый бизнес", metric: "Заявки с сайта за месяц" },
    { name: "Поиск репетиторов", audience: "Школьники и родители", metric: "Записи на занятия за месяц" }
];
var darkTheme = false;
var ideasHidden = false;
var storageKey = "kapitonova-lab5";

// Сохранение идей и настроек в localStorage
function saveState() {
    try {
        localStorage.setItem(storageKey, JSON.stringify({
            ideas: ideas,
            darkTheme: darkTheme,
            ideasHidden: ideasHidden
        }));
    } catch (error) {
        ideaMessage.textContent = "Не удалось сохранить данные в браузере.";
    }
}

// Загрузка сохранённых идей и настроек
function loadState() {
    try {
        var saved = localStorage.getItem(storageKey);
        // При первом открытии оставляем начальный список идей
        if (saved === null) {
            return;
        }
        var state = JSON.parse(saved);
        if (state && Array.isArray(state.ideas)) {
            // Загружаем только карточки, у которых есть все три поля
            ideas = state.ideas.filter(function (idea) {
                return idea && typeof idea.name === "string" &&
                    typeof idea.audience === "string" && typeof idea.metric === "string";
            });
            darkTheme = state.darkTheme === true;
            ideasHidden = state.ideasHidden === true;
        }
    } catch (error) {
        ideaMessage.textContent = "Не удалось прочитать сохранённые данные.";
    }
}

// Создание карточки идеи
function createIdeaCard(idea, index) {
    var card = document.createElement("article");
    card.classList.add("idea-card");

    var title = document.createElement("h3");
    title.textContent = idea.name;
    card.appendChild(title);

    var audience = document.createElement("p");
    audience.textContent = "Целевая аудитория: " + idea.audience;
    card.appendChild(audience);

    var metric = document.createElement("p");
    metric.textContent = "Метрика: " + idea.metric;
    card.appendChild(metric);

    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.textContent = "Удалить";
    // Кнопка удаляет именно ту идею, для которой создана карточка
    button.addEventListener("click", function () {
        removeIdea(index);
    });
    card.appendChild(button);
    return card;
}

// Вывод списка и количества идей
function showIdeas() {
    // Убираем старые карточки и строим список заново из массива
    ideaList.textContent = "";
    for (var i = 0; i < ideas.length; i++) {
        ideaList.appendChild(createIdeaCard(ideas[i], i));
    }
    var cards = ideaList.querySelectorAll(".idea-card");
    ideaCount.textContent = cards.length === 0 ? "Идей пока нет." : "Всего идей: " + cards.length;
    removeLastButton.disabled = cards.length === 0;
}

// Добавление идеи из формы
function addIdea(event) {
    event.preventDefault();
    var name = nameInput.value.trim();
    var audience = audienceInput.value.trim();
    var metric = metricInput.value.trim();
    // Поле из одних пробелов тоже считаем пустым
    if (name === "" || audience === "" || metric === "") {
        ideaMessage.textContent = "Заполните название, целевую аудиторию и метрику.";
        return;
    }
    ideas.push({ name: name, audience: audience, metric: metric });
    ideaForm.reset();
    ideaMessage.textContent = "Идея добавлена.";
    // Показываем новую карточку, даже если список был скрыт
    ideasHidden = false;
    showIdeas();
    showVisibility();
    saveState();
}

// Удаление идеи по её номеру в массиве
function removeIdea(index) {
    if (index < 0 || index >= ideas.length) {
        return;
    }
    ideas.splice(index, 1);
    ideaMessage.textContent = "Идея удалена.";
    showIdeas();
    saveState();
}

// Переключение темы и изменение текста кнопки
function showTheme() {
    document.body.classList.toggle("dark-theme", darkTheme);
    themeButton.setAttribute("aria-pressed", darkTheme);
    themeButton.textContent = darkTheme ? "Светлая тема" : "Тёмная тема";
}

// Скрытие или показ списка
function showVisibility() {
    ideaBlock.hidden = ideasHidden;
    toggleIdeasButton.setAttribute("aria-expanded", !ideasHidden);
    toggleIdeasButton.textContent = ideasHidden ? "Показать идеи" : "Скрыть идеи";
}

// Проверка элементов и подключение событий
function startIdeas() {
    if (!ideaForm || !ideaList || !ideaBlock || !ideaCount || !ideaMessage ||
        !themeButton || !removeLastButton || !toggleIdeasButton ||
        !nameInput || !audienceInput || !metricInput) {
        console.error("Не найдены элементы списка идей.");
        return;
    }
    loadState();
    showTheme();
    showVisibility();
    showIdeas();

    ideaForm.addEventListener("submit", addIdea);
    removeLastButton.addEventListener("click", function () {
        removeIdea(ideas.length - 1);
    });
    themeButton.addEventListener("click", function () {
        darkTheme = !darkTheme;
        showTheme();
        saveState();
    });
    toggleIdeasButton.addEventListener("click", function () {
        ideasHidden = !ideasHidden;
        showVisibility();
        saveState();
    });
}

startIdeas();
