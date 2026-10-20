import { taxiChatBackend } from "@/lib/taxi-chat";

export async function GET(request: Request) {
  const backend = taxiChatBackend();
  if (!backend) {
    return Response.json({ error: "Taxi Chat is not connected." }, { status: 503 });
  }

  try {
    const upstream = await fetch(`${backend}/api/stats`, {
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
    });

    if (!upstream.ok) {
      return Response.json({ error: `Taxi Chat backend returned ${upstream.status}.` }, { status: 502 });
    }

    return Response.json(await upstream.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Could not reach the Taxi Chat backend." }, { status: 502 });
  }
}
