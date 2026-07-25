"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { Movie } from "@/lib/api";

export default function FilmstripHero({ movies }: { movies: Movie[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const featured = movies.slice(0, 8);

  return (
    <section className="relative overflow-hidden border-b border-border pb-20 pt-28">
      {/* Ambient spotlight glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-marquee/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-marquee"
        >
          service-O presents
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-display text-6xl leading-[0.9] tracking-wide text-cream sm:text-8xl"
        >
          THE LIGHTS ARE
          <br />
          ABOUT TO DIM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-6 max-w-md text-sm text-muted"
        >
          Pick a seat. Grab the popcorn. Your next favorite film is already on screen.
        </motion.p>
      </div>

      {/* Filmstrip carousel */}
      <div className="relative mt-16">
        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />

        <div
          ref={trackRef}
          className="scrollbar-none flex gap-6 overflow-x-auto px-24 py-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {featured.map((movie, i) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
              style={{ scrollSnapAlign: "center" }}
              className="group shrink-0"
            >
              <Link href={`/movies/${movie._id}`}>
                <div className="sprocket-frame my-4 h-72 w-48 overflow-hidden bg-panel-raised shadow-2xl transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
                  {movie.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center font-display text-xl text-muted">
                      {movie.title}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
