import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json();

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: "Invalid domains array provided" },
        { status: 400 },
      );
    }

    const workflow = mastra.getWorkflow("domainTokenizationWorkflow");
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { domains },
    });

    if (result.status === "success") {
      return NextResponse.json({
        success: true,
        analysis: result.result.analysis,
      });
    } else {
      console.error("Workflow execution failed:", result);
      return NextResponse.json(
        { error: "Domain analysis workflow did not complete successfully" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Domain analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error during domain analysis" },
      { status: 500 },
    );
  }
}
