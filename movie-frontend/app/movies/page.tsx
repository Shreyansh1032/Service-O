import Navbar from "@/components/Navbar";
import MoviesGrid from "@/components/MoviesGrid";
import { getMovies } from "@/lib/api";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function MoviesListPage() {
  let movies: Awaited<ReturnType<typeof getMovies>> = [];
  let fetchFailed = false;

  try {
    movies = await getMovies();
  } catch {
    fetchFailed = true;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="font-display text-5xl tracking-wide text-cream">
            All Movies
          </h1>
          <p className="mt-2 text-sm text-muted">
            {movies.length} {movies.length === 1 ? "film" : "films"} in the catalog
          </p>

          {fetchFailed ? (
            <div className="mt-10 rounded border border-border bg-panel p-8 text-center text-muted">
              Couldn&apos;t reach the box office right now. Check that the API
              gateway is running.
            </div>
          ) : (
            <MoviesGrid movies={movies} />
          )}
        </div>
      </main>
    </>
  );
}
