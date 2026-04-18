import { NextRequest } from "next/server";

const mockMessages = [
  { id: "m1", threadId: "t1", role: "user", content: "What's the strongest opportunity you see today?", createdAt: "2026-04-14T11:00:00Z" },
  { id: "m2", threadId: "t1", role: "assistant", content: "The retatrutide protocol builder is the clear standout. Searches are up 890% in 30 days, there are ZERO competitors on any platform, and r/peptides has 400+ posts this week asking about protocols. This is a textbook first-mover opportunity with breakout demand.", createdAt: "2026-04-14T11:01:00Z" },
  { id: "m3", threadId: "t1", role: "user", content: "How does it compare to the semaglutide guide?", createdAt: "2026-04-14T11:05:00Z" },
  { id: "m4", threadId: "t1", role: "assistant", content: "Different plays entirely. The semaglutide guide is a proven-demand gap fill — massive existing audience (4,231 Reddit mentions), only 6 Etsy competitors with weak offerings. Lower risk, lower ceiling. The retatrutide builder is higher risk (new compound, uncertain regulation) but the first-mover advantage is enormous. I'd build semaglutide first (3-5 days, ship fast) then retatrutide (2-3 weeks, bigger bet).", createdAt: "2026-04-14T11:06:00Z" },
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const messages = mockMessages.filter((m) => m.threadId === id);
  return Response.json({ data: messages.length > 0 ? messages : mockMessages });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const userMessage = {
      id: crypto.randomUUID(),
      threadId: id,
      role: "user" as const,
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    const assistantMessage = {
      id: crypto.randomUUID(),
      threadId: id,
      role: "assistant" as const,
      content: `I've analyzed your question about "${body.content.substring(0, 50)}...". Based on the current pipeline data and my understanding of your preferences, here's my take: This touches on a growing segment of the peptide market. Let me pull the relevant signals and give you a data-backed assessment.`,
      createdAt: new Date().toISOString(),
    };

    return Response.json({ data: [userMessage, assistantMessage] }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
