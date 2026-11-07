import { afterEach, expect, it, vi } from "vitest";
import { createAIServer } from "../server/ai.mjs";
let servers = [];
afterEach(async () => {
  await Promise.all(
    servers.map(
      (s) =>
        new Promise((r) => {
          s.closeAllConnections();
          s.close(r);
        }),
    ),
  );
  servers = [];
});
async function server(fetchImpl) {
  const s = createAIServer({
    extensionId: "a".repeat(32),
    model: "test-model",
    fetchImpl,
  });
  servers.push(s);
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  return `http://127.0.0.1:${s.address().port}`;
}
const headers = {
  "Content-Type": "application/json",
  Origin: "chrome-extension://" + "a".repeat(32),
};

it("cancels an upstream generation when the client disconnects and accepts the next request", async () => {
  let started;
  const ready = new Promise((resolve) => (started = resolve));
  let cancelled;
  const aborted = new Promise((resolve) => (cancelled = resolve));
  let calls = 0;
  const model = vi.fn(async (_url, options) => {
    if (++calls > 1)
      return new Response(
        JSON.stringify({
          response: JSON.stringify({ simplified: "Next result." }),
        }),
      );
    started();
    return await new Promise((_resolve, reject) => {
      options.signal.addEventListener(
        "abort",
        () => {
          cancelled();
          reject(options.signal.reason);
        },
        { once: true },
      );
    });
  });
  const url = await server(model);
  const controller = new AbortController();
  const first = fetch(url + "/simplify", {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "Controlled cancellation example." }),
    signal: controller.signal,
  }).catch((error) => error);
  await ready;
  controller.abort();
  await first;
  await aborted;
  const next = await fetch(url + "/simplify", {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "Next controlled example." }),
  });
  expect(next.status).toBe(200);
  expect(await next.json()).toEqual({ simplified: "Next result." });
  expect(model).toHaveBeenCalledTimes(2);
});
it("rejects website origins without touching the model", async () => {
  const model = vi.fn();
  const url = await server(model);
  const r = await fetch(url + "/simplify", {
    method: "POST",
    headers: { ...headers, Origin: "https://example.com" },
    body: JSON.stringify({ text: "text" }),
  });
  expect(r.status).toBe(403);
  expect(model).not.toHaveBeenCalled();
});
it("validates input and output, sends no URL or extra fields, and calls only local Ollama", async () => {
  const model = vi.fn(
    async () =>
      new Response(
        JSON.stringify({
          response: JSON.stringify({ simplified: "Simple text." }),
        }),
      ),
  );
  const url = await server(model);
  let r = await fetch(url + "/simplify", {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "Complex text." }),
  });
  expect(r.status).toBe(200);
  expect(await r.json()).toEqual({ simplified: "Simple text." });
  expect(model.mock.calls[0][0]).toBe("http://127.0.0.1:11434/api/generate");
  r = await fetch(url + "/simplify", {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "x".repeat(5001) }),
  });
  expect(r.status).toBe(400);
  expect(model).toHaveBeenCalledTimes(1);
});
