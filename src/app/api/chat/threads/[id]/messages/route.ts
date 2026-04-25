import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId, UnauthorizedError } from "@/lib/session";

async function verifyThreadOwnership(threadId: string, userId: string) {
  const thread = await prisma.chatThread.findUnique({ where: { id: threadId } });
  if (!thread || thread.userId !== userId) {
    return null;
  }
  return thread;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const thread = await verifyThreadOwnership(id, userId);
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

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
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("GET messages failed:", error);
    return Response.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id: threadId } = await params;
    const thread = await verifyThreadOwnership(threadId, userId);
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

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
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("POST message failed:", error);
    return Response.json({ error: "Failed to save message" }, { status: 500 });
  }
}
