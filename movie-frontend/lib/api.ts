const API_BASE = process.env.API_GATEWAY_URL || "http://localhost:8000";

export interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  genre: string[];
  language: string[];
  releaseDate: string;
  poster: string;
  rating: number;
  active: boolean;
}

export async function getMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_BASE}/api/movies`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch movies");
  const json = await res.json();
  return json.data as Movie[];
}

export async function getMovieById(id: string): Promise<Movie> {
  const res = await fetch(`${API_BASE}/api/movies/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch movie");
  const json = await res.json();
  return json.data as Movie;
}

export interface Theatre {
  _id: string;
  name: string;
  city: string;
  address: string;
}

export interface Screen {
  _id: string;
  screenNumber: number;
  screenName: string;
  totalRows: number;
  seatsPerRow: number;
}

export interface Show {
  _id: string;
  movie: Movie;
  theatre: Theatre;
  screen: Screen;
  showDate: string;
  startTime: string;
  endTime: string;
  price: number;
}

export async function getShowsByMovie(movieId: string): Promise<Show[]> {
  const res = await fetch(`${API_BASE}/api/shows/movie/${movieId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch shows");
  const json = await res.json();
  return json.data as Show[];
}

export async function getShowById(showId: string): Promise<Show> {
  const res = await fetch(`${API_BASE}/api/shows/${showId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch show");
  const json = await res.json();
  return json.data as Show;
}

export interface Seat {
  _id: string;
  screenId: string;
  seatNumber: string;
  row: string;
  type: "REGULAR" | "PREMIUM" | "RECLINER";
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  price: number;
}

export async function getSeatsByScreen(screenId: string): Promise<Seat[]> {
  // Seat browsing is public (no auth needed) — matches seat-service's
  // gateway route, which uses optionalAuthMiddleware for GET requests.
  const res = await fetch(`${API_BASE}/api/seats/screen/${screenId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch seats");
  // NOTE: unlike movie-catalog/booking-service, this seat-service route
  // returns the raw array directly (no { success, data } wrapper).
  const json = await res.json();
  return json as Seat[];
}

export interface Booking {
  _id: string;
  showId: string;
  seatIds: string[];
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
}

// Note: booking creation now goes through /api/bookings (a Next.js API route)
// instead of calling the gateway directly — see components/SeatMap.tsx.
// That route reads the httpOnly auth cookie server-side and forwards the
// request with the Authorization header, since client JS can't read httpOnly
// cookies directly.
