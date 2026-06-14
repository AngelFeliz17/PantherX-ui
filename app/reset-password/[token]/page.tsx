"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";

import { resetPassword } from "@/lib/api/auth";
import { classnames } from "@/styles/input.styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Feature from "@/lib/functions/feature";

const PASSWORD_MIN_LENGTH = 8;

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, {
        newPassword: password,
        newPasswordConfirmation: confirmPassword,
      });
      router.push("/login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
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
            <h1 className="text-5xl font-bold leading-tight">Set a New Password</h1>
            <p className="mt-5 text-lg text-white/90">
              Choose a strong password to keep your account secure.
            </p>
          </div>
          <div className="space-y-6">
            <Feature title="Stay Secure" description="Use a mix of letters, numbers, and symbols." />
            <Feature title="Don't Reuse" description="Avoid passwords used on other sites." />
            <Feature title="Almost There" description="One step away from getting back in." />
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
            <p className="mt-3 text-sm text-white/90">Set a new password</p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border bg-white p-6 shadow-sm lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                  <KeyRound className="h-8 w-8 text-violet-600" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-3xl font-bold lg:text-4xl">Set new password</h2>
                <p className="mt-2 text-muted-foreground">
                  Must be at least {PASSWORD_MIN_LENGTH} characters.
                </p>
              </div>

              <form id="reset-password-form" onSubmit={handleResetPassword} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`${classnames.input} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`${classnames.input} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-200 ${error ? "max-h-[80px] mb-2" : "max-h-0"}`}>
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700 first-letter:uppercase">{error}</p>
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  form="reset-password-form"
                  type="submit"
                  className="h-12 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-700 font-bold text-lg hover:shadow-lg transition-shadow"
                >
                  {isLoading ? "Resetting password..." : "Reset Password"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/reset-password"
                    className="inline-flex items-center gap-2 font-medium text-violet-600 hover:underline"
                  >
                    <ArrowLeft size={18} />
                    Request a new link
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