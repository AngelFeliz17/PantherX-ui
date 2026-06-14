"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { sendForgotPasswordEmail } from "@/lib/api/auth";
import { classnames } from "@/styles/input.styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Feature from "@/lib/functions/feature";

export default function ResetPasswordRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await sendForgotPasswordEmail({ email });
      setMessage({ text: response.message, isError: false });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Something went wrong",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-background">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block">
        <Image src="/images/campanile.jpg" alt="UNI Campus" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <span className="text-2xl font-bold">P</span>
            </div>
            <span className="text-3xl font-bold">PantherX</span>
          </div>
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">Reset Your Password</h1>
            <p className="mt-5 text-lg text-white/90">
              Enter your university email and we'll send you a reset link.
            </p>
          </div>
          <div className="space-y-6">
            <Feature title="Quick & Secure" description="Reset link expires after 15 minutes." />
            <Feature title="Check Your Inbox" description="Look for an email from PantherX." />
            <Feature title="Still Stuck?" description="Contact support if you need help." />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex min-h-screen flex-col bg-background">
        {/* MOBILE HERO */}
        <div className="relative h-60 lg:hidden">
          <Image src="/images/campanile.jpg" alt="UNI Campus" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <span className="text-xl font-bold">P</span>
              </div>
              <span className="text-2xl font-bold">PantherX</span>
            </div>
            <p className="mt-3 text-sm text-white/90">Reset your password</p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border bg-white p-6 shadow-sm lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                  <Mail className="h-8 w-8 text-violet-600" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-3xl font-bold lg:text-4xl">Forgot password?</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form id="forgot-password-form" onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`you@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN}`}
                    className={classnames.input}
                  />
                </div>

                <div className={`overflow-hidden transition-all duration-200 ${message ? "max-h-[80px] mb-2" : "max-h-0"}`}>
                  <div className={`rounded-xl p-4 ${message?.isError ? "bg-red-50" : "bg-green-50"}`}>
                    <p className={`text-sm first-letter:uppercase ${message?.isError ? "text-red-700" : "text-green-700"}`}>
                      {message?.text}
                    </p>
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  form="forgot-password-form"
                  type="submit"
                  className="h-12 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-700 font-bold text-lg hover:shadow-lg transition-shadow"
                >
                  {isLoading ? "Sending reset link..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 font-medium text-violet-600 hover:underline"
                  >
                    <ArrowLeft size={18} />
                    Back to Log In
                  </Link>
                </div>
              </form>
            </div>

            <div className="mt-2 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Check your spam folder if you don't see the email.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}