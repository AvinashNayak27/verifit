"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import * as Clerk from "@clerk/elements/common";
import { Icons } from "@/components/ui/icons";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/clerk-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Fingerprint } from "lucide-react";
import { truncateAddress } from "@/lib/utils"; // Assume this utility function exists
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useWriteContracts } from "wagmi/experimental";
import { USER_REGISTRY_ABI, USER_REGISTRY_ADDRESS } from "@/lib/constants";
import { getCallsStatus } from "@wagmi/core/experimental";
import { config } from "@/lib/wagmi";
import { useReadContract } from "wagmi";

async function hashPassword(password) {
  const salt = "verifit";
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // Convert the hash buffer to a hexadecimal string
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Pad the hexadecimal string to ensure it's 64 characters (32 bytes)
  const bytes32Hash = "0x" + hashHex.padStart(64, "0");
  return bytes32Hash;
}

export function ProfileSetupComponent() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractsAsync } = useWriteContracts();

  const { data: userData, error: userError } = useReadContract({
    functionName: "getUser",
    address: USER_REGISTRY_ADDRESS,
    args: [account.address],
    abi: USER_REGISTRY_ABI,
  });

  useEffect(() => {
    if (userData && isSignedIn) {
      router.push("/dashboard");
    }
  }, [userData, user, isSignedIn]);

  const login = async () => {
    connect({ connector: connectors[0] });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDisconnect = () => {
    disconnect();
    setIsDialogOpen(false);
  };


  const [minSteps, setMinSteps] = useState(10000);
  const [completedSteps, setCompletedSteps] = useState(0);

  const updateCompletedSteps = () => {
    let steps = 0;
    if (account?.address) steps++;
    if (isSignedIn) steps++;
    if (minSteps !== 10000) steps++;
    setCompletedSteps(steps);
  };

  useEffect(() => {
    updateCompletedSteps();
  }, [account?.address, isSignedIn, minSteps]);

  const handleSaveProfile = async () => {
    const email = user.primaryEmailAddress;
    const gmailHash = await hashPassword(email);
    const id = await writeContractsAsync({
      contracts: [
        {
          address: USER_REGISTRY_ADDRESS,
          abi: USER_REGISTRY_ABI,
          functionName: "registerUser",
          args: [account.address, gmailHash, minSteps],
        },
      ],
      capabilities: {
        paymasterService: {
          url: "https://api.developer.coinbase.com/rpc/v1/base-sepolia/M7i_mAeIwcxH0ybHelrnX3iQHXuQPT2C",
        },
      },
    });

    let status = await getCallsStatus(config, {
      id: id,
    });
    console.log(status);
    while (status?.status !== "CONFIRMED") {
      console.log("Waiting for transaction to be confirmed...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await getCallsStatus(config, {
        id: id,
      });
    }

    // Push to dashboard after confirmation
    router.push("/dashboard");
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background sm:p-6 md:p-8">
      <div className="w-4 bg-muted rounded-full mr-4 hidden md:block">
        <div
          className="bg-primary rounded-full transition-all duration-500 ease-in-out"
          style={{ height: `${(completedSteps / 3) * 100}%` }}
        ></div>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Verift.club 
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!account?.address ? (
            <>
              <CardDescription className=" text-center text-xs">
                Connect your Coinbase Smart Wallet to get started
              </CardDescription>
              <Button className="w-full" size="lg" onClick={login}>
                <Fingerprint className="mr-2 h-4 w-4 animate-pulse" />
                Connect Coinbase Smart Wallet
              </Button>
            </>
          ) : (
            <>
              <p className="text-center font-semibold">
                Wallet connected successfully!
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" type="button">
                    {truncateAddress(account.address)}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Disconnect Wallet
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to disconnect your wallet?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          <>
            {!isSignedIn ? (
              <CardDescription className="text-center">
                Now, connect your Google Fit account
              </CardDescription>
            ) : (
              <p className="text-center font-semibold">
                Google Fit account connected successfully!
              </p>
            )}
            <SignedOut>
                <SignIn.Root>
                  <Clerk.Loading>
                    {(isGlobalLoading) => (
                      <SignIn.Step name="start">
                        <Clerk.Connection name="google" asChild>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            type="button"
                            disabled={isGlobalLoading}
                          >
                            <Clerk.Loading scope="provider:google">
                              {(isLoading) =>
                                isLoading ? (
                                  <Icons.spinner className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Icons.google className="mr-2 h-4 w-4" />
                                    Connect Google Fit
                                  </>
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </Clerk.Connection>
                      </SignIn.Step>
                    )}
                  </Clerk.Loading>
                </SignIn.Root>
                {/* <SignUp.Root>
                  <Clerk.Loading>
                    {(isGlobalLoading) => (
                      <SignUp.Step name="start">
                        <Clerk.Connection name="google" asChild>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            type="button"
                            disabled={isGlobalLoading}
                          >
                            <Clerk.Loading scope="provider:google">
                              {(isLoading) =>
                                isLoading ? (
                                  <Icons.spinner className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Icons.google className="mr-2 h-4 w-4" />
                                    Connect Google Fit
                                  </>
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </Clerk.Connection>
                      </SignUp.Step>
                    )}
                  </Clerk.Loading>
                </SignUp.Root> */}
            </SignedOut>
            <SignedIn>
              <div className="text-center space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" type="button">
                      Google Fit Connected
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        Google Fit Account
                      </DialogTitle>
                      <DialogDescription>
                        Your Google Fit account is currently connected. Would
                        you like to disconnect it?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <SignOutButton>
                        <Button
                          variant="destructive"
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Disconnect
                        </Button>
                      </SignOutButton>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </SignedIn>

            <div className="space-y-4">
              <CardDescription className="text-center">
                Set your minimum daily step goal
              </CardDescription>
              <Slider
                min={0}
                max={20000}
                step={100}
                value={[minSteps]}
                onValueChange={(value) => setMinSteps(value[0])}
              />
              <p className="text-center font-semibold">
                Minimum Steps: {minSteps}
              </p>
            </div>
            <Button className="w-full" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </>
        </CardContent>
      </Card>
    </div>
  );
}
