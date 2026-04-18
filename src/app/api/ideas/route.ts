import { NextRequest } from "next/server";
import { mockIdeas } from "@/lib/mock-data";
import type { IdeaStatus, IdeaCategory } from "@/lib/types";

// GET /api/ideas — list ideas with filters, sorting, pagination
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status") as IdeaStatus | null;
  const category = searchParams.get("category") as IdeaCategory | null;
  const minScore = searchParams.get("minScore");
  const sort = searchParams.get("sort") || "compositeScore";
  const order = searchParams.get("order") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search");

  try {
    // TODO: Replace with real DB query
    // const ideas = await prisma.idea.findMany({ where: { ... }, orderBy: { ... } });

    let filtered = [...mockIdeas];

    // Apply filters
    if (status) {
      filtered = filtered.filter((idea) => idea.status === status);
    }
    if (category) {
      filtered = filtered.filter((idea) => idea.category === category);
    }
    if (minScore) {
      const min = parseInt(minScore, 10);
      filtered = filtered.filter((idea) => idea.compositeScore >= min);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.summary.toLowerCase().includes(q) ||
          idea.peptideTopics.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Apply sorting
    const sortKey = sort as keyof (typeof mockIdeas)[0];
    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    // Apply pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return Response.json({
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    return Response.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

// POST /api/ideas — create a new idea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, summary, category } = body;

    if (!title || !summary) {
      return Response.json(
        { error: "title and summary are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with real DB insert
    // const idea = await prisma.idea.create({ data: { ... } });

    const newIdea = {
      id: crypto.randomUUID(),
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      summary,
      status: "detected" as const,
      compositeScore: 0,
      trendScore: 0,
      demandScore: 0,
      competitionScore: 0,
      feasibilityScore: 0,
      revenuePotentialScore: 0,
      confidenceScore: 0,
      category: category || "other",
      peptideTopics: body.peptideTopics || [],
      productType: body.productType || [],
      subNiche: body.subNiche || [],
      targetAudience: body.targetAudience || null,
      opportunityType: body.opportunityType || null,
      complianceFlag: "yellow" as const,
      complianceNotes: body.complianceNotes || null,
      redditMentionCount: 0,
      redditQuestionCount: 0,
      youtubeVideoCount: 0,
      etsyCompetitorCount: 0,
      whopCompetitorCount: 0,
      sourceUrls: body.sourceUrls || [],
      sourcePlatforms: body.sourcePlatforms || [],
      discoveredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return Response.json({ data: newIdea }, { status: 201 });
  } catch (error) {
    console.error("Failed to create idea:", error);
    return Response.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
