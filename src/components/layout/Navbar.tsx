"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useSession } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user as Record<string, unknown> | undefined;
  const isAuthenticated = !!user;
  const isOwner = user?.role === "owner";
  const userName = (user?.name as string) || "";
  const userImage = user?.image as string | undefined;

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/properties", label: "Properties" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ...(isAuthenticated ? [{ href: "/saved", label: "Saved" }] : []),
    ...(isAuthenticated ? [{ href: "/history", label: "History" }] : []),
    ...(isOwner
      ? [{ href: "/properties/manage", label: "My Properties" }]
      : []),
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3"
            : "py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className={`mx-auto flex items-center justify-between px-6 py-3 transition-all duration-300 ${
              scrolled
                ? "bg-background/80 shadow-md backdrop-blur-xl"
                : "bg-background/60 backdrop-blur-md"
            } rounded-full`}
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight"
            >
              <span className="text-primary">Rentivo</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  {!isOwner && (
                    <Link href="/upgrade">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-sm"
                      >
                        Become an Owner
                      </Button>
                    </Link>
                  )}
                  <Link href="/properties/add">
                    <Button
                      size="sm"
                      className="rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add Property
                    </Button>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted/50"
                    aria-label="Go to profile"
                  >
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={userName || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-2 ring-border">
                        {initials}
                      </div>
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="rounded-full text-sm text-muted-foreground"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-sm"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden relative h-10 w-10 flex items-center justify-center rounded-full transition-colors hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isAuthenticated && userImage ? (
                      <Image
                        src={userImage}
                        alt={userName || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-50 rounded-2xl border bg-background p-4 shadow-lg lg:hidden"
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={link.href}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.03 }}
                  >
                    <Link
                      href="/profile"
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </motion.div>
                )}

                <div className="my-2 h-px bg-border" />

                <div className="flex items-center justify-center py-2">
                  <ThemeToggle />
                </div>

                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 pt-2">
                    {!isOwner && (
                      <Link href="/upgrade" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full rounded-full">
                          Become an Owner
                        </Button>
                      </Link>
                    )}
                    <Link href="/properties/add" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Add Property
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full rounded-full text-muted-foreground"
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full rounded-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};
