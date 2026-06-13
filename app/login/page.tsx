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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { logIn } from "@/lib/api/auth"
import { Eye, EyeOff } from "lucide-react"
import { classnames } from "@/styles/input.styles"

export default function LogIn() {
  const router = useRouter()
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    try {
      const result = await logIn({ email, password });
      localStorage.setItem("access_token", result.token);
      router.push(`/listings`);
    } catch(error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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
            Sign In to PantherX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleLogIn}>
            <div className="flex flex-col gap-6">

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email-spacing" className="font-bold">Email</Label>
                <Input
                    className={classnames.input}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={"you@" + process.env.NEXT_PUBLIC_EMAIL_DOMAIN}
                    required
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-spacing" className="font-bold">Password</Label>
                </div>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} className={`${classnames.input} pr-10`} id="password" name="password" placeholder="••••••••" autoComplete="new-password" required />

                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>
              </div>
            </div>
          </form>
          {error && <p className="first-letter:uppercase text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>

        {/* Button */}
        <CardFooter className="flex-col gap-2">
          <span className="text-lg text-center text-gray-500 self-end">
            <a href="/forgot-password" className="text-purple-700 font-medium no-underline">Forgot Password?</a>
          </span>
          <Button disabled={isLoading} form="signup-form" type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-800 py-6 rounded-full">
            <span className="text-white font-bold text-lg"> { isLoading ? 'Loging In...' : 'Log In'}</span>
          </Button>
          <span className="text-lg text-center text-gray-500">
            Don't have an account? <a href="/signup" className="text-purple-700 font-medium no-underline">Sign Up</a>
          </span>
        </CardFooter>
      </Card>

    <div className="flex flex-col items-center justify-center">
    <p className="text-center text-white/80 text-sm">
          UNI students only. You must have a valid university email to Log In.
        </p>
      </div>
    </div>
    </div>
  )
}