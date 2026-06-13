"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signUp } from "@/lib/api/auth"

export default function SignUp() {
  const searchParams = useSearchParams();
  const [prefilledEmail, setPrefilledEmail] = useState("");

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setPrefilledEmail(decodeURIComponent(emailFromParams));
    }
  }, [searchParams]);

  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const classnames = {
    input: "bg-gray-300 border-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-0 p-5 rounded-md"
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string
    const name = formData.get("name") as string;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await signUp({ email, password, name });
      
      router.push(`/verify-account/${encodeURIComponent(result.email)}`);
    } catch(error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700">
    <div className="mx-auto grid w-full max-w-sm md:max-w-md gap-4 px-4">
      <Card className={"[--card-spacing:--spacing(5)]"}>
        <CardHeader className="bg-purple-700 text-white rounded-t-xl mb-6 flex flex-col items-center justify-center space-y-0 -mx-6 -mt-6 p-6">

          <div className="flex items-center justify-center bg-white rounded-md w-15 h-15">
            <span className="text-3xl font-bold text-purple-700">
                P
            </span>
          </div>
          <CardTitle className="text-white text-2xl font-bold text-center">
            Join PantherX
            </CardTitle>
          <CardDescription className="text-white text-center">
            Create your account to start buying and selling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fname-spacing" className="font-bold">Full Name</Label>
                <Input
                  className={classnames.input}
                  id="fname-spacing"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email-spacing" className="font-bold">Email</Label>
                <Input
                    className={classnames.input}
                    id="email-spacing"
                    value={prefilledEmail}
                    onChange={(e) => setPrefilledEmail(e.currentTarget.value)}
                    name="email"
                    type="email"
                  placeholder={"you@" + process.env.NEXT_PUBLIC_EMAIL_DOMAIN}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-spacing" className="font-bold">Password</Label>
                </div>
                <Input className={classnames.input} id="password-spacing" name="password" placeholder="••••••••" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm-password-spacing" className="font-bold">Confirm Password</Label>
                </div>
                <Input className={classnames.input} id="confirm-password-spacing" name="confirm-password" placeholder="••••••••" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {error && <p className="first-letter:uppercase text-red-500 text-sm">{error}</p>}
          <Button disabled={isLoading} form="signup-form" type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-800 py-6 rounded-full">
            <span className="text-white font-bold text-lg"> { isLoading ? 'Creating Account...' : 'Create Account'}</span>
          </Button>
        </CardFooter>
      </Card>
    <div className="flex flex-col items-center justify-center">
    <p className="text-center text-white/80 text-sm">
          UNI students only. You must have a valid university email to join.
        </p>
      </div>
    </div>
    </div>
  )
}