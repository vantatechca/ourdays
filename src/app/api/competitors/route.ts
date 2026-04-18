import { NextRequest } from "next/server";
import { mockCompetitors } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ data: mockCompetitors });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, platform, profileUrl } = body;

    if (!name || !platform) {
      return Response.json({ error: "name and platform are required" }, { status: 400 });
    }

    const newCompetitor = {
      id: crypto.randomUUID(),
      name,
      platform,
      profileUrl: profileUrl || null,
      totalProducts: 0,
      estimatedRevenue: null,
      watchPriority: "normal",
      isActive: true,
      createdAt: new Date().toISOString(),
      products: [],
    };

    return Response.json({ data: newCompetitor }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to add competitor" }, { status: 500 });
  }
}
