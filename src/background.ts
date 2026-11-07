import { executeCommand } from "./commands";
chrome.commands.onCommand.addListener((command) => {
  void executeCommand(command)
    .then(() => {
      void chrome.action.setBadgeText({ text: "" });
      void chrome.action.setTitle({ title: "AbleVerse AI" });
    })
    .catch((error) => {
      void chrome.action.setBadgeText({ text: "!" });
      void chrome.action.setTitle({
        title:
          error instanceof Error
            ? `AbleVerse: ${error.message}`
            : "AbleVerse action failed. Open the popup for help.",
      });
    });
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch(() => {});
});
