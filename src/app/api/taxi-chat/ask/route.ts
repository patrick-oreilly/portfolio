import { sseError, taxiChatBackend } from "@/lib/taxi-chat";

// Keep the proxy alive while the backend runs a query (Vercel caps this by plan).
export const maxDuration = 60;

// Streams the FastAPI server's stage events straight through to the browser.
export async function GET(request: Request) {
  const question = new URL(request.url).searchParams.get("q")?.trim();
  if (!question) return sseError("Ask a question first.");

  const backend = taxiChatBackend();
  if (!backend) {
    return sseError("Taxi Chat is not connected. Set TAXI_CHAT_API_URL to the FastAPI service.");
  }

  try {
    const upstream = await fetch(`${backend}/api/ask?q=${encodeURIComponent(question)}`, {
      headers: { Accept: "text/event-stream" },
      cache: "no-store",
      signal: request.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return sseError(`Taxi Chat backend returned ${upstream.status}.`);
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return sseError("Could not reach the Taxi Chat backend.");
  }
}
