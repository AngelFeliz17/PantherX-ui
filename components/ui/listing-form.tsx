"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  X,
} from "lucide-react";

import { Listing, ListingFormData } from "@/interfaces/listing";
import { getCategories } from "@/lib/api/categories";
import { CategoryType } from "@/interfaces/category";
import { BackendResponse } from "@/interfaces/response";
import imageCompression from "browser-image-compression";
import { formatWord } from "@/lib/hooks/format-word";
import { ITEM_CONDITIONS } from "../../app/listings/page"
import { useSwipe } from "@/lib/hooks/useSwipe";
import { useUser } from "@/context/user-context";
import NotLoggedUser from "@/components/ui/not-logged-user";

export const EMPTY_FORM: ListingFormData = {
  title: "",
  price: 0,
  categoryId: "",
  condition: "",
  location: "Cedar Falls, IA",
  description: "",
  images: []
};

const MAX_IMAGES = 10;

type ImageSlot = { url: string; file?: File; existingId?: string };

interface ListingFormProps {
    onSubmit: (data: FormData) => Promise<BackendResponse>;
    initialData?: Listing;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ListingForm({ onSubmit, initialData, onSuccess, onCancel }: ListingFormProps) {
      const user = useUser();
      const isEditing = Boolean(initialData);
      const [images, setImages] = useState<ImageSlot[]>([]);
      const imgSrcs = useMemo(() => images.map((img) => img.url), [images]);
      const imagesInputRef = useRef<HTMLInputElement>(null);
    
      const [categories, setCategories] = useState<CategoryType[]>([]);
      const [currentImage, setCurrentImage] = useState(0);
      const [message, setMessage] = useState<BackendResponse>();
      const [submitting, setSubmitting] = useState(false);
      const [formData, setFormData] = useState<ListingFormData>(EMPTY_FORM);
      
      const touchStartX = useRef<number | null>(null);
    
      useEffect(() => {
        if(!user) return;
        getCategories().then(setCategories);
      }, []);

      useEffect(() => {
        if(!initialData) return;
        setFormData({
          title: initialData.title,
          price: Number(initialData.price),
          categoryId: initialData.category.id,
          condition: initialData.condition,
          location: initialData.location,
          description: initialData.description,
          images: [],
        });

        setImages(
          initialData.images
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((img) => ({ url: img.url, existingId: img.id }))
        );
      }, [initialData])
    
      // Keep the carousel index in range whenever images are added/removed.
      useEffect(() => {
        if (imgSrcs.length === 0) {
          setCurrentImage(0);
        } else if (currentImage > imgSrcs.length - 1) {
          setCurrentImage(imgSrcs.length - 1);
        }
      }, [imgSrcs, currentImage]);
    
      // Keep formData.images in sync with the newly-added (non-existing) files.
      useEffect(() => {
        setFormData((prev) => ({
          ...prev,
          images: images.filter((img) => img.file).map((img) => img.file!),
        }));
      }, [images]);

      // Revoke every blob URL only on final unmount, not on every images change.
      // (Reading from a ref here, not the images state, so this effect's
      // cleanup doesn't fire mid-session and revoke URLs still in use.)
      const imagesRef = useRef(images);
      imagesRef.current = images;
      useEffect(() => {
        return () => {
          imagesRef.current.forEach((img) => {
            if (img.file) URL.revokeObjectURL(img.url);
          });
        };
      }, []);
    
      const selectedCategory = useMemo(
        () => categories.find((c) => c.id === formData.categoryId)?.name ?? "",
        [categories, formData.categoryId]
      );
    
      const nextImage = () => {
        setCurrentImage((prev) => (prev === imgSrcs.length - 1 ? 0 : prev + 1));
      };
    
      const previousImage = () => {
        setCurrentImage((prev) => (prev === 0 ? imgSrcs.length - 1 : prev - 1));
      };
    
      const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (!files.length) return;
    
        const remaining = Math.max(0, MAX_IMAGES - images.length);
        const filesToAdd = files.slice(0, remaining);
        if (!filesToAdd.length) return;

        const wasEmpty = images.length === 0;

        setImages((prev) => [
          ...prev,
          ...filesToAdd.map((file) => ({ url: URL.createObjectURL(file), file })),
        ]);

        // Jump to the first photo only on the very first upload, so the
        // carousel never silently drifts to whatever index it happened to be
        // on. Subsequent uploads append after the current set without moving
        // the viewer.
        if (wasEmpty) {
          setCurrentImage(0);
        }
      };

      const removeImage = (index: number) => {
        setImages((prev) => {
          const target = prev[index];
          if (target?.file) URL.revokeObjectURL(target.url);
          return prev.filter((_, i) => i !== index);
        });
        setCurrentImage((prev) => (prev > index ? prev - 1 : prev));
      };
    
      // Moves the photo at fromIndex so it sits at toIndex, shifting everything
      // in between. Used by drag-to-reorder, where a photo can move several
      // positions in one gesture rather than just swapping with a neighbor.
      const reorderImage = (fromIndex: number, toIndex: number) => {
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= imgSrcs.length ||
          toIndex >= imgSrcs.length
        ) {
          return;
        }
    
        setImages((prev) => {
          const next = [...prev];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return next;
        });

        // Keep the viewer following the image the user was looking at / moving.
        setCurrentImage((prev) => {
          if (prev === fromIndex) return toIndex;
          if (fromIndex < prev && prev <= toIndex) return prev - 1;
          if (toIndex <= prev && prev < fromIndex) return prev + 1;
          return prev;
        });
      };
    
      const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [id]: id === "price" ? value.replace(/[^0-9.]/g, "") : value,
        }));
      };
    
      const handleSelectChange = (field: keyof ListingFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };
    
      const resetForm = () => {
        images.forEach((img) => {
          if (img.file) URL.revokeObjectURL(img.url);
        });
        setImages([]);
        setCurrentImage(0);
        setFormData(EMPTY_FORM);
      };
    
      const isValid =
        formData.title.trim() !== "" &&
        String(formData.price).trim() !== "" &&
        formData.categoryId !== "" &&
        formData.condition !== "";
    
      const handleSubmitListing = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid || submitting) return;
        const appendedFormData = new FormData();
    
        appendedFormData.append('title', String(formData.title));
        appendedFormData.append('description', String(formData.description));
        appendedFormData.append('price', String(formData.price));
        appendedFormData.append('condition', String(formData.condition));
        appendedFormData.append('location', String(formData.location));
        appendedFormData.append('categoryId', String(formData.categoryId));
        if (isEditing) {
          appendedFormData.append(
            'existingImageIds',
            JSON.stringify(images.filter((img) => img.existingId).map((img) => img.existingId))
          );
        }

        for(const img of images) {
            if (!img.file) continue;
            const compressed = await imageCompression(img.file, {
              maxSizeMB: 5,
              maxWidthOrHeight: 1920,
            });
            appendedFormData.append('images', compressed);
        };

        setSubmitting(true);
        try {
          const result = await onSubmit(appendedFormData);
          setMessage(result);
          if (result.status === 201) {
            resetForm();
          }
          if (result.status && result.status >= 200 && result.status < 300) {
            onSuccess?.();
          }
        } finally {
          setSubmitting(false);
        }
      };

    return (
        <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Listing" : "Create Listing"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update your listing details." : "Sell your items to fellow Panthers."}
        </p>
      </div>

      {
        !user ? <NotLoggedUser /> : <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <Card className="rounded-3xl border shadow-sm">
          <form id="listing" onSubmit={handleSubmitListing}>
            <CardContent className="space-y-6 p-6">
              {message && (
                <div
                  className={`rounded-2xl border p-4 text-sm ${
                    message.status && message.status >= 200 && message.status < 300
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message.data?.message}
                </div>
              )}

              <div className="space-y-3">
                <Label>
                  Photos {images.length}/{MAX_IMAGES}
                </Label>
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
                    onChange={handleAddImages}
                  />
                  <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Upload photos</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, WEBP • Up to {MAX_IMAGES} photos
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tip: add photos one at a time to control their order
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
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="h-12 rounded-2xl pl-10 focus-visible:ring-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => handleSelectChange("categoryId", val)}
                >
                  <SelectTrigger className="rounded-2xl border py-5 focus-visible:ring-1">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(val) => handleSelectChange("condition", val)}
                >
                  <SelectTrigger className="rounded-2xl border py-5 focus-visible:ring-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_CONDITIONS.map(c =>(
                      <SelectItem key={c} value={c}>
                        {formatWord(c)}
                      </SelectItem>

                    ))}
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
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={onCancel ?? resetForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl"
                  disabled={!isValid || submitting}
                >
                  {submitting
                    ? isEditing ? "Saving..." : "Publishing..."
                    : isEditing ? "Save Changes" : "Publish Listing"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        <Card className="h-fit rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageCarousel
              imgSrcs={imgSrcs}
              currentImage={currentImage}
              onNext={nextImage}
              onPrevious={previousImage}
              onSelect={setCurrentImage}
              onRemove={removeImage}
              onReorder={reorderImage}
              touchStartX={touchStartX}
            />

            <div>
              <h3 className="font-semibold">
                {formData.title || "Your title"}
              </h3>
              <p className="mt-1 text-2xl font-bold text-primary">
                ${formData.price || 0}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              {[
                selectedCategory,
                formData.condition
                  ? ITEM_CONDITIONS[
                      formData.condition as keyof typeof ITEM_CONDITIONS
                    ]
                  : "",
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>

            <p className="text-sm text-muted-foreground">
              {formData.location}
            </p>
          </CardContent>
        </Card>
      </div>
      }
    </div>
    )
}

interface ImageCarouselProps {
  imgSrcs: string[];
  currentImage: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  touchStartX: React.MutableRefObject<number | null>;
}

export function ImageCarousel({
  imgSrcs,
  currentImage,
  onNext,
  onPrevious,
  onSelect,
  onRemove,
  onReorder,
}: ImageCarouselProps) {
  const swipe = useSwipe(onNext, onPrevious);
  return (
    <div className="space-y-3">
      <div
        className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-muted lg:aspect-auto lg:h-52"
        onTouchStart={(e) => {
          swipe.onTouchStart(e.touches[0].clientX)
        }}
        onTouchEnd={(e) => {
          swipe.onTouchEnd(e.touches[0].clientX)
        }}
      >
        {imgSrcs.length > 0 && (
          <>
            <div className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {currentImage + 1} / {imgSrcs.length}
            </div>
            <button
              type="button"
              onClick={() => onRemove(currentImage)}
              className="absolute left-3 top-3 z-10 cursor-pointer rounded-full bg-black/60 p-2 text-white"
              aria-label="Remove this photo"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}

        {imgSrcs.length ? (
          // eslint-disable-next-line @next/next/no-img-element
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
              onClick={onPrevious}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 p-2 text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 p-2 text-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {imgSrcs.length > 1 && (
        <>
          <ReorderableThumbnails
            imgSrcs={imgSrcs}
            currentImage={currentImage}
            onSelect={onSelect}
            onRemove={onRemove}
            onReorder={onReorder}
          />
          <p className="text-center text-xs text-muted-foreground">
            Drag a photo to reorder it. The first photo is your cover image.
          </p>
        </>
      )}
    </div>
  );
}

interface ReorderableThumbnailsProps {
  imgSrcs: string[];
  currentImage: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

// Drag-to-reorder thumbnail strip. Uses the Pointer Events API so the same
// handlers drive both mouse dragging on desktop and touch dragging/swiping
// on mobile, instead of maintaining separate mouse/touch implementations.
function ReorderableThumbnails({
  imgSrcs,
  currentImage,
  onSelect,
  onRemove,
  onReorder,
}: ReorderableThumbnailsProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    moved: boolean;
  } | null>(null);

  const getIndexAtPoint = (clientX: number, clientY: number) => {
    const strip = stripRef.current;
    if (!strip) return null;

    const items = Array.from(
      strip.querySelectorAll<HTMLElement>("[data-thumb-index]")
    );

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return Number(item.dataset.thumbIndex);
      }
    }
    return null;
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    index: number
  ) => {
    // Only the primary button/touch starts a drag; avoids hijacking
    // right-click or secondary pointer interactions.
    if (e.button !== undefined && e.button !== 0) return;

    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      moved: false,
    };
    setDraggingIndex(index);
    setDragOffsetX(0);

    // Keep receiving move/up events for this pointer even after the
    // thumbnail translates out from under the cursor/finger.
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingIndex === null || !dragState.current) return;
    if (e.pointerId !== dragState.current.pointerId) return;

    const dx = e.clientX - dragState.current.startX;

    // Require a small movement threshold before treating this as a drag,
    // so a plain tap-to-select click still works on the thumbnail.
    if (!dragState.current.moved) {
      if (Math.abs(dx) < 6) return;
      dragState.current.moved = true;
    }

    setDragOffsetX(dx);
    setHoverIndex(getIndexAtPoint(e.clientX, e.clientY));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingIndex === null || !dragState.current) return;
    if (e.pointerId !== dragState.current.pointerId) return;

    const wasDrag = dragState.current.moved;
    const target = wasDrag ? getIndexAtPoint(e.clientX, e.clientY) : null;

    if (wasDrag && target !== null && target !== draggingIndex) {
      onReorder(draggingIndex, target);
    } else if (!wasDrag) {
      onSelect(draggingIndex);
    }

    dragState.current = null;
    setDraggingIndex(null);
    setHoverIndex(null);
    setDragOffsetX(0);
  };

  return (
    <div
      ref={stripRef}
      className="flex select-none gap-2 overflow-x-auto px-1 pb-2 pt-2"
    >
      {imgSrcs.map((src, index) => {
        const isDragging = draggingIndex === index;
        const isDropTarget =
          hoverIndex === index && draggingIndex !== null && !isDragging;

        return (
          <div
            key={src}
            data-thumb-index={index}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`relative h-16 w-16 shrink-0 touch-none select-none overflow-hidden rounded-xl border-2 ${
              isDragging
                ? "z-20 border-primary shadow-xl"
                : "transition-all duration-150 " +
                  (isDropTarget
                    ? "border-primary"
                    : currentImage === index
                      ? "border-primary"
                      : "border-transparent")
            }`}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none",
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
              transform: isDragging
                ? `translateX(${dragOffsetX}px) translateY(-8px) scale(1.1)`
                : undefined,
              transition: isDragging ? "none" : undefined,
            }}
          >
            <div className="pointer-events-none absolute left-1 top-1 z-10 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white">
              {index + 1}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="absolute right-1 top-1 z-10 cursor-pointer rounded-full bg-black/70 p-1 text-white"
              aria-label={`Remove photo ${index + 1}`}
            >
              <X className="h-3 w-3" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="pointer-events-none h-full w-full select-none object-cover"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        );
      })}
    </div>
  );
}