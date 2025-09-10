"use client";

import * as React from "react";
import {
  Command,
  Globe,
  GalleryVerticalEnd,
  Coins,
  Bell,
  SquareTerminal,
  ShoppingCart,
  Plus,
  X,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { NavUser } from "@/components/nav-user";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// doma.app static data
const staticData = {
  teams: [
    {
      name: "doma.app",
      logo: Globe,
      plan: "Beta",
    },
  ],
  navMain: [
    {
      title: "Doma Agent",
      url: "/dashboard",
      icon: MessageSquare,
      isActive: true,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  // Create dynamic user data from Clerk user info
  const userData = {
    name: user?.fullName || user?.firstName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "/avatars/user.jpg",
  };

  return (
    <Sidebar collapsible="icon" className="!block" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={staticData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
