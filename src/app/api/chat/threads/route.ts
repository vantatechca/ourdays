import { NextRequest } from "next/server";

const mockThreads = [
  { id: "t1", threadType: "global", title: "Daily Strategy Discussion", lastMessageAt: "2026-04-14T12:00:00Z", messageCount: 12 },
  { id: "t2", threadType: "idea_specific", title: "Semaglutide Guide Deep Dive", ideaId: "1", lastMessageAt: "2026-04-14T10:00:00Z", messageCount: 8 },
  { id: "t3", threadType: "strategy", title: "Q2 Product Launch Order", lastMessageAt: "2026-04-13T16:00:00Z", messageCount: 5 },
  { id: "t4", threadType: "explore", title: "Retatrutide Market Analysis", lastMessageAt: "2026-04-13T14:00:00Z", messageCount: 7 },
];

export async function GET() {
  return Response.json({ data: mockThreads });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newThread = {
      id: crypto.randomUUID(),
      threadType: body.threadType || "global",
      title: body.title || "New Conversation",
      ideaId: body.ideaId || null,
      lastMessageAt: new Date().toISOString(),
      messageCount: 0,
    };
    return Response.json({ data: newThread }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
