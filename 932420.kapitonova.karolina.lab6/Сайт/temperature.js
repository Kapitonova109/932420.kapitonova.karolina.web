// Перевод из исходной единицы в Цельсии, затем в нужную единицу
function convertTemperature(value, from, to) {
    if (from === to) {
        return value;
    }

    let celsius = value;
    if (from === "F") {
        celsius = (value - 32) / 1.8;
    } else if (from === "K") {
        celsius = value - 273.15;
    }

    let result = celsius;
    if (to === "F") {
        result = celsius * 1.8 + 32;
    } else if (to === "K") {
        result = celsius + 273.15;
    }

    // Убираем лишние знаки после запятой
    return Number(result.toFixed(2));
}

// На сервере экспортируем формулу, в браузере подключаем форму
if (typeof module !== "undefined") {
    module.exports = convertTemperature;
} else {
    const form = document.getElementById("temperature-form");
    const output = document.getElementById("temperature-result");
    const labels = { C: "°C", F: "°F", K: "K" };

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const params = new URLSearchParams(new FormData(form));
        output.textContent = "Пересчитываем температуру…";
        let data;
        let note = "";

        try {
            // Запрашиваем результат у сервера
            const response = await fetch("/api/temp?" + params);
            data = await response.json();
            if (!response.ok) {
                output.textContent = data.error;
                return;
            }
        } catch (error) {
            // Без сети используем ту же формулу в браузере
            const value = Number(params.get("value"));
            const from = params.get("from");
            const to = params.get("to");
            data = { value, from, to, result: convertTemperature(value, from, to) };
            note = " (офлайн)";
        }

        if (!Number.isFinite(data.result)) {
            output.textContent = "Значение слишком большое для пересчёта";
            return;
        }
        output.textContent = data.value + " " + labels[data.from] + " = " +
            data.result + " " + labels[data.to] + note;
    });
}
