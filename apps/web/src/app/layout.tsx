import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import ConditionalHeader from "@/components/conditional-header";
import { ClerkProvider } from "@clerk/nextjs";

// Using Inter as a modern alternative to TASA Orbiter until the font is available
// Inter has similar geometric characteristics and excellent readability
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

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
        className={`${inter.variable} font-inter antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white`}
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
