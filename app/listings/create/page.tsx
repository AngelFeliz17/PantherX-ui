"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ImagePlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ListingFormData } from "@/interfaces/listing";
import { getCategories } from "@/lib/api/categories";
import { CategoryType } from "@/interfaces/category";

const ITEM_CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const;

export default function CreateListingPage() {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    price: 0,
    categoryId: "",
    condition: "",
    location: "Cedar Falls, IA",
    description: "",
  });
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, [])
  
  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === imgSrcs.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? imgSrcs.length - 1 : prev - 1,
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof ListingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setCategoryName = (id: string) => {
    const name = categories.find(c => c.id === id)?.name;
    setCategory(name ?? "");
  };

  const capitalizeFirstLetter = (c: string) => {
    setCondition(c.charAt(0).toUpperCase() + c.slice(1).toLowerCase());
  };

  const handlePostListing = async () => {
    
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Listing
        </h1>
        <p className="text-muted-foreground">
          Sell your items to fellow Panthers.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <Card className="rounded-3xl border shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <Label>Photos {imgFiles.length}/10</Label>

              <div
                onClick={() => imagesInputRef.current?.click()}
                className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/20 transition hover:border-primary hover:bg-muted/40"
              >
                <input
                  ref={imagesInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);

                    if (files.length) {
                      const remaining = Math.max(0, 10 - imgFiles.length);
                      const filesToAdd = files.slice(0, remaining);

                      if (!filesToAdd.length) {
                        e.target.value = "";
                        return;
                      }

                      setImgFiles((prev) => [...prev, ...filesToAdd]);
                      setImgSrcs((prev) => [
                        ...prev,
                        ...filesToAdd.map((file) => URL.createObjectURL(file)),
                      ]);
                    }

                    e.target.value = "";
                  }}
                />
                <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />

                <p className="font-medium">Upload photos</p>

                <p className="text-sm text-muted-foreground">
                  PNG, JPG, WEBP • Up to 10 photos
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex. MacBook Pro 2021"
                className="h-12 rounded-2xl focus-visible:ring-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>

              <div className="relative">
                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="h-12 rounded-2xl pl-10 focus-visible:ring-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>

              <Select onValueChange={(val) => { handleSelectChange("categoryId", val); setCategoryName(val);}}>
                <SelectTrigger className="rounded-2xl border py-5 focus-visible:ring-1">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                    {
                        categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>

              <Select onValueChange={(val) => {handleSelectChange("condition", val); capitalizeFirstLetter(val)}}>
                <SelectTrigger className="rounded-2xl border py-5 focus-visible:ring-1">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>

                <SelectContent>
                    {
                        ITEM_CONDITIONS.map(c => (
                            <SelectItem key={c} className="first-uppercarse" value={c}>{ c === "LIKE_NEW" ? "Like new" : condition }</SelectItem>
                        ))
                    }
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ex. Cedar Falls, IA"
                className="h-12 rounded-2xl focus-visible:ring-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item, include condition, pickup details, etc."
                className="min-h-[140px] resize-none rounded-2xl focus-visible:ring-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="rounded-xl">
                Cancel
              </Button>

              <Button className="rounded-xl">
                Publish Listing
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div
                className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-muted"
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (touchStartX.current === null || imgSrcs.length <= 1) return;

                  const diff = touchStartX.current - e.changedTouches[0].clientX;

                  if (Math.abs(diff) < 50) return;

                  if (diff > 0) {
                    nextImage();
                  } else {
                    previousImage();
                  }

                  touchStartX.current = null;
                }}
              >
                {imgSrcs.length > 0 && (
                  <div className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    {currentImage + 1} / {imgSrcs.length}
                  </div>
                )}
                {imgSrcs.length ? (
                  <img
                    src={imgSrcs[currentImage]}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-10 w-10 text-muted-foreground" />
                )}

                {imgSrcs.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      className="absolute left-3 rounded-full bg-black/60 p-2 text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 rounded-full bg-black/60 p-2 text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {imgSrcs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {imgSrcs.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setCurrentImage(index)}
                      className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${currentImage === index ? "border-primary" : "border-transparent"}`}
                    >
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Your title</h3>
              <p className="mt-1 text-2xl font-bold text-primary">
                ${formData.price}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              {category} • {condition}
            </p>

            <p className="text-sm text-muted-foreground">
              Cedar Falls, IA
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}