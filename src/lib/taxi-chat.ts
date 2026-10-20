const DEV_BACKEND = "http://127.0.0.1:8000";

/**
 * Base URL of the FastAPI Taxi Chat service. Production deployments set
 * TAXI_CHAT_API_URL; local development falls back to the uv/uvicorn default.
 */
export function taxiChatBackend(): string | null {
  const configured = process.env.TAXI_CHAT_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return process.env.NODE_ENV === "production" ? null : DEV_BACKEND;
}

export function sseError(message: string) {
  return new Response(`data: ${JSON.stringify({ stage: "error", message })}\n\n`, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
