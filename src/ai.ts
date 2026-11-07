export const localAIOrigin = "http://127.0.0.1:3187";
export async function requestSimplification(
  text: string,
  consent: boolean,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  if (!consent)
    throw new Error("Explicit consent is required for this selection.");
  if (!text.trim() || text.length > 5000)
    throw new Error("Select between 1 and 5,000 characters.");
  let response: Response;
  try {
    response = await fetcher(`${localAIOrigin}/simplify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.any([signal, AbortSignal.timeout(30_000)]),
      credentials: "omit",
      cache: "no-store",
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error(
      "Local AI service is unavailable or timed out. Start the configured service and retry.",
    );
  }
  if (!response.ok)
    throw new Error(
      "Local AI service is unavailable or the model rejected the request. Check its configuration and retry.",
    );
  const raw = await response.text();
  if (raw.length > 16000)
    throw new Error("AI service returned an invalid response.");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("AI service returned an invalid response.");
  }
  const simplified =
    value && typeof value === "object" && "simplified" in value
      ? value.simplified
      : undefined;
  if (
    typeof simplified !== "string" ||
    !simplified.trim() ||
    simplified.length > 6000
  )
    throw new Error("AI service returned an invalid response.");
  return simplified.trim();
}
