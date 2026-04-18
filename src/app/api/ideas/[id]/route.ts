import { NextRequest } from "next/server";
import { mockIdeas } from "@/lib/mock-data";

// GET /api/ideas/[id] — get a single idea by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // TODO: Replace with real DB query
    // const idea = await prisma.idea.findUnique({ where: { id } });

    const idea = mockIdeas.find((i) => i.id === id);

    if (!idea) {
      return Response.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    return Response.json({ data: idea });
  } catch (error) {
    console.error("Failed to fetch idea:", error);
    return Response.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }
}

// PATCH /api/ideas/[id] — update an idea (status, notes, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    // TODO: Replace with real DB update
    // const idea = await prisma.idea.update({ where: { id }, data: body });

    const idea = mockIdeas.find((i) => i.id === id);

    if (!idea) {
      return Response.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Validate status if provided
    const validStatuses = [
      "detected",
      "reviewing",
      "approved",
      "declined",
      "incubating",
      "archived",
      "starred",
    ];
    if (body.status && !validStatuses.includes(body.status)) {
      return Response.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = {
      ...idea,
      ...body,
      id, // prevent id override
      updatedAt: new Date().toISOString(),
    };

    return Response.json({ data: updated });
  } catch (error) {
    console.error("Failed to update idea:", error);
    return Response.json(
      { error: "Failed to update idea" },
      { status: 500 }
    );
  }
}
