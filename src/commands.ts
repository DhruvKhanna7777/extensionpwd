import { supportedUrl } from "./pageAccess";
import { validateSettings } from "./settings";
const actions: Record<string, string> = {
  "read-selection": "READ",
  "stop-speech": "STOP",
  "restore-page": "RESTORE",
};
export async function executeCommand(
  command: string,
  api: typeof chrome = chrome,
) {
  if (!Object.hasOwn(actions, command)) return;
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab?.id === undefined || !supportedUrl(tab.url))
    throw new Error("Open a regular website to use AbleVerse shortcuts.");
  const tabId = tab.id;
  await api.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
  const state = await api.tabs.sendMessage(tabId, { type: "GET_STATE" });
  const result = await api.tabs.sendMessage(tabId, {
    type: actions[command],
    settings: validateSettings(state?.settings),
  });
  if (!result?.ok)
    throw new Error(
      result?.error ||
        "Page action failed. Click the AbleVerse icon and retry.",
    );
}
