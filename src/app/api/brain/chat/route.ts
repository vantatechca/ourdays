import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireUserId, UnauthorizedError } from "@/lib/session";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Brain, an AI assistant for PeptideIQ — a platform that discovers and analyzes digital product opportunities in the peptide/biohacking space.

Your role is to help the operator:
- Analyze product ideas (ebooks, courses, SaaS tools, templates)
- Evaluate trends and competitors
- Score opportunities across dimensions (trend, demand, competition, feasibility, revenue)
- Apply "golden rules" from user feedback patterns
- Suggest next actions

When analyzing, be specific and actionable. Reference concrete numbers (trend scores, revenue estimates, competitor counts) when relevant. Keep responses concise but substantive.

Supported commands (when the user types these):
- /trending — show top trending topics
- /suggest — recommend top product ideas
- /stats — show pipeline statistics
- /deep-dive [topic] — deep analysis
- /compare [A] vs [B] — head-to-head comparison
- /rules — show active golden rules`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    await requireUserId();

    const body = await request.json();
    const { message, threadId, history } = body as {
      message: string;
      threadId?: string;
      history?: ChatMessage[];
    };

    if (!message) {
      return Response.json({ error: "message is required" }, { status: 400 });
    }

    const messages: Anthropic.MessageParam[] = [
      ...(history ?? []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages,
      thinking: { type: "adaptive" },
    });

    const textContent = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return Response.json({
      data: {
        id: response.id,
        threadId: threadId ?? crypto.randomUUID(),
        role: "assistant" as const,
        content: textContent,
        metadata: {
          model: response.model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          stopReason: response.stop_reason,
        },
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "Invalid Anthropic API key. Check ANTHROPIC_API_KEY in .env" },
        { status: 401 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Rate limited. Please try again shortly." },
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Claude API error: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }
    return Response.json(
      { error: "Failed to process brain chat" },
      { status: 500 }
    );
  }
}
