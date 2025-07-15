"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRedirectProps {
  to: string;
  delayMs?: number;
}

export function AutoRedirect({ to, delayMs = 3000 }: AutoRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(to);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [to, delayMs, router]);

  return null;
}
