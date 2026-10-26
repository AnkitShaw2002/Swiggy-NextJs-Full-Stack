"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function AuthToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const processedRef = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");

    if (error && processedRef.current !== error) {
      // Mark as processed so StrictMode or re-renders won't trigger it twice
      processedRef.current = error;

      if (error === "unauthorized_user") {
        // Using a fixed `id` prevents duplicate toasts from firing
        toast.error("Please login as role User to access the URL", {
          id: "unauthorized_user_toast",
        });
      }

      if (error === "unauthorized_owner") {
        toast.error("Please login as restaurant owner to access the URL", {
          id: "unauthorized_owner_toast",
        });
      }

      // Clean up the URL parameter cleanly
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      
      router.replace(`${pathname}${newQuery}`, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}