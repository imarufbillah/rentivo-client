"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property } from "@/../../rentivo-server/src/types";

const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be positive"),
  location: z.string().min(2, "Location is required"),
  propertyType: z.enum(["apartment", "house", "room", "studio", "villa"]),
  status: z.enum(["active", "pending", "archived"]),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: Omit<Property, "_id" | "ownerId" | "createdAt" | "updatedAt">) => void;
  isLoading?: boolean;
}

const propertyTypes = ["apartment", "house", "room", "studio", "villa"] as const;
const propertyStatuses = ["active", "pending", "archived"] as const;

export const PropertyForm = ({ initialData, onSubmit, isLoading }: PropertyFormProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images?.length ? initialData.images : [""]);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      location: initialData?.location || "",
      propertyType: initialData?.propertyType || "apartment",
      status: initialData?.status || "active",
    },
  });

  const addImageUrl = () => {
    if (imageUrls.length < 6) setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const onFormSubmit = (data: PropertyFormData) => {
    const validUrls = imageUrls.filter((url) => url.trim());
    if (validUrls.length === 0) {
      setImageError("At least one image URL is required");
      return;
    }
    setImageError("");
    onSubmit({
      ...data,
      price: Number(data.price),
      images: validUrls,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Cozy apartment downtown"
        />
        {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Describe your property in detail..."
        />
        {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5">
            Price ($/month)
          </label>
          <Input
            id="price"
            type="number"
            {...register("price")}
            placeholder="1500"
          />
          {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">
            Location
          </label>
          <Input
            id="location"
            {...register("location")}
            placeholder="New York"
          />
          {errors.location && <p className="mt-1 text-sm text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium mb-1.5">
            Property Type
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1.5">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {propertyStatuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Image URLs</label>
        <div className="space-y-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => updateImageUrl(i, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {imageUrls.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImageUrl(i)}
                  className="shrink-0"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
        {imageUrls.length < 6 && (
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addImageUrl}>
            + Add Image
          </Button>
        )}
        {imageError && <p className="mt-1 text-sm text-destructive">{imageError}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
};
