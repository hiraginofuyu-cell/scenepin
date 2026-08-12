import assert from "node:assert/strict";
import test from "node:test";

test("renders the ScenePin home page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /ScenePin/i);
  assert.doesNotMatch(html, /codex-preview/i);
});

test("renders the anime archive page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("anime-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/anime", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /ANIME ARCHIVE/i);
  assert.match(html, /2026年夏アニメ/);
  assert.match(html, /2026年春アニメ/);
  assert.match(html, /銀魂/);
  assert.match(html, /BLEACH/);
});

test("renders the 2026 spring anime archive", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("spring-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/season/2026-spring", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /PAST ANIME · 2026 SPRING/i);
  assert.match(html, /春夏秋冬代行者 春の舞/);
  assert.match(html, /冬に咲く春の花/);
  assert.match(html, /ようこそ実力至上主義の教室へ/);
  assert.match(html, /ある未来のために/);
  assert.match(html, /とんがり帽子のアトリエ/);
  assert.match(html, /禁じられた魔法/);
  assert.match(html, /43(?:<!-- -->)?話・(?:<!-- -->)?3(?:<!-- -->)?作品は各話収録済み/);
  assert.match(html, /COMPLETE SEASON INDEX/);
  assert.match(html, /<strong>88<\/strong><span>TITLES<\/span>/);
  assert.match(html, /黄泉のツガイ/);
  assert.match(html, /レプリカだって、恋をする。/);
  assert.doesNotMatch(html, /アオアシ（再放送）/);
});
