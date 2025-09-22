// Server-only env access. Do NOT import this from client components.
export function getOpenAIKey(): string {
  if (typeof process === "undefined") {
    throw new Error("getOpenAIKey() must run on the server.");
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // Keep message generic to avoid leaking expectations in logs.
    throw new Error("Missing OPENAI_API_KEY (server env).");
  }
  return key;
}