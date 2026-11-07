// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { AISelection } from "../src/AISelection";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const capture = {
  token: "captured",
  text: "A complicated sentence.",
  canApply: true,
  tabId: 7,
  url: "https://example.com",
};

async function prepareSuggestion(apply = vi.fn(async () => {})) {
  const captureSelection = vi.fn(async () => capture);
  const discardSelection = vi.fn();
  vi.stubGlobal("chrome", {
    permissions: { request: vi.fn(async () => true) },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(
      async (url) =>
        new Response(
          JSON.stringify(
            String(url).endsWith("/health")
              ? { ready: true }
              : { simplified: "A simple sentence." },
          ),
        ),
    ),
  );
  const props = {
    captureSelection,
    discardSelection,
    applySimplification: apply,
  };
  const view = render(<AISelection pageEpoch={0} {...props} />);
  fireEvent.click(
    screen.getByRole("button", { name: "Connect local AI service" }),
  );
  await screen.findByText(/Connected to the local model/);
  fireEvent.click(screen.getByRole("button", { name: "Capture selection" }));
  await screen.findByText(capture.text);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Simplify selection" }));
  await screen.findByText("A simple sentence.");
  return { view, props };
}

it("clears the old selection, consent and suggestion when a new capture fails", async () => {
  const { props } = await prepareSuggestion();
  props.captureSelection.mockRejectedValueOnce(
    new Error("Select one passage first."),
  );
  fireEvent.click(screen.getByRole("button", { name: "Capture selection" }));
  await screen.findByText("Select one passage first.");
  expect(screen.queryByText(capture.text)).toBeNull();
  expect(screen.queryByText("A simple sentence.")).toBeNull();
  expect(
    screen.queryByRole("button", { name: "Simplify selection" }),
  ).toBeNull();
  expect(props.discardSelection).toHaveBeenCalledWith(capture);
});

it("discards a capture that completes after the user cancelled it", async () => {
  let complete!: (value: typeof capture) => void;
  const discard = vi.fn();
  render(
    <AISelection
      pageEpoch={0}
      captureSelection={() => new Promise((resolve) => (complete = resolve))}
      applySimplification={vi.fn()}
      discardSelection={discard}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Capture selection" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel AI request" }));
  await act(async () => complete(capture));
  expect(discard).toHaveBeenCalledWith(capture);
  expect(screen.queryByText(capture.text)).toBeNull();
});

it("dispatches Apply once and ignores its confirmation after the page changes", async () => {
  let complete!: () => void;
  const apply = vi.fn(
    () => new Promise<void>((resolve) => (complete = resolve)),
  );
  const { view, props } = await prepareSuggestion(apply);
  const button = screen.getByRole("button", {
    name: "Apply suggestion to page",
  });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(apply).toHaveBeenCalledTimes(1);
  view.rerender(<AISelection pageEpoch={1} {...props} />);
  await act(async () => complete());
  expect(
    screen.queryByText(/Suggestion applied to the captured passage/),
  ).toBeNull();
});

it("ignores an old Apply failure after navigation resets the panel", async () => {
  let reject!: (reason: Error) => void;
  const apply = vi.fn(
    () => new Promise<void>((_resolve, fail) => (reject = fail)),
  );
  const { view, props } = await prepareSuggestion(apply);
  fireEvent.click(
    screen.getByRole("button", { name: "Apply suggestion to page" }),
  );
  expect(
    screen.queryByRole("button", { name: "Cancel AI request" }),
  ).toBeNull();
  view.rerender(<AISelection pageEpoch={1} {...props} />);
  await act(async () =>
    reject(new Error("Old page rejected the replacement.")),
  );
  expect(screen.queryByText("Old page rejected the replacement.")).toBeNull();
});

it("does not contact the local service when optional access is denied", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  vi.stubGlobal("chrome", {
    permissions: { request: vi.fn(async () => false) },
  });
  render(
    <AISelection
      pageEpoch={0}
      captureSelection={async () => capture}
      applySimplification={vi.fn()}
      discardSelection={vi.fn()}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Connect local AI service" }),
  );
  await screen.findByText(/Local service access was not granted/);
  expect(fetcher).not.toHaveBeenCalled();
  expect(
    (
      screen.getByRole("button", {
        name: "Capture selection",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(false);
});
it("requires consent after capture, previews a suggestion and replaces only after explicit Apply", async () => {
  const apply = vi.fn(async () => {}),
    discard = vi.fn();
  const fetcher = vi.fn<typeof fetch>(
    async (url) =>
      new Response(
        JSON.stringify(
          String(url).endsWith("/health")
            ? { ready: true }
            : { simplified: "A simple sentence." },
        ),
      ),
  );
  vi.stubGlobal("fetch", fetcher);
  vi.stubGlobal("chrome", {
    permissions: { request: vi.fn(async () => true) },
  });
  render(
    <AISelection
      pageEpoch={0}
      captureSelection={async () => capture}
      applySimplification={apply}
      discardSelection={discard}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Capture selection" }));
  await screen.findByText(capture.text);
  expect(fetcher).not.toHaveBeenCalled();
  expect(
    (
      screen.getByRole("button", {
        name: "Simplify selection",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  fireEvent.click(
    screen.getByRole("button", { name: "Connect local AI service" }),
  );
  await screen.findByText(/Connected to the local model/);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Simplify selection" }));
  await screen.findByText("A simple sentence.");
  expect(apply).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Apply suggestion to page" }),
  );
  await waitFor(() =>
    expect(apply).toHaveBeenCalledWith(capture, "A simple sentence."),
  );
});
it("aborts generation and drops captured text/consent on a page epoch change", async () => {
  let pending!: (value: Response) => void;
  let signal: AbortSignal | undefined;
  vi.stubGlobal("chrome", {
    permissions: { request: vi.fn(async () => true) },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn<typeof fetch>(async (url, init) => {
      if (String(url).endsWith("/health"))
        return new Response('{"ready":true}');
      signal = init?.signal as AbortSignal;
      return await new Promise<Response>((resolve) => {
        pending = resolve;
      });
    }),
  );
  const props = {
    captureSelection: async () => capture,
    applySimplification: vi.fn(async () => {}),
    discardSelection: vi.fn(),
  };
  const view = render(<AISelection pageEpoch={0} {...props} />);
  fireEvent.click(
    screen.getByRole("button", { name: "Connect local AI service" }),
  );
  await screen.findByText(/Connected to the local model/);
  fireEvent.click(screen.getByRole("button", { name: "Capture selection" }));
  await screen.findByText(capture.text);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Simplify selection" }));
  await waitFor(() => expect(signal).toBeDefined());
  view.rerender(<AISelection pageEpoch={1} {...props} />);
  expect(signal?.aborted).toBe(true);
  expect(screen.queryByText(capture.text)).toBeNull();
  await act(async () => pending(new Response('{"simplified":"Stale result"}')));
  expect(screen.queryByText("Stale result")).toBeNull();
});
