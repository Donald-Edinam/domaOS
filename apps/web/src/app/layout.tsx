import type { Metadata } from "next";
// import { JetBrains_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import ConditionalHeader from "@/components/conditional-header";
import { ClerkProvider } from "@clerk/nextjs";

// Temporarily use system font until network issues are resolved
// const jetbrainsMono = JetBrains_Mono({
//   variable: "--font-jetbrains-mono",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "DomaOS",
  description:
    "AI-powered domain operating system for intelligent domain management and analysis",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-mono antialiased bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 text-gray-900"
      >
        <ClerkProvider>
          <Providers>
            <div className="grid grid-rows-[auto_1fr] h-svh">
              <ConditionalHeader />
              {children}
            </div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
