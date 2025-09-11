import type { ToolStep } from "@/components/ui/tool-progress"

export type AssistantMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ProgressCallback = {
  onToolStart?: (toolId: string, toolName: string, input: Record<string, unknown>) => void
  onToolComplete?: (toolId: string, output: unknown) => void
  onToolError?: (toolId: string, error: string) => void
  onThinking?: (message: string) => void
}

export async function callAssistantWithProgress(
  input: {
    prompt?: string;
    messages?: AssistantMessage[];
    userId?: string;
    threadId?: string;
  },
  progressCallback?: ProgressCallback
): Promise<{ text: string; object?: any; usage?: any; toolSteps?: ToolStep[] }> {

  // Simulate tool steps for demonstration
  const simulateToolProgress = async () => {
    const toolSteps: ToolStep[] = []

    if (input.prompt && (
      input.prompt.toLowerCase().includes("search") ||
      input.prompt.toLowerCase().includes("find") ||
      input.prompt.toLowerCase().includes("domain")
    )) {
      // Step 1: Analyzing query
      const step1: ToolStep = {
        id: "analyze-query",
        name: "Analyzing Query",
        description: "Understanding your domain search requirements",
        status: "running",
        startTime: new Date()
      }
      toolSteps.push(step1)
      progressCallback?.onThinking?.("Analyzing your domain query...")

      await new Promise(resolve => setTimeout(resolve, 800))
      step1.status = "completed"
      step1.endTime = new Date()

      // Step 2: Searching domains
      const step2: ToolStep = {
        id: "search-doma-names",
        name: "Searching Domains",
        description: "Looking up domains in the DOMA Protocol",
        status: "running",
        startTime: new Date(),
        input: { name: input.prompt, take: 10 }
      }
      toolSteps.push(step2)
      progressCallback?.onToolStart?.("search-doma-names", "Searching Domains", step2.input!)

      await new Promise(resolve => setTimeout(resolve, 1200))
      step2.status = "completed"
      step2.endTime = new Date()
      progressCallback?.onToolComplete?.("search-doma-names", { found: 5, domains: ["example.com", "test.io"] })

      // Step 3: Fetching details
      const step3: ToolStep = {
        id: "get-doma-name-details",
        name: "Fetching Details",
        description: "Getting detailed information about found domains",
        status: "running",
        startTime: new Date(),
        input: { name: "example.com" }
      }
      toolSteps.push(step3)
      progressCallback?.onToolStart?.("get-doma-name-details", "Fetching Details", step3.input!)

      await new Promise(resolve => setTimeout(resolve, 900))
      step3.status = "completed"
      step3.endTime = new Date()
      progressCallback?.onToolComplete?.("get-doma-name-details", {
        name: "example.com",
        status: "available",
        price: "100 USD"
      })
    }

    return toolSteps
  }

  // Run the simulation alongside the actual API call
  const [apiResult, toolSteps] = await Promise.all([
    // Actual API call
    fetch("/api/agent/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then(async (res) => {
      if (!res.ok) {
        let errText = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          errText = err?.details || err?.error || errText;
        } catch {}
        throw new Error(errText);
      }
      const data = await res.json();
      return { text: data.text, object: data.object, usage: data.usage };
    }),

    // Progress simulation
    simulateToolProgress()
  ])

  return {
    ...apiResult,
    toolSteps
  }
}
