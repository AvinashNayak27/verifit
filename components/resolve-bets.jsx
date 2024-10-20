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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { NavigationBar } from "./navigation-bar";
import { prepareEvent, getContractEvents } from "thirdweb";
import { personalAccountabilityContract } from "@/lib/utils";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import { PERSONAL_ACCOUNTABILTY_ADDRESS, PERSONAL_ACCOUNTABILTY_ABI } from "@/lib/constants";
import { useClerk } from "@clerk/nextjs";

const getBetEvents = async () => {
  const preparedEvent = prepareEvent({
    signature:
      "event CreatedBetEvent(uint256 indexed betId, address indexed user, uint256 minSteps, uint256 startTimestamp, uint256 endTimestamp, uint256 stake)",
  });
  const events = await getContractEvents({
    contract: personalAccountabilityContract,
    events: [preparedEvent],
    fromBlock: 16818904n,
  });
  return events;
};

const getResolvedBets = async () => {
  const preparedEvent = prepareEvent({
    signature:
      "event ResolvedBetEvent(uint256 indexed betId, address indexed user, bool achieved)",
  });
  const events = await getContractEvents({
    contract: personalAccountabilityContract,
    events: [preparedEvent],
    fromBlock: 16818904n,
  });
  return events;
};

const BetCard = ({ bet, onResolve }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>{bet.goal}</CardTitle>
      <CardDescription>Deadline: {bet.deadline}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>
          <strong>Stake:</strong> {bet.stake} Ether
        </p>
        <p>
          <strong>Status:</strong>
          &nbsp;
          <span
            className={
              bet.status === "Achieved"
                ? "text-green-500"
                : bet.status === "Not Achieved"
                ? "text-red-500"
                : ""
            }
          >
            {bet.status}
          </span>
        </p>
      </div>
    </CardContent>
    <CardContent>
      <Button
        variant="default"
        className="w-full"
        onClick={() => onResolve(bet.id, true)}
      >
        Resolve
      </Button>
    </CardContent>
  </Card>
);

export function ResolveBets() {
  const account = useAccount();
  const [personalBets, setPersonalBets] = useState([]);
  const [resolvedBets, setResolvedBets] = useState([]);
  const [proof, setProof] = useState(null);
  const { signOut } = useClerk();

  useEffect(() => {
    getBetEvents().then((events) => {
      const userBets = events.filter(
        (event) =>
          event.args.user.toLowerCase() === account.address.toLowerCase()
      );
      const formattedBets = userBets.map((event) => ({
        id: Number(event.args.betId),
        goal: `Min Steps: ${event.args.minSteps}`,
        deadline: new Date(
          Number(event.args.endTimestamp) * 1000
        ).toLocaleString(), // Updated to include time
        stake: Number(event.args.stake) / 1e18,
        status: "In Progress", // Assuming new bets are "In Progress"
      }));
      setPersonalBets(formattedBets);
    });
  }, [account.address]);

  useEffect(() => {
    getResolvedBets().then((events) => {
      console.log(events);
      const userResolvedBets = events.filter(
        (event) =>
          event.args.user.toLowerCase() === account.address.toLowerCase()
      );
      const formattedResolvedBets = userResolvedBets.map((event) => {
        const personalBet = personalBets.find(bet => bet.id === Number(event.args.betId));
        return {
          id: Number(event.args.betId),
          achieved: event.args.achieved,
          goal: personalBet ? personalBet.goal : "Unknown Goal",
          deadline: personalBet ? personalBet.deadline : "Unknown Deadline",
          stake: personalBet ? personalBet.stake : "Unknown Stake",
        };
      });
      setResolvedBets(formattedResolvedBets);
    });
  }, [account.address, personalBets]);

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
      alert("bet resolved successfully!");
    }
  }, [callsStatus]);

  useEffect(() => {
    fetch("/api/proof")
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Session token expired") {
          alert("Session token expired please re-login");
          signOut();
          return;
        }
        setProof(data);
      })
      .catch((error) => console.error("Error fetching fitness data:", error));
  }, []);

  const handleResolveBet = async (betId) => {
    if (account.address) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: PERSONAL_ACCOUNTABILTY_ADDRESS,
              data: encodeFunctionData({
                abi: PERSONAL_ACCOUNTABILTY_ABI,
                functionName: "resolveBet",
                args: [betId, proof],
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
        <h1 className="text-2xl font-bold">Resolve Personal Bets</h1>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Bets</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Bets</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="flex flex-col space-y-4">
              {personalBets
                .filter((bet) => 
                  bet.status === "In Progress" && 
                  !resolvedBets.some(resolvedBet => resolvedBet.id === bet.id)
                )
                .map((bet) => (
                  <div key={bet.id} className="p-1">
                    <BetCard bet={bet} onResolve={handleResolveBet} />
                  </div>
                ))}
              {personalBets.filter((bet) => 
                bet.status === "In Progress" && 
                !resolvedBets.some(resolvedBet => resolvedBet.id === bet.id)
              ).length === 0 && (
                <p className="text-center text-lg font-semibold text-gray-500">
                  No active bets
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="resolved">
            <div className="space-y-4">
              {resolvedBets.map((bet) => (
                <Card key={bet.id}>
                  <CardHeader>
                    <CardTitle>{bet.goal}</CardTitle>
                    <CardDescription>
                      Deadline: {bet.deadline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Stake:</strong> {bet.stake} Ether
                    </p>
                    <p>
                      <strong>Status:</strong>
                      &nbsp;
                      <span
                        className={
                          bet.achieved
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {bet.achieved ? "Achieved" : "Not Achieved"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <NavigationBar />
    </div>
  );
}
