import { NextRequest, NextResponse } from "next/server";
import { mastra } from "../../../../mastra";

export async function POST(request: NextRequest) {
  try {
    // Check if Google AI API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Google AI API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable.",
          details:
            "Get your API key from https://aistudio.google.com/app/apikey",
        },
        { status: 500 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 415 },
      );
    }

    const body = (await request.json().catch(() => null)) as {
      prompt?: string;
      messages?: Array<{
        role: "user" | "assistant" | "system";
        content: string;
      }>;
      userId?: string;
      threadId?: string;
    } | null;

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const {
      prompt,
      messages,
      userId = "default-user",
      threadId = "default-thread",
    } = body;

    if (!prompt && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { success: false, error: "Provide 'prompt' or 'messages' in body" },
        { status: 400 },
      );
    }

    // Get the agent from Mastra instance
    const agent = mastra.getAgent("domainAssistant");

    // Support either simple prompt or full message array
    const normalized: string | string[] =
      messages && messages.length > 0
        ? messages.map((m) => m.content)
        : (prompt as string);

    // Use generateVNext for V2 model support
    const result = await agent.generateVNext(normalized, {
      maxSteps: 3,
      memory: {
        thread: threadId,
        resource: `user_${userId}`,
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

    // Provide more specific error messages
    let errorMessage = "Agent call failed";
    let errorDetails = error instanceof Error ? error.message : String(error);

    if (errorDetails.includes("Google Generative AI API key")) {
      errorMessage = "Google AI API key error";
      errorDetails =
        "Please check your GOOGLE_GENERATIVE_AI_API_KEY environment variable";
    } else if (errorDetails.includes("AGENT_STREAM_VNEXT_FAILED")) {
      errorMessage = "Agent streaming failed";
      errorDetails =
        "There may be an issue with the agent configuration or model access";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        troubleshooting: {
          apiKeySet: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
          domaKeySet: !!process.env.DOMA_API_KEY,
        },
      },
      { status: 500 },
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
