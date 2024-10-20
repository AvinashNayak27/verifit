"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Award,
  Gift,
  Home,
  Trophy,
  Wallet,
  Mail,
  User,
  Bell,
} from "lucide-react";
import { NavigationBar } from "./navigation-bar";
import { SignOutButton } from "@clerk/nextjs";
import { useAccount } from "wagmi";

export function Settings() {
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const account = useAccount();

  const copyAddressToClipboard = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
        .then(() => {
          console.log('Address copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy address: ', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected accounts and integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Coinbase Smart Wallet</span>
              </div>
              <Switch
                checked={isWalletConnected}
                onCheckedChange={setIsWalletConnected}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Google Account</span>
              </div>
              <Switch
                checked={isGoogleConnected}
                onCheckedChange={setIsGoogleConnected}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span>Account Address</span>
                <Button onClick={copyAddressToClipboard}>Copy Address</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
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

        <SignOutButton>
          <Button variant="destructive" className="w-full">
            Logout
          </Button>
        </SignOutButton>
      </div>
      <NavigationBar />
    </div>
  );
}
