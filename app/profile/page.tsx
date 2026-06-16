"use client";

import Image from "next/image";
import {
  Calendar,
  Package,
  Heart,
  Star,
  Settings,
  Pencil,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useUser } from "../context/user-context";

const listings = [
  {
    id: 1,
    title: "MacBook Air M2",
    price: "$700",
    image:{
      src: "/images/UNI-Basketball-Court.jpg"
    },
    location: "Cedar Falls, IA",
  },
  {
    id: 2,
    title: "Calculus Textbook",
    price: "$40",
    image:{
      src: "/images/UNI-Basketball-Court.jpg"
    },
    location: "UNI Campus",
  },
  {
    id: 3,
    title: "Mini Fridge",
    price: "$80",
    image:{
      src: "/images/UNI-Basketball-Court.jpg"
    },
    location: "Dorms",
  },
];

export default function ProfilePage() {
  const user = useUser();
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      <section className="relative h-72 w-full overflow-hidden">
        <Image
          src="/images/UNI-Basketball-Court.jpg"
          alt="Campus Banner"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Profile Header */}
        <div className="relative -mt-20">
          <Card className="overflow-visible rounded-3xl shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src="/images/UNI-Basketball-Court.jpg"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h1 className="text-3xl font-bold">
                      {user?.name}
                    </h1>

                    {/* <p className="mt-1 text-muted-foreground">
                      @angelfeliz
                    </p> */}

                    <p className="mt-4 max-w-xl text-sm text-slate-600">
                      {user?.bio}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                       { user?.graduationYear && 
                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Class of {user?.graduationYear}</span>
                      </div>
                       }

                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        University of Northern Iowa
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>

                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-10 grid gap-4 md:grid-cols-4">
                <StatCard
                  icon={<Package className="h-5 w-5" />}
                  value="14"
                  label="Listings"
                />

                <StatCard
                  icon={<Star className="h-5 w-5" />}
                  value="4.9"
                  label="Rating"
                />

                <StatCard
                  icon={<Heart className="h-5 w-5" />}
                  value="23"
                  label="Saved"
                />

                <StatCard
                  icon={<Package className="h-5 w-5" />}
                  value="31"
                  label="Sold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="mt-10">
          <TabsList>
            <TabsTrigger value="listings">
              Listings
            </TabsTrigger>

            <TabsTrigger value="reviews">
              Reviews
            </TabsTrigger>

            <TabsTrigger value="saved">
              Saved
            </TabsTrigger>

            <TabsTrigger value="about">
              About
            </TabsTrigger>
          </TabsList>

          {/* Listings */}
          <TabsContent value="listings">
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56">
                    <Image
                      src={listing.image.src}
                      alt={listing.title}
                      fill
                      className="object-cover -mt-6"
                    />
                  </div>

                  <CardContent className="space-y-3 p-5">
                    <h3 className="font-semibold">
                      {listing.title}
                    </h3>

                    <p className="text-xl font-bold">
                      {listing.price}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {listing.location}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <Card className="mt-8 rounded-3xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground">
                  No reviews yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved */}
          <TabsContent value="saved">
            <Card className="mt-8 rounded-3xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground">
                  No saved listings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About */}
          <TabsContent value="about">
            <Card className="mt-8 rounded-3xl">
              <CardContent className="space-y-4 p-8">
                <div>
                  <p className="text-sm text-muted-foreground">
                    University
                  </p>

                  <p className="font-medium">
                    University of Northern Iowa
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Graduation Year
                  </p>

                  <p className="font-medium">
                    Class of 2028
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Joined
                  </p>

                  <p className="font-medium">
                    June 2026
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-xl bg-slate-100 p-3">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold">
            {value}
          </p>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}