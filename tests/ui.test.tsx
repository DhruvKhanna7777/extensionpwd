// @vitest-environment jsdom
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { App } from "../src/App";
import { defaults } from "../src/settings";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
type Message = { type: string; settings?: typeof defaults };
it("ignores a pending state refresh after a newer Apply action", async () => {
  render(<App />);
  await screen.findByText(/Showing this page/);
  const original = chrome.tabs.sendMessage;
  let complete!: (v: unknown) => void;
  (chrome.tabs as any).sendMessage = (id: number, message: Message) =>
    message.type === "GET_STATE"
      ? new Promise((r) => (complete = r))
      : original(id, message);
  await act(async () => {
    for (const listener of stateListeners)
      listener({ type: "PAGE_STATE_CHANGED" }, { tab: { id: 7 } });
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /Reading Studio/ }));
  await waitFor(() => expect(applied).toEqual([7]));
  await act(async () => complete({ ok: true, settings: defaults }));
  expect(
    (
      screen.getByRole("checkbox", {
        name: /Reading Studio/,
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});
it("clears the reading announcement when playback finishes", async () => {
  const original = chrome.tabs.sendMessage;
  let speech = { state: "speaking" };
  (chrome.tabs as any).sendMessage = async (id: number, message: Message) =>
    message.type === "GET_STATE"
      ? { ok: true, settings: defaults, speech }
      : original(id, message);
  render(<App />);
  await screen.findByText(
    "Reading your selection. Use Stop or press Esc on the page.",
  );
  speech = { state: "idle" };
  await act(async () => {
    for (const listener of stateListeners)
      listener({ type: "PAGE_STATE_CHANGED" }, { tab: { id: 7 } });
  });
  expect(screen.getByRole("status").textContent).toMatch(/stopped|finished/i);
});
it("keeps the Restore confirmation when the page state notification arrives", async () => {
  render(<App />);
  await screen.findByText(/Showing this page/);
  fireEvent.click(screen.getByRole("button", { name: /Restore original/ }));
  await screen.findByText("Original page restored. Speech stopped.");
  await act(async () => {
    for (const listener of stateListeners)
      listener(
        { type: "PAGE_STATE_CHANGED", reason: "restored" },
        { tab: { id: 7 } },
      );
  });
  expect(screen.getByRole("status").textContent).toBe(
    "Original page restored. Speech stopped.",
  );
});
let active = {
  id: 7,
  url: "https://example.com/article",
  windowId: 12,
  active: true,
};
let failInjection = false;
let applied: number[] = [];
let listeners = new Set<() => void>();
let saved: unknown;
let pageSettings = { ...defaults };
let pendingApply: Promise<void> | undefined;
let stateListeners = new Set<(message: unknown, sender: unknown) => void>();
beforeEach(() => {
  active = {
    id: 7,
    url: "https://example.com/article",
    windowId: 12,
    active: true,
  };
  failInjection = false;
  applied = [];
  listeners = new Set();
  stateListeners = new Set();
  saved = undefined;
  pageSettings = { ...defaults };
  pendingApply = undefined;
  history.replaceState({}, "", "/sidepanel.html");
  vi.stubGlobal("chrome", {
    runtime: {
      onMessage: {
        addListener: (f: (m: unknown, s: unknown) => void) =>
          stateListeners.add(f),
        removeListener: (f: (m: unknown, s: unknown) => void) =>
          stateListeners.delete(f),
      },
    },
    tabs: {
      query: async () => [{ ...active }],
      sendMessage: async (id: number, m: Message) => {
        if (m.type === "GET_STATE") return { ok: true, settings: pageSettings };
        if (m.type === "APPLY") {
          applied.push(id);
          await pendingApply;
          pageSettings = { ...m.settings! };
        }
        return { ok: true, charts: 0, warnings: [] };
      },
      onActivated: {
        addListener: (f: () => void) => listeners.add(f),
        removeListener: (f: () => void) => listeners.delete(f),
      },
      onUpdated: { addListener: () => {}, removeListener: () => {} },
    },
    scripting: {
      executeScript: async () => {
        if (failInjection)
          throw new Error(
            "Cannot access this tab. Click the extension icon to grant access.",
          );
      },
    },
    storage: {
      local: {
        set: async (v: unknown) => {
          saved = v;
        },
        get: async () => saved || {},
      },
    },
    sidePanel: { open: async () => {} },
    windows: { WINDOW_ID_CURRENT: -2 },
  });
});
it("keeps focused controls enabled while a speech status update is pending", async () => {
  render(<App />);
  await screen.findByText(/Showing this page/);
  const checkbox = screen.getByRole("checkbox", {
    name: /Reading Studio/,
  }) as HTMLInputElement;
  checkbox.focus();
  const original = chrome.tabs.sendMessage;
  let complete!: (v: unknown) => void;
  (chrome.tabs as any).sendMessage = (id: number, m: Message) =>
    m.type === "GET_STATE"
      ? new Promise((r) => (complete = r))
      : original(id, m);
  await act(async () => {
    for (const listener of stateListeners)
      listener({ type: "PAGE_STATE_CHANGED" }, { tab: { id: 7 } });
  });
  expect(checkbox.disabled).toBe(false);
  expect(document.activeElement).toBe(checkbox);
  await act(async () =>
    complete({ ok: true, settings: defaults, speech: { state: "paused" } }),
  );
  expect(screen.getByRole("status").textContent).toMatch(/paused/i);
});
it("supports keyboard navigation, Space to enable and Enter to restore", async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByText(/Showing this page/);
  await user.tab();
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: /Restore original/ }),
  );
  for (let i = 0; i < 6; i++) await user.tab();
  const checkbox = screen.getByRole("checkbox", {
    name: /Reading Studio/,
  }) as HTMLInputElement;
  expect(document.activeElement).toBe(checkbox);
  await user.keyboard("[Space]");
  await waitFor(() => expect(applied).toEqual([7]));
  expect(checkbox.checked).toBe(true);
  screen.getByRole("button", { name: /Restore original/ }).focus();
  await user.keyboard("[Enter]");
  await screen.findByText("Original page restored. Speech stopped.");
  expect(checkbox.checked).toBe(false);
});
it("has no automated semantic accessibility violations in each module", async () => {
  const { container } = render(<App />);
  await screen.findByText(/Showing this page/);
  for (const name of ["Overview", "Reading", "Sensory", "Charts", "Settings"]) {
    fireEvent.click(screen.getByRole("button", { name }));
    const result = await axe.run(container, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations.map((v) => `${name}: ${v.id}`)).toEqual([]);
  }
}, 15000);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("rolls controls back when page permission is denied", async () => {
  render(<App />);
  await screen.findByText(/Showing this page/);
  failInjection = true;
  fireEvent.click(screen.getByRole("checkbox", { name: /Reading Studio/ }));
  await screen.findByText(/Cannot access this tab/);
  expect(
    (
      screen.getByRole("checkbox", {
        name: /Reading Studio/,
      }) as HTMLInputElement
    ).checked,
  ).toBe(false);
});
it("disables page actions and explains unsupported contexts before applying", async () => {
  active.url = "chrome://settings/";
  render(<App />);
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toMatch(
      /cannot be changed|unsupported/i,
    ),
  );
  expect(
    (
      screen.getByRole("checkbox", {
        name: /Reading Studio/,
      }) as HTMLInputElement
    ).disabled,
  ).toBe(true);
  expect(applied).toEqual([]);
});
it("keeps queued page changes bound to the tab selected at click time", async () => {
  let release!: () => void;
  pendingApply = new Promise<void>((r) => (release = r));
  render(<App />);
  await screen.findByText(/Showing this page/);
  fireEvent.click(screen.getByRole("checkbox", { name: /Reading Studio/ }));
  await waitFor(() => expect(applied).toEqual([7]));
  fireEvent.click(screen.getByRole("checkbox", { name: /Reduce motion/ }));
  active = { ...active, id: 99 };
  await act(async () => {
    release();
  });
  await waitFor(() => expect(applied.length).toBe(2));
  expect(applied).toEqual([7, 7]);
});
it("loads saved preferences without injecting or applying page changes", async () => {
  saved = { ableverse: { ...defaults, reading: true, fontScale: 130 } };
  render(<App />);
  await screen.findByText(/Showing this page/);
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  fireEvent.click(screen.getByRole("button", { name: "Load saved" }));
  await screen.findByText(/Saved preferences loaded/);
  expect(applied).toEqual([]);
  fireEvent.click(screen.getByRole("button", { name: "Reading" }));
  expect(
    (
      screen.getByRole("spinbutton", {
        name: "Text size numeric value",
      }) as HTMLInputElement
    ).value,
  ).toBe("130");
});
it("does not let a stale tab-state response overwrite the new tab", async () => {
  let completeOld!: (v: unknown) => void;
  const old = chrome.tabs.sendMessage;
  (chrome.tabs as any).sendMessage = (id: number, m: Message) =>
    id === 7 && m.type === "GET_STATE"
      ? new Promise((r) => (completeOld = r))
      : old(id, m);
  render(<App />);
  await waitFor(() => expect(completeOld).toBeTypeOf("function"));
  active = { ...active, id: 99 };
  await act(async () => {
    for (const fn of listeners) fn();
  });
  await screen.findByText(/Showing this page/);
  await act(async () => {
    completeOld({ ok: true, settings: { ...defaults, reading: true } });
  });
  expect(
    (
      screen.getByRole("checkbox", {
        name: /Reading Studio/,
      }) as HTMLInputElement
    ).checked,
  ).toBe(false);
});

it("keeps typography preview local until explicitly applied and preserves other modes", async () => {
  render(<App />);
  await screen.findByText(/Showing this page/);
  fireEvent.click(screen.getByRole("checkbox", { name: /Reduce motion/ }));
  await waitFor(() => expect(applied).toHaveLength(1));
  fireEvent.click(screen.getByRole("button", { name: "Reading" }));
  fireEvent.click(
    screen.getByRole("checkbox", { name: /Preview typography only/ }),
  );
  fireEvent.change(
    screen.getByRole("spinbutton", { name: "Text size numeric value" }),
    { target: { value: "150" } },
  );
  expect(applied).toHaveLength(1);
  expect(pageSettings.fontScale).toBe(100);
  fireEvent.click(
    screen.getByRole("button", { name: "Apply typography preview" }),
  );
  await waitFor(() => expect(pageSettings.fontScale).toBe(150));
  expect(pageSettings.reading).toBe(true);
  expect(pageSettings.motion).toBe(true);
});
it("discards typography preview on tab changes and restores without applying the draft", async () => {
  render(<App />);
  await screen.findByText(/Showing this page/);
  fireEvent.click(screen.getByRole("button", { name: "Reading" }));
  fireEvent.click(
    screen.getByRole("checkbox", { name: /Preview typography only/ }),
  );
  fireEvent.change(
    screen.getByRole("spinbutton", { name: "Text size numeric value" }),
    { target: { value: "160" } },
  );
  active = { ...active, id: 99 };
  await act(async () => {
    for (const fn of listeners) fn();
  });
  expect(
    (
      screen.getByRole("checkbox", {
        name: /Preview typography only/,
      }) as HTMLInputElement
    ).checked,
  ).toBe(false);
  expect(
    (
      screen.getByRole("spinbutton", {
        name: "Text size numeric value",
      }) as HTMLInputElement
    ).value,
  ).toBe("100");
  expect(applied).toEqual([]);
  fireEvent.click(
    screen.getByRole("checkbox", { name: /Preview typography only/ }),
  );
  fireEvent.change(
    screen.getByRole("spinbutton", { name: "Text size numeric value" }),
    { target: { value: "170" } },
  );
  fireEvent.click(screen.getByRole("button", { name: /Restore original/ }));
  await screen.findByText("Original page restored. Speech stopped.");
  expect(
    screen.queryByRole("button", { name: "Apply typography preview" }),
  ).toBeNull();
  expect(applied).toEqual([]);
});
