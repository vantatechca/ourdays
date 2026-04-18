import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, threadId } = body;

    if (!message) {
      return Response.json({ error: "message is required" }, { status: 400 });
    }

    // TODO: Replace with real Claude Sonnet API call with full context injection
    // Context to inject: golden rules, feedback patterns, brain memory, stats, recent decisions
    const response = {
      id: crypto.randomUUID(),
      threadId: threadId || crypto.randomUUID(),
      role: "assistant" as const,
      content: generateMockBrainResponse(message),
      metadata: {
        model: "claude-sonnet-4-6",
        tokensUsed: 847,
        contextIncluded: ["golden_rules", "feedback_patterns", "recent_decisions"],
      },
      createdAt: new Date().toISOString(),
    };

    return Response.json({ data: response });
  } catch {
    return Response.json({ error: "Failed to process brain chat" }, { status: 500 });
  }
}

function generateMockBrainResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("/trending") || lower.includes("trending")) {
    return `Here's what's trending right now in the peptide space:

1. **Retatrutide** — BREAKOUT (+890% in 30 days). Zero digital products exist. This is your strongest first-mover window.
2. **Semaglutide dosing** — Still climbing (+45%). 2,847 Reddit questions this month about reconstitution alone.
3. **BPC-157 + TB-500 stacking** — Steady growth (+32%). The most-asked-about peptide combination.
4. **GHK-Cu skincare** — Crossover appeal emerging (+18%). Tapping into the broader skincare audience.

My recommendation: Ship the semaglutide guide this week (3-5 day build), then pivot to the retatrutide builder before anyone else gets there.`;
  }

  if (lower.includes("/suggest") || lower.includes("recommend")) {
    return `Based on your golden rules and approval patterns, here are my top 5 right now:

1. **Retatrutide Protocol Builder** (Score: 91) — First-mover, breakout trend, recurring revenue via subscription
2. **Semaglutide Dosing Guide** (Score: 92) — Massive demand gap, low build effort, ship this week
3. **BPC-157 + TB-500 Stack Builder** (Score: 88) — Zero competitors, SaaS model, matches your preference for tools
4. **Peptide Cycle Planner** (Score: 83) — High ceiling SaaS play, addresses #1 pain point
5. **GHK-Cu Skincare Guide** (Score: 76) — Lower risk, proven model, new audience expansion

I notice you consistently approve SaaS/tool products over ebooks (88% approval rate for tools vs 45% for ebooks). Should I add a stronger weight to the "prefer tools" golden rule?`;
  }

  if (lower.includes("/stats")) {
    return `Pipeline Stats:
- **47** total ideas in pipeline
- **12** pending review (5 scored above 80)
- **8** approved (3 in active build)
- **15** declined
- **4** incubating
- **9** new ideas this week (down from 14 last week — brain is filtering better)
- **Average score**: 71.3 (up from 64.8 last week)
- **Top source**: Reddit (contributing 58% of signals)
- **Daily API cost**: $3.42 (within $5 budget)`;
  }

  return `I've analyzed your message. Based on the current pipeline of 47 ideas, your 8 golden rules, and 40 learned preferences, here's what I think:

The peptide digital product space continues to show strong signals, particularly around GLP-1 compounds (semaglutide, tirzepatide, retatrutide). Your approval patterns show a clear preference for SaaS tools with recurring revenue over one-time info products.

What specific aspect would you like me to dig deeper into? I can run a /deep-dive on any topic, /compare ideas side by side, or give you my /suggest top picks.`;
}
