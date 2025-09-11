"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { Search, Plus, PlusIcon } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useChatHistory, type ChatSession } from "@/hooks/useChatHistory";
import { DomaScrollbars } from "@/components/ui/overlay-scrollbars";

// Conversation history grouped by time periods
const groupConversationsByPeriod = (sessions: ChatSession[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups = {
    today: [] as ChatSession[],
    yesterday: [] as ChatSession[],
    lastWeek: [] as ChatSession[],
    lastMonth: [] as ChatSession[],
  };

  sessions.forEach((session) => {
    const sessionDate = new Date(session.updatedAt);
    if (sessionDate >= today) {
      groups.today.push(session);
    } else if (sessionDate >= yesterday) {
      groups.yesterday.push(session);
    } else if (sessionDate >= lastWeek) {
      groups.lastWeek.push(session);
    } else if (sessionDate >= lastMonth) {
      groups.lastMonth.push(session);
    }
  });

  return groups;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNewChat?: () => void;
  onSwitchChat?: (sessionId: string) => void;
  currentSessionId?: string | null;
}

export function AppSidebar({
  onNewChat,
  onSwitchChat,
  currentSessionId,
  ...props
}: AppSidebarProps) {
  const { user } = useUser();
  const { sessions, deleteSession, createNewSession } = useChatHistory();

  const userData = {
    name: user?.fullName || user?.firstName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "/avatars/user.jpg",
  };

  const handleNewChat = () => {
    // Create new session and clear current thread
    const newSessionId = createNewSession();
    sessionStorage.removeItem("current-thread-id"); // This will trigger new thread creation
    onNewChat?.();
    onSwitchChat?.(newSessionId);
  };

  const handleSwitchChat = (sessionId: string) => {
    // When switching chats, we could optionally create new threads
    // For now, we'll keep the current thread behavior
    onSwitchChat?.(sessionId);
  };

  const conversationGroups = groupConversationsByPeriod(sessions);

  const renderConversationGroup = (
    title: string,
    conversations: ChatSession[],
  ) => {
    if (conversations.length === 0) return null;

    return (
      <SidebarGroup key={title}>
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        <SidebarMenu>
          {conversations.map((conversation) => (
            <SidebarMenuButton
              key={conversation.id}
              onClick={() => handleSwitchChat(conversation.id)}
              className={
                currentSessionId === conversation.id ? "bg-accent" : ""
              }
            >
              <span className="truncate">{conversation.title}</span>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-2 py-4 bg-cyan-500">
        <div className="flex flex-row items-center gap-2 px-2">
          <img src="/orbf.png" alt="DomaOS" className="size-8 rounded-md" />
          <div className="text-md font-base text-white tracking-tight">
            DomaOS
          </div>
        </div>
        <Button variant="ghost" className="size-8 text-white hover:bg-white/20">
          <Search className="size-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <DomaScrollbars
          className="flex-1"
          options={{
            overflow: { x: "hidden", y: "scroll" },
            scrollbars: { autoHide: "leave", autoHideDelay: 800 },
          }}
        >
          <div className="px-4">
            <Button
              onClick={handleNewChat}
              variant="outline"
              className="mb-4 flex w-full items-center gap-2"
            >
              <PlusIcon className="size-4" />
              <span>New Chat</span>
            </Button>
          </div>

          {renderConversationGroup("Today", conversationGroups.today)}
          {renderConversationGroup("Yesterday", conversationGroups.yesterday)}
          {renderConversationGroup("Last 7 days", conversationGroups.lastWeek)}
          {renderConversationGroup("Last month", conversationGroups.lastMonth)}

          {sessions.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          )}
        </DomaScrollbars>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
