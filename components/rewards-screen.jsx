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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationBar } from "@/components/navigation-bar";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import {
  SponsoredBasenameRegistrationAddress,
  SponsoredBasenameRegistrationAbi,
} from "@/lib/constants";
import { useClerk } from "@clerk/nextjs";

export function RewardsScreenComponent() {
  const [name, setName] = useState("");
  const [tokenId, setTokenId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [proofs, setProofs] = useState(null);
  const [callsId, setCallsId] = useState();
  const { signOut } = useClerk();
  const account = useAccount();
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
      console.log(callsStatus.receipts[0].logs);
      const tokenIdInHex = callsStatus.receipts[0].logs[2].topics[3];
      
      // Convert tokenId from hex to BigInt
      const tokenId = BigInt(tokenIdInHex);
      
      // Convert to string to avoid scientific notation
      setTokenId(tokenId.toString());
    }
  }, [callsStatus]);
  

  useEffect(() => {
    fetch("/api/google")
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Session token expired") {
          alert("Session token expired please re-login");
          signOut();
          return;
        }
        setProofs(data);
      })
      .catch((error) => console.error("Error fetching fitness data:", error));
  }, []);

  const handleClaim = async (name) => {
    console.log(proofs);
    console.log(name);
    if (account.address) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: SponsoredBasenameRegistrationAddress,
              data: encodeFunctionData({
                abi: SponsoredBasenameRegistrationAbi,
                functionName: "registerBasename",
                args: [name, proofs.proofs],
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

  const url = `https://www.base.org/api/basenames/${name}.base.eth/assets/cardImage.svg`
  const defaultURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwMCIgaGVpZ2h0PSIzMDAwIiB2aWV3Qm94PSIwIDAgMzAwMCAzMDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNTU2OV83MjgzNSkiPgo8cmVjdCB3aWR0aD0iMzAwMCIgaGVpZ2h0PSIzMDAwIiBmaWxsPSIjMTU1REZEIi8+CjxjaXJjbGUgY3g9IjE1MDAiIGN5PSIxNTAwIiByPSIxNTAwIiBmaWxsPSIjMTU1REZEIi8+CjxwYXRoIGQ9Ik0yNzEzLjEzIDE1MDBDMjczMS4yIDE2ODAuOTIgMjYxNS4xMyAxODE4LjE1IDI1MDcuNzggMTkyNC40MkMyMzk0LjcgMjAzMi4xMyAyMjkwLjQ0IDIxMDguODggMjIwMC44OCAyMjAwLjYxQzIxMDkuMTUgMjI5MC4xNiAyMDMyLjIyIDIzOTQuNjEgMTkyNC41MSAyNTA3LjY4QzE4MTguMTUgMjYxNS4wNCAxNjgwLjkyIDI3MzEuMTEgMTUwMCAyNzEzLjEzQzEzMTkuMDggMjczMS4yIDExODEuODUgMjYxNS4xMyAxMDc1LjU4IDI1MDcuNzhDOTY3Ljg2NiAyMzk0LjcgODkxLjEyIDIyOTAuNDQgNzk5LjM4OSAyMjAwLjg4QzcwOS44MzcgMjEwOS4xNSA2MDUuMzkgMjAzMi4yMiA0OTIuMzE1IDE5MjQuNTFDMzg0Ljk2MiAxODE4LjE1IDI2OC44OSAxNjgwLjkyIDI4Ni44NzMgMTUwMEMyNjguNzk5IDEzMTkuMDggMzg0Ljg3MSAxMTgxLjg1IDQ5Mi4yMjQgMTA3NS41OEM2MDUuMjk5IDk2Ny44NjYgNzA5LjU2NCA4OTEuMTIgNzk5LjExNiA3OTkuMzg5Qzg5MC44NDggNzA5LjgzNyA5NjcuNzc1IDYwNS4zOSAxMDc1LjQ5IDQ5Mi4zMTVDMTE4MS44NSAzODQuODcxIDEzMTkuMDggMjY4Ljc5OSAxNTAwIDI4Ni44NzNDMTY4MC45MiAyNjguNzk5IDE4MTguMTUgMzg0Ljg3MSAxOTI0LjQyIDQ5Mi4yMjRDMjAzMi4xMyA2MDUuMjk5IDIxMDguODggNzA5LjU2NCAyMjAwLjYxIDc5OS4xMTZDMjI5MC4xNiA4OTAuODQ4IDIzOTQuNjEgOTY3Ljc3NSAyNTA3LjY4IDEwNzUuNDlDMjYxNS4wNCAxMTgxLjg1IDI3MzEuMTEgMTMxOS4wOCAyNzEzLjEzIDE1MDBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTM5MS4wNiAxNTAwQzEzOTEuMDYgMTY0Ny44OSAxMzU4LjQgMTc4MS42MiAxMzA1Ljc0IDE4NzguMjhDMTI1My4wMyAxOTc1LjA1IDExODAuNjkgMjAzNCAxMTAxLjUzIDIwMzRDMTAyMi4zNiAyMDM0IDk1MC4wMzEgMTk3NS4wNSA4OTcuMzE0IDE4NzguMjhDODQ0LjY2IDE3ODEuNjIgODEyIDE2NDcuODkgODEyIDE1MDBDODEyIDEzNTIuMTEgODQ0LjY2IDEyMTguMzggODk3LjMxNCAxMTIxLjcyQzk1MC4wMzEgMTAyNC45NSAxMDIyLjM2IDk2NiAxMTAxLjUzIDk2NkMxMTgwLjY5IDk2NiAxMjUzLjAzIDEwMjQuOTUgMTMwNS43NCAxMTIxLjcyQzEzNTguNCAxMjE4LjM4IDEzOTEuMDYgMTM1Mi4xMSAxMzkxLjA2IDE1MDBaIiBmaWxsPSIjMTU1REZEIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiLz4KPGVsbGlwc2UgY3g9IjExMDIuNTciIGN5PSIxMTk0LjkzIiByeD0iMTI2LjQxNCIgcnk9IjIzMS45MzQiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMTg3LjE2IDE1MDBDMjE4Ny4xNiAxNjQ3Ljg5IDIxNTQuNSAxNzgxLjYyIDIxMDEuODQgMTg3OC4yOEMyMDQ5LjEyIDE5NzUuMDUgMTk3Ni43OSAyMDM0IDE4OTcuNjMgMjAzNEMxODE4LjQ2IDIwMzQgMTc0Ni4xMyAxOTc1LjA1IDE2OTMuNDEgMTg3OC4yOEMxNjQwLjc2IDE3ODEuNjIgMTYwOC4xIDE2NDcuODkgMTYwOC4xIDE1MDBDMTYwOC4xIDEzNTIuMTEgMTY0MC43NiAxMjE4LjM4IDE2OTMuNDEgMTEyMS43MkMxNzQ2LjEzIDEwMjQuOTUgMTgxOC40NiA5NjYgMTg5Ny42MyA5NjZDMTk3Ni43OSA5NjYgMjA0OS4xMiAxMDI0Ljk1IDIxMDEuODQgMTEyMS43MkMyMTU0LjUgMTIxOC4zOCAyMTg3LjE2IDEzNTIuMTEgMjE4Ny4xNiAxNTAwWiIgZmlsbD0iIzE1NURGRCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI2Ii8+CjxlbGxpcHNlIGN4PSIxODk2LjU4IiBjeT0iMTE5NC45MyIgcng9IjEyNi40MTQiIHJ5PSIyMzEuOTM0IiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzU1NjlfNzI4MzUiPgo8cmVjdCB3aWR0aD0iMzAwMCIgaGVpZ2h0PSIzMDAwIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo="

  const imageURL = tokenId ? url : defaultURL;

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
                <CardTitle>7 Days 1000 Steps</CardTitle>
                <CardDescription>Claim a free Basename</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={imageURL}
                  alt="NFT"
                  className="w-full rounded-lg"
                />
                {!(callsStatus && callsStatus.status == "CONFIRMED") && (
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-2 w-full p-2 border rounded"
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </CardContent>
              <CardFooter>
                {callsStatus && callsStatus.status === "CONFIRMED" ? (
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        `https://testnets.opensea.io/assets/base-sepolia/0xa0c70ec36c010b55e3c434d6c6ebeec50c705794/${tokenId}`,
                        "_blank"
                      )
                    }
                  >
                    View on OpenSea
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleClaim(name)}>
                    Claim
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <NavigationBar />
    </div>
  );
}
