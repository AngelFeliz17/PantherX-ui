"use client"

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="relative mb-8 h-52 w-full sm:h-64 sm:w-[34rem]">
          <Image
            src="/images/404-not-found.png"
            alt="404 Illustration"
            fill
            priority
            className="object-contain"
          />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Page not found
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you’re looking for doesn’t exist, was moved, or the link may
          be broken.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}