"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { logIn } from "@/lib/api/auth";
import { classnames } from "@/styles/input.styles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Feature from "@/lib/functions/feature";

export default function LogIn() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await logIn({ email, password });
      localStorage.setItem("access_token", result.token);
      router.push("/listings");
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
          alt="University of Northern Iowa"
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
            <h1 className="text-5xl font-bold leading-tight">Buy & Sell Campus Life</h1>
            <p className="mt-5 text-lg text-white/90">
              The trusted marketplace for University of Northern Iowa students.
            </p>
          </div>
          <div className="space-y-6">
            <Feature title="Safe & Secure" description="Verified student accounts" />
            <Feature title="Fast & Easy" description="Buy and sell in minutes" />
            <Feature title="Best Value" description="Great deals from students" />
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
            <p className="mt-3 text-sm text-white/90">Buy & Sell Campus Life</p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
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

                <div className={`overflow-hidden transition-all duration-200 ${error ? "max-h-[80px] mb-2" : "max-h-0"}`}>
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700 first-letter:uppercase">{error}</p>
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
                  Don't have an account?{" "}
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
          </div>
        </div>
      </div>
    </div>
  );
}