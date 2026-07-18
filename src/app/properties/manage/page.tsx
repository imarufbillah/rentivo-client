"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PropertyManagementTable } from "@/components/properties/PropertyManagementTable";

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

          <PropertyManagementTable />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default ManagePropertiesPage;
