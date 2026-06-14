"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { signUp } from "@/lib/api/auth";
import { classnames } from "@/styles/input.styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Feature from "@/lib/functions/feature";

const PASSWORD_MIN_LENGTH = 8;

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score === 2) return { score, label: "Fair", color: "bg-amber-400" };
  if (score === 3) return { score, label: "Good", color: "bg-blue-400" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export default function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = React.use(searchParams);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const strength = password ? getPasswordStrength(password) : null;

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const pw = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const name = formData.get("name") as string;

    // Client-side validation before hitting the server
    if (pw.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      setIsLoading(false);
      return;
    }

    if (pw !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp({ email, password: pw, name });
      router.push(`/verify-account/${encodeURIComponent(result.email)}`);
    } catch (error: any) {
      setError(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-background">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/campanile.jpg"
          alt="UNI Campus"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <span className="text-2xl font-bold">P</span>
            </div>
            <span className="text-3xl font-bold">PantherX</span>
          </div>
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">Join PantherX</h1>
            <p className="mt-5 text-lg text-white/90">
              Buy, sell, and connect with verified University of Northern Iowa students.
            </p>
          </div>
          <div className="space-y-6">
            <Feature title="Verified Students" description="Only students with a valid UNI email can join." />
            <Feature title="Campus Marketplace" description="Find textbooks, furniture, electronics, and more." />
            <Feature title="Safe Community" description="Buy and sell with people you share a campus with." />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex min-h-screen flex-col bg-background">
        {/* MOBILE HERO */}
        <div className="relative h-60 lg:hidden">
          <Image
            src="/images/campanile.jpg"
            alt="UNI Campus"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <span className="text-xl font-bold">P</span>
              </div>
              <span className="text-2xl font-bold">PantherX</span>
            </div>
            <p className="mt-3 text-sm text-white/90">Join the campus marketplace</p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border bg-white p-6 shadow-sm lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div>
                <h2 className="text-3xl font-bold lg:text-4xl">Create your account</h2>
                <p className="mt-2 text-muted-foreground">
                  Join the trusted marketplace for UNI students.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="mt-8 space-y-5">
                {/* NAME */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className={classnames.input}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    defaultValue={params.email ?? ""}
                    placeholder={`you@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN}`}
                    className={classnames.input}
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${classnames.input} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div className={`overflow-hidden transition-all duration-200 ${strength ? "max-h-[40px] mb-2" : "max-h-0"}`}>
                    {strength && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : "bg-muted"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Strength: <span className="font-medium text-foreground">{strength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700 first-letter:uppercase">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700 font-bold text-lg text-white hover:shadow-lg transition-shadow"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-violet-600 hover:underline">
                    Log In
                  </Link>
                </p>
              </form>
            </div>

            <div className="mt-2 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                You must have a valid university email to join.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}