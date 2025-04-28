"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "freemium",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlanChange = (value: string) => {
    setFormData((prev) => ({ ...prev, plan: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      return
    }

    // Create user object
    const user = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      plan: formData.plan,
      planStartDate: new Date().toISOString(),
      watchlist: [],
    }

    // Save to local storage
    localStorage.setItem("popcorntvUser", JSON.stringify(user))
    localStorage.setItem("popcorntvAuth", "true")

    // Redirect to home
    router.push("/browse")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Logo className="mb-6" />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 text-white border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription className="text-gray-400">Sign up to start your 30-day free trial</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label>Choose your plan</Label>
                <RadioGroup value={formData.plan} onValueChange={handlePlanChange} className="space-y-3">
                  <div className="flex items-center space-x-2 border border-gray-700 p-3 rounded-md">
                    <RadioGroupItem value="freemium" id="freemium" />
                    <Label htmlFor="freemium" className="flex-1 cursor-pointer">
                      <div className="font-medium">Freemium</div>
                      <div className="text-sm text-gray-400">Limited content with ads</div>
                    </Label>
                    <div className="text-gray-400">Free</div>
                  </div>

                  <div className="flex items-center space-x-2 border border-gray-700 p-3 rounded-md">
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="flex-1 cursor-pointer">
                      <div className="font-medium">Premium</div>
                      <div className="text-sm text-gray-400">Unlimited content, no ads</div>
                    </Label>
                    <div className="text-gray-400">₹199/mo</div>
                  </div>
                </RadioGroup>

                {formData.plan === "premium" && (
                  <p className="text-sm text-gray-400">
                    Your 30-day free trial starts today. You won't be charged until the trial ends.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400 text-center w-full">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-white underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

