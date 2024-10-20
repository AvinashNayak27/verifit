"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Trophy, Users, Zap, Smartphone } from "lucide-react"

export function VerifitLandingWhite() {
  return (
    (<div className="min-h-screen bg-white text-gray-800">
      <header className="container mx-auto px-4 py-16 text-center">
        <h1
          className="mb-4 text-5xl font-extrabold tracking-tight text-neutral-900 lg:text-6xl dark:text-neutral-50">
          Verifit: Your Fitness Journey, Supercharged
        </h1>
        <p className="mb-8 text-xl text-neutral-500 dark:text-neutral-400">
          Achieve your goals, connect with friends, and earn rewards – all in one app
        </p>
        <Button size="lg" className="text-lg">
          Start Your Journey
        </Button>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Heart className="h-12 w-12 text-neutral-900 dark:text-neutral-50" />}
            title="Track Your Progress"
            description="Log your workouts and see improvement over time with our intuitive interface." />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-neutral-900 dark:text-neutral-50" />}
            title="Connect with Friends"
            description="Challenge your buddies and stay motivated together on fitness journeys." />
          <FeatureCard
            icon={<Trophy className="h-12 w-12 text-neutral-900 dark:text-neutral-50" />}
            title="Earn Real Rewards"
            description="Hit your milestones and earn exciting rewards like free domain names more!" />
          <FeatureCard
            icon={<Shield className="h-12 w-12 text-neutral-900 dark:text-neutral-50" />}
            title="Your Data, Control"
            description="Advanced privacy technology ensures your fitness data stays yours and alone." />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-neutral-900 dark:text-neutral-50" />}
            title="Lightning-Fast Experience"
            description="Enjoy a smooth, responsive app that keeps up with your active lifestyle." />
          <FeatureCard
            icon={<Smartphone className="h-12 w-12 text-neutral-900 dark:text-neutral-50" />}
            title="Seamless Integration"
            description="Works perfectly with your favorite fitness trackers and smartwatches." />
        </div>
      </main>
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-50">How Verifit Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div
                className="bg-neutral-900/10 rounded-full p-6 inline-block mb-4 dark:bg-neutral-50/10">
                <Smartphone className="h-10 w-10 text-neutral-900 dark:text-neutral-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-neutral-500 dark:text-neutral-400">Link your fitness devices and set your goals</p>
            </div>
            <div>
              <div
                className="bg-neutral-900/10 rounded-full p-6 inline-block mb-4 dark:bg-neutral-50/10">
                <Heart className="h-10 w-10 text-neutral-900 dark:text-neutral-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achieve</h3>
              <p className="text-neutral-500 dark:text-neutral-400">Work out and let Verifit track your progress</p>
            </div>
            <div>
              <div
                className="bg-neutral-900/10 rounded-full p-6 inline-block mb-4 dark:bg-neutral-50/10">
                <Trophy className="h-10 w-10 text-neutral-900 dark:text-neutral-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn</h3>
              <p className="text-neutral-500 dark:text-neutral-400">Hit your goals and claim your rewards</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-neutral-500 mb-4 dark:text-neutral-400">Ready to revolutionize your fitness journey?</p>
        <Button size="lg" className="text-lg">
          Download Verifit Now
        </Button>
      </footer>
    </div>)
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    (<Card>
      <CardContent className="pt-6 flex flex-col items-center text-center">
        {icon}
        <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{description}</p>
      </CardContent>
    </Card>)
  );
}