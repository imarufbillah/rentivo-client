"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  User,
  Home,
  Heart,
  Clock,
  Settings,
  BarChart3,
  Key,
  ArrowUpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";
import { useSession, useCurrentUser } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: currentUser } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = currentUser;
  const isAuthenticated = !!session;
  const isOwner = user?.role === "owner";
  const userName = user?.name || "";
  const userImage = user?.avatar || user?.image;

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
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (profileOpen) setProfileOpen(false);
      }
    },
    [mobileMenuOpen, profileOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-menu]")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties", exact: true },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
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
                    isActive(link.href, link.exact)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                  {isActive(link.href, link.exact) && (
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
              <Tooltip>
                <TooltipTrigger render={<div />}>
                  <ThemeToggle />
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
              {isAuthenticated ? (
                <>
                  {isOwner && (
                    <Link href="/properties/add">
                      <Button
                        size="sm"
                        className="rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Add Property
                      </Button>
                    </Link>
                  )}

                  {/* Profile dropdown */}
                  <div className="relative" data-profile-menu>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted/50"
                      aria-label="Account menu"
                      aria-expanded={profileOpen}
                      aria-haspopup="true"
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
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border bg-card shadow-lg"
                          role="menu"
                        >
                          <div className="border-b px-4 py-3">
                            <p className="text-sm font-medium">
                              {userName || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email as string}
                            </p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/dashboard"
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                isActive("/dashboard")
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              }`}
                              role="menuitem"
                            >
                              <Home className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <Link
                              href="/saved"
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                isActive("/saved")
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              }`}
                              role="menuitem"
                            >
                              <Heart className="h-4 w-4" />
                              Saved Properties
                            </Link>
                            <Link
                              href="/history"
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                isActive("/history")
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              }`}
                              role="menuitem"
                            >
                              <Clock className="h-4 w-4" />
                              History
                            </Link>
                            <Link
                              href="/profile"
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                isActive("/profile")
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              }`}
                              role="menuitem"
                            >
                              <User className="h-4 w-4" />
                              Profile
                            </Link>
                          </div>
                          {isOwner && (
                            <div className="border-t py-1">
                              <Link
                                href="/properties/manage"
                                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                  isActive("/properties/manage")
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                                role="menuitem"
                              >
                                <BarChart3 className="h-4 w-4" />
                                My Properties
                              </Link>
                            </div>
                          )}
                          {!isOwner && (
                            <div className="border-t py-1">
                              <Link
                                href="/upgrade"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                role="menuitem"
                              >
                                <ArrowUpCircle className="h-4 w-4" />
                                Become an Owner
                              </Link>
                            </div>
                          )}
                          <div className="border-t py-1">
                            <button
                              onClick={handleSignOut}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              role="menuitem"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border bg-background p-4 shadow-lg lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {/* Public nav */}
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
                        isActive(link.href, link.exact)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Authenticated links — flat list */}
                {isAuthenticated && (
                  <>
                    <div className="my-2 h-px bg-border" />
                    {[
                      { href: "/dashboard", label: "Dashboard", icon: Home },
                      { href: "/saved", label: "Saved Properties", icon: Heart },
                      { href: "/history", label: "History", icon: Clock },
                      { href: "/profile", label: "Profile", icon: User },
                      ...(isOwner
                        ? [
                            {
                              href: "/properties/manage",
                              label: "My Properties",
                              icon: BarChart3,
                            },
                          ]
                        : []),
                    ].map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 1 + i) * 0.03 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                            isActive(link.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </>
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
                    {isOwner && (
                      <Link href="/properties/add" onClick={() => setMobileMenuOpen(false)}>
                        <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Add Property
                        </Button>
                      </Link>
                    )}
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

    </>
  );
};
