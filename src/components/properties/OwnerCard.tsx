"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 font-semibold">Listed by</h3>
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium">
            {owner.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{owner.name}</p>
            {owner.isVerified && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
          {owner.bio && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{owner.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};
