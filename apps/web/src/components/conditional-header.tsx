"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return <Header />;
}
