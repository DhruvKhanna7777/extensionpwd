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
type Message = { type: string; settings?: typeof defaults };
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
  saved = undefined;
  pageSettings = { ...defaults };
  pendingApply = undefined;
  history.replaceState({}, "", "/sidepanel.html");
  vi.stubGlobal("chrome", {
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
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("rolls controls back when page permission is denied", async () => {
  render(<App />);
  await screen.findByText("Showing this page’s current preferences.");
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
  await screen.findByText("Showing this page’s current preferences.");
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
  await screen.findByText("Showing this page’s current preferences.");
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
  await screen.findByText("Showing this page’s current preferences.");
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
