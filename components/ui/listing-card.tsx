"use client";

import { useUser, useUserActions } from "@/context/user-context";
import { Listing } from '@/interfaces/listing';
import { formatWord } from "@/lib/hooks/format-word";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  LinkIcon,
  Flag,
  Share2,
  Heart,
} from "lucide-react";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenu,
} from "./dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { add, remove } from "@/lib/api/favorite";
import { useEffect, useState } from "react";

export default function ListingCard({ listing }: { listing: Listing }) {
  const imageUrl = listing.images?.[0]?.url;
  const user = useUser();
  const { refreshUser } = useUserActions();
  const isOwner = listing.seller.id === user?.id;
  const listingHref = `/listings/${listing.id}`;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const exists = user?.favorites?.some(l => l.listingId === listing.id) ?? false;
    setIsFavorite(exists);
  }, [user?.favorites, listing.id])

  const handleShare = async () => {
    const url = `${window.location.origin}${listingHref}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: listing.title, url });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        await navigator.clipboard.writeText(url);
      }
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  const handleAddToFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isFavorite) {
      await add(listing.id);
      setIsFavorite(true);
    } else {
      await remove(listing.id);
      setIsFavorite(false);
    }
    await refreshUser();
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {
        user?.id !== listing.seller.id && <button
        type="button"
        onClick={handleAddToFavorite}
        aria-label={`Save ${listing.title}`}
        className="absolute left-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white shadow-lg backdrop-blur-md transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Heart className={`size-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}/>
      </button>
      }
      <Link href={listingHref} className="block">
        <div className="relative h-56 overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              unoptimized={imageUrl.startsWith("blob:")}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-1 font-semibold">{listing.title}</h2>
            <span className="font-bold text-primary">${listing.price}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatWord(listing.condition)}</span>
            <span className="line-clamp-1 max-w-[120px] text-right">
              {listing.seller.name}
            </span>
          </div>
        </div>
      </Link>

      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${isOwner ? "Manage" : "More options for"} ${listing.title}`}
              className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white shadow-lg backdrop-blur-md transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 rounded-2xl p-2 shadow-xl"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider">
              {isOwner ? "Your listing" : "Listing options"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {isOwner ? (
              <>
                <DropdownMenuItem className="cursor-pointer rounded-xl px-2.5 py-2.5">
                  <Pencil className="size-4" />
                  Edit listing
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer rounded-xl px-2.5 py-2.5"
                >
                  <Trash2 className="size-4" />
                  Delete listing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl px-2.5 py-2.5"
                  onSelect={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}${listingHref}`
                    )
                  }
                >
                  <LinkIcon className="size-4" />
                  Copy listing link
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer rounded-xl px-2.5 py-2.5"
                >
                  <Flag className="size-4" />
                  Report listing
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl px-2.5 py-2.5"
                  onSelect={handleShare}
                >
                  <Share2 className="size-4" />
                  Share listing
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
    </article>
  );
}