"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Property,
  PropertyStatus,
  FurnishingStatus,
  PropertyCondition,
  ParkingStatus,
  PetPolicy,
  SmokingPolicy,
  RentFrequency,
} from "@/../../rentivo-server/src/types";
import { ImageManager } from "./ImageManager";
import { useAmenities } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";

const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z
    .string()
    .max(200, "Short description must be 200 characters or less")
    .optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Price must be positive"
  ),
  location: z.string().min(2, "Location is required"),
  propertyType: z.enum(["apartment", "house", "room", "studio", "villa"]),
  status: z.enum(["active", "pending", "archived", "rented"]),
  images: z
    .array(z.string().url())
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed"),
  bedrooms: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Bedrooms must be 0 or more"
    ),
  bathrooms: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Bathrooms must be 0 or more"
    ),
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
  onSubmit: (
    data: Omit<Property, "_id" | "ownerId" | "createdAt" | "updatedAt">
  ) => void;
  isLoading?: boolean;
}

const propertyTypes = ["apartment", "house", "room", "studio", "villa"] as const;
const propertyStatuses: readonly PropertyStatus[] = [
  "active",
  "pending",
  "archived",
  "rented",
];
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

const inputClass =
  "w-full rounded-xl border bg-card py-2.5 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-6 mb-4 border-b pb-2 font-display text-sm font-bold text-foreground">
    {children}
  </h3>
);

export const PropertyForm = ({
  initialData,
  onSubmit,
  isLoading,
}: PropertyFormProps) => {
  const [images, setImages] = useState<string[]>(
    initialData?.images || []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  );
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
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
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
      securityDeposit: data.securityDeposit
        ? Number(data.securityDeposit)
        : undefined,
      advancePayment: data.advancePayment
        ? Number(data.advancePayment)
        : undefined,
      leaseDuration: data.leaseDuration
        ? Number(data.leaseDuration)
        : undefined,
      minStay: data.minStay ? Number(data.minStay) : undefined,
      utilities: data.utilities
        ? data.utilities
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean)
        : undefined,
      availableFrom: data.availableFrom
        ? new Date(data.availableFrom)
        : undefined,
      amenities: selectedAmenities,
      images,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-2xl space-y-6"
      noValidate
    >
      <SectionHeading>Basic Information</SectionHeading>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          placeholder="Cozy apartment downtown"
          className={inputClass}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="shortDescription"
          className="text-sm font-medium text-foreground"
        >
          Short Description
        </label>
        <input
          id="shortDescription"
          {...register("shortDescription")}
          placeholder="Brief one-liner about your property"
          maxLength={200}
          className={inputClass}
        />
        {errors.shortDescription && (
          <p role="alert" className="text-sm text-destructive">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className={inputClass}
          placeholder="Describe your property in detail..."
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p
            id="description-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="propertyType"
            className="text-sm font-medium text-foreground"
          >
            Property Type
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            className={inputClass}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-foreground"
          >
            Status
          </label>
          <select id="status" {...register("status")} className={inputClass}>
            {propertyStatuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SectionHeading>Location</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="location"
            className="text-sm font-medium text-foreground"
          >
            Location
          </label>
          <input
            id="location"
            {...register("location")}
            placeholder="New York"
            className={inputClass}
            aria-invalid={!!errors.location}
          />
          {errors.location && (
            <p role="alert" className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="fullAddress"
            className="text-sm font-medium text-foreground"
          >
            Full Address
          </label>
          <input
            id="fullAddress"
            {...register("fullAddress")}
            placeholder="123 Main St, Apt 4B"
            className={inputClass}
          />
        </div>
      </div>

      <SectionHeading>Pricing</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="text-sm font-medium text-foreground"
          >
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            {...register("price")}
            placeholder="1500"
            className={inputClass}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p role="alert" className="text-sm text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="rentFrequency"
            className="text-sm font-medium text-foreground"
          >
            Rent Frequency
          </label>
          <select
            id="rentFrequency"
            {...register("rentFrequency")}
            className={inputClass}
          >
            <option value="">Select...</option>
            {rentFrequencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="securityDeposit"
            className="text-sm font-medium text-foreground"
          >
            Security Deposit ($)
          </label>
          <input
            id="securityDeposit"
            type="number"
            {...register("securityDeposit")}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="advancePayment"
            className="text-sm font-medium text-foreground"
          >
            Advance Payment ($)
          </label>
          <input
            id="advancePayment"
            type="number"
            {...register("advancePayment")}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      <SectionHeading>Property Details</SectionHeading>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="bedrooms"
            className="text-sm font-medium text-foreground"
          >
            Bedrooms
          </label>
          <input
            id="bedrooms"
            type="number"
            {...register("bedrooms")}
            min="0"
            className={inputClass}
          />
          {errors.bedrooms && (
            <p role="alert" className="text-sm text-destructive">
              {errors.bedrooms.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="bathrooms"
            className="text-sm font-medium text-foreground"
          >
            Bathrooms
          </label>
          <input
            id="bathrooms"
            type="number"
            {...register("bathrooms")}
            min="0"
            className={inputClass}
          />
          {errors.bathrooms && (
            <p role="alert" className="text-sm text-destructive">
              {errors.bathrooms.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="size"
            className="text-sm font-medium text-foreground"
          >
            Size (sqft)
          </label>
          <input
            id="size"
            type="number"
            {...register("size")}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="balconies"
            className="text-sm font-medium text-foreground"
          >
            Balconies
          </label>
          <input
            id="balconies"
            type="number"
            {...register("balconies")}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="floor"
            className="text-sm font-medium text-foreground"
          >
            Floor
          </label>
          <input
            id="floor"
            type="number"
            {...register("floor")}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="totalFloors"
            className="text-sm font-medium text-foreground"
          >
            Total Floors
          </label>
          <input
            id="totalFloors"
            type="number"
            {...register("totalFloors")}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      <SectionHeading>Condition & Furnishing</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="furnishing"
            className="text-sm font-medium text-foreground"
          >
            Furnishing
          </label>
          <select
            id="furnishing"
            {...register("furnishing")}
            className={inputClass}
          >
            <option value="">Select...</option>
            {furnishingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="condition"
            className="text-sm font-medium text-foreground"
          >
            Condition
          </label>
          <select
            id="condition"
            {...register("condition")}
            className={inputClass}
          >
            <option value="">Select...</option>
            {conditionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SectionHeading>Parking & Internet</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="parking"
            className="text-sm font-medium text-foreground"
          >
            Parking
          </label>
          <select
            id="parking"
            {...register("parking")}
            className={inputClass}
          >
            <option value="">Select...</option>
            {parkingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            id="internet"
            type="checkbox"
            {...register("internet")}
            checked={internetChecked}
            className="rounded"
          />
          <label
            htmlFor="internet"
            className="text-sm font-medium text-foreground"
          >
            Internet Included
          </label>
        </div>
      </div>

      <SectionHeading>Lease Terms</SectionHeading>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="leaseDuration"
            className="text-sm font-medium text-foreground"
          >
            Lease Duration (months)
          </label>
          <input
            id="leaseDuration"
            type="number"
            {...register("leaseDuration")}
            placeholder="12"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="minStay"
            className="text-sm font-medium text-foreground"
          >
            Min Stay (months)
          </label>
          <input
            id="minStay"
            type="number"
            {...register("minStay")}
            placeholder="1"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="availableFrom"
            className="text-sm font-medium text-foreground"
          >
            Available From
          </label>
          <input
            id="availableFrom"
            type="date"
            {...register("availableFrom")}
            className={inputClass}
          />
        </div>
      </div>

      <SectionHeading>Policies</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="petPolicy"
            className="text-sm font-medium text-foreground"
          >
            Pet Policy
          </label>
          <select
            id="petPolicy"
            {...register("petPolicy")}
            className={inputClass}
          >
            <option value="">Select...</option>
            {petPolicyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="smokingPolicy"
            className="text-sm font-medium text-foreground"
          >
            Smoking Policy
          </label>
          <select
            id="smokingPolicy"
            {...register("smokingPolicy")}
            className={inputClass}
          >
            <option value="">Select...</option>
            {smokingPolicyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
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
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {amenity.label}
            </button>
          );
        })}
      </div>

      <SectionHeading>Utilities</SectionHeading>

      <div className="space-y-2">
        <label
          htmlFor="utilities"
          className="text-sm font-medium text-foreground"
        >
          Utilities (comma-separated)
        </label>
        <input
          id="utilities"
          {...register("utilities")}
          placeholder="water, electricity, gas, internet"
          className={inputClass}
        />
      </div>

      <SectionHeading>House Rules</SectionHeading>

      <div className="space-y-2">
        <label
          htmlFor="houseRules"
          className="text-sm font-medium text-foreground"
        >
          House Rules
        </label>
        <textarea
          id="houseRules"
          {...register("houseRules")}
          rows={3}
          className={inputClass}
          placeholder="No smoking, quiet hours after 10pm..."
        />
      </div>

      <SectionHeading>Rental Terms</SectionHeading>

      <div className="space-y-2">
        <label
          htmlFor="rentalTerms"
          className="text-sm font-medium text-foreground"
        >
          Rental Terms
        </label>
        <textarea
          id="rentalTerms"
          {...register("rentalTerms")}
          rows={3}
          className={inputClass}
          placeholder="Payment due on the 1st, late fee applies..."
        />
      </div>

      <SectionHeading>Property Images</SectionHeading>

      <div>
        <ImageManager images={images} onChange={handleImagesChange} />
        {errors.images && (
          <p className="mt-1 text-sm text-destructive">
            {errors.images.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {isLoading
          ? "Saving..."
          : initialData
            ? "Update Property"
            : "Create Property"}
      </Button>
    </form>
  );
};
