"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Package,
  Heart,
  Star,
  MapPin,
} from "lucide-react";

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
import { User, useUser } from "@/context/user-context";
import { findUserProfile } from "@/lib/api/user";
import NotLoggedUser from "@/components/ui/not-logged-user";
import { useRouter } from "next/navigation";
import { use

 } from "react";
import NotFound from "@/app/not-found";
import ListingCard from "@/components/ui/listing-card";
type Props = {
    params: Promise<{ id: string }>;
}

const DEFAULT_BANNER_URL = "/images/default-banner.png";
const DEFAULT_AVATAR_URL = "/images/default-profile-picture.png"

export default function UserProfilePageById({ params }: Props) {
  const loggedUser = useUser();
  const router = useRouter();
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
      const find = async () => {
        try {
          const result = await findUserProfile(id);
          if(loggedUser?.id === result.data.id) return router.replace('/profile');
          setUser(result.data);
        } catch (error: any) {
          if (error?.status === 404 || error?.response?.status === 404) {
            setUserNotFound(true);
            return;
          }
        }
      };

    find()
  }, [id])

  const soldCount = user?.listings?.filter((l) => l.status === "SOLD").length ?? 0;

  if (userNotFound) {
    return <NotFound />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      <section className="group/banner relative h-72 w-full overflow-hidden">
        <Image
          src={user?.banner?.url || DEFAULT_BANNER_URL}
          alt="Banner"
          priority
          className="object-cover"
          fill
          sizes="2160px"
        />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Profile Header */}
        <div className="relative -mt-20">
          <Card className="relative overflow-visible rounded-3xl shadow-lg">
        {
          !user ? <NotLoggedUser /> : <CardContent className="relative p-8 pt-14 sm:pt-8">
              <div>
                {/* Left */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                  <div
                    className="group/avatar relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg"
                  >
                    <Image
                      src={user.profilePicture?.url ?? DEFAULT_AVATAR_URL}
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
              </div>

              {/* Stats */}
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <StatCard
                  icon={<Package className="h-5 w-5" />}
                  value={user?.listings?.length || 0}
                  label="Listings"
                />

                <StatCard
                  icon={<Star className="h-5 w-5" />}
                  value="4.9"
                  label="Rating"
                />

                <StatCard
                  icon={<Package className="h-5 w-5" />}
                  value={soldCount}
                  label="Sold"
                />
              </div>
            </CardContent>
        }
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

            <TabsTrigger value="about">
              About
            </TabsTrigger>
          </TabsList>

          {/* Listings */}
          <TabsContent value="listings">
            {
                (user?.listings?.length ?? 0) >= 1 ? <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {user?.listings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
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
  value: string | number;
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