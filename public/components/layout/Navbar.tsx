"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { Menu, X, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useRole";
import { useTheme } from "@/hooks/useTheme";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/members", label: "Members" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const isAdmin = useIsAdmin();
  const { theme, toggleTheme, isMounted } = useTheme();

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 20));
  }, [scrollY]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-white/5 border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 select-none rounded-lg overflow-hidden bg-white p-0.5 border border-text-primary/10 transition-transform group-hover:scale-105 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Kaizen Tech Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-accent-primary">Kaizen</span>
            <span className="text-text-primary"> Tech</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-accent-primary",
                pathname === link.href
                  ? "text-accent-primary"
                  : "text-text-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-accent-primary hover:bg-text-primary/5 transition-colors mr-1"
          >
            {isMounted ? (
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 360, scale: theme === "dark" ? 1 : 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-accent-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-accent-primary" />
                )}
              </motion.div>
            ) : (
              <Sun className="w-5 h-5 text-accent-primary opacity-50" />
            )}
          </button>

          {user ? (
            <>
              {isAdmin && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-sm"
              >
                <span className="w-8 h-8 rounded-full bg-accent-secondary/30 flex items-center justify-center text-xs font-bold border border-white/10">
                  {profile?.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.photoURL}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(profile?.name || user.email || "U")
                  )}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        className="md:hidden overflow-hidden glass border-t border-white/10"
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between py-2 border-b border-text-primary/10 mb-2">
            <span className="text-sm font-medium text-text-muted">Theme</span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-accent-primary hover:bg-text-primary/5 transition-colors"
            >
              {isMounted ? (
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 0 : 360, scale: theme === "dark" ? 1 : 0.9 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-accent-primary" />
                  ) : (
                    <Moon className="w-5 h-5 text-accent-primary" />
                  )}
                </motion.div>
              ) : (
                <Sun className="w-5 h-5 text-accent-primary opacity-50" />
              )}
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-text-muted hover:text-accent-primary"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            isAdmin && (
              <Link href="/dashboard" className="py-2 text-accent-primary">
                Dashboard
              </Link>
            )
          ) : (
            <>
              <Link href="/auth/login" className="py-2">
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </header>
  );
}
