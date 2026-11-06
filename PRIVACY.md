# Privacy and limitations

AbleVerse 0.1.0 requests activeTab, scripting, storage and sidePanel. No all-sites host access. Injection happens only after a user action on the current http(s) tab. Panel observation does not inject automatically.

Only explicitly saved preference objects go in chrome.storage.local. Page/selected text, history, passwords, form values and chart contents are not stored. No analytics, fetch calls, AI endpoint, remote script or embedded key.

Speech uses the browser's Web Speech implementation. Device/browser voices may use remote speech services; offline speech is not guaranteed. Only explicitly selected eligible prose is passed to that API. Selections touching controls, editables, code or aria-hidden regions are rejected; text is capped at 5,000 characters. No unsolicited speech.

Source text is never rewritten. Prose changes use owned data attributes and removable CSS. Chart fills are restored only if they still match the applied value. Labels and tables use textContent, not HTML. Restore disconnects the active observer and speech listeners; the singleton message receiver remains for future explicit actions.

Unsupported: browser/store pages, file URLs, embedded PDFs, cross-origin frames, universal shadow DOM, image/canvas charts, automatic translation, diagnosis or universal accessibility certification. Motion reduction does not stop video, canvas or GIFs. Status/progress CSS animation is excluded. Focus outlines the reading region without hiding content.

AI and ASL are not included. Future AI requires preview, explicit network consent, cancellation, failure states and server-side secrets. ASL requires verified, permissioned clips and attribution.
