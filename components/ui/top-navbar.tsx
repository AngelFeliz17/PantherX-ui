import Link from "next/link";
import {
  LogIn,
  MessageCircle,
  Package,
  PlusCircle,
  User,
} from "lucide-react";
import { Button } from "./button";

interface UserProps {
    isAuthenticated: boolean;
}

export default function TopNavBar({ isAuthenticated }: UserProps) {
    return (
        <nav className="absolute top-0 z-20 w-full border-b border-white/10">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-3 text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <span className="text-lg font-bold">P</span>
              </div>

              <span className="text-2xl font-bold">
                PantherX
              </span>
            </Link>

            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="text-white hover:bg-white/10 hover:text-white"
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
                  className="text-white hover:bg-white/10 hover:text-white"
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
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link
                    href="/listings"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    My Listings
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
                  className="rounded-full text-white hover:bg-white/10"
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