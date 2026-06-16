"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { sendForgotPasswordEmail } from "@/lib/api/auth";
import { classnames } from "@/styles/input.styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLeftPanel from "@/components/ui/authentication.left.design";
import AuthRightPanel from "@/components/ui/authentication.right.design";

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
     <AuthLeftPanel />

    <AuthRightPanel subtitle="Reset your password">
      {/* RIGHT SIDE */}
        {/* FORM */}
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
    </AuthRightPanel>
    </div>
  );
}