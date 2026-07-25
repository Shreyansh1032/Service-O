"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface BookingDetail {
  _id: string;
  totalAmount: number;
  bookingStatus: string;
  seatSnapshot: { seatNumber: string; type: string; price: number }[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetail | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setBooking(json.data);
      });
  }, [bookingId]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-marquee"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewBox="0 0 24 24"
          className="h-10 w-10"
          fill="none"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="#F5F0E8"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 font-display text-4xl tracking-wide text-cream"
      >
        You&apos;re all set
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-2 text-sm text-muted"
      >
        Your booking is confirmed. Enjoy the show.
      </motion.p>

      {booking && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="sprocket-frame my-6 w-full rounded border border-border bg-panel p-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-marquee">
            Ticket
          </p>
          <p className="mt-1 font-mono text-xs text-muted">#{booking._id}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {booking.seatSnapshot.map((seat) => (
              <span
                key={seat.seatNumber}
                className="rounded border border-border px-3 py-1 font-mono text-xs text-cream"
              >
                {seat.seatNumber}
              </span>
            ))}
          </div>

          <p className="mt-4 font-display text-3xl tracking-wide text-spotlight">
            ₹{booking.totalAmount}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-4 flex gap-3"
      >
        <Link
          href="/bookings"
          className="rounded border border-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:border-marquee hover:text-marquee"
        >
          My Bookings
        </Link>
        <Link
          href="/"
          className="rounded bg-marquee px-6 py-3 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:bg-marquee-dim"
        >
          Browse More
        </Link>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <ConfirmationContent />
        </Suspense>
      </main>
    </>
  );
}
