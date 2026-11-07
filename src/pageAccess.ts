export function supportedUrl(raw?: string) {
  try {
    const u = new URL(raw || "");
    return (
      ["http:", "https:"].includes(u.protocol) &&
      u.hostname !== "chromewebstore.google.com" &&
      !(
        u.hostname === "chrome.google.com" && u.pathname.startsWith("/webstore")
      )
    );
  } catch {
    return false;
  }
}
