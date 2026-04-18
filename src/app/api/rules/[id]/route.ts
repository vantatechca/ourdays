import { NextRequest } from "next/server";
import { mockGoldenRules } from "@/lib/mock-data";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const rule = mockGoldenRules.find((r) => r.id === id);

  if (!rule) {
    return Response.json({ error: "Rule not found" }, { status: 404 });
  }

  const updated = { ...rule, ...body };
  return Response.json({ data: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rule = mockGoldenRules.find((r) => r.id === id);

  if (!rule) {
    return Response.json({ error: "Rule not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
