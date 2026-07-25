"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Show } from "@/lib/api";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function ShowtimePicker({ shows }: { shows: Show[] }) {
  const router = useRouter();

  const dates = useMemo(() => {
    const unique = Array.from(new Set(shows.map((s) => s.showDate.slice(0, 10))));
    return unique.sort();
  }, [shows]);

  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "");

  const theatreGroups = useMemo(() => {
    const filtered = shows.filter((s) => s.showDate.slice(0, 10) === selectedDate);
    const groups = new Map<string, { theatre: Show["theatre"]; shows: Show[] }>();

    for (const show of filtered) {
      const key = show.theatre._id;
      if (!groups.has(key)) {
        groups.set(key, { theatre: show.theatre, shows: [] });
      }
      groups.get(key)!.shows.push(show);
    }

    return Array.from(groups.values());
  }, [shows, selectedDate]);

  if (shows.length === 0) {
    return (
      <div className="rounded border border-border bg-panel p-8 text-center text-muted">
        No showtimes scheduled for this film yet.
      </div>
    );
  }

  return (
    <div>
      {/* Date selector */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`shrink-0 rounded border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              selectedDate === date
                ? "border-marquee bg-marquee text-cream"
                : "border-border text-muted hover:border-cream hover:text-cream"
            }`}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>

      {/* Theatre groups */}
      <div className="space-y-6">
        {theatreGroups.map(({ theatre, shows: theatreShows }, i) => (
          <motion.div
            key={theatre._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded border border-border bg-panel p-5"
          >
            <h3 className="font-display text-xl tracking-wide text-cream">
              {theatre.name}
            </h3>
            <p className="mt-1 font-mono text-xs text-muted">{theatre.city}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              {theatreShows.map((show) => (
                <button
                  key={show._id}
                  onClick={() => router.push(`/booking/${show._id}/seats`)}
                  className="group rounded border border-border px-4 py-2 transition-colors hover:border-spotlight"
                >
                  <span className="font-mono text-sm text-cream group-hover:text-spotlight">
                    {show.startTime}
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted">
                    ₹{show.price}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
