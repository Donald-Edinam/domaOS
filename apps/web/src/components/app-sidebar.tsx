"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const staticData = {
  teams: [
    {
      name: "Doma Agent",
      logo: Globe,
      plan: "Beta",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const userData = {
    name: user?.fullName || user?.firstName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "/avatars/user.jpg",
  };

  return (
    <Sidebar
      collapsible="icon"
      className="!block border-r borderborder-gray-200 bg-white200 bg-white"
      {...props}
    >
      <SidebarHeader className="p-4 bg-white border-b border-gray-100">
        <TeamSwitcher teams={staticData.teams} />
      </SidebarHeader>

      <SidebarContent className="bg-white flex-1 bg-white">
        <div className="p-4">
          <div className="text-center text-gray-500 text-sm"></div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-2 bg-white border-t border-gray-100">
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
