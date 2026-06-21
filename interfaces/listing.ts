export interface ListingFormData {
  title: string;
  price: number | "";
  categoryId: string;
  condition: string;
  location: string | "null";
  description: string | "";
  images: File[];
}