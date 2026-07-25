"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/auth";

interface BookingListItem {
  _id: string;
  showId: string;
  totalAmount: number;
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  paymentStatus: string;
  seatSnapshot: { seatNumber: string; type: string; price: number }[];
  createdAt: string;
}

const STATUS_STYLES: Record<BookingListItem["bookingStatus"], string> = {
  PENDING: "border-spotlight text-spotlight",
  CONFIRMED: "border-emerald-500 text-emerald-400",
  CANCELLED: "border-muted text-muted",
  EXPIRED: "border-marquee text-marquee",
};

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    const session = await getSession();
    if (!session.loggedIn || !session.user) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/bookings/user/${session.user.id}`);
    const json = await res.json();
    if (json.success) setBookings(json.data);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to cancel");
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="font-display text-4xl tracking-wide text-cream">My Bookings</h1>

          {loading ? (
            <p className="mt-8 font-mono text-sm text-muted">Loading…</p>
          ) : !loggedIn ? (
            <div className="mt-8 rounded border border-border bg-panel p-8 text-center">
              <p className="text-muted">Sign in to see your bookings.</p>
              <Link
                href="/login?redirect=/bookings"
                className="mt-4 inline-block rounded bg-marquee px-6 py-3 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:bg-marquee-dim"
              >
                Sign In
              </Link>
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-8 rounded border border-border bg-panel p-8 text-center">
              <p className="text-muted">No bookings yet — go find something to watch.</p>
              <Link
                href="/movies"
                className="mt-4 inline-block rounded bg-marquee px-6 py-3 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:bg-marquee-dim"
              >
                Browse Movies
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <p className="mt-6 font-mono text-xs text-marquee">{error}</p>
              )}

              <div className="mt-8 space-y-4">
                <AnimatePresence>
                  {bookings.map((booking, i) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="rounded border border-border bg-panel p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-[10px] text-muted">
                            #{booking._id}
                          </p>
                          <p className="mt-1 font-mono text-sm text-cream">
                            {booking.seatSnapshot.map((s) => s.seatNumber).join(", ")}
                          </p>
                          <p className="mt-1 font-display text-2xl tracking-wide text-spotlight">
                            ₹{booking.totalAmount}
                          </p>
                        </div>

                        <span
                          className={`rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLES[booking.bookingStatus]}`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>

                      {(booking.bookingStatus === "PENDING" ||
                        booking.bookingStatus === "CONFIRMED") && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="mt-4 rounded border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-marquee hover:text-marquee disabled:opacity-50"
                        >
                          {cancellingId === booking._id ? "Cancelling…" : "Cancel Booking"}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
