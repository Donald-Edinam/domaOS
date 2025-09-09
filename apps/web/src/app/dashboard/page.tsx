"use client";

import { api } from "@my-better-t-app/backend/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { user } = useUser();
  const privateData = useQuery(api.privateData.get);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50 p-4">
            <h2 className="text-lg font-medium">Welcome {user?.fullName}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {privateData?.message || "Loading your data..."}
            </p>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 p-4">
            <h3 className="text-md font-medium">Domains Found</h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 p-4">
            <h3 className="text-md font-medium">Watchlist</h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Your domain hunting activity will appear here.
          </p>
        </div>
      </div>
    </>
  );
}
