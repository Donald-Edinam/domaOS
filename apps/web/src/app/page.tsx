"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl transform rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-lg transform rotate-12 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-2xl transform -rotate-12 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-xl transform rotate-45 animate-bounce"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6">
        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Hero section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium tracking-wider mb-6">
                DOMAIN MANAGEMENT
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-6 leading-none">
              Everything big
            </h1>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-8 leading-none">
              starts small
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
              Generally, The DomaOS community have built world-leading 
              expertise and gained from .com, .io, and other top TLDs. The web
              starts to evolve with domain intelligence behind. Work
              with DomaOS.
            </p>
          </div>

          {/* Featured domains showcase */}
          <div className="relative w-full max-w-6xl mx-auto">
            {/* Center featured domain */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center min-w-[280px]">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl tracking-wider">.ai</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">AI Domains</h3>
                  <p className="text-gray-400 text-sm mb-4 font-medium tracking-wide">65 Challenges</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-gray-800"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-full border-2 border-gray-800"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <span className="text-white text-sm font-medium tracking-wide">+ 25000 builders</span>
                  </div>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-semibold w-full tracking-wide">
                    View Challenge
                  </Button>
                </div>
              </div>
            </div>

            {/* Side domains */}
            <div className="flex justify-between items-center">
              {/* Left domain */}
              <div className="transform -rotate-6 scale-75 opacity-80">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 text-center min-w-[240px]">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">.io</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Tech Domains</h3>
                  <p className="text-gray-400 text-xs mb-3">42 Challenges</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full border border-gray-800"></div>
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border border-gray-800"></div>
                    </div>
                    <span className="text-white text-xs">+ 15.5k builders</span>
                  </div>
                </div>
              </div>

              {/* Right domain */}
              <div className="transform rotate-6 scale-75 opacity-80">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 text-center min-w-[240px]">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">.dev</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Developer Domains</h3>
                  <p className="text-gray-400 text-xs mb-3">38 Challenges</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border border-gray-800"></div>
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-gray-800"></div>
                    </div>
                    <span className="text-white text-xs">+ 22.1k builders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center py-12">
          <h3 className="text-3xl font-bold text-white mb-4 tracking-wide">Download the App</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto font-light tracking-wide leading-relaxed">
            Learn about the world's leading 
            domains, right from your phone
          </p>
          
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="bg-transparent hover:bg-gray-800/50 text-white border-gray-600 hover:border-gray-500 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </Button>
            <Button
              variant="outline"
              className="bg-transparent hover:bg-gray-800/50 text-white border-gray-600 hover:border-gray-500 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              Google Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
