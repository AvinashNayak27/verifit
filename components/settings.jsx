"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Award, Gift, Home, Trophy, Wallet, Mail, User, Bell } from "lucide-react"
import { NavigationBar } from "./navigation-bar"

export function Settings() {
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [isGoogleConnected, setIsGoogleConnected] = useState(true)

  return (
    (<div
      className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your connected accounts and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Coinbase Smart Wallet</span>
              </div>
              <Switch checked={isWalletConnected} onCheckedChange={setIsWalletConnected} />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Google Account</span>
              </div>
              <Switch checked={isGoogleConnected} onCheckedChange={setIsGoogleConnected} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="johndoe123" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Public Profile</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Show on Leaderboards</span>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>)
  );
}