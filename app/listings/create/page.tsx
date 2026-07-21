"use client";

import ListingForm from "@/components/ui/listing-form";
import { create } from "@/lib/api/listings";

export default function CreateListingPage() {
  return (
    <ListingForm onSubmit={(data: any) => create(data)} />
  );
}