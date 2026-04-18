import { NextRequest } from "next/server";
import { mockIdeas } from "@/lib/mock-data";
import type { IdeaStatus } from "@/lib/types";

type FeedbackAction = "approve" | "decline" | "star" | "archive";

const actionToStatus: Record<FeedbackAction, IdeaStatus> = {
  approve: "approved",
  decline: "declined",
  star: "starred",
  archive: "archived",
};

// POST /api/ideas/[id]/feedback — approve, decline, star, or archive an idea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { action, note } = body as { action?: string; note?: string };

    if (!action) {
      return Response.json(
        { error: "action is required" },
        { status: 400 }
      );
    }

    const validActions: FeedbackAction[] = [
      "approve",
      "decline",
      "star",
      "archive",
    ];
    if (!validActions.includes(action as FeedbackAction)) {
      return Response.json(
        {
          error: `Invalid action. Must be one of: ${validActions.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // TODO: Replace with real DB operations
    // const idea = await prisma.idea.update({ where: { id }, data: { status: newStatus } });
    // await prisma.ideaFeedback.create({ data: { ideaId: id, action, note } });

    const idea = mockIdeas.find((i) => i.id === id);

    if (!idea) {
      return Response.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    const newStatus = actionToStatus[action as FeedbackAction];

    const updated = {
      ...idea,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    const feedback = {
      id: crypto.randomUUID(),
      ideaId: id,
      action,
      note: note || null,
      previousStatus: idea.status,
      newStatus,
      createdAt: new Date().toISOString(),
    };

    return Response.json({
      data: updated,
      feedback,
    });
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return Response.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
