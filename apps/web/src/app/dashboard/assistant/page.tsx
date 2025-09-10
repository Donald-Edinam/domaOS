import { AssistantChat } from "../../../components/assistant-chat";

export default function AssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Doma Agent</h1>
        <p className="text-muted-foreground mt-2">
          Chat with our Doma Protocol AI assistant about your domains
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}