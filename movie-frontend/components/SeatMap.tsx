"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Seat } from "@/lib/api";
import { getSession } from "@/lib/auth";

const TYPE_STYLES: Record<Seat["type"], { label: string; dot: string; price: string }> = {
  REGULAR: { label: "Regular", dot: "bg-muted", price: "text-muted" },
  PREMIUM: { label: "Premium", dot: "bg-spotlight", price: "text-spotlight" },
  RECLINER: { label: "Recliner", dot: "bg-marquee", price: "text-marquee" },
};

export default function SeatMap({
  showId,
  seats,
  seatsPerRow,
}: {
  showId: string;
  seats: Seat[];
  seatsPerRow: number;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const grouped = new Map<string, Seat[]>();
    for (const seat of seats) {
      if (!grouped.has(seat.row)) grouped.set(seat.row, []);
      grouped.get(seat.row)!.push(seat);
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }));
    }
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  const selectedSeats = seats.filter((s) => selected.has(s._id));
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== "AVAILABLE") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat._id)) {
        next.delete(seat._id);
      } else {
        next.add(seat._id);
      }
      return next;
    });
  };

  const handleConfirm = async () => {
    setError(null);

    const session = await getSession();
    if (!session.loggedIn) {
      router.push(`/login?redirect=/booking/${showId}/seats`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showId, seatIds: Array.from(selected) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create booking");
      // replace (not push): once seats are locked, Back should skip this
      // step entirely rather than showing a stale, already-consumed seat map
      router.replace(`/booking/${showId}/pay?bookingId=${json.data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Legend */}
      <div className="mb-8 flex flex-wrap items-center gap-6 font-mono text-xs text-muted">
        {(Object.keys(TYPE_STYLES) as Seat["type"][]).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-sm ${TYPE_STYLES[type].dot}`} />
            {TYPE_STYLES[type].label}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-border bg-void opacity-40" />
          Taken
        </div>
      </div>

      {/* Screen indicator */}
      <div className="mb-12 flex justify-center">
        <div className="w-3/4 max-w-md">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-transparent via-cream/40 to-transparent" />
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Screen this way
          </p>
        </div>
      </div>

      {/* Seat grid */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 overflow-x-auto">
        {rows.map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-5 shrink-0 font-mono text-xs text-muted">{row}</span>
            <div className="flex gap-1.5">
              {rowSeats.map((seat) => {
                const isSelected = selected.has(seat._id);
                const isTaken = seat.status !== "AVAILABLE";

                return (
                  <motion.button
                    key={seat._id}
                    disabled={isTaken}
                    onClick={() => toggleSeat(seat)}
                    whileHover={!isTaken ? { scale: 1.15, y: -2 } : {}}
                    whileTap={!isTaken ? { scale: 0.95 } : {}}
                    className={`group relative h-7 w-7 rounded-t-md border font-mono text-[9px] transition-colors ${
                      isTaken
                        ? "cursor-not-allowed border-border bg-void opacity-30"
                        : isSelected
                        ? "border-marquee bg-marquee text-cream"
                        : `border-border ${TYPE_STYLES[seat.type].dot} bg-opacity-20 hover:border-cream`
                    }`}
                    title={`${seat.seatNumber} · ${TYPE_STYLES[seat.type].label} · ₹${seat.price}`}
                  >
                    <span className="sr-only">{seat.seatNumber}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selection summary bar */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-panel/95 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="font-mono text-xs text-muted">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                </p>
                <p className="font-display text-2xl tracking-wide text-cream">
                  ₹{total}
                </p>
              </div>

              {error && (
                <p className="max-w-xs text-right font-mono text-xs text-marquee">{error}</p>
              )}

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="rounded bg-marquee px-8 py-3 font-mono text-sm uppercase tracking-wider text-cream transition-colors hover:bg-marquee-dim disabled:opacity-50"
              >
                {submitting ? "Locking seats…" : "Proceed to Pay"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
