"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Movie } from "@/lib/api";

export default function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/movies/${movie._id}`} className="group block">
        <div className="relative overflow-hidden rounded-md bg-panel aspect-[2/3]">
          {movie.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted font-display text-2xl tracking-wide">
              NO POSTER
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-void/80 px-2 py-1 backdrop-blur-sm">
            <span className="text-spotlight font-mono text-xs">★</span>
            <span className="font-mono text-xs text-cream">{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="mt-3 font-display text-2xl leading-none tracking-wide text-cream group-hover:text-marquee transition-colors">
          {movie.title}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted">
          {movie.genre.slice(0, 2).join(" / ")} · {movie.duration}min
        </p>
      </Link>
    </motion.div>
  );
}
