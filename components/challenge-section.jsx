"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, Trophy, Award, Gift } from "lucide-react"
import { NavigationBar } from "./navigation-bar"

export function ChallengeSectionComponent() {
  
  return (
    (<div
      className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Card>
          <CardHeader>
            <CardTitle>30-Day Step Challenge</CardTitle>
            <CardDescription>Reach 300,000 steps in 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold">Prize Pool: 1000 FIT Tokens</p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="stake">Stake Amount (FIT Tokens)</Label>
              <Input id="stake" type="number" placeholder="Enter stake amount" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Join Challenge</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekend Warrior</CardTitle>
            <CardDescription>Get 25,000 steps this weekend</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold">Prize Pool: 500 FIT Tokens</p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="stake2">Stake Amount (FIT Tokens)</Label>
              <Input id="stake2" type="number" placeholder="Enter stake amount" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Join Challenge</Button>
          </CardFooter>
        </Card>
      </div>
      <NavigationBar />
    </div>)
  );
}