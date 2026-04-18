import { mockScraperStatus } from "@/lib/mock-data";

export async function GET() {
  return Response.json({
    data: mockScraperStatus,
    summary: {
      totalScrapers: mockScraperStatus.length,
      running: mockScraperStatus.filter((s) => s.status === "running").length,
      idle: mockScraperStatus.filter((s) => s.status === "idle").length,
      error: mockScraperStatus.filter((s) => s.status === "error").length,
      totalSignals: mockScraperStatus.reduce((sum, s) => sum + s.signalsTotal, 0),
    },
  });
}
