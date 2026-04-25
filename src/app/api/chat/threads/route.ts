import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId, UnauthorizedError } from "@/lib/session";

export async function GET() {
  try {
    const userId = await requireUserId();
    const threads = await prisma.chatThread.findMany({
      where: { userId },
      orderBy: { lastMessageAt: "desc" },
      include: { _count: { select: { messages: true } } },
    });
    return Response.json({
      data: threads.map((t) => ({
        id: t.id,
        threadType: t.threadType,
        title: t.title,
        ideaId: t.ideaId,
        lastMessageAt: t.lastMessageAt.toISOString(),
        createdAt: t.createdAt.toISOString(),
        messageCount: t._count.messages,
      })),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("GET /api/chat/threads failed:", error);
    return Response.json({ error: "Failed to load threads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();
    const thread = await prisma.chatThread.create({
      data: {
        userId,
        threadType: body.threadType ?? "global",
        title: body.title ?? "New Conversation",
        ideaId: body.ideaId ?? null,
      },
    });
    return Response.json(
      {
        data: {
          id: thread.id,
          threadType: thread.threadType,
          title: thread.title,
          ideaId: thread.ideaId,
          lastMessageAt: thread.lastMessageAt.toISOString(),
          createdAt: thread.createdAt.toISOString(),
          messageCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("POST /api/chat/threads failed:", error);
    return Response.json({ error: "Failed to create thread" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return Response.json({ error: "thread id required" }, { status: 400 });
    }

    const thread = await prisma.chatThread.findUnique({ where: { id } });
    if (!thread || thread.userId !== userId) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.chatThread.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("DELETE /api/chat/threads failed:", error);
    return Response.json({ error: "Failed to delete thread" }, { status: 500 });
  }
}
