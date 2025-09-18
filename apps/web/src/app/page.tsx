"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600"></div>

      {/* Main content with integrated header */}
      <div className="relative z-10 flex flex-col min-h-screen px-6">
        {/* Header - empty since navbar handles branding */}
        <div className="py-6"></div>

        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              AI Domain Management
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Reimagined
            </h2>
            <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto mb-12 leading-relaxed">
              Transform your ideas into stunning results with our advanced
              AI-powered domain management platform. Create, edit, and enhance
              domains like never before.
            </p>

            <Button
              onClick={handleGetStarted}
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 rounded-full text-lg font-medium mb-16"
            >
              Get Started
            </Button>
          </div>

          {/* Card showcase */}
          <div className="relative flex justify-center items-center gap-4 mt-8">
            {/* Left card */}
            <div className="transform -rotate-12 bg-white rounded-2xl shadow-2xl overflow-hidden w-64 h-80">
              <div className="h-3/4 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="white" opacity="0.2"/></svg>\')',
                  }}
                ></div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900">Domain Analytics</h3>
                <p className="text-sm text-gray-600">Comprehensive insights</p>
              </div>
            </div>

            {/* Center card */}
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden w-64 h-80 z-10">
              <div className="h-3/4 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                <img
                  src="/orbf.png"
                  alt="DomaOS"
                  className="w-16 h-16 opacity-80"
                />
              </div>
              <div className="p-4 bg-gray-900">
                <h3 className="font-bold text-white">DomaOS AI</h3>
                <p className="text-sm text-gray-300">Intelligent automation</p>
              </div>
            </div>

            {/* Right card */}
            <div className="transform rotate-12 bg-white rounded-2xl shadow-2xl overflow-hidden w-64 h-80">
              <div className="h-3/4 bg-gradient-to-br from-orange-300 to-yellow-400 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40"
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="white" opacity="0.3"/></svg>\')',
                  }}
                ></div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900">Smart Optimization</h3>
                <p className="text-sm text-gray-600">Performance focused</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
