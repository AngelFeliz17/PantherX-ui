"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Laptop,
  Sofa,
  Bike,
  House,
  Shield,
  Users,
  BadgeDollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMe } from "@/lib/api/user";
import NavBar from "@/components/ui/top-navbar";
import BottomNavBar from "@/components/ui/bottom-navbar";
import Footer from "@/components/ui/footer";

export default function LandingPage() {

    const [user, setUser] = useState<any>(null);
  
    useEffect(() => {
      const getUserInfo = async () => {
        try {
          const me = await getMe();
          setUser(me);
        } catch(err) {
          setUser(null);
        }};
        
        getUserInfo();
      }, []);
  
  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0">
      {/* HERO */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <Image
          src="/images/UNI-Basketball-Court.jpg"
          alt="University of Northern Iowa Campus"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        {/* NAVBAR */}
        <NavBar name={user?.name} isAuthenticated={!!user} />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex min-h-[90vh] items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="max-w-3xl text-white">
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <span className="text-sm font-medium">
                  Exclusively for UNI Students
                </span>
              </div>

              <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
                Buy, Sell & Trade at UNI
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
                The marketplace built exclusively
                for University of Northern Iowa
                students. Find textbooks, dorm
                furniture, electronics, bikes,
                and more.
              </p>

              {/* SEARCH */}
              <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-3 shadow-xl">
                <Search className="h-5 w-5 text-muted-foreground" />

                <Input
                  placeholder="Search textbooks, furniture, electronics..."
                  className="border-0 shadow-none focus-visible:ring-0 text-black"
                />

                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  Search
                </Button>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="rounded-lg bg-violet-600 hover:bg-violet-700"
                >
                  <Link href="/signup">
                    Start Selling
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-lg"
                >
                  Browse Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-b bg-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold">
            Trending on Campus
          </h2>

          <p className="mt-3 text-muted-foreground">
            Explore the most popular categories
            among UNI students.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            <CategoryCard
              icon={<BookOpen />}
              title="Textbooks"
            />

            <CategoryCard
              icon={<Laptop />}
              title="Electronics"
            />

            <CategoryCard
              icon={<Sofa />}
              title="Dorm Furniture"
            />

            <CategoryCard
              icon={<Bike />}
              title="Bikes"
            />

            <CategoryCard
              icon={<House />}
              title="Subleases"
            />
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">
              Why PantherX?
            </h2>

            <p className="mt-4 text-muted-foreground">
              Built specifically for University of
              Northern Iowa students.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Shield />}
              title="Verified Students"
              description="Every account requires a valid university email."
            />

            <FeatureCard
              icon={<Users />}
              title="Campus Community"
              description="Buy and sell with people you share a campus with."
            />

            <FeatureCard
              icon={<BadgeDollarSign />}
              title="Save Money"
              description="Find great deals from fellow students."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <Footer />
      <BottomNavBar />
    </main>
  );
}

function CategoryCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-center text-violet-600">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border p-8 text-center">
      <div className="flex justify-center text-violet-600">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}