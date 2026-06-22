"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { use, useEffect, useState } from "react";
import { Listing } from "@/context/user-context";
import { find } from "@/lib/api/listings";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ListingPage({ params }: PageProps) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const getListing = async () => {
      setListing(await find(id));
    };

    getListing();
  }, [id]);

  if (!listing) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 mt-24 md:px-6">
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          Loading listing...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 mt-24 md:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="relative aspect-square w-full bg-muted">
              {listing.images.length > 0 ? (
                <Image
                  src={listing.images[0].url}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <div>
            <Badge className="mb-3 rounded-full px-4 py-1">
              {listing.category?.name ?? "Uncategorized"}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {listing.title}
            </h1>

            <p className="mt-4 text-4xl font-bold text-primary">
              ${Number(listing.price).toFixed(2)}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-3 text-lg font-semibold">Condition</h2>
            <Badge variant="secondary" className="rounded-full px-4 py-1">
              {listing.condition
                ?.toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char: string) => char.toUpperCase())}
            </Badge>
          </div>

          <Separator />

          <div>
            <h2 className="mb-3 text-lg font-semibold">Description</h2>
            <p className="leading-7 text-muted-foreground">
              {listing.description || "No description provided."}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-3 text-lg font-semibold">Seller</h2>
            <p className="text-muted-foreground">
              {listing.seller?.name ?? "Unknown seller"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}