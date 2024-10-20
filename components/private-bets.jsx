"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Gift, Home, Trophy, LockIcon } from "lucide-react";
import Link from "next/link";
import { NavigationBar } from "./navigation-bar";
import { useAccount, useConnect, useWalletClient } from "wagmi";
import { useState, useEffect } from "react";
import { useCallsStatus, useSendCalls } from "wagmi/experimental";
import {
  PERSONAL_ACCOUNTABILTY_ABI,
  PERSONAL_ACCOUNTABILTY_ADDRESS,
} from "@/lib/constants";
import { encodeFunctionData } from "viem";


export function PrivateBets() {
  const [goalType, setGoalType] = useState("steps");
  const [goalValue, setGoalValue] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const account = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: 84532 });

  const [submitted, setSubmitted] = useState(false);
  const [callsId, setCallsId] = useState();
  const { data: callsStatus } = useCallsStatus({
    id: callsId,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data.state.data?.status === "PENDING" ? 200 : false,
    },
  });
  const { sendCallsAsync } = useSendCalls();

  useEffect(() => {
    if (callsStatus && callsStatus.status === "CONFIRMED") {
      alert("bet created successfully!");
    }
  }, [callsStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now in Unix timestamp
    const minSteps = goalValue;
    const value = BigInt(stakeAmount * 10 ** 18);
    console.log(account.address);

    if (account.address) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: PERSONAL_ACCOUNTABILTY_ADDRESS,
              value: value,
              data: encodeFunctionData({
                abi: PERSONAL_ACCOUNTABILTY_ABI,
                functionName: "createBet",
                args: [deadline, minSteps],
              }),
            },
          ],
        });
        setCallsId(callsId);
      } catch (e) {
        console.error(e);
      }
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <Link
          href="/challenges"
          className="inline-flex items-center mb-4 text-neutral-900 hover:text-primary-dark dark:text-neutral-50"
        >
          <span className="text-2xl mr-2">←</span> Back to Quests
        </Link>
        <h1 className="text-2xl font-bold">Private Accountability Bets</h1>

        <Card>
          <CardHeader>
            <CardTitle>Set Your Fitness Goal</CardTitle>
            <CardDescription>
              Create a private bet using zero-knowledge proofs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select value={goalType} onValueChange={setGoalType}>
                  <SelectTrigger id="goal-type">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steps">Daily Steps</SelectItem>
                    <SelectItem value="distance">Distance (km)</SelectItem>
                    <SelectItem value="calories">Calories Burned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-value">Goal Value</Label>
                <Input
                  id="goal-value"
                  type="number"
                  placeholder={`Enter your ${goalType} goal`}
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stake-amount">Stake Amount (Ether)</Label>
                <Input
                  id="stake-amount"
                  type="number"
                  placeholder="0.0001 Ether"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              <LockIcon className="mr-2 h-4 w-4" />
              Create Private Bet
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>1. Set your personal fitness goal and stake FIT tokens.</p>
            <p>
              2. Submit zero-knowledge proofs to verify your progress privately.
            </p>
            <p>
              3. Meet your goal to keep your stake, or lose it gradually if you
              miss the deadline.
            </p>
            <p>
              4. Recover part of your stake over time as you improve and submit
              proofs.
            </p>
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
}
