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
  images: {
    id: string;
    url: string;
    order: number;
  }[]
  seller: {
    id: string;
    name: string;
    profilePicture?: {
    id: string;
    url: string;
    order: number;
  }; 
}
category: {
  id: string;
  name: string;
}
}