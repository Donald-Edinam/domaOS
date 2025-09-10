"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AssistantChat } from "@/components/assistant-chat";

export default function Dashboard() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Doma Agent</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Chat with Doma Agent</h2>
            <p className="text-muted-foreground">
              Explore domains on the Doma Protocol - search, get details, view listings, and more.
            </p>
          </div>
          <AssistantChat />
        </div>
      </div>
    </>
  );
}
