"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import * as Clerk from "@clerk/elements/common";
import { Icons } from "@/components/ui/icons";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from '@clerk/clerk-react'

export function ProfileSetupComponent() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser()
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === 1) {
            clearInterval(timer);
            router.push("/dashboard");
          }
          return prevCount - 1;
        });
      }, 1000);
      return () => clearInterval(timer); // Clean up the timer
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            FitChain Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignedOut>
            <SignIn.Root>
              <Clerk.Loading>
                {(isGlobalLoading) => (
                  <SignIn.Step name="start">
                    <Clerk.Connection name="google" asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        disabled={isGlobalLoading}
                      >
                        <Clerk.Loading scope="provider:google">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.google className="mr-2 size-4" />
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
          </SignedOut>
          <SignedIn>
            <div className="text-center space-y-4">
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-500 hover:bg-green-50"
                disabled
              >
                Google Fit Connected
              </Button>
              <p className="text-lg font-semibold">
                Welcome, {user?.firstName}!
              </p>
              <p className="text-sm text-neutral-500">
                Redirecting to dashboard in {countdown}...
              </p>
            </div>
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  );
}
