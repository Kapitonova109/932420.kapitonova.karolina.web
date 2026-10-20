// Лабораторная работа 4, вариант 16 - дневная выручка

// Ввод имени и приветствие
var userName = prompt("Введите ваше имя:");

if (userName === null || userName === "") {
    alert("Здравствуйте!");
} else {
    alert("Здравствуйте, " + userName + "! Сейчас рассчитаем выручку за семь дней.");
}

// Дневная выручка за семь дней в рублях
var income = [12000, 2000, 3000, 1000, 2500, 1500, 11000];
console.log("Дневная выручка:", income);

// Поиск максимальной выручки
function getMax(numbers) {
    var max = numbers[0];

    for (var i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }

    return max;
}

// Отбор выручки больше 10 000 рублей
function filterIncome(numbers) {
    var result = [];

    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] > 10000) {
            result.push(numbers[i]);
        }
    }

    return result;
}

// Подсчёт общей выручки
function getSum(numbers) {
    var sum = 0;

    for (var i = 0; i < numbers.length; i++) {
        sum = sum + numbers[i];
    }

    return sum;
}

// Вызов функций
var maxIncome = getMax(income);
var highIncome = filterIncome(income);
var total = getSum(income);

console.log("Максимальная выручка: " + maxIncome + " ₽");
console.log("Выручка больше 10 000 ₽:", highIncome);

// Подсчёт дней с выручкой не больше 3 000 рублей
var lowCount = 0;

for (var i = 0; i < income.length; i++) {
    if (income[i] <= 3000) {
        lowCount = lowCount + 1;
        console.log("День " + (i + 1) + ": низкая выручка — " + income[i] + " ₽");
    }
}

// Доля дней с низкой выручкой в процентах
var lowShare = lowCount / income.length * 100;

console.log("Количество дней с низкой выручкой: " + lowCount);
console.log("Доля дней с низкой выручкой: " + lowShare.toFixed(2) + "%");

// Вывод общей выручки и количества дней с высокими показателями
alert("Общая выручка – " + total + " ₽, в " + highIncome.length + " днях показатели были высокими");

// Проверка средней выручки
var average = total / income.length;

if (average < 5000) {
    console.log("Стоит проанализировать причины низкой выручки");
}
