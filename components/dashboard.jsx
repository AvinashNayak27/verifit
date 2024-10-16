"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation";
import { NavigationBar } from "@/components/navigation-bar"
import { useState } from "react"
import { UserIcon, Settings, Gift } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DashboardComponent() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4 relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 p-4 rounded-full"
        >
          <UserIcon className="w-6 h-6" />
        </button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Personal Details</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <button onClick={() => router.push('/rewards')} className="text-blue-600 hover:underline">
                View Rewards
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <h1 className="text-2xl font-bold">Welcome, User!</h1>
        <Card>
          <CardHeader>
            <CardTitle>Daily Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">7,532 / 10,000</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between">
              {[60, 80, 40, 75, 90, 50, 70].map((value, index) => (
                <div
                  key={index}
                  className="w-8 bg-neutral-900 dark:bg-neutral-50"
                  style={{ height: `${value}%` }}></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rank: #42</div>
            <p className="text-neutral-500 dark:text-neutral-400">Keep it up! You're in the top 10%</p>
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
}
