"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { generateCode, verifyAccount } from "@/lib/api/auth";
import { VerifyCodeData } from "@/lib/dto/auth.dto";
import AuthLeftPanel from "@/components/ui/authentication.left.design";
import AuthRightPanel from "@/components/ui/authentication.right.design";

interface PageProps {
  params: Promise<{ email: string }>;
}

export default function VerifyEmailPage({ params }: PageProps) {
  const router = useRouter();
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const unwrappedParams = React.use(params);
  const email = decodeURIComponent(unwrappedParams.email);

  const clearInputs = () => {
    inputsRef.current.forEach((input) => {
      if (input) input.value = "";
    });
    inputsRef.current[0]?.focus();
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const code = inputsRef.current.map((input) => input?.value || "").join("");

    try {
      const response = await verifyAccount({ code, email } as VerifyCodeData);
      localStorage.setItem("access_token", response.access_token);
      router.push("/home");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsLoading(true);
    setError("");
    clearInputs();

    generateCode(email)
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setError("Failed to resend code. Please try again.");
      });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      e.preventDefault();
      pastedData.split("").forEach((digit, i) => {
        if (inputsRef.current[i]) inputsRef.current[i].value = digit;
      });
      inputsRef.current[5]?.focus();
    }
  };

  const handleBackSpace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleInput = (
    e: React.FormEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.currentTarget.value.replace(/\D/g, "");

    if (value.length > 1) {
      value
        .split("")
        .slice(0, 6)
        .forEach((digit, i) => {
          if (inputsRef.current[i]) inputsRef.current[i].value = digit;
        });
      inputsRef.current[Math.min(value.length - 1, 5)]?.focus();
      return;
    }

    e.currentTarget.value = value;
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-background">
      {/* LEFT SIDE */}
      <AuthLeftPanel />

      {/* RIGHT SIDE */}
       <AuthRightPanel subtitle="Verify account">
        {/* FORM */}
            <div className="rounded-3xl border bg-white p-6 shadow-sm lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                  <Mail className="h-8 w-8 text-violet-600" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-3xl font-bold lg:text-4xl">Verify Your Email</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              <div className="mt-8 rounded-2xl bg-violet-50 p-5 text-center">
                <p className="text-sm text-muted-foreground">Verification code sent to</p>
                <p className="mt-2 font-semibold break-all">{email}</p>
              </div>

              <form id="form-verify-id" onSubmit={handleVerifyCode} className="mt-8 space-y-6">
                <div>
                  <Label>Verification Code</Label>

                  <div className="mt-3 flex justify-between gap-2">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        ref={(el: any) => (inputsRef.current[index] = el)}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="•"
                        maxLength={1}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        onPaste={handlePaste}
                        onInput={(e: any) => handleInput(e, index)}
                        onKeyDown={(e) => handleBackSpace(e, index)}
                        className="
                          flex-1
                          min-w-0
                          max-w-[52px]
                          h-14
                          rounded-xl
                          border
                          text-center
                          text-2xl
                          focus:border-violet-600
                          focus:ring-2
                          focus:ring-violet-600/20
                          focus:outline-none
                        "
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Or paste the 6-digit code
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700 first-letter:uppercase">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  form="form-verify-id"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700 font-bold text-lg text-white hover:shadow-lg transition-shadow"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>

                <div className="space-y-5 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                    <button
                      type="button"
                      className="mt-2 font-semibold text-violet-600 hover:underline"
                      onClick={handleResend}
                    >
                      Resend Code
                    </button>
                  </div>

                  <div className="border-t pt-5">
                    <p className="text-sm text-muted-foreground">
                      Wrong email address?{" "}
                      <button
                        type="button"
                        className="font-semibold text-violet-600 hover:underline"
                        onClick={() =>
                          router.push(`/signup?email=${encodeURIComponent(email)}`)
                        }
                      >
                        Change email
                      </button>
                    </p>
                  </div>

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