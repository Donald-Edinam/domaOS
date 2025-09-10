import { Mastra } from "@mastra/core/mastra";
import { domainAssistant } from "./agents/domain-assistant";
import {
  domainTokenizationWorkflow,
  domainTokenizationWorkflowEnhanced,
} from "./workflows";

export const mastra = new Mastra({
  agents: { domainAssistant },
  workflows: {
    domainTokenizationWorkflow,
    domainTokenizationWorkflowEnhanced,
  },
});
