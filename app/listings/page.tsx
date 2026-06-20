"use client"

import { Listing } from "@/context/user-context";
import { findAll } from "@/lib/api/listings";
import { Search, SlidersHorizontal, Plus, ChevronDown, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  useEffect(() => {
    const findAllListings = async () => {
      const result = await findAll();
      setListings(result ?? []);
    };

    findAllListings();
  }, [])

  const filteredListings = listings.filter((listing) => {
    const price = Number(listing.price);

    const matchesCondition =
      !conditionFilter ||
      conditionFilter === "all" ||
      listing.condition === conditionFilter;

    const matchesMinPrice =
      !minPrice || price >= Number(minPrice);

    const matchesMaxPrice =
      !maxPrice || price <= Number(maxPrice);

    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "all" ||
      ("category" in listing && listing.category?.name === categoryFilter);

    return (
      matchesCondition &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesCategory
    );
  });

  return (
    <main className="min-h-screen bg-muted/30 px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
              <p className="text-muted-foreground">
                Discover items from students around campus.
              </p>
            </div>

            <Link
              href="/listing/create"
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Sell Item
            </Link>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border bg-background p-4 shadow-sm md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                placeholder="Search for textbooks, electronics, furniture..."
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition hover:bg-muted"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full z-20 mt-3 w-[360px] rounded-3xl border bg-background p-6 shadow-2xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="rounded-full p-2 transition hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Category
                      </label>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-full py-5 rounded-2xl border">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>

                        <SelectContent className="rounded-2xl">
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Textbooks">Textbooks</SelectItem>
                          <SelectItem value="Furniture">Furniture</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Condition
                      </label>
                      <Select
                        value={conditionFilter}
                        onValueChange={setConditionFilter}
                      >
                        <SelectTrigger className="w-full p-5 rounded-2xl border">
                          <SelectValue placeholder="All Conditions" />
                        </SelectTrigger>

                        <SelectContent className="rounded-2xl">
                          <SelectItem value="all">All Conditions</SelectItem>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="LIKE_NEW">Like New</SelectItem>
                          <SelectItem value="GOOD">Good</SelectItem>
                          <SelectItem value="FAIR">Fair</SelectItem>
                          <SelectItem value="POOR">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Price Range
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min $"
                            className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition focus:ring-1 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max $"
                            className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition focus:ring-1 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("");
                          setConditionFilter("");
                          setMinPrice("");
                          setMaxPrice("");
                        }}
                        className="flex-1 rounded-2xl border px-4 py-3 font-medium transition hover:bg-muted"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFilters(false)}
                        className="flex-1 rounded-2xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          {filteredListings.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed bg-background p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold">No listings yet</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Be the first student to post an item for sale on PantherX.
              </p>

              <Link
                href="/listing/create"
                className="mt-6 flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-primary-foreground transition hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                Create Listing
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredListings.map((listing) => (
                <article
                  key={listing.id}
                  className="group overflow-hidden rounded-3xl border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-muted">
                    {listing.images?.[0]?.url ? (
                      <Image
                        src={listing.images[0]?.url}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        unoptimized={listing.images[0].url.startsWith("blob:")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="line-clamp-1 font-semibold">
                        {listing.title}
                      </h2>
                      <span className="font-bold text-primary">
                        {listing.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{listing.condition}</span>
                      <span className="line-clamp-1 max-w-[120px] text-right">
                        {listing.seller.name}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
