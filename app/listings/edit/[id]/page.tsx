"use client";

import ListingForm, { EMPTY_FORM } from "@/components/ui/listing-form";
import { ListingFormData } from "@/interfaces/listing";
import { find, update } from "@/lib/api/listings";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateListingPage() {
    const { id }: { id: string } = useParams();
    const [initialData, setInitialData] = useState<ListingFormData>(EMPTY_FORM);
    
    useEffect(() => {
        const findListing = async () => {
            const listing = await find(id);
            setInitialData(listing);
        };
        console.log(initialData)
        findListing();
    }, [id])
  return (
    <ListingForm initialData={initialData} onSubmit={(data: any) => update(id, data)} />
  );
}