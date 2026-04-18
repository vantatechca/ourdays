import { mockDashboardStats, mockIdeas } from "@/lib/mock-data";

// GET /api/ideas/stats — dashboard stats
export async function GET() {
  try {
    // TODO: Replace with real DB aggregations
    // const totalIdeas = await prisma.idea.count();
    // const pendingReview = await prisma.idea.count({ where: { status: "detected" } });
    // const approved = await prisma.idea.count({ where: { status: "approved" } });
    // const declined = await prisma.idea.count({ where: { status: "declined" } });
    // const incubating = await prisma.idea.count({ where: { status: "incubating" } });

    // Compute stats from mock data to demonstrate the shape
    const statusCounts = mockIdeas.reduce(
      (acc, idea) => {
        acc[idea.status] = (acc[idea.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const stats = {
      ...mockDashboardStats,
      statusBreakdown: statusCounts,
      scoreDistribution: {
        excellent: mockIdeas.filter((i) => i.compositeScore >= 85).length,
        good: mockIdeas.filter(
          (i) => i.compositeScore >= 70 && i.compositeScore < 85
        ).length,
        average: mockIdeas.filter(
          (i) => i.compositeScore >= 50 && i.compositeScore < 70
        ).length,
        low: mockIdeas.filter((i) => i.compositeScore < 50).length,
      },
    };

    return Response.json({ data: stats });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return Response.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
