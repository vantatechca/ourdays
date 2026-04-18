import { NextRequest } from "next/server";
import { mockGoldenRules } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ data: mockGoldenRules });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruleText, ruleType, direction, weight, importance } = body;

    if (!ruleText || !ruleType) {
      return Response.json({ error: "ruleText and ruleType are required" }, { status: 400 });
    }

    const newRule = {
      id: crypto.randomUUID(),
      ruleType,
      ruleText,
      direction: direction || "boost",
      weight: weight ?? 1.0,
      importance: importance ?? 0.5,
      isActive: true,
      approved: true,
      source: "manual",
      appliedCount: 0,
      overrideCount: 0,
    };

    return Response.json({ data: newRule }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create rule" }, { status: 500 });
  }
}
