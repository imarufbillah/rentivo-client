"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Clock, User, BarChart3, Compass } from "lucide-react";
import { useSession } from "@/hooks/useAuth";

export const BottomNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const isAuthenticated = !!user;
  const isOwner = user?.role === "owner";

  if (!isAuthenticated) return null;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/saved", label: "Saved", icon: Heart },
    { href: "/history", label: "History", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
    ...(isOwner
      ? [{ href: "/properties/manage", label: "My Props", icon: BarChart3 }]
      : [{ href: "/properties", label: "Explore", icon: Compass }]),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-xl lg:hidden"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
              isActive(link.href)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
