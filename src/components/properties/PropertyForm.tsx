"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property } from "@/../../rentivo-server/src/types";

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: Omit<Property, "_id" | "ownerId" | "createdAt" | "updatedAt">) => void;
  isLoading?: boolean;
}

const propertyTypes = ["apartment", "house", "room", "studio", "villa"] as const;
const propertyStatuses = ["active", "pending", "archived"] as const;

export const PropertyForm = ({ initialData, onSubmit, isLoading }: PropertyFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [propertyType, setPropertyType] = useState<Property["propertyType"]>(
    initialData?.propertyType || "apartment"
  );
  const [status, setStatus] = useState<Property["status"]>(initialData?.status || "active");
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addImageUrl = () => {
    if (imageUrls.length < 6) {
      setImageUrls([...imageUrls, ""]);
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title || title.length < 5) newErrors.title = "Title must be at least 5 characters";
    if (!description || description.length < 20) newErrors.description = "Description must be at least 20 characters";
    if (!price || Number(price) <= 0) newErrors.price = "Price must be positive";
    if (!location || location.length < 2) newErrors.location = "Location is required";

    const validUrls = imageUrls.filter((url) => url.trim());
    if (validUrls.length === 0) newErrors.images = "At least one image URL is required";
    if (validUrls.length > 6) newErrors.images = "Maximum 6 images allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title,
      description,
      price: Number(price),
      location,
      propertyType,
      status,
      images: imageUrls.filter((url) => url.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cozy apartment downtown"
        />
        {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Describe your property in detail..."
        />
        {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5">
            Price ($/month)
          </label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1500"
          />
          {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">
            Location
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="New York"
          />
          {errors.location && <p className="mt-1 text-sm text-destructive">{errors.location}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium mb-1.5">
            Property Type
          </label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as Property["propertyType"])}
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
            value={status}
            onChange={(e) => setStatus(e.target.value as Property["status"])}
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
        {errors.images && <p className="mt-1 text-sm text-destructive">{errors.images}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
};
