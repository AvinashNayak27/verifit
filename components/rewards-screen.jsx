"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"

export function RewardsScreenComponent() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Your Rewards</h1>
        <Tabs defaultValue="nfts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="nfts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>30-Day Challenge Completion NFT</CardTitle>
                <CardDescription>Earned on July 1, 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://g-5bhtwnqj6te.vusercontent.net/placeholder.svg"
                  alt="NFT"
                  className="w-full rounded-lg" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">View on OpenSea</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>FIT Tokens</CardTitle>
                <CardDescription>Your current balance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">2,500 FIT</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Redeem for Rewards</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span>$50 Nike Gift Card</span>
              <Button>Redeem (1000 FIT)</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>1-Month Gym Membership</span>
              <Button>Redeem (2000 FIT)</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Premium Fitness Tracker</span>
              <Button>Redeem (5000 FIT)</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
}
