"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogIn,
  MessageCircle,
  Package,
  PlusCircle,
  User,
} from "lucide-react";
import { Button } from "./button";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";

export default function TopNavBar() {
  const user = useUser();
  const pathname = usePathname();
  const isListingsPage = pathname.startsWith("/listings");

  const navTextClass = isListingsPage
    ? "text-slate-900 hover:bg-slate-100 hover:text-slate-900"
    : "text-white hover:bg-white/10 hover:text-white";

    return (
        <nav
          className={cn(
            "absolute top-0 z-20 w-full border-b",
            isListingsPage
              ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur"
              : "border-white/10"
          )}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3",
                isListingsPage ? "text-slate-900" : "text-white"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur",
                  isListingsPage ? "bg-violet-600 text-white" : "bg-white/20"
                )}
              >
                <span className="text-lg font-bold">P</span>
              </div>

              <span className="text-2xl font-bold">
                PantherX
              </span>
            </Link>

            {!!user === false ? (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className={navTextClass}
                >
                  <Link
                    href="/login"
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>

                <Button
                  asChild
                  className="rounded-xl bg-violet-600 hover:bg-violet-700"
                >
                  <Link href="/signup">
                    Sign Up
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className={navTextClass}
                >
                  <Link
                    href="/messages"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Messages
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  asChild
                  className={navTextClass}
                >
                  <Link
                    href="/listings"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Listings
                  </Link>
                </Button>

                <Button
                  asChild
                  className="rounded-xl bg-violet-600 hover:bg-violet-700"
                >
                  <Link
                    href="/listings/create"
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Sell Item
                  </Link>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "rounded-full",
                    isListingsPage
                      ? "text-slate-900 hover:bg-slate-100"
                      : "text-white hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
    )
}
