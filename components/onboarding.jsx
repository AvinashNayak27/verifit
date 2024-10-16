"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { useEffect } from "react";

export function Onboarding() {
  const router = useRouter();
  const account = useAccount();
  const { connectors, connect } = useConnect();

  const login = async () => {
    connect({ connector: connectors[0] });
  };

  useEffect(() => {
    if (account?.address) {
      router.push("/profile-setup");
    }
  }, [account?.address, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to FitChain
          </CardTitle>
          <CardDescription className="text-center">
            Connect your Coinbase Smart Wallet to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={login}>
            <Fingerprint className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
