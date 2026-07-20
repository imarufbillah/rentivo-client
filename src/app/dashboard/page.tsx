"use client";

import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RecommendationFeed } from "@/components/recommendations/RecommendationFeed";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useAuth";
import { useMyProperties } from "@/hooks/useProperties";
import { useSavedProperties } from "@/hooks/useInteractions";
import { useMyRentals } from "@/hooks/useRentals";
import {
  Heart,
  Clock,
  Search,
  Home,
  Plus,
  Eye,
  Star,
  ArrowRight,
  Key,
} from "lucide-react";

const RenterDashboard = ({ userName }: { userName: string }) => {
  const { data: savedData } = useSavedProperties();
  const { data: rentalsData } = useMyRentals();
  const savedCount = savedData?.properties?.length || 0;
  const rentals = rentalsData?.rentals || [];
  const activeRentals = rentals.filter((r) => r.status === "active");

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome back, {userName || "there"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find your next perfect rental home.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link href="/saved" className="group">
          <div className="rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              Saved
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {savedCount}
            </p>
          </div>
        </Link>
        <Link href="/history" className="group">
          <div className="rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Active Rentals
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {activeRentals.length}
            </p>
          </div>
        </Link>
        <Link href="/properties" className="group">
          <div className="rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              Browse
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Find properties
            </p>
          </div>
        </Link>
      </div>

      {/* Active rentals preview */}
      {activeRentals.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">Your Rentals</h2>
            <Link
              href="/history"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeRentals.slice(0, 3).map((rental) => (
              <Link
                key={rental._id?.toString()}
                href={`/properties/${rental.propertyId}`}
                className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                {rental.property?.images?.[0] ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={rental.property.images[0]}
                      alt={rental.property.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Key className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-foreground">
                    {rental.property?.title || "Property"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {rental.property?.location}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                  Active
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <RecommendationFeed />
    </div>
  );
};

const OwnerDashboard = ({ userName }: { userName: string }) => {
  const { data } = useMyProperties();
  const properties = data?.properties || [];

  const totals = properties.reduce(
    (acc, p) => ({
      views: acc.views + p.viewCount,
      saves: acc.saves + p.saveCount,
      reviews: acc.reviews + p.totalReviews,
    }),
    { views: 0, saves: 0, reviews: 0 }
  );

  const avgRating =
    properties.length > 0
      ? properties.reduce((acc, p) => acc + (p.averageRating || 0), 0) /
        properties.length
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome back, {userName || "there"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s how your properties are performing.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            Properties
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {properties.length}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            Total Views
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {totals.views}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            Total Saves
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {totals.saves}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            Avg Rating
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {avgRating > 0 ? avgRating.toFixed(1) : "\u2014"}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/properties/add">
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
        <Link href="/properties/manage">
          <Button variant="outline" className="rounded-full">
            Manage Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Recent properties */}
      {properties.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">
              Your Properties
            </h2>
            <Link
              href="/properties/manage"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {properties.slice(0, 5).map((property) => (
              <Link
                key={property._id?.toString()}
                href={`/properties/${property._id}`}
                className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                {property.images?.[0] ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Home className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-foreground">
                    {property.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {property.location}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {property.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {property.saveCount}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    property.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : property.status === "rented"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {property.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const isOwner = user?.role === "owner";
  const userName = (user?.name as string) || "";

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {isOwner ? (
          <OwnerDashboard userName={userName} />
        ) : (
          <RenterDashboard userName={userName} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
