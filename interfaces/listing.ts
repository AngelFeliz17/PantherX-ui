import { User } from "./user";

export interface ListingFormData {
  title: string;
  price: number | "";
  categoryId: string;
  condition: string;
  location: string | "null";
  description: string | "";
  images: File[];
}

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: string;
  status: string;
  condition: string;
  location: string;
  createdAt: Date;
  images: {
    id: string;
    url: string;
    order: number;
  }[]
  seller: User;
  category: {
    id: string;
    name: string;
  }
}