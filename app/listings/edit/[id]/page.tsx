"use client";

import ListingForm from "@/components/ui/listing-form";
import { Listing } from "@/interfaces/listing";
import { find, update } from "@/lib/api/listings";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditListingPage() {
    const { id }: { id: string } = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<Listing>();

    useEffect(() => {
        if(!id) return;
        const findListing = async () => {
            const listing = await find(id);
            setInitialData(listing);
        };
        findListing();
      }, [id])
  return (
    <ListingForm
      initialData={initialData}
      onSubmit={(data: any) => update(id, data)}
      onSuccess={() => router.push(`/listings/${id}`)}
      onCancel={() => router.push(`/listings/${id}`)}
    />
  );
}