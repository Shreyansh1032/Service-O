import Navbar from "@/components/Navbar";
import FilmstripHero from "@/components/FilmstripHero";
import MovieCard from "@/components/MovieCard";
import { getMovies } from "@/lib/api";

export default async function LandingPage() {
  let movies: Awaited<ReturnType<typeof getMovies>> = [];
  let fetchFailed = false;

  try {
    movies = await getMovies();
  } catch {
    fetchFailed = true;
  }

  const nowShowing = movies.filter((m) => m.active);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FilmstripHero movies={nowShowing} />

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="font-display text-4xl tracking-wide text-cream">
              Now Showing
            </h2>
            <span className="font-mono text-xs text-muted">
              {nowShowing.length} {nowShowing.length === 1 ? "film" : "films"}
            </span>
          </div>

          {fetchFailed ? (
            <div className="rounded border border-border bg-panel p-8 text-center text-muted">
              Couldn&apos;t reach the box office right now. Check that the API
              gateway is running.
            </div>
          ) : nowShowing.length === 0 ? (
            <div className="rounded border border-border bg-panel p-8 text-center text-muted">
              No films on screen yet — check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {nowShowing.map((movie, i) => (
                <MovieCard key={movie._id} movie={movie} index={i} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 text-center font-mono text-xs text-muted">
        service-O — a microservices movie booking platform
      </footer>
    </>
  );
}
