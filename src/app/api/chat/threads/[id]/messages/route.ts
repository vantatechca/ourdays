import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await prisma.chatMessage.findMany({
      where: { threadId: id },
      orderBy: { createdAt: "asc" },
    });
    return Response.json({
      data: messages.map((m) => ({
        id: m.id,
        threadId: m.threadId,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET messages failed:", error);
    return Response.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params;
    const body = await request.json();
    const { role, content } = body as { role: "user" | "assistant"; content: string };

    if (!role || !content) {
      return Response.json({ error: "role and content required" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: { threadId, role, content },
    });

    await prisma.chatThread.update({
      where: { id: threadId },
      data: { lastMessageAt: new Date() },
    });

    return Response.json(
      {
        data: {
          id: message.id,
          threadId: message.threadId,
          role: message.role,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST message failed:", error);
    return Response.json({ error: "Failed to save message" }, { status: 500 });
  }
}
