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

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get user from local storage
    const storedUser = localStorage.getItem("popcorntvUser")

    if (storedUser) {
      const user = JSON.parse(storedUser)

      // Check credentials
      if (user.email === formData.email && user.password === formData.password) {
        // Set auth status
        localStorage.setItem("popcorntvAuth", "true")

        // Redirect to home
        router.push("/browse")
      } else {
        alert("Invalid email or password")
      }
    } else {
      alert("No account found. Please sign up.")
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Logo className="mb-6" />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 text-white border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription className="text-gray-400">Welcome back to PopcornTV</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400 text-center w-full">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-white underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

