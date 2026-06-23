"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Listing } from "@/interfaces/listing";
import { find } from "@/lib/api/listings";
import { formatWord } from "@/lib/hooks/format-word";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ListingPage({ params }: PageProps) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState("Is this available?");

  const touchStartX = useRef<number | null>(null);

  const nextImage = () => {
    if (!listing?.images.length) return;

    setSelectedImage((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!listing?.images.length) return;

    setSelectedImage((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const currentImage = useMemo(() => {
    if (!listing?.images?.length) return null;
    return listing.images[selectedImage]?.url ?? listing.images[0].url;
  }, [listing, selectedImage]);

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
    <main className="min-h-screen bg-background mt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden rounded-[2rem] border border-border/50 py-0 shadow-none">
              <CardContent
                className="p-0"
              >
                <div
                  className="relative h-[500px] w-full bg-muted select-none"
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    if (touchStartX.current === null || listing.images.length <= 1)
                      return;

                    const diff = touchStartX.current - e.changedTouches[0].clientX;
                    touchStartX.current = null;

                    if (Math.abs(diff) < 50) return;

                    diff > 0 ? nextImage() : previousImage();
                  }}
                >
                  {currentImage ? (
                    <>
                      <Image
                        src={currentImage}
                        alt={listing.title}
                        fill
                        priority
                        draggable={false}
                        className="object-cover"
                      />

                      {listing.images.length > 1 && (
                        <>
                          <div className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                            {selectedImage + 1} / {listing.images.length}
                          </div>

                          <button
                            type="button"
                            onClick={previousImage}
                            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/70"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/70"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {listing.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {listing.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${listing.title}-${index}`}
                      fill
                      draggable={false}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 h-fit space-y-5">
            <Card className="rounded-[2rem] border border-border/50 shadow-none">
              <CardContent className="space-y-5 p-6">
                <div className="space-y-4">
                  <Badge className="rounded-full px-4 py-1 font-medium">
                    {listing.category?.name ?? "Uncategorized"}
                  </Badge>

                  <div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                      {listing.title}
                    </h1>
                    <p className="mt-3 text-3xl font-bold text-primary">
                      ${Number(listing.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-muted/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Condition
                    </p>
                    <p className="mt-2 font-medium">
                      {formatWord(listing.condition)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Seller
                    </p>
                    <p className="mt-2 font-medium">
                      {listing.seller?.name ?? "Unknown seller"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {listing.description || "No description provided."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Message Seller</h2>

                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-28 resize-none rounded-2xl"
                    placeholder="Write a message..."
                  />

                  <Button className="w-full rounded-xl">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
