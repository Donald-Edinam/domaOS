"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            DomaOS
          </h1>

          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered domain operating system for intelligent domain
            management and analysis
          </p>

          <p className="text-lg text-muted-foreground/80 max-w-3xl mx-auto">
            Discover, analyze, and manage domains with the power of artificial
            intelligence. Get insights, recommendations, and automated
            assistance for all your domain needs.
          </p>

          <div className="pt-8">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="text-lg px-8 py-6 rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
