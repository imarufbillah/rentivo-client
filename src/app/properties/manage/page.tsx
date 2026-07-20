"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PropertyManagementTable } from "@/components/properties/PropertyManagementTable";
import { useMyProperties } from "@/hooks/useProperties";
import { PropertyWithStats } from "@/types";
import { Eye, Heart, Star, Home, Plus, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SummaryCards = () => {
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

  const cards = [
    { label: "Properties", value: properties.length, icon: Home },
    { label: "Total Views", value: totals.views, icon: Eye },
    { label: "Total Saves", value: totals.saves, icon: Heart },
    {
      label: "Avg Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "\u2014",
      icon: Star,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <card.icon className="h-3.5 w-3.5 text-primary" />
            </div>
            {card.label}
          </div>
          <p className="mt-2.5 font-display text-2xl font-bold text-foreground">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const PropertyChart = () => {
  const { data } = useMyProperties();
  const properties = data?.properties || [];

  if (properties.length === 0) return null;

  const chartData = properties.map((p: PropertyWithStats) => ({
    name: p.title.length > 15 ? p.title.slice(0, 15) + "..." : p.title,
    views: p.viewCount,
    saves: p.saveCount,
  }));

  return (
    <div className="mb-8 rounded-2xl border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display text-sm font-bold">Property Performance</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="views"
            fill="var(--chart-1)"
            name="Views"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="saves"
            fill="var(--chart-3)"
            name="Saves"
            radius={[4, 4, 0, 0]}
          />
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
              <h1 className="font-display text-2xl font-bold">
                My Properties
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your property listings and track performance
              </p>
            </div>
            <Link href="/properties/add">
              <Button className="rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
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
