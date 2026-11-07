import { expect, it, vi } from "vitest";
import { executeCommand } from "../src/commands";
import { defaults } from "../src/settings";
it("binds a shortcut to the initial tab, uses its voice settings, and never reads text into the background", async () => {
  let active = 7;
  const sendMessage = vi.fn(async (id: number, message: { type: string }) =>
    message.type === "GET_STATE"
      ? { ok: true, settings: { ...defaults, rate: 0.8 } }
      : { ok: true },
  );
  const api = {
    tabs: {
      query: vi.fn(async () => [{ id: active, url: "https://example.com" }]),
      sendMessage,
    },
    scripting: {
      executeScript: vi.fn(async () => {
        active = 99;
      }),
    },
  };
  await executeCommand("read-selection", api as any);
  expect(sendMessage).toHaveBeenLastCalledWith(7, {
    type: "READ",
    settings: { ...defaults, rate: 0.8 },
  });
  expect(sendMessage.mock.calls.every(([id]) => id === 7)).toBe(true);
});
it("rejects restricted pages and ignores unknown commands without injection", async () => {
  const api = {
    tabs: { query: vi.fn(async () => [{ id: 7, url: "chrome://settings" }]) },
    scripting: { executeScript: vi.fn() },
  };
  await expect(executeCommand("restore-page", api as any)).rejects.toThrow(
    /regular/,
  );
  await executeCommand("unknown", api as any);
  expect(api.scripting.executeScript).not.toHaveBeenCalled();
});
