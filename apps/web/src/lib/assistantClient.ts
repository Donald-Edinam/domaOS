export type AssistantMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function callAssistant(input: {
  prompt?: string;
  messages?: AssistantMessage[];
  userId?: string;
  threadId?: string;
}): Promise<{ text: string; object?: any; usage?: any }> {
  const res = await fetch("/api/agent/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

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
}