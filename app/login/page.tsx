"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

import { generateCode, logIn } from "@/lib/api/auth";
import { classnames } from "@/styles/input.styles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthLeftPanel from "@/components/ui/authentication.left.design";
import AuthRightPanel from "@/components/ui/authentication.right.design";

interface AuthError {
  message: string;
  code?: string;
}

export default function LogIn() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await logIn({ email, password });
      window.location.replace("/");
    } catch (error: unknown) {
      if (axios.isAxiosError<AuthError>(error)) {
        setError(error.response?.data ?? { message: "Something went wrong" });
      } else {
        setError({ message: "Something went wrong" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      await generateCode(email);
      router.push(`/verify-account/${encodeURIComponent(email)}`)
    } catch {
      setError({ message: "Failed to resend verification email. Please try again later"});
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-background">
      {/* LEFT SIDE - large screens only */}
      <AuthLeftPanel />

      <AuthRightPanel subtitle="Sign in to your account to continue">
      {/* RIGHT SIDE */}
        {/* FORM */}
            <div className="rounded-3xl border bg-white p-6 shadow-sm lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div>
                <h2 className="text-3xl font-bold lg:text-4xl">Welcome back</h2>
                <p className="mt-2 text-muted-foreground">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleLogIn} className="mt-8 space-y-5">
                {/* EMAIL */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={`you@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={classnames.input}
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/reset-password"
                      className="text-sm font-medium text-violet-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`${classnames.input} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                  <div className={`overflow-hidden transition-all duration-200 ${error ? "max-h-[80px] mb-2" : "max-h-0"}`}>
                      <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                          {error?.message}
                          {error?.code === "UNVERIFIED" && (
                            <>
                              {" "}
                              <button
                                type="button"
                                onClick={handleResendVerificationEmail}
                                className="font-medium underline cursor-pointer"
                              >
                                Resend verification email
                              </button>
                            </>
                          )}
                        </p>
                      </div>
                  </div>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="h-12 font-bold text-lg w-full rounded-xl bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg transition-shadow"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <p className="pt-3 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-semibold text-violet-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>

            <div className="mt-2 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Sign in with your university email address.
              </span>
            </div>
      </AuthRightPanel>
    </div>
  );
}
