import { expect, it, vi } from "vitest";
import { requestSimplification } from "../src/ai";
it("makes no request without explicit per-selection consent", async () => {
  const fetcher = vi.fn();
  await expect(
    requestSimplification(
      "Selected text",
      false,
      new AbortController().signal,
      fetcher,
    ),
  ).rejects.toThrow(/consent/i);
  expect(fetcher).not.toHaveBeenCalled();
});
it("sends only the selected text to the fixed local endpoint and validates the response", async () => {
  const fetcher = vi.fn<typeof fetch>(
    async () =>
      new Response(JSON.stringify({ simplified: "Simple text." }), {
        status: 200,
      }),
  );
  expect(
    await requestSimplification(
      "Complex text.",
      true,
      new AbortController().signal,
      fetcher,
    ),
  ).toBe("Simple text.");
  expect(fetcher.mock.calls[0][0]).toBe("http://127.0.0.1:3187/simplify");
  expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({
    text: "Complex text.",
  });
});
it("rejects malformed responses and reports an unavailable service", async () => {
  await expect(
    requestSimplification(
      "text",
      true,
      new AbortController().signal,
      async () => new Response("{}"),
    ),
  ).rejects.toThrow(/valid/i);
  await expect(
    requestSimplification(
      "text",
      true,
      new AbortController().signal,
      async () => new Response("{}", { status: 503 }),
    ),
  ).rejects.toThrow(/unavailable/i);
});
