const cacheName = "kapitonova-lab6-v3";
const files = [
    "/", "/about", "/style.css", "/ideas.js", "/script.js",
    "/temperature.js", "/Изображения/myphoto.jpg", "/manifest.json",
    "/Изображения/icon-192.png", "/Изображения/icon-512.png"
];

// При первом запуске сохраняем страницы и их файлы в кеш
self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(cacheName).then(function (cache) {
        return cache.addAll(files);
    }).then(function () {
        return self.skipWaiting();
    }));
});

// Удаляем кеши старых версий этой работы
self.addEventListener("activate", function (event) {
    event.waitUntil((async function () {
        const names = await caches.keys();
        for (const name of names) {
            if (name.startsWith("kapitonova-lab6-") && name !== cacheName) {
                await caches.delete(name);
            }
        }
        await self.clients.claim();
    })());
});

self.addEventListener("fetch", function (event) {
    const request = event.request;
    const url = new URL(request.url);
    // JSON с сервера не кешируем, чтобы не выдавать старый ответ
    if (request.method !== "GET" || url.origin !== self.location.origin ||
        url.pathname.startsWith("/api/")) {
        return;
    }

    // Если сеть недоступна, берём сохранённый файл
    event.respondWith(fetch(request).catch(function () {
        return caches.open(cacheName).then(async function (cache) {
            const saved = await cache.match(request, { ignoreSearch: true });
            return saved || new Response("Нет сети и сохранённой копии страницы.", { status: 503 });
        });
    }));
});
