"use client";

import * as React from "react";
import {
  Search,
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
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
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
      title: "Domain Search",
      url: "/dashboard/search",
      icon: Search,
      isActive: true,
      items: [
        {
          title: "Expiring Domains",
          url: "/dashboard/search/expiring",
        },
        {
          title: "Advanced Search",
          url: "/dashboard/search/advanced",
        },
        {
          title: "Search History",
          url: "/dashboard/search/history",
        },
      ],
    },
    {
      title: "Orderbook",
      url: "/dashboard/orderbook",
      icon: ShoppingCart,
      items: [
        {
          title: "Create Listing",
          url: "/dashboard/orderbook/create-listing",
        },
        {
          title: "Create Offer",
          url: "/dashboard/orderbook/create-offer",
        },
        {
          title: "Cancel Listing",
          url: "/dashboard/orderbook/cancel-listing",
        },
        {
          title: "Cancel Offer",
          url: "/dashboard/orderbook/cancel-offer",
        },
        {
          title: "View Fees",
          url: "/dashboard/orderbook/fees",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Tokenized Domains",
      url: "/dashboard/tokenized",
      icon: Coins,
    },
    {
      name: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
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
        <NavProjects projects={staticData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
