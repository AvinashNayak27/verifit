"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { NavigationBar } from "@/components/navigation-bar";
import { useState, useEffect, useCallback } from "react";
import { UserIcon, Settings, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLongPress } from "use-long-press";
import { useUser } from "@clerk/nextjs";
import { useReadContract } from "wagmi";
import { USER_REGISTRY_ADDRESS, USER_REGISTRY_ABI } from "@/lib/constants";
import { useAccount } from "wagmi";
import { useClerk } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardComponent() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const account = useAccount();
  const {
    data: userData,
    error: userError,
    isFetching,
  } = useReadContract({
    functionName: "getUser",
    address: USER_REGISTRY_ADDRESS,
    args: [account.address],
    abi: USER_REGISTRY_ABI,
  });
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [weeklyProofs, setWeeklyProofs] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/google")
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Session token expired") {
          alert("Session token expired please re-login with Google");
          signOut();
          return;
        }
        const steps = data.proofs.map((proof) => {
          const steps = parseInt(
            proof.claimInfo.parameters.match(/intVal\\\": (\d+)/)[1]
          );
          return steps;
        });
        setWeeklySteps(steps);
        setWeeklyProofs(data.proofs);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const bind = useLongPress(
    (event, { context }) => {
      setSelectedProof(weeklyProofs[context]);
      setIsModalOpen(true);
    },
    {
      threshold: 500, // Long press duration in milliseconds
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pb-16">
      <div className="container mx-auto p-4 space-y-4 relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 p-4 rounded-full"
        >
          <UserIcon className="w-6 h-6" />
        </button>

        <Dialog 
          open={isModalOpen} 
          onOpenChange={(isOpen) => {
            setIsModalOpen(isOpen);
            if (!isOpen) {
              setSelectedProof(null); // Reset selectedProof when modal is closed
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProof ? "Proof Details" : "Personal Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedProof ? (
              <div>
                <p>
                  Date:{" "}
                  {new Date(
                    parseInt(
                      JSON.parse(selectedProof.claimInfo.parameters).body.match(
                        /"endTimeMillis":(\d+)/
                      )[1]
                    )
                  ).toLocaleString()}
                </p>
                <p>
                  Steps:{" "}
                  {
                    selectedProof.claimInfo.parameters.match(
                      /intVal\\\": (\d+)/
                    )[1]
                  }
                </p>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                  {JSON.stringify(selectedProof, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <button
                  onClick={() => router.push("/rewards")}
                  className="text-blue-600 hover:underline"
                >
                  View Rewards
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <h1 className="text-2xl font-bold">Welcome {user?.fullName}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Daily Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || isFetching ? (
              <div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold">
                  {weeklySteps[0]} / {userData?.[2].toString()}
                </div>
                <Progress
                  value={(weeklySteps[0] / userData?.[2].toString()) * 100}
                  className="mt-2"
                />
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between">
              {isLoading
                ? Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton key={index} className="w-8 h-full" />
                    ))
                : weeklySteps
                    .slice()
                    .reverse()
                    .map((value, index) => (
                      <div
                        key={index}
                        className="w-8 bg-neutral-900 dark:bg-neutral-50 cursor-pointer"
                        style={{
                          height: `${(value / userData?.[2].toString()) * 100}%`,
                        }}
                        {...bind(weeklySteps.length - 1 - index)}
                      ></div>
                    ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">Rank: #42</div>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Keep it up! You're in the top 10%
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
}
