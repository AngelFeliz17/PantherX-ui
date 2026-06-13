"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target as HTMLFormElement)
    const code = formData.get("code") as string;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-account`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, code })
      }
    )
    const data = await response.json()
    if(!data.ok) {
      setError(data.message)
      return;
    }
    router.push('/login')
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700 px-4">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden">
          <CardHeader className="bg-purple-700 text-white flex flex-col items-center gap-4 py-10 -mx-6 -mt-6 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500">
              <Mail className="h-8 w-8" />
            </div>

            <div className="text-center">
              <CardTitle className="text-4xl font-bold">
                Verify Your Email
              </CardTitle>

              <CardDescription className="mt-2 text-white/80">
                Enter the code sent to your email
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            <div className="rounded-xl bg-gray-100 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Verification code sent to
              </p>

              <p className="mt-2 font-semibold break-all">
                {email || "student@uni.edu"}
              </p>
            </div>

            <div className="space-y-3">
              <label className="font-semibold">
                Verification Code
              </label>

              <div className="flex justify-between gap-2">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      ref={(el: any) => {
                        inputsRef.current[index] = el;
                      }}
                      type="text"
                      name="code"
                      maxLength={1}
                      className="h-14 w-14 rounded-lg border text-center text-xl"
                      onChange={(e) => {
                        const value = e.target.value;

                        // only allow digits
                        if (!/^\d?$/.test(value)) {
                          e.target.value = "";
                          return;
                        }

                        // move to next input
                        if (value && index < 5) {
                          inputsRef.current[index + 1]?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // go back when pressing backspace on empty input
                        if (
                          e.key === "Backspace" &&
                          !e.currentTarget.value &&
                          index > 0
                        ) {
                          inputsRef.current[index - 1]?.focus();
                        }
                      }}
                    />
                  ))}
                </div>

              <p className="text-center text-sm text-muted-foreground">
                Or paste the 6-digit code
              </p>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Verify Email
            </Button>

            <div className="space-y-3 text-center">
              <p className="text-muted-foreground">
                Didn't receive the code?
              </p>

              <button
                type="button"
                className="font-semibold text-purple-600 hover:underline"
              >
                Resend Code
              </button>
            </div>

            <div className="border-t pt-6 text-center">
              <p className="text-muted-foreground">
                Wrong email address?{" "}
                <button
                  type="button"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Change email
                </button>
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-medium text-purple-600 hover:underline"
              >
                <ArrowLeft size={18} />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-white/80">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}