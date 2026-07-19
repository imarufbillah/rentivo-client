"use client";

import Image from "next/image";
import { PropertyOwner } from "@/hooks/useProperties";
import { ShieldCheck } from "lucide-react";

interface OwnerCardProps {
  owner: PropertyOwner;
}

export const OwnerCard = ({ owner }: OwnerCardProps) => {
  const memberSince = new Date(owner.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 font-display text-sm font-bold">Listed by</h3>
      <div className="flex items-start gap-3">
        {owner.avatar ? (
          <Image
            src={owner.avatar}
            alt={owner.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium text-muted-foreground">
            {owner.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-foreground">
              {owner.name}
            </p>
            {owner.isVerified && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Member since {memberSince}
          </p>
          {owner.bio && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {owner.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
