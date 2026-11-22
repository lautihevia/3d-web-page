"use client";

import { Analytics } from "@vercel/analytics/next";

/** Vercel Web Analytics. Las visitas al admin no se cuentan. */
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => (new URL(event.url).pathname.startsWith("/admin") ? null : event)}
    />
  );
}
