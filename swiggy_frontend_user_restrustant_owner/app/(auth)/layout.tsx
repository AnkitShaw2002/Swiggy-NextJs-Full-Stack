// app/(auth)/layout.tsx
import { connection } from "next/server";

// The auth pages (Login, Register, otp-verify) are client components that read
// useSearchParams(). Waiting for the incoming request here opts the whole
// (auth) segment out of static prerendering, so each page can stay a single
// component without its own Suspense wrapper.
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  return <>{children}</>;
}
