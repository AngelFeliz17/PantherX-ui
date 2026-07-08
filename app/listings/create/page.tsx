"use client";

import ListingForm, { EMPTY_FORM } from "@/components/ui/listing-form";
import { create } from "@/lib/api/listings";

export default function CreateListingPage() {
  return (
    <ListingForm initialData={EMPTY_FORM} onSubmit={(data: any) => create(data)} />
  );
}