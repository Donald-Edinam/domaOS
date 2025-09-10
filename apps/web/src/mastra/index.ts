import { Mastra } from "@mastra/core/mastra";
import { domainAssistant } from "./agents/domain-assistant";

export const mastra = new Mastra({
  agents: { domainAssistant },
});