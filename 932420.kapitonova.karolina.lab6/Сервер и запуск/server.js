const express = require("express");
const path = require("node:path");
const convertTemperature = require("../Сайт/temperature");

const app = express();
const port = process.env.PORT || 3000;
const publicFolder = path.join(__dirname, "..", "Сайт");

// Главная страница и страница «О себе»
app.get("/", (req, res) => {
    res.sendFile(path.join(publicFolder, "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(publicFolder, "about.html"));
});

// Проверка, что сервер отвечает
app.get("/api/status", (req, res) => {
    res.json({ status: "ok" });
});

// Читаем параметры после знака ? в адресе
app.get("/api/temp", (req, res) => {
    const { value, from, to } = req.query;
    const units = ["C", "F", "K"];
    const number = Number(value);

    // Пустая строка тоже недопустима: Number("") вернул бы 0
    if (typeof value !== "string" || value.trim() === "" || !Number.isFinite(number)) {
        return res.status(400).json({ error: "Введите числовое значение температуры" });
    }

    if (!units.includes(from) || !units.includes(to)) {
        return res.status(400).json({ error: "Допустимые единицы: C, F, K" });
    }

    const result = convertTemperature(number, from, to);
    if (!Number.isFinite(result)) {
        return res.status(400).json({ error: "Значение слишком большое для пересчёта" });
    }

    res.json({ value: number, from, to, result });
});

// Отдаём CSS, JavaScript, изображения и файлы PWA из папки «Сайт»
app.use(express.static(publicFolder));

app.listen(port, () => {
    console.log("Сервер запущен: http://localhost:" + port);
});
