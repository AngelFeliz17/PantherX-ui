"use client";

import Link from "next/link";
import { UserRound, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotLoggedUser() {
  return (
      <CardContent className="flex flex-col items-center gap-6 px-8 py-16 text-center sm:py-20">
        {/* Icon badge */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <UserRound className="h-9 w-9 text-slate-400" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm ring-4 ring-white">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-sm space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            This is where your profile lives
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            Sign in to list items, track what you&apos;ve sold, and keep an
            eye on the things you&apos;ve saved.
          </p>
        </div>

        {/* Actions */}
           <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-lg"
              >
                Sign In
              </Button>
              <Button
                size="lg"
                asChild
                className="rounded-lg bg-violet-600 hover:bg-violet-700"
              >
                <Link href="/signup">
                  Create Account
                </Link>
              </Button>
          </div>
      </CardContent>
  );
}