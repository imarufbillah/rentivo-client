"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property, PropertyStatus, FurnishingStatus, PropertyCondition, ParkingStatus, PetPolicy, SmokingPolicy, RentFrequency } from "@/../../rentivo-server/src/types";
import { ImageManager } from "./ImageManager";
import { useAmenities } from "@/hooks/useProperties";

const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z.string().max(200, "Short description must be 200 characters or less").optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be positive"),
  location: z.string().min(2, "Location is required"),
  propertyType: z.enum(["apartment", "house", "room", "studio", "villa"]),
  status: z.enum(["active", "pending", "archived", "rented"]),
  images: z.array(z.string().url()).min(1, "At least one image is required").max(6, "Maximum 6 images allowed"),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Bedrooms must be 0 or more"),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Bathrooms must be 0 or more"),
  size: z.string().optional(),
  balconies: z.string().optional(),
  floor: z.string().optional(),
  totalFloors: z.string().optional(),
  furnishing: z.enum(["furnished", "semi-furnished", "unfurnished"]).optional(),
  condition: z.enum(["new", "excellent", "good", "fair"]).optional(),
  parking: z.enum(["included", "available", "none"]).optional(),
  internet: z.boolean().optional(),
  petPolicy: z.enum(["allowed", "not-allowed", "case-by-case"]).optional(),
  smokingPolicy: z.enum(["allowed", "not-allowed"]).optional(),
  securityDeposit: z.string().optional(),
  advancePayment: z.string().optional(),
  leaseDuration: z.string().optional(),
  minStay: z.string().optional(),
  rentFrequency: z.enum(["monthly", "weekly", "daily"]).optional(),
  fullAddress: z.string().optional(),
  utilities: z.string().optional(),
  houseRules: z.string().optional(),
  rentalTerms: z.string().optional(),
  availableFrom: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: Omit<Property, "_id" | "ownerId" | "createdAt" | "updatedAt">) => void;
  isLoading?: boolean;
}

const propertyTypes = ["apartment", "house", "room", "studio", "villa"] as const;
const propertyStatuses: readonly PropertyStatus[] = ["active", "pending", "archived", "rented"];
const furnishingOptions: { value: FurnishingStatus; label: string }[] = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];
const conditionOptions: { value: PropertyCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];
const parkingOptions: { value: ParkingStatus; label: string }[] = [
  { value: "included", label: "Included" },
  { value: "available", label: "Available" },
  { value: "none", label: "None" },
];
const petPolicyOptions: { value: PetPolicy; label: string }[] = [
  { value: "allowed", label: "Allowed" },
  { value: "not-allowed", label: "Not Allowed" },
  { value: "case-by-case", label: "Case by Case" },
];
const smokingPolicyOptions: { value: SmokingPolicy; label: string }[] = [
  { value: "allowed", label: "Allowed" },
  { value: "not-allowed", label: "Not Allowed" },
];
const rentFrequencyOptions: { value: RentFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold border-b pb-2 mt-6 mb-4">{children}</h3>
);

export const PropertyForm = ({ initialData, onSubmit, isLoading }: PropertyFormProps) => {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);
  const { data: amenitiesData } = useAmenities();
  const amenitiesList = (amenitiesData?.amenities || []).map((a) => ({
    value: a,
    label: a.charAt(0).toUpperCase() + a.slice(1),
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      location: initialData?.location || "",
      propertyType: initialData?.propertyType || "apartment",
      status: initialData?.status || "active",
      images: initialData?.images || [],
      bedrooms: initialData?.bedrooms?.toString() ?? "1",
      bathrooms: initialData?.bathrooms?.toString() ?? "1",
      size: initialData?.size?.toString() || "",
      balconies: initialData?.balconies?.toString() || "",
      floor: initialData?.floor?.toString() || "",
      totalFloors: initialData?.totalFloors?.toString() || "",
      furnishing: initialData?.furnishing || undefined,
      condition: initialData?.condition || undefined,
      parking: initialData?.parking || undefined,
      internet: initialData?.internet ?? false,
      petPolicy: initialData?.petPolicy || undefined,
      smokingPolicy: initialData?.smokingPolicy || undefined,
      securityDeposit: initialData?.securityDeposit?.toString() || "",
      advancePayment: initialData?.advancePayment?.toString() || "",
      leaseDuration: initialData?.leaseDuration?.toString() || "",
      minStay: initialData?.minStay?.toString() || "",
      rentFrequency: initialData?.rentFrequency || undefined,
      fullAddress: initialData?.fullAddress || "",
      utilities: initialData?.utilities?.join(", ") || "",
      houseRules: initialData?.houseRules || "",
      rentalTerms: initialData?.rentalTerms || "",
      availableFrom: initialData?.availableFrom
        ? new Date(initialData.availableFrom).toISOString().split("T")[0]
        : "",
    },
  });

  const internetChecked = watch("internet");

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
      size: data.size ? Number(data.size) : undefined,
      balconies: data.balconies ? Number(data.balconies) : undefined,
      floor: data.floor ? Number(data.floor) : undefined,
      totalFloors: data.totalFloors ? Number(data.totalFloors) : undefined,
      securityDeposit: data.securityDeposit ? Number(data.securityDeposit) : undefined,
      advancePayment: data.advancePayment ? Number(data.advancePayment) : undefined,
      leaseDuration: data.leaseDuration ? Number(data.leaseDuration) : undefined,
      minStay: data.minStay ? Number(data.minStay) : undefined,
      utilities: data.utilities
        ? data.utilities.split(",").map((u) => u.trim()).filter(Boolean)
        : undefined,
      availableFrom: data.availableFrom ? new Date(data.availableFrom) : undefined,
      amenities: selectedAmenities,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl" noValidate>
      <SectionHeading>Basic Information</SectionHeading>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">Title</label>
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
        <label htmlFor="shortDescription" className="block text-sm font-medium mb-1.5">Short Description</label>
        <Input
          id="shortDescription"
          {...register("shortDescription")}
          placeholder="Brief one-liner about your property"
          maxLength={200}
        />
        {errors.shortDescription && <p role="alert" className="mt-1 text-sm text-destructive">{errors.shortDescription.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">Description</label>
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
          <label htmlFor="propertyType" className="block text-sm font-medium mb-1.5">Property Type</label>
          <select
            id="propertyType"
            {...register("propertyType")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1.5">Status</label>
          <select
            id="status"
            {...register("status")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {propertyStatuses.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <SectionHeading>Location</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">Location</label>
          <Input
            id="location"
            {...register("location")}
            placeholder="New York"
            aria-invalid={!!errors.location}
          />
          {errors.location && <p role="alert" className="mt-1 text-sm text-destructive">{errors.location.message}</p>}
        </div>
        <div>
          <label htmlFor="fullAddress" className="block text-sm font-medium mb-1.5">Full Address</label>
          <Input
            id="fullAddress"
            {...register("fullAddress")}
            placeholder="123 Main St, Apt 4B"
          />
        </div>
      </div>

      <SectionHeading>Pricing</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1.5">Price ($)</label>
          <Input
            id="price"
            type="number"
            {...register("price")}
            placeholder="1500"
            aria-invalid={!!errors.price}
          />
          {errors.price && <p role="alert" className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div>
          <label htmlFor="rentFrequency" className="block text-sm font-medium mb-1.5">Rent Frequency</label>
          <select
            id="rentFrequency"
            {...register("rentFrequency")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {rentFrequencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="securityDeposit" className="block text-sm font-medium mb-1.5">Security Deposit ($)</label>
          <Input
            id="securityDeposit"
            type="number"
            {...register("securityDeposit")}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="advancePayment" className="block text-sm font-medium mb-1.5">Advance Payment ($)</label>
          <Input
            id="advancePayment"
            type="number"
            {...register("advancePayment")}
            placeholder="0"
          />
        </div>
      </div>

      <SectionHeading>Property Details</SectionHeading>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium mb-1.5">Bedrooms</label>
          <Input
            id="bedrooms"
            type="number"
            {...register("bedrooms")}
            min="0"
          />
          {errors.bedrooms && <p role="alert" className="mt-1 text-sm text-destructive">{errors.bedrooms.message}</p>}
        </div>
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium mb-1.5">Bathrooms</label>
          <Input
            id="bathrooms"
            type="number"
            {...register("bathrooms")}
            min="0"
          />
          {errors.bathrooms && <p role="alert" className="mt-1 text-sm text-destructive">{errors.bathrooms.message}</p>}
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-medium mb-1.5">Size (sqft)</label>
          <Input
            id="size"
            type="number"
            {...register("size")}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="balconies" className="block text-sm font-medium mb-1.5">Balconies</label>
          <Input
            id="balconies"
            type="number"
            {...register("balconies")}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="floor" className="block text-sm font-medium mb-1.5">Floor</label>
          <Input
            id="floor"
            type="number"
            {...register("floor")}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="totalFloors" className="block text-sm font-medium mb-1.5">Total Floors</label>
          <Input
            id="totalFloors"
            type="number"
            {...register("totalFloors")}
            placeholder="0"
          />
        </div>
      </div>

      <SectionHeading>Condition & Furnishing</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="furnishing" className="block text-sm font-medium mb-1.5">Furnishing</label>
          <select
            id="furnishing"
            {...register("furnishing")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {furnishingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium mb-1.5">Condition</label>
          <select
            id="condition"
            {...register("condition")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {conditionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <SectionHeading>Parking & Internet</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="parking" className="block text-sm font-medium mb-1.5">Parking</label>
          <select
            id="parking"
            {...register("parking")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {parkingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            id="internet"
            type="checkbox"
            {...register("internet")}
            checked={internetChecked}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="internet" className="text-sm font-medium">Internet Included</label>
        </div>
      </div>

      <SectionHeading>Lease Terms</SectionHeading>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="leaseDuration" className="block text-sm font-medium mb-1.5">Lease Duration (months)</label>
          <Input
            id="leaseDuration"
            type="number"
            {...register("leaseDuration")}
            placeholder="12"
          />
        </div>
        <div>
          <label htmlFor="minStay" className="block text-sm font-medium mb-1.5">Min Stay (months)</label>
          <Input
            id="minStay"
            type="number"
            {...register("minStay")}
            placeholder="1"
          />
        </div>
        <div>
          <label htmlFor="availableFrom" className="block text-sm font-medium mb-1.5">Available From</label>
          <Input
            id="availableFrom"
            type="date"
            {...register("availableFrom")}
          />
        </div>
      </div>

      <SectionHeading>Policies</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="petPolicy" className="block text-sm font-medium mb-1.5">Pet Policy</label>
          <select
            id="petPolicy"
            {...register("petPolicy")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {petPolicyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="smokingPolicy" className="block text-sm font-medium mb-1.5">Smoking Policy</label>
          <select
            id="smokingPolicy"
            {...register("smokingPolicy")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {smokingPolicyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <SectionHeading>Amenities</SectionHeading>

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

      <SectionHeading>Utilities</SectionHeading>

      <div>
        <label htmlFor="utilities" className="block text-sm font-medium mb-1.5">Utilities (comma-separated)</label>
        <Input
          id="utilities"
          {...register("utilities")}
          placeholder="water, electricity, gas, internet"
        />
      </div>

      <SectionHeading>House Rules</SectionHeading>

      <div>
        <label htmlFor="houseRules" className="block text-sm font-medium mb-1.5">House Rules</label>
        <textarea
          id="houseRules"
          {...register("houseRules")}
          rows={3}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="No smoking, quiet hours after 10pm..."
        />
      </div>

      <SectionHeading>Rental Terms</SectionHeading>

      <div>
        <label htmlFor="rentalTerms" className="block text-sm font-medium mb-1.5">Rental Terms</label>
        <textarea
          id="rentalTerms"
          {...register("rentalTerms")}
          rows={3}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Payment due on the 1st, late fee applies..."
        />
      </div>

      <SectionHeading>Property Images</SectionHeading>

      <div>
        <ImageManager images={images} onChange={handleImagesChange} />
        {errors.images && <p className="mt-1 text-sm text-destructive">{errors.images.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
};
