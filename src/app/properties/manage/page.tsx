"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PropertyManagementTable } from "@/components/properties/PropertyManagementTable";
import { useMyProperties } from "@/hooks/useProperties";
import { Eye, Heart, Star, Home } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SummaryCards = () => {
  const { data } = useMyProperties();
  const properties = data?.properties || [];

  const totals = properties.reduce(
    (acc, p) => ({
      views: acc.views + p.viewCount,
      saves: acc.saves + p.saveCount,
      reviews: acc.reviews + p.totalReviews,
      properties: acc.properties + 1,
    }),
    { views: 0, saves: 0, reviews: 0, properties: 0 }
  );

  const avgRating =
    properties.length > 0
      ? properties.reduce((acc, p) => acc + (p.averageRating || 0), 0) / properties.length
      : 0;

  const cards = [
    { label: "Properties", value: totals.properties, icon: Home },
    { label: "Total Views", value: totals.views, icon: Eye },
    { label: "Total Saves", value: totals.saves, icon: Heart },
    { label: "Avg Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <card.icon className="h-4 w-4" />
            {card.label}
          </div>
          <p className="mt-2 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

const PropertyChart = () => {
  const { data } = useMyProperties();
  const properties = data?.properties || [];

  if (properties.length === 0) return null;

  const chartData = properties.map((p) => ({
    name: p.title.length > 15 ? p.title.slice(0, 15) + "..." : p.title,
    views: p.viewCount,
    saves: p.saveCount,
  }));

  return (
    <div className="mb-8 rounded-xl border p-4">
      <h2 className="mb-4 text-lg font-semibold">Property Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" radius={[4, 4, 0, 0]} />
          <Bar dataKey="saves" fill="hsl(142, 71%, 45%)" name="Saves" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ManagePropertiesPage = () => {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="owner">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Properties</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your property listings
              </p>
            </div>
            <Link href="/properties/add">
              <Button>Add Property</Button>
            </Link>
          </div>

          <SummaryCards />
          <PropertyChart />
          <PropertyManagementTable />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default ManagePropertiesPage;
