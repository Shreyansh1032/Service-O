import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import { getShowById, getSeatsByScreen } from "@/lib/api";
import { notFound } from "next/navigation";

// Always fetch fresh seat data — including on browser back/forward — so a
// seat you just locked/booked never shows a stale AVAILABLE snapshot.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function SeatSelectionPage({
  params,
}: {
  params: Promise<{ showId: string }>;
}) {
  const { showId } = await params;

  let show;
  let seats;

  try {
    show = await getShowById(showId);
    seats = await getSeatsByScreen(show.screen._id);
  } catch {
    notFound();
  }

  if (!show) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-32">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-marquee">
            {show.theatre.name}
          </span>
          <h1 className="mt-2 font-display text-4xl tracking-wide text-cream">
            {show.movie.title}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted">
            {show.screen.screenName} · {show.startTime} · {new Date(show.showDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>

          <div className="mt-12">
            <SeatMap showId={showId} seats={seats} seatsPerRow={show.screen.seatsPerRow} />
          </div>
        </div>
      </main>
    </>
  );
}
