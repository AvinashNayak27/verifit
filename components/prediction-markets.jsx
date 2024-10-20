"use client";

import React from "react";
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
import { Users, CheckIcon, XIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { NavigationBar } from "./navigation-bar";
import TinderCard from "react-tinder-card";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fingerprint } from "lucide-react";
import { contract } from "@/lib/utils";
import { clickAbi, clickAddress } from "@/lib/constants";
import { useEffect } from "react";
import { createCredential, signWithCredential } from "webauthn-p256";
import { useGrantPermissions, useSendCalls } from "wagmi/experimental";
import { parseEther, toFunctionSelector } from "viem";
import { useAccount } from "wagmi";
import { useWalletClient } from "wagmi";
import { encodeFunctionData } from "viem";
import { useCallsStatus } from "wagmi/experimental";
import { prepareEvent, getContractEvents } from "thirdweb";
import { Settings } from "lucide-react";
import { readContract } from "thirdweb";
import { useClerk } from "@clerk/nextjs";
import {
  fetchCredentials,
  fetchPermissionContexts,
  storeCredential,
  storePermissionContext,
} from "@/lib/storageUtils";

const getAllMarkets = async () => {
  const preparedEvent = prepareEvent({
    signature:
      "event MarketCreated(address indexed proposer, uint256 marketId, uint256 targetSteps)",
  });
  const events = await getContractEvents({
    contract: contract,
    fromBlock: 16797833n,
    events: [preparedEvent],
  });

  // Map events to market objects
  return events.map((event) => ({
    id: event.args.marketId,
    proposer: event.args.proposer,
    goal: `${event.args.targetSteps} steps`,
    transactionHash: event.transactionHash,
  }));
};

const getUserMarkets = async (address) => {
  const preparedEvent = prepareEvent({
    signature:
      "event MarketCreated(address indexed proposer, uint256 marketId, uint256 targetSteps)",
  });
  const events = await getContractEvents({
    contract,
    events: [preparedEvent],
    fromBlock: 16797833n,
  });

  const userMarkets = events.filter(
    (event) => event.args.proposer.toLowerCase() === address.toLowerCase()
  );
  const MarketIds = userMarkets.map((event) => event.args.marketId);
  const userMarketsData = await Promise.all(
    MarketIds.map((marketId) =>
      readContract({
        contract,
        method:
          "function getMarket(uint256 marketId) view returns ((address marketProposer, (address better, bool betAboveTarget, uint256 amount)[] predictions, uint256 targetSteps, bool resolved, bool result, uint256 totalPool, uint256 totalBetsOnTrue, uint256 totalBetsOnFalse))",
        params: [marketId],
      }).then((marketData) => ({
        ...marketData,
        marketId, // Add MarketId to each market object
      }))
    )
  );

  return userMarketsData;
};

const getUserPlacedBets = async () => {
  const preparedEvent = prepareEvent({
    signature:
      "event BetPlaced(uint256 marketId, address better, bool betAboveTarget, uint256 amount)",
  });
  const events = await getContractEvents({
    contract,
    events: [preparedEvent],
    fromBlock: 16797833n,
  });

  // Fetch additional data for each marketId
  const betsWithAdditionalData = await Promise.all(
    events.map(async (event) => {
      const marketData = await readContract({
        contract,
        method: "function getMarket(uint256 marketId) view returns ((address marketProposer, (address better, bool betAboveTarget, uint256 amount)[] predictions, uint256 targetSteps, bool resolved, bool result, uint256 totalPool, uint256 totalBetsOnTrue, uint256 totalBetsOnFalse))",
        params: [event.args.marketId],
      });

      const didUserWin = marketData.result === event.args.betAboveTarget;
      const betAmount = event.args.amount;
      const userWinAmount = didUserWin
        ? (event.args.betAboveTarget
            ? (marketData.totalPool * betAmount) / marketData.totalBetsOnTrue
            : (marketData.totalPool * betAmount) / marketData.totalBetsOnFalse)
        : 0;

      return {
        marketId: event.args.marketId,
        better: event.args.better,
        betAboveTarget: event.args.betAboveTarget,
        amount: event.args.amount,
        transactionHash: event.transactionHash,
        resolved: marketData.resolved,
        totalPool: marketData.totalPool,
        userWinAmount,
      };
    })
  );

  return betsWithAdditionalData;
};

const MarketCard = ({ market, onSwipe }) => {
  return (
    <TinderCard
      onSwipe={(dir) => onSwipe(market, dir, market.id)}
      preventSwipe={["up", "down"]}
      className="absolute w-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>
            {market?.proposer?.slice(0, 6)}...{market?.proposer?.slice(-4)}'s
            Fitness Challenge
          </CardTitle>
          <CardDescription>
            Goal: {market?.goal}{" "}
            <Dialog>
              <DialogTrigger asChild>
                <InfoIcon className="h-5 w-5 text-gray-500 cursor-pointer inline-block" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Market Information</DialogTitle>
                  <DialogDescription>
                    <Link
                      href={`https://sepolia.basescan.org/tx/${market.transactionHash}`}
                      target="_blank"
                      className="text-blue-500"
                    >
                      View on BaseScan
                    </Link>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="relative w-full h-0 pb-[56.25%] mb-4">
            <img
              src={`https://i.pravatar.cc/150?img=${market.id}`}
              alt="Fitness challenge"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
            />
          </div>
        </CardContent>
      </Card>
    </TinderCard>
  );
};

export function PredictionMarkets() {
  const [markets, setMarkets] = useState([]);
  const [userMarkets, setUserMarkets] = useState([]);

  const [permissionsContext, setPermissionsContext] = useState();
  const [credential, setCredential] = useState();
  const [callsId, setCallsId] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [defaultBet, setDefaultBet] = useState(0.01); // Initialize with 0.01 ETH

  const [submitted, setSubmitted] = useState(false);
  const { grantPermissionsAsync } = useGrantPermissions();
  const { data: walletClient } = useWalletClient({ chainId: 84532 });
  const { sendCallsAsync } = useSendCalls();
  const { data: callsStatus } = useCallsStatus({
    id: callsId,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data.state.data?.status === "PENDING" ? 500 : false,
    },
  });

  const [userPlacedBets, setUserPlacedBets] = useState([]);
  const [proof, setProof] = useState();
  const { signOut } = useClerk();

  const [hideResolved, setHideResolved] = useState(false); // New state for hiding resolved markets

  // Fetch stored credentials and permission contexts on mount
  useEffect(() => {
    const loadStoredData = async () => {
      const storedCredentials = await fetchCredentials();
      if (storedCredentials.length > 0) {
        setCredential(storedCredentials[0]); // Use the first stored credential
      }

      const storedContexts = await fetchPermissionContexts();
      if (storedContexts.length > 0) {
        setPermissionsContext(storedContexts[0]); // Use the first stored context
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const fetchMarkets = async () => {
      const markets = await getAllMarkets();
      setMarkets(markets);
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    const fetchUserPlacedBets = async () => {
      const bets = await getUserPlacedBets();
      console.log(bets);
      const currentUser = account.address;
      const userBets = bets.filter(
        (bet) => bet.better.toLowerCase() === currentUser.toLowerCase()
      );
      setUserPlacedBets(userBets);
    };
    fetchUserPlacedBets();
  }, []);

  useEffect(() => {
    const fetchUserMarkets = async () => {
      const userMarkets = await getUserMarkets(account.address);
      setUserMarkets(userMarkets);
      console.log(userMarkets);
    };
    fetchUserMarkets();
  }, []);

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

  useEffect(() => {
    if (callsStatus && callsStatus.status === "CONFIRMED") {
      alert("Tx confirmed!");
    }
  }, [callsStatus]);

  // Add state for minSteps
  const [minSteps, setMinSteps] = useState("");
  const account = useAccount();

  async function grantPermissions() {
    if (account.address) {
      const newCredential = await createCredential({ type: "cryptoKey" });
      await storeCredential(newCredential); // Store the new credential

      const response = await grantPermissionsAsync({
        permissions: [
          {
            address: account.address,
            chainId: 84532,
            expiry: 17218875770,
            signer: {
              type: "key",
              data: {
                type: "secp256r1",
                publicKey: newCredential.publicKey,
              },
            },
            permissions: [
              {
                type: "native-token-recurring-allowance",
                data: {
                  allowance: parseEther("0.1"),
                  start: Math.floor(Date.now() / 1000),
                  period: 86400,
                },
              },
              {
                type: "allowed-contract-selector",
                data: {
                  contract: clickAddress,
                  selector: toFunctionSelector(
                    "permissionedCall(bytes calldata call)"
                  ),
                },
              },
            ],
          },
        ],
      });

      const context = response[0].context;
      await storePermissionContext(context); // Store the permission context
      setPermissionsContext(context);
      setCredential(newCredential);
    }
  }

  const createMarket = async () => {
    if (account.address && permissionsContext && credential && walletClient) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: clickAddress,
              data: encodeFunctionData({
                abi: clickAbi,
                functionName: "createMarket",
                args: [minSteps],
              }),
            },
          ],
          capabilities: {
            permissions: {
              context: permissionsContext,
            },
            paymasterService: {},
          },
          signatureOverride: signWithCredential(credential),
        });
        setCallsId(callsId);
      } catch (e) {
        console.error(e);
      }
      setSubmitted(false);
    }
  };

  const placeBet = async (marketId, decision) => {
    console.log("Market ID:", marketId);
    console.log("Decision:", decision);

    if (account.address && permissionsContext && credential && walletClient) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: clickAddress,
              value: 1000000000000000,
              data: encodeFunctionData({
                abi: clickAbi,
                functionName: "placeBet",
                args: [marketId, decision],
              }),
            },
          ],
          capabilities: {
            permissions: {
              context: permissionsContext,
            },
            paymasterService: {},
          },
          signatureOverride: signWithCredential(credential),
        });
        setCallsId(callsId);
      } catch (e) {
        console.error(e);
      }
      setSubmitted(false);
    }
  };

  const resolveMarket = async (marketId) => {
    if (account.address && permissionsContext && credential && walletClient) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: clickAddress,
              data: encodeFunctionData({
                abi: clickAbi,
                functionName: "resolveMarket",
                args: [marketId, proof],
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

  const handleSwipe = async (swipedMarket, direction, marketId) => {
    const decision = direction === "right" ? true : false;
    await placeBet(marketId, decision);
    setMarkets((prevMarkets) =>
      prevMarkets.filter((market) => market.id !== swipedMarket.id)
    );
  };

  // Filter markets to exclude resolved ones and those where the user has already placed a bet
  const filteredMarkets = markets.filter((market) => {
    const hasUserBet = userPlacedBets.some(
      (bet) => bet.marketId === market.id
    );
    return !market.resolved && !hasUserBet;
  });

  const filteredUserMarkets = userMarkets.filter((market) => {
    return hideResolved ? !market.resolved : true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4">
        <Link
          href="/challenges"
          className="inline-flex items-center mb-4 text-neutral-900 hover:text-primary-dark dark:text-neutral-50"
        >
          <span className="text-2xl mr-2">←</span> Back to Quests
        </Link>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-2">Public Prediction Markets</h1>
          <Dialog>
            <DialogTrigger asChild>
              <InfoIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How It Works</DialogTitle>
                <DialogDescription>
                  <p className="mb-2">
                    Swipe right to bet on a challenge's success:
                  </p>
                  <p className="flex items-center mb-2">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> You
                    believe the user will achieve their goal
                  </p>
                  <p className="mb-2">Swipe left to bet against a challenge:</p>
                  <p className="flex items-center">
                    <XIcon className="h-5 w-5 text-red-500 mr-2" /> You think
                    the user won't complete their goal
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="open">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="open">Open Markets</TabsTrigger>
            <TabsTrigger value="create-market">Create Market</TabsTrigger>
            <TabsTrigger value="my-bets">My Bets</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            {filteredMarkets.length === 0 ? (
              <div className="text-center py-8 h-[38vh] flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-lg">No markets available</p>
              </div>
            ) : (
              <div className="relative h-[38vh] w-full">
                {filteredMarkets.map((market, index) => (
                  <div
                    key={market.id}
                    className="absolute w-full"
                    style={{ zIndex: filteredMarkets.length - index }}
                  >
                    <MarketCard market={market} onSwipe={handleSwipe} />
                  </div>
                ))}
              </div>
            )}

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Enable Session Keys</CardTitle>
                <CardDescription>
                  Improve your experience with seamless transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className={`w-full ${
                    permissionsContext && credential ? "bg-green-500" : ""
                  }`}
                  onClick={grantPermissions}
                  disabled={submitted}
                >
                  <Fingerprint className="mr-2 h-4 w-4" />
                  {permissionsContext && credential
                    ? "Session Keys Enabled"
                    : "Enable Session Keys"}
                </Button>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <InfoIcon className="mr-2 h-4 w-4" />
                      Learn More
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>About Session Keys</DialogTitle>
                      <DialogDescription>
                        <p className="mb-2">
                          Session Keys unlock experiences that keep all of the
                          unique properties of wallets (e.g., self-custody, data
                          portability) without sacrificing user experience
                          compared to web2:
                        </p>
                        <ul className="list-disc list-inside">
                          <li>
                            Sign-in and never see mention of a wallet again
                          </li>
                          <li>
                            High-frequency transactions (e.g., gaming, social)
                          </li>
                          <li>
                            Background transactions (e.g., subscriptions,
                            automated trading)
                          </li>
                        </ul>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
            <div className="flex justify-center items-center">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="default" className="mt-4 w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Default Bet Amount
                  </Button>
                </DialogTrigger>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogContent className="flex justify-center items-center">
                  <div className="py-4">
                    <Label htmlFor="defaultBet">Default Bet Amount (ETH)</Label>
                    <Input
                      id="defaultBet"
                      type="number"
                      value={defaultBet}
                      onChange={(e) => setDefaultBet(Number(e.target.value))}
                      placeholder="0.01 ETH" // Update placeholder
                      className="mt-1"
                    />
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setShowSettings(false); // Close dialog after saving
                    }}
                  >
                    Save
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          <TabsContent value="my-bets" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Markets</CardTitle>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hideResolved"
                      checked={hideResolved}
                      onChange={() => setHideResolved(!hideResolved)}
                      className="mr-2"
                    />
                    <Label htmlFor="hideResolved">Hide Resolved</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUserMarkets.length > 0 ? (
                  filteredUserMarkets.map((market, index) => (
                    <Card
                      key={index}
                      className={`mb-4 border shadow-sm rounded-lg ${
                        market.resolved
                          ? market.result
                            ? "border-green-500"
                            : "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      <CardContent className="p-4">
                        <p>Market ID: {market.marketId.toString()}</p>
                        <p className="text-sm text-gray-600">
                          Target Steps:{" "}
                          <span className="font-bold">
                            {market.targetSteps.toString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Resolved:{" "}
                          <span className="font-bold">
                            {market.resolved ? "Yes" : "No"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Result:{" "}
                          <span className="font-bold">
                            {market.resolved
                              ? market.result
                                ? "Success"
                                : "Failure"
                              : "In progress"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Pool:{" "}
                          <span className="font-bold">
                            {Number(market.totalPool.toString()) / 1e18} ETH
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Bets on True:{" "}
                          <span className="font-bold">
                            {Number(market.totalBetsOnTrue.toString()) / 1e18}{" "}
                            ETH
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Bets on False:{" "}
                          <span className="font-bold">
                            {Number(market.totalBetsOnFalse.toString()) / 1e18}{" "}
                            ETH
                          </span>
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() =>
                            resolveMarket(market.marketId.toString())
                          }
                          disabled={market.resolved}
                        >
                          Resolve Market
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p>You have no active markets at the moment.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Bets</CardTitle>
              </CardHeader>
              <CardContent>
                {userPlacedBets
                  .sort((a, b) => b.marketId.toString() - a.marketId.toString()) // Sort by marketId in descending order
                  .map((bet) => (
                    <Card
                      key={bet.marketId}
                      className={`mb-4 border shadow-sm rounded-lg ${
                        bet.resolved
                          ? bet.userWinAmount > 0
                            ? "border-green-500"
                            : "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      <CardContent className="p-4">
                        <p className="text-lg font-semibold">
                          Market ID: {bet.marketId.toString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Bet:{" "}
                          <span
                            className={`font-bold ${
                              bet.betAboveTarget
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {bet.betAboveTarget ? "Above Target" : "Below Target"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Amount:{" "}
                          <span className="font-bold">
                            {Number(bet.amount.toString()) / 1e18} ETH
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Winning:{" "}
                          <span
                            className={`font-bold ${
                              bet.resolved
                                ? bet.userWinAmount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                                : "text-gray-600"
                            }`}
                          >
                            {bet.resolved
                              ? bet.userWinAmount > 0
                                ? `+${Number(bet.userWinAmount.toString()) / 1e18} ETH`
                                : `-${Number(bet.amount.toString()) / 1e18} ETH`
                              : "Pending"}
                          </span>
                        </p>
                        <Link
                          href={`https://sepolia.basescan.org/tx/${bet.transactionHash}`}
                          target="_blank"
                          className="text-blue-500 hover:underline mt-2 block"
                        >
                          View Transaction
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create-market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Market</CardTitle>
                <CardDescription>
                  Set up a public prediction market for your fitness goal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minSteps">Fitness Goal</Label>
                    <Input
                      id="minSteps"
                      placeholder="e.g., 10000 steps"
                      value={minSteps}
                      onChange={(e) => setMinSteps(e.target.value)} // Capture input
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="datetime-local" />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={createMarket}>
                  <Users className="mr-2 h-4 w-4" />
                  {callsStatus && callsStatus.status === "PENDING"
                    ? "Creating Market..."
                    : "Create Market"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <NavigationBar />
    </div>
  );
}
