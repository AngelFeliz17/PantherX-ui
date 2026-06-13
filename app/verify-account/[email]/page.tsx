"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import React from "react";

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
import { generateCode, verifyAccount } from "@/lib/api/auth";
import { VerifyCodeData } from "@/lib/dto/auth.dto";

interface PageProps {
  params: Promise<{ email: string }>;
}

export default function VerifyEmailPage({ params }: PageProps) {
  const router = useRouter()
  const inputsRef = useRef<HTMLInputElement[]>([]);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const unwrappedParams = React.use(params);
  const email = decodeURIComponent(unwrappedParams.email);
  
  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    const code = inputsRef.current.map((input) => input?.value || "").join("");

    try{
      const response = await verifyAccount({ code, email } as VerifyCodeData);
      router.push('/home');
      localStorage.setItem("access_token", response.access_token);
    } catch(error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      e.preventDefault();
      pastedData.split("").forEach((digit, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = digit;
        }
      });
      inputsRef.current[5]?.focus();
    }
  }

  const handleBackSpace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number ) => {
    const value = e.currentTarget.value.replace(/\D/g, "");

    if (value.length > 1) {
      value.split("").slice(0, 6).forEach((digit, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = digit;
        }
      });

      inputsRef.current[Math.min(value.length - 1, 5)]?.focus();
      return;
    }

    e.currentTarget.value = value;

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }
  
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700 p-4">
        <div className="mx-auto grid w-full max-w-sm md:max-w-md gap-4 px-4">
        <Card className="overflow-hidden">
          <CardHeader className="bg-purple-700 text-white flex flex-col items-center gap-4 py-6 md:py-10 -mx-6 -mt-6 p-6">
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

          <CardContent className="space-y-6 md:space-y-8 p-6 md:p-8">
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

            <form id="form-verify-id" onSubmit={handleVerifyCode}>
              <div className="flex justify-between gap-2">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      ref={(el: any) => {
                        inputsRef.current[index] = el;
                      }}
                      type="tel"
                      placeholder="•"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      name={`code-${index}`}
                      onPaste={handlePaste}
                      onInput={(e: any) => {
                        handleInput(e, index);
                      }}
                      onKeyDown={(e) => handleBackSpace(e, index)}
                      maxLength={1}
                      className="w-full aspect-square rounded-lg border text-center text-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  ))}
                </div>
            </form>

              <p className="text-center text-sm text-muted-foreground">
                Or paste the 6-digit code
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 m-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button form="form-verify-id" type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-full text-white font-bold text-lg">
              { isLoading ? "Verifying" : "Verify Email" }
            </Button>

            <div className="space-y-3 text-center">
              <p className="text-muted-foreground">
                Didn't receive the code or is expired?
              </p>

              <button
                type="button"
                className="font-semibold text-purple-600 hover:underline"
                onClick={() => {
                  setIsLoading(true);
                  generateCode(email).then(() => {
                    setIsLoading(false);
                  }).catch(() => {
                    setIsLoading(false);
                    setError("Failed to resend code. Please try again.");
                  });
                }}
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
                  onClick={() => router.push(`/signup?email=${encodeURIComponent(email)}`)}
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
                Back to Log In
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-white/80">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}