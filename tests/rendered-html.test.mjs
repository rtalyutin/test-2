import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";

const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const expectedContent = {
  "/": "МАСТЕРСКАЯ Галерея Контакты +7 980 156-01-07 МАСТЕРСКАЯ МЯТЫЙ ЭЛЕМЕНТ КУЗОВНОЙ РЕМОНТ От царапины до серьёзного кузовного ремонта. Позвонить Смотреть галерею РЕМОНТ ГЕОМЕТРИИ ГАРАНТИЯ 1 ГОД Листать вниз МАСТЕРСКАЯ МЯТЫЙ ЭЛЕМЕНТ Точность в каждой линии кузова. Собираем автомобиль обратно в его форму: без лишней спешки и с контролем на каждом этапе. 0 1 КУЗОВ Выправляем детали, восстанавливаем зазоры и готовим поверхность к точной окраске. 0 2 РАМА Проверяем контрольные точки и возвращаем геометрию автомобиля. 0 3 ПОКРАСКА Подбираем оттенок и собираем покрытие в единый чистый тон. ФОТО РАБОТ Ремонт, который можно рассмотреть в деталях. Открыть галерею работ КОНТАКТЫ Связаться с мастерской Телефон для связи +7 980 156-01-07 Позвоните, чтобы обсудить автомобиль и удобное время осмотра. МАСТЕРСКАЯ МЯТЫЙ ЭЛЕМЕНТ Галерея Контакты +7 980 156-01-07",
  "/gallery": "МАСТЕРСКАЯ Галерея Контакты +7 980 156-01-07 ГАЛЕРЕЯ РАБОТ КУЗОВНОЙ РЕМОНТ ФОТО РАБОТ РЕМОНТ ГЕОМЕТРИИ ГАРАНТИЯ 1 ГОД МАСТЕРСКАЯ МЯТЫЙ ЭЛЕМЕНТ Галерея Контакты +7 980 156-01-07",
};

async function render(route) {
  return worker.fetch(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }), env, ctx);
}

function visibleText(html) {
  return html.split("<body>")[1].split("</body>")[0]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

for (const route of Object.keys(expectedContent)) {
  test(`${route} preserves the complete original visible content`, async () => {
    const response = await render(route);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.equal(visibleText(html), expectedContent[route]);
    assert.match(html, /<html lang="ru"/);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.doesNotMatch(html, /codex-preview|__x00__virtual|@vite\/client/);
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
    for (const href of links) assert.ok(["/", "/gallery", "/#contacts", "#about", "tel:+79801560107"].includes(href), href);
    for (const [, src] of html.matchAll(/<(?:img|script)\b[^>]*src="([^"]+)"/g)) {
      assert.ok(src.startsWith("/"));
      await access(new URL(`../dist/client${src}`, import.meta.url));
    }
  });
}

test("gallery retains all six original photos with unique accessible controls", async () => {
  const html = await (await render("/gallery")).text();
  const images = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(images, ["/images/gallery/gallery-spraygun.png", ...Array.from({ length: 6 }, (_, index) => `/images/gallery/gallery-repair-0${index + 1}.png`)]);
  const labels = [...html.matchAll(/aria-label="(Открыть: [^"]+)"/g)].map(match => match[1]);
  assert.equal(labels.length, 6);
  assert.equal(new Set(labels).size, 6);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /<title>Галерея работ — Мастерская Мятый Элемент<\/title>/);
});

test("home retains functional section anchors and non-repeating cover background", async () => {
  const html = await (await render("/")).text();
  assert.match(html, /id="about"/);
  assert.match(html, /id="contacts"/);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\/ cover no-repeat/);
  assert.doesNotMatch(css, /background-size:\s*(?:100% auto|auto 100%)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("unknown routes return 404 and the gallery trailing slash redirects", async () => {
  assert.equal((await render("/not-a-page")).status, 404);
  const redirect = await render("/gallery/");
  assert.equal(redirect.status, 308);
  assert.equal(new URL(redirect.headers.get("location"), "http://localhost").pathname, "/gallery");
});
