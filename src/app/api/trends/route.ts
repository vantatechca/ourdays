import { mockTrends } from "@/lib/mock-data";

export async function GET() {
  const breakouts = mockTrends.filter((t) => t.direction === "breakout");
  const rising = mockTrends.filter((t) => t.direction === "rising");
  const stable = mockTrends.filter((t) => t.direction === "stable");
  const declining = mockTrends.filter((t) => t.direction === "declining");

  return Response.json({
    data: {
      all: mockTrends,
      breakouts,
      rising,
      stable,
      declining,
      summary: {
        totalTracked: mockTrends.length,
        breakoutCount: breakouts.length,
        risingCount: rising.length,
        avgChangePercent: Math.round(mockTrends.reduce((sum, t) => sum + t.changePercent, 0) / mockTrends.length),
      },
    },
  });
}
