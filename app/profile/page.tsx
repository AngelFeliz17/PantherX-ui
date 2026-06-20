"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Package,
  Heart,
  Star,
  MapPin,
  LogOut,
  UserPen,
  Pencil,
  Check,
  X,
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
import { useUser, useUserActions } from "@/context/user-context";
import { logOut } from "@/lib/api/auth";
import { updateProfileBanner, updateProfilePicture } from "@/lib/api/user";

export default function ProfilePage() {
  const user = useUser();
  const { refreshUser } = useUserActions();

  const [bannerSrc, setBannerSrc] = useState(user?.banner?.url || "/images/default-banner.png");
  const [pendingBannerSrc, setPendingBannerSrc] = useState<string | null>(null);
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [isBannerOverlayActive, setIsBannerOverlayActive] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture?.url || "/images/default-profile-picture.png");
  const [pendingAvatarSrc, setPendingAvatarSrc] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [isAvatarOverlayActive, setIsAvatarOverlayActive] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (bannerSrc.startsWith("blob:")) {
        URL.revokeObjectURL(bannerSrc);
      }
    };
  }, [bannerSrc]);

  useEffect(() => {
    return () => {
      if (pendingAvatarSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(pendingAvatarSrc);
      }
    };
  }, [pendingAvatarSrc]);

  const handleSignOut = async () => {
    await logOut();
    window.location.replace("/login");
  }

  const soldCount = user?.listings?.filter((l) => l.status === "SOLD").length ?? 0;

  const handleUpdateProfilePicture = async () => {
    if (!pendingAvatarFile) return;
    await updateProfilePicture(pendingAvatarFile);
    await refreshUser()
  };

  const handleUpdateProfileBanner = async () => {
    if(!pendingBannerFile) return;
    await updateProfileBanner(pendingBannerFile);
    await refreshUser();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      <section
        className="group/banner relative h-72 w-full overflow-hidden"
        onMouseEnter={() => setIsBannerOverlayActive(true)}
        onMouseLeave={() => setIsBannerOverlayActive(false)}
        onClick={() => setIsBannerOverlayActive((prev) => !prev)}
      >
        <Image
          src={pendingBannerSrc ?? bannerSrc}
          alt="Banner"
          priority
          className="object-cover"
          fill
          sizes="2160px"
        />

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setPendingBannerFile(file)
              setPendingBannerSrc(URL.createObjectURL(file));
            }

            e.target.value = "";
          }}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
            isBannerOverlayActive ? "opacity-100" : "opacity-0"
          } sm:group-hover/banner:opacity-100`}
        >
          {pendingBannerSrc ? (
            <div className="flex gap-2">
              <Button
                type="button"
                size="icon"
                className="h-9 w-9 rounded-full bg-white text-green-600 shadow-lg hover:bg-white/80"
                onClick={async (e) => {
                  e.stopPropagation();
                  setBannerSrc(pendingBannerSrc);
                  await handleUpdateProfileBanner()
                  setPendingBannerFile(null);
                  setPendingBannerSrc(null);
                  setIsBannerOverlayActive(false);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/95 text-red-600 shadow-lg hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingBannerSrc(null);
                  setPendingBannerFile(null);
                  setIsBannerOverlayActive(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/95 text-slate-900 shadow-lg hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                bannerInputRef.current?.click();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
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
                  <div
                    className="group/avatar relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg"
                    onMouseEnter={() => setIsAvatarOverlayActive(true)}
                    onMouseLeave={() => setIsAvatarOverlayActive(false)}
                    onClick={() => setIsAvatarOverlayActive((prev) => !prev)}
                  >
                    <Image
                      src={pendingAvatarSrc ?? avatarSrc}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="768px"
                    />

                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          setPendingAvatarFile(file);
                          setPendingAvatarSrc(URL.createObjectURL(file));
                        }

                        e.target.value = "";
                      }}
                    />

                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
                        isAvatarOverlayActive ? "opacity-100" : "opacity-0"
                      } sm:group-hover/avatar:opacity-100`}
                    >
                      {pendingAvatarSrc ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="icon"
                            className="h-9 w-9 rounded-full bg-white text-green-600 shadow-lg hover:bg-white/90"
                            onClick={async (e) => {
                              e.stopPropagation();
                              setAvatarSrc(pendingAvatarSrc);
                              await handleUpdateProfilePicture()
                              setPendingAvatarFile(null);
                              setPendingAvatarSrc(null);
                              setIsAvatarOverlayActive(false);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/95 text-red-600 shadow-lg hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingAvatarSrc(null);
                              setPendingAvatarFile(null);
                              setIsAvatarOverlayActive(false);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-white/95 text-slate-900 shadow-lg hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            avatarInputRef.current?.click();
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                  value={user?.listings?.length || 0}
                  label="Listings"
                />

                <StatCard
                  icon={<Star className="h-5 w-5" />}
                  value="4.9"
                  label="Rating"
                />

                <StatCard
                  icon={<Heart className="h-5 w-5" />}
                  value={user?.favorite?.length || 0}
                  label="Saved"
                />

                <StatCard
                  icon={<Package className="h-5 w-5" />}
                  value={soldCount}
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
                (user?.listings?.length ?? 0) >= 1 ? <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {user?.listings?.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56">
                    <Image
                      src={listing?.images?.[0]?.url || "/images/graduate.png"}
                      alt={listing.title}
                      fill
                      className="object-cover -mt-6"
                      unoptimized={Boolean(listing?.images?.[0]?.url?.startsWith("blob:"))}
                    />
                  </div>

                  <CardContent className="space-y-3 p-5">
                    <h3 className="font-semibold">
                      {listing.title}
                    </h3>

                    <p className="text-xl font-bold">
                      ${listing.price}
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