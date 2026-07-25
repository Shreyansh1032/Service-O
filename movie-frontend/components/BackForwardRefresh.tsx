"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The browser's back/forward cache (bfcache) can restore a page exactly as
 * it looked when the user left — stale countdown timers, stale seat
 * statuses, stale booking state, all frozen in place. This forces a real
 * refetch whenever a page is restored from bfcache (event.persisted),
 * so the user always sees current server state after navigating back.
 */
export default function BackForwardRefresh() {
  const router = useRouter();

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        router.refresh();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  return null;
}
