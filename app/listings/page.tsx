"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronDown,
  X
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Listing } from "@/interfaces/listing";
import { findAll } from "@/lib/api/listings";
import { CategoryType } from "@/interfaces/category";
import { getCategories } from "@/lib/api/categories";
import { filterListings } from "@/lib/api/filter";
import { FilterType } from "@/interfaces/filter";
import { formatWord } from "@/lib/hooks/format-word";
import ListingCard from "@/components/ui/listing-card";
import { useSearchParams } from "next/navigation";

export const ITEM_CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const;

const EMPTY_FILTERS = {
  categoryId: "",
  condition: "",
  minPrice: "",
  maxPrice: "",
  search: "",
};

type Filters = typeof EMPTY_FILTERS;

function toApiFilters(filters: Filters): FilterType {
  return {
    categoryId: filters.categoryId === "all" ? "" : filters.categoryId,
    condition: filters.condition === "all" ? "" : filters.condition,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    search: filters.search,
  } as FilterType;
}

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') as any;

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY_FILTERS,
    search: search,
  }));
  const [loading, setLoading] = useState(false);

  const filterPanelRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const filterByParam = async () => {
      getCategories().then(setCategories);

      if(search) {
        await applyFilters({ search });
        setFilters((prev) => ({
          ...prev,
          search: search
        }));
      } else {
        findAll().then((result) => setListings(result ?? []));
      }
    }
    filterByParam();
  }, [search])
  
  // Close the filter panel on outside click.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (
        target.closest("[data-radix-popper-content-wrapper]") ||
        target.closest("[role='listbox']")
      ) {
        return;
      }

      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(target)
      ) {
        setShowFilters(false);
      }
    }

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFilters]);

  const applyFilters = useCallback(async (overrides?: Partial<Filters>) => {
    const nextFilters = { ...filters, ...overrides };
    setLoading(true);

    try {
      const hasActiveFilters = Object.values(toApiFilters(nextFilters)).some(
        (value) => value !== "" && value !== undefined
      );

      const result = hasActiveFilters
        ? await filterListings(toApiFilters(nextFilters))
        : await findAll();

      setListings(result ?? []);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      applyFilters({ search: value });
    }, 300);
  };

  const handleApplyClick = () => {
    applyFilters();
    setShowFilters(false);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    applyFilters(EMPTY_FILTERS);
    setShowFilters(false);
  };

  return (
    <main className="min-h-screen flex-1 bg-muted/30 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-28 sm:px-6 sm:pb-10 lg:px-8">
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
              href="/listings/create"
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
                type="text"
                value={filters.search ?? ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for textbooks, electronics, furniture..."
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative" ref={filterPanelRef}>
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition hover:bg-muted"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFilters && (
                <FilterPanel
                  filters={filters}
                  categories={categories}
                  onChange={(partial) =>
                    setFilters((prev) => ({ ...prev, ...partial }))
                  }
                  onApply={handleApplyClick}
                  onReset={handleReset}
                  onClose={() => setShowFilters(false)}
                />
              )}
            </div>
          </div>
        </section>

        <section>
          {listings.length === 0 ? (
            <EmptyState loading={loading} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

interface FilterPanelProps {
  filters: Filters;
  categories: CategoryType[];
  onChange: (partial: Partial<Filters>) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

function FilterPanel({
  filters,
  categories,
  onChange,
  onApply,
  onReset,
  onClose,
}: FilterPanelProps) {
  return (
    <div className="absolute right-0 top-full z-20 mt-3 w-[360px] rounded-3xl border bg-background p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={onClose}
          className="rounded-full p-2 transition hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <Select
            value={filters.categoryId}
            onValueChange={(value) => onChange({ categoryId: value })}
          >
            <SelectTrigger className="w-full rounded-2xl border py-5">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem value={c.id} key={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Condition</label>
          <Select
            value={filters.condition}
            onValueChange={(value) => onChange({ condition: value })}
          >
            <SelectTrigger className="w-full rounded-2xl border p-5">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Conditions</SelectItem>
              {ITEM_CONDITIONS.map((c) => (
                <SelectItem value={c} key={c}>
                    {formatWord(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              placeholder="Min $"
              className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition focus:ring-1 focus:ring-primary/20"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              placeholder="Max $"
              className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-2xl border px-4 py-3 font-medium transition hover:bg-muted"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-2xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed bg-background p-10 text-center shadow-sm">
      <h2 className="text-xl font-semibold">
        {loading ? "Loading listings..." : "No listings yet"}
      </h2>

      {!loading && (
        <>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Be the first student to post an item for sale on PantherX.
          </p>

          <Link
            href="/listings/create"
            className="mt-6 flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-primary-foreground transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Create Listing
          </Link>
        </>
      )}
    </div>
  );
}
