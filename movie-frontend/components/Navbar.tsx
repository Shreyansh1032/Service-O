"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout, type User } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session.user ?? null);
      setChecked(true);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border bg-void/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl tracking-wide text-cream">
          service<span className="text-marquee">-O</span>
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-wider text-muted sm:flex">
          <Link href="/movies" className="hover:text-cream transition-colors">
            Movies
          </Link>
          <Link href="/bookings" className="hover:text-cream transition-colors">
            My Bookings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!checked ? null : user ? (
            <>
              <span className="font-mono text-xs text-muted">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:border-marquee hover:text-marquee"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:border-marquee hover:text-marquee"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
