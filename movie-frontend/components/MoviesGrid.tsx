"use client";

import { useMemo, useState } from "react";
import MovieCard from "@/components/MovieCard";
import type { Movie } from "@/lib/api";

export default function MoviesGrid({ movies }: { movies: Movie[] }) {
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  const genres = useMemo(
    () => Array.from(new Set(movies.flatMap((m) => m.genre))).sort(),
    [movies]
  );
  const languages = useMemo(
    () => Array.from(new Set(movies.flatMap((m) => m.language))).sort(),
    [movies]
  );

  const filtered = movies.filter((m) => {
    if (genreFilter && !m.genre.includes(genreFilter)) return false;
    if (languageFilter && !m.language.includes(languageFilter)) return false;
    return true;
  });

  const clearFilters = () => {
    setGenreFilter(null);
    setLanguageFilter(null);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          Genre:
        </span>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenreFilter(genreFilter === genre ? null : genre)}
            className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              genreFilter === genre
                ? "border-marquee bg-marquee text-cream"
                : "border-border text-muted hover:border-cream hover:text-cream"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          Language:
        </span>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguageFilter(languageFilter === lang ? null : lang)}
            className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              languageFilter === lang
                ? "border-spotlight bg-spotlight text-void"
                : "border-border text-muted hover:border-cream hover:text-cream"
            }`}
          >
            {lang}
          </button>
        ))}

        {(genreFilter || languageFilter) && (
          <button
            onClick={clearFilters}
            className="font-mono text-xs text-muted underline hover:text-marquee"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded border border-border bg-panel p-8 text-center text-muted">
          No films match those filters.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((movie, i) => (
            <MovieCard key={movie._id} movie={movie} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
