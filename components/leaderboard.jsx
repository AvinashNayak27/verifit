"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"

const LeaderboardEntry = ({
  rank,
  name,
  steps,
  avatar
}) => (
  <div className="flex items-center space-x-4 py-2">
    <div className="w-8 text-center font-bold">{rank}</div>
    <Avatar>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{steps.toLocaleString()} steps</p>
    </div>
    {rank <= 3 && (
      <Award
        className={`h-6 w-6 ${rank === 1 ? "'text-yellow-500'" : rank === 2 ? "'text-gray-400'" : "'text-amber-600'"}`} />
    )}
  </div>
)

export function LeaderboardComponent() {
  const router = useRouter()
  const leaderboardData = [
    { name: "Alice Johnson", steps: 15234, avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Bob Smith", steps: 14567, avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Charlie Brown", steps: 13890, avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "David Lee", steps: 12456, avatar: "https://i.pravatar.cc/150?img=4" },
    { name: "Eva Martinez", steps: 11789, avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Frank Wilson", steps: 10987, avatar: "https://i.pravatar.cc/150?img=6" },
    { name: "Grace Taylor", steps: 10234, avatar: "https://i.pravatar.cc/150?img=7" },
    { name: "Henry Davis", steps: 9876, avatar: "https://i.pravatar.cc/150?img=8" },
    { name: "Ivy Chen", steps: 9543, avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "Jack Robinson", steps: 9210, avatar: "https://i.pravatar.cc/150?img=10" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <Tabs defaultValue="global">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle>Global Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboardData.map((user, index) => (
                    <LeaderboardEntry
                      key={index}
                      rank={index + 1}
                      name={user.name}
                      steps={user.steps}
                      avatar={user.avatar} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>Friends Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboardData.slice(0, 5).map((user, index) => (
                    <LeaderboardEntry
                      key={index}
                      rank={index + 1}
                      name={user.name}
                      steps={user.steps}
                      avatar={user.avatar} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <NavigationBar />
    </div>
  );
}
