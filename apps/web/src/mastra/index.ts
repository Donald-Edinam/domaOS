import { Mastra } from "@mastra/core/mastra";
import { domainAssistant } from "./agents/domain-assistant";
import { domainTokenizationWorkflow } from "./workflows";

export const mastra = new Mastra({
  agents: { domainAssistant },
  workflows: {
    domainTokenizationWorkflow,
  },
});
