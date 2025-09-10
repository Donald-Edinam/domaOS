import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/mastra';

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json();

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: 'Invalid domains array provided' },
        { status: 400 }
      );
    }

    // Try enhanced workflow first, fall back to original if needed
    try {
      const workflow = mastra.getWorkflow("domainTokenizationWorkflowEnhanced");
      const run = await workflow.createRunAsync();
      const result = await run.start({
        inputData: { domains }
      });

      if (result.status === "success") {
        return NextResponse.json({
          success: true,
          analysis: result.result.analysis,
          workflow: 'enhanced'
        });
      }
    } catch (enhancedError) {
      console.warn('Enhanced workflow failed, trying fallback:', enhancedError);

      // Fallback to original workflow
      try {
        const fallbackWorkflow = mastra.getWorkflow("domainTokenizationWorkflow");
        const fallbackRun = await fallbackWorkflow.createRunAsync();
        const fallbackResult = await fallbackRun.start({
          inputData: { domains }
        });

        if (fallbackResult.status === "success") {
          return NextResponse.json({
            success: true,
            analysis: fallbackResult.result.analysis,
            workflow: 'fallback'
          });
        }
      } catch (fallbackError) {
        console.error('Both workflows failed:', fallbackError);
        return NextResponse.json(
          { error: 'Domain analysis failed with both workflows' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Domain analysis workflow did not complete successfully' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Domain analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during domain analysis' },
      { status: 500 }
    );
  }
}
