import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId, UnauthorizedError } from "@/lib/session";

export async function GET() {
  try {
    const userId = await requireUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        settings: true,
        createdAt: true,
      },
    });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ data: user });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("GET profile failed:", error);
    return Response.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();
    const { name, email, settings } = body as {
      name?: string;
      email?: string;
      settings?: Record<string, unknown>;
    };

    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        return Response.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(settings !== undefined && {
          settings: settings as Parameters<typeof prisma.user.update>[0]["data"]["settings"],
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        settings: true,
      },
    });

    return Response.json({ data: updated });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    console.error("PATCH profile failed:", error);
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}