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
