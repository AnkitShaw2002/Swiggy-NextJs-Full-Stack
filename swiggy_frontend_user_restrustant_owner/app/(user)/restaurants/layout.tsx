// app/(user)/restaurants/layout.tsx
import { connection } from "next/server";

// restaurants/page.tsx is a client component whose useRestaurantsPage() hook
// reads useSearchParams(). Waiting for the incoming request here opts this
// segment out of static prerendering, so the page needs no Suspense wrapper.
export default async function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  return <>{children}</>;
}
