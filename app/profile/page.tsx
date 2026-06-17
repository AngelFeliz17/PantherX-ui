"use client";

import Image from "next/image";
import {
  Calendar,
  Package,
  Heart,
  Star,
  MapPin,
  LogOut,
  UserPen,
} from "lucide-react";

import EditProfileModal from "@/components/ui/edit-profile-modal";

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
import { useUser } from "@/context/user-context";
import { logOut } from "@/lib/api/auth";

export default function ProfilePage() {
  const user = useUser();

  const handleSignOut = async () => {
    await logOut();
    window.location.replace("/login");
  }
  
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      <section className="relative h-72 w-full overflow-hidden">
        <Image
          src="/images/UNI-Basketball-Court.jpg"
          alt="Campus Banner"
          priority
          className="object-cover"
          fill
          sizes="2160px"
        />

        <div className="absolute inset-0 bg-black/35" />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Profile Header */}
        <div className="relative -mt-20">
          <Card className="relative overflow-visible rounded-3xl shadow-lg">
            <CardContent className="relative p-8 pt-14 sm:pt-8">
              <div>
                {/* Left */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src="/images/UNI-Basketball-Court.jpg"
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="768px"
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

                    {
                        user?.bio && 
                        <p className="mt-4 max-w-xl text-sm text-slate-600">
                            {user?.bio}
                        </p>
                    }

                    <div className="mt-5 flex flex-wrap gap-3">
                       { user?.graduationYear && 
                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Class of {user?.graduationYear}</span>
                      </div>
                       }

                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {user?.university?.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute right-5 top-5 flex items-center gap-2 sm:right-8 sm:top-8">
                  <div className="flex items-center gap-2">
                    <UserPen className="h-4 w-4 sm:hidden" />
                    <EditProfileModal user={user} />
                  </div>
                  <Button
                    onClick={handleSignOut}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
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
            {
                user?.listings?.length >= 1 ? <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {user?.listings?.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56">
                    <Image
                      src={listing?.images?.url}
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
                      {listing.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div> : <Card className="mt-8 rounded-3xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground">
                  No listings yet
                </p>
              </CardContent>
            </Card>
            }
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <Card className="mt-8 rounded-3xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground">
                  No reviews yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved */}
          <TabsContent value="saved">
            <Card className="mt-8 rounded-3xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground">
                  No saved listings
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
                    {user?.university?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Graduation Year
                  </p>

                  {
                    user?.graduationYear && <p className="font-medium">
                    Class of {user.graduationYear}
                  </p>
                  }
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Joined
                  </p>

                  {
                    user?.createdAt && (
                      <p className="font-medium">
                        {new Date(user.createdAt).toDateString()}
                      </p>
                    )
                  }
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