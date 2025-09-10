import { NextRequest, NextResponse } from "next/server";
import { mastra } from "../../../../mastra";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = await request.json().catch(() => null) as {
      prompt?: string;
      messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      userId?: string;
      threadId?: string;
    } | null;
    
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { prompt, messages, userId = "default-user", threadId = "default-thread" } = body;

    if (!prompt && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { success: false, error: "Provide 'prompt' or 'messages' in body" },
        { status: 400 }
      );
    }

    // Get the agent from Mastra instance
    const agent = mastra.getAgent("domainAssistant");

    // Support either simple prompt or full message array
    const normalized: string | string[] =
      messages && messages.length > 0
        ? messages.map((m) => m.content)
        : (prompt as string);

    // Use maxSteps to allow multiple tool calls if needed
    // Include memory configuration for conversation persistence
    const result = await agent.generate(normalized, {
      maxSteps: 5, // Allow up to 5 sequential tool calls
      memory: {
        resource: `user_${userId}`,
        thread: { id: threadId },
      },
    });

    return NextResponse.json({
      success: true,
      text: result.text,
      object: (result as any).object ?? null,
      usage: (result as any).usage ?? null,
    });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Agent call failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    info: "POST a JSON body with { prompt: string } or { messages: {role, content}[] } to call the assistant agent.",
    model: "google gemini-1.5-flash",
    env: {
      googleKeyPresent: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    },
  });
}