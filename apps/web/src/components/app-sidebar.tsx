"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { History, Plus, Trash2, MessageSquare } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useChatHistory, type ChatSession } from "@/hooks/useChatHistory";

const OrbIcon = () => (
  <div className="h-6 w-6 rounded-full overflow-hidden">
    <img src="/orbf.png" alt="ORB" className="w-full h-full object-cover" />
  </div>
);

const staticData = {
  teams: [
    {
      name: "",
      logo: OrbIcon,
      plan: "Free",
    },
  ],
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
    const newSessionId = createNewSession();
    onNewChat?.();
    onSwitchChat?.(newSessionId);
  };

  const handleSwitchChat = (sessionId: string) => {
    onSwitchChat?.(sessionId);
  };

  const handleDeleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="!block border-r border-gray-200"
      style={{ backgroundColor: "#F4F4F5" }}
      {...props}
    >
      <SidebarHeader
        className="p-4 border-b border-gray-100"
        style={{ backgroundColor: "#F4F4F5" }}
      >
        <TeamSwitcher teams={staticData.teams} />

        {/* New Chat Button */}
        <div className="mt-3 group-data-[collapsible=icon]:hidden">
          <Button
            onClick={handleNewChat}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent
        className="flex-1 p-2"
        style={{ backgroundColor: "#F4F4F5" }}
      >
        {/* Chat History Section */}
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <History className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Chat History
            </span>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <SidebarMenu>
              {sessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => handleSwitchChat(session.id)}
                    className={`group flex items-center justify-between w-full p-3 rounded-lg hover:bg-white transition-colors duration-200 ${
                      currentSessionId === session.id
                        ? "bg-white shadow-sm border border-cyan-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <MessageSquare className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-red-500 transition-all duration-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {sessions.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No chat history yet</p>
                </div>
              )}
            </SidebarMenu>
          </ScrollArea>
        </div>

        {/* Collapsed icon view */}
        <div className="group-data-[collapsible=icon]:block hidden">
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleNewChat}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Chat History"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter
        className="p-2 border-t border-gray-100"
        style={{ backgroundColor: "#F4F4F5" }}
      >
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
