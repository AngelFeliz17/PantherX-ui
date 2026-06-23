import { Listing } from "./listing";

export type User = {
  id: string;
  email: string;
  name: string;
  profilePicture?: {
    id: string;
    url: string;
    order: number;
  };
  banner?: {
    id: string;
    url: string;
    order: number;
  }
  bio?: string;
  graduationYear?: string;
  createdAt: Date;
  university: {
    id: string;
    name: string;
  }
  listings?: Listing[];
  favorites?: {
    listingId: string;
    listings: Listing[];
  }[]
};

export type NullableUser = User | null;