"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"

export function ProfileSetupComponent() {
  const [stepGoal, setStepGoal] = useState(10000)
  const router = useRouter()

  return (
    (<div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Set Up Your Profile</CardTitle>
          <CardDescription>Customize your FitChain experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <Button className="w-full" variant="outline">
            Connect Google Fit
          </Button>
          <div className="space-y-2">
            <Label>Daily Step Goal</Label>
            <Slider
              min={1000}
              max={20000}
              step={1000}
              value={[stepGoal]}
              onValueChange={(value) => setStepGoal(value[0])} />
            <p className="text-sm text-neutral-500 text-center dark:text-neutral-400">{stepGoal.toLocaleString()} steps</p>
          </div>
          <Button className="w-full" onClick={() => router.push("/dashboard")}>Save Profile</Button>
        </CardContent>
      </Card>
    </div>)
  );
}