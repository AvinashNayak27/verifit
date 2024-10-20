"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Gift, Home, Trophy, LockIcon, Users } from "lucide-react"
import Link from "next/link"
import { NavigationBar } from "./navigation-bar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FitnessQuests() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Fitness Quests</h1>

        <Card>
          <CardHeader>
            <CardTitle>Private Accountability Bets</CardTitle>
            <CardDescription>Set personal goals and stake tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/private-bets">
              <Button className="w-full flex items-center justify-center">
                <LockIcon className="mr-2 h-4 w-4" />
                Create Private Bet
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Prediction Markets</CardTitle>
            <CardDescription>Participate in community-driven fitness bets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/prediction-markets">
              <Button className="w-full flex items-center justify-center">
                <Users className="mr-2 h-4 w-4" />
                View Prediction Markets
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group Challenges</CardTitle>
            <CardDescription>Compete with others and earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button className="w-full" disabled>
                      <Trophy className="mr-2 h-4 w-4" />
                      View Group Challenges
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolve Personal Bets</CardTitle>
            <CardDescription>View and resolve your personal accountability bets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/resolve-bets">
              <Button className="w-full flex items-center justify-center">
                <Award className="mr-2 h-4 w-4" />
                Resolve Bets
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>

      <NavigationBar />
    </div>
  )
}
