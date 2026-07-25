import Navbar from "@/components/Navbar";
import ShowtimePicker from "@/components/ShowtimePicker";
import { getMovieById, getShowsByMovie } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let movie;
  let shows;

  try {
    [movie, shows] = await Promise.all([getMovieById(id), getShowsByMovie(id)]);
  } catch {
    notFound();
  }

  if (!movie) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Backdrop banner using the poster, blurred and dimmed */}
        <div className="relative h-[420px] overflow-hidden">
          {movie.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.poster}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-sm"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-void/40" />

          <div className="relative mx-auto flex h-full max-w-6xl items-end gap-8 px-6 pb-10">
            <div className="sprocket-frame my-4 hidden h-64 w-44 shrink-0 overflow-hidden shadow-2xl sm:block">
              {movie.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-panel-raised text-muted">
                  No poster
                </div>
              )}
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-marquee">
                {movie.genre.join(" · ")}
              </span>
              <h1 className="mt-2 font-display text-5xl tracking-wide text-cream sm:text-6xl">
                {movie.title}
              </h1>
              <div className="mt-3 flex items-center gap-4 font-mono text-sm text-muted">
                <span className="flex items-center gap-1 text-spotlight">
                  ★ {movie.rating.toFixed(1)}
                </span>
                <span>{movie.duration} min</span>
                <span>{movie.language.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {movie.description}
          </p>

          <h2 className="mt-12 mb-6 font-display text-3xl tracking-wide text-cream">
            Select a Showtime
          </h2>
          <ShowtimePicker shows={shows} />
        </div>
      </main>
    </>
  );
}
