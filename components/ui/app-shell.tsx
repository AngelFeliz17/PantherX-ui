"use client";

import { usePathname } from "next/navigation";
import TopNavBar from "@/components/ui/top-navbar";
import BottomNavBar from "@/components/ui/bottom-navbar";

const NAVLESS_ROUTES = ["/login", "/signup", "/reset-password", "/verify-account"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbars = NAVLESS_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {!hideNavbars && <TopNavBar />}
      <main>{children}</main>
      {!hideNavbars && <BottomNavBar />}
    </>
  );
}
