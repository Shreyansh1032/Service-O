"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

// Always fetch fresh booking data — including on browser back/forward —
// so a completed/cancelled booking never shows a stale countdown.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface BookingDetail {
  _id: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  expiresAt: string;
  seatSnapshot: { seatNumber: string; type: string; price: number }[];
}

function useCountdown(expiresAt: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();

    const tick = () => {
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setRemaining(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return remaining;
}

function PaymentContent() {
  const router = useRouter();
  const params = useParams<{ showId: string }>();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET">("UPI");

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) {
          setError(json.message || "Booking not found");
          return;
        }

        // If this booking already went through (e.g. user hit Back after
        // paying, or the page was revisited later), don't show a stale
        // countdown — send them straight to where they actually are.
        if (json.data.bookingStatus === "CONFIRMED") {
          router.replace(`/booking/${params.showId}/confirmation?bookingId=${bookingId}`);
          return;
        }

        setBooking(json.data);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const remaining = useCountdown(booking?.expiresAt ?? null);
  const settled = booking?.bookingStatus === "CANCELLED" || booking?.bookingStatus === "EXPIRED";
  const expired = settled || remaining === 0;

  const handlePay = async () => {
    if (!bookingId) return;
    setPaying(true);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, paymentMethod: method, simulate: "SUCCESS" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Payment failed");
      // replace (not push): once payment succeeds, Back should skip this
      // step rather than returning to a checkout for an already-paid booking
      router.replace(`/booking/${params.showId}/confirmation?bookingId=${bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center font-mono text-muted">Loading booking…</div>;
  }

  if (!booking) {
    return (
      <div className="py-24 text-center font-mono text-marquee">
        {error || "Booking not found"}
      </div>
    );
  }

  const minutes = remaining !== null ? Math.floor(remaining / 60) : 0;
  const seconds = remaining !== null ? remaining % 60 : 0;

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-4xl tracking-wide text-cream">Checkout</h1>

        {!expired && remaining !== null && (
          <p className="mt-2 font-mono text-xs text-spotlight">
            Seats held for {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        )}

        {expired && (
          <p className="mt-2 font-mono text-xs text-marquee">
            {settled
              ? "This booking is no longer active. Please select seats again."
              : "Your seat hold has expired. Please select seats again."}
          </p>
        )}

        {/* Seat summary */}
        <div className="mt-8 rounded border border-border bg-panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Your seats</p>
          <div className="mt-3 space-y-2">
            {booking.seatSnapshot.map((seat) => (
              <div key={seat.seatNumber} className="flex justify-between font-mono text-sm">
                <span className="text-cream">
                  {seat.seatNumber} <span className="text-muted">({seat.type})</span>
                </span>
                <span className="text-cream">₹{seat.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-2xl tracking-wide text-cream">
            <span>Total</span>
            <span>₹{booking.totalAmount}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Pay with</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(["UPI", "CARD", "NETBANKING", "WALLET"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded border py-2 font-mono text-xs transition-colors ${
                  method === m
                    ? "border-marquee bg-marquee text-cream"
                    : "border-border text-muted hover:border-cream hover:text-cream"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 font-mono text-xs text-marquee"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handlePay}
          disabled={paying || expired}
          className="mt-8 w-full rounded bg-marquee py-4 font-mono text-sm uppercase tracking-wider text-cream transition-colors hover:bg-marquee-dim disabled:opacity-40"
        >
          {paying ? "Processing…" : `Pay ₹${booking.totalAmount}`}
        </button>

        <p className="mt-3 text-center font-mono text-[10px] text-muted">
          This is a simulated payment for demo purposes.
        </p>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <PaymentContent />
        </Suspense>
      </main>
    </>
  );
}
