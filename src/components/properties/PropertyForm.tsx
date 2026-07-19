"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property } from "@/../../rentivo-server/src/types";
import { ImageManager } from "./ImageManager";

const amenitiesList = [
  { value: "wifi", label: "WiFi" },
  { value: "parking", label: "Parking" },
  { value: "pool", label: "Pool" },
  { value: "gym", label: "Gym" },
  { value: "laundry", label: "Laundry" },
  { value: "ac", label: "AC" },
  { value: "pets", label: "Pets Allowed" },
  { value: "doorman", label: "Doorman" },
  { value: "elevator", label: "Elevator" },
  { value: "balcony", label: "Balcony" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "hardwood", label: "Hardwood" },
  { value: "fireplace", label: "Fireplace" },
  { value: "storage", label: "Storage" },
  { value: "bike", label: "Bike Storage" },
] as const;

const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be positive"),
  location: z.string().min(2, "Location is required"),
  propertyType: z.enum(["apartment", "house", "room", "studio", "villa"]),
  status: z.enum(["active", "pending", "archived"]),
  images: z.array(z.string().url()).min(1, "At least one image is required").max(6, "Maximum 6 images allowed"),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Bedrooms must be 0 or more"),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Bathrooms must be 0 or more"),
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
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      location: initialData?.location || "",
      propertyType: initialData?.propertyType || "apartment",
      status: initialData?.status || "active",
      images: initialData?.images || [],
      bedrooms: initialData?.bedrooms?.toString() ?? "1",
      bathrooms: initialData?.bathrooms?.toString() ?? "1",
    },
  });

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setValue("images", newImages, { shouldValidate: true });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const onFormSubmit = (data: PropertyFormData) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      amenities: selectedAmenities,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl" noValidate>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Cozy apartment downtown"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && <p id="title-error" role="alert" className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
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
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && <p id="description-error" role="alert" className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
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
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : undefined}
          />
          {errors.price && <p id="price-error" role="alert" className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">
            Location
          </label>
          <Input
            id="location"
            {...register("location")}
            placeholder="New York"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && <p id="location-error" role="alert" className="mt-1 text-sm text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
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

        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium mb-1.5">
            Bedrooms
          </label>
          <Input
            id="bedrooms"
            type="number"
            {...register("bedrooms")}
            min="0"
            aria-invalid={!!errors.bedrooms}
            aria-describedby={errors.bedrooms ? "bedrooms-error" : undefined}
          />
          {errors.bedrooms && <p id="bedrooms-error" role="alert" className="mt-1 text-sm text-destructive">{errors.bedrooms.message}</p>}
        </div>

        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium mb-1.5">
            Bathrooms
          </label>
          <Input
            id="bathrooms"
            type="number"
            {...register("bathrooms")}
            min="0"
            aria-invalid={!!errors.bathrooms}
            aria-describedby={errors.bathrooms ? "bathrooms-error" : undefined}
          />
          {errors.bathrooms && <p id="bathrooms-error" role="alert" className="mt-1 text-sm text-destructive">{errors.bathrooms.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map((amenity) => {
            const selected = selectedAmenities.includes(amenity.value);
            return (
              <button
                key={amenity.value}
                type="button"
                onClick={() => toggleAmenity(amenity.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:bg-muted"
                }`}
              >
                {amenity.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Property Images</label>
        <ImageManager images={images} onChange={handleImagesChange} />
        {errors.images && <p className="mt-1 text-sm text-destructive">{errors.images.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
};
