"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"

interface User {
  id: string
  name: string
  email: string
  plan: string
  planStartDate: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("popcorntvAuth")

    if (!authStatus || authStatus !== "true") {
      router.push("/auth/signin")
      return
    }

    // Get user data
    const userData = localStorage.getItem("popcorntvUser")

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setSelectedPlan(parsedUser.plan)
    }
  }, [router])

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)

    // Update user in local storage
    if (user) {
      const updatedUser = {
        ...user,
        plan: value,
        planStartDate: new Date().toISOString(),
      }

      localStorage.setItem("popcorntvUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("popcorntvAuth")
    router.push("/")
  }

  if (!user) {
    return null
  }

  // Calculate trial end date for premium users
  const trialEndDate =
    user.plan === "premium"
      ? new Date(new Date(user.planStartDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      : null

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Link href="/browse">
              <Logo className="mr-8" />
            </Link>
            <MainNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <div className="space-y-8">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-gray-400">Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Name</Label>
                    <div className="font-medium">{user.name}</div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400">Member Since</Label>
                  <div className="font-medium">{new Date(user.planStartDate).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription className="text-gray-400">Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedPlan} onValueChange={handlePlanChange} className="space-y-3">
                  <div className="flex items-center space-x-2 border border-gray-700 p-3 rounded-md">
                    <RadioGroupItem value="freemium" id="profile-freemium" />
                    <Label htmlFor="profile-freemium" className="flex-1 cursor-pointer">
                      <div className="font-medium">Freemium</div>
                      <div className="text-sm text-gray-400">Limited content with ads</div>
                    </Label>
                    <div className="text-gray-400">Free</div>
                  </div>

                  <div className="flex items-center space-x-2 border border-gray-700 p-3 rounded-md">
                    <RadioGroupItem value="premium" id="profile-premium" />
                    <Label htmlFor="profile-premium" className="flex-1 cursor-pointer">
                      <div className="font-medium">Premium</div>
                      <div className="text-sm text-gray-400">Unlimited content, no ads</div>
                    </Label>
                    <div className="text-gray-400">₹199/mo</div>
                  </div>
                </RadioGroup>

                {user.plan === "premium" && (
                  <div className="bg-gray-800 p-4 rounded-md">
                    <p className="text-sm">
                      {new Date(user.planStartDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
                        <>
                          You are currently in your 30-day free trial. Your first payment of ₹199 will be charged on{" "}
                          {trialEndDate}.
                        </>
                      ) : (
                        <>
                          Your Premium subscription is active. Your next billing date is{" "}
                          {new Date(
                            new Date(user.planStartDate).getTime() + 30 * 24 * 60 * 60 * 1000,
                          ).toLocaleDateString()}
                          .
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

