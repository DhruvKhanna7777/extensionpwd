# Optional local AI setup

The extension's Reading, Sensory, Charts and speech tools do not need this service. The service source lives in Git; it is intentionally outside the extension ZIP.

The adapter uses [Ollama's local generate API](https://docs.ollama.com/api/generate). Ollama is an external MIT-licensed runtime, not bundled software. Install it from its official source, choose a suitable model, check that model's separate licence, and install the model yourself. There is no bundled model, hosted endpoint, provider key or free API promise. Check whether the chosen model runs locally or forwards to a cloud service.

## Start the adapter

1. Build/load this branch as an unpacked extension. Copy its actual ID from `chrome://extensions`; IDs depend on the installation and are not portable between machines.
2. Start Ollama at its standard local API `127.0.0.1:11434`, with your chosen model installed. Test the model independently before the extension flow.
3. In PowerShell at the repository root, replace both placeholders:

```powershell
$env:ABLEVERSE_EXTENSION_ID = '<your 32-character Chrome extension ID>'
$env:ABLEVERSE_MODEL = '<your installed Ollama model name>'
npm run ai:server
```

The adapter binds only to `127.0.0.1:3187`. It rejects unexpected Host and Origin headers, serves only the health and simplify routes, bounds input/output, permits one generation at a time, times out requests and logs no page text. CORS allows only the configured extension origin. It is not designed for public hosting; do not expose the port or replace checks with wildcard CORS.

## Use it

1. On an authorized regular webpage, select up to 5,000 characters of nonprotected prose.
2. In Reading, choose **Capture selection**. Check the original text. Capture does not send it to the model.
3. Choose **Connect local AI service**. Chrome requests optional loopback host access. A successful health check means the adapter is reachable, not that model quality has passed.
4. Enable the consent checkbox for this captured selection, then choose **Simplify selection**.
5. Compare original and suggestion. AI can change meaning; verify facts, names, numbers, units, negation and warnings. Copy is available separately.
6. **Apply suggestion to page** is explicit and limited to a safely restorable range in one prose block without links/controls. Unsupported inline crossings stay comparison/copy only. Stale/expired captures are rejected. Use **Restore original page** to undo unchanged owned output; later site edits take precedence.

Cancel, page/tab/module changes and Restore discard pending UI results. Original text/captures/suggestions are held in memory, not extension storage. The server receives only the selected text, not the page URL or whole DOM; it calls the fixed local Ollama API. The selected model's own data practices still matter.

## Verify before claiming it works

Client/UI/HTTP tests use a fake model. On a real configured installation, record model/version, runtime version, source commit, browser/OS, input, explicit consent, actual output, latency, cancellation, route changes, offline/malformed response and Restore/site-edit outcomes. Check the optional permission denial path. Never describe the mocked test output as real inference evidence.

Stop the adapter with Ctrl+C in its terminal. Stop/unload Ollama separately using that application's supported controls. Never put credentials, page text, model downloads or service logs in Git.
