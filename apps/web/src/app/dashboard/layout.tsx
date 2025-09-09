"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  // Show loading while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Show sign-in button if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignInButton />
      </div>
    );
  }

  // User is authenticated, show the dashboard with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="w-full">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
