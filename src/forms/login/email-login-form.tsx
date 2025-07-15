"use client";

import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { LoginButton } from "@/components/privy-login";

export const EmailForm = () => {
  const router = useRouter();
  const { authenticated, user, getAccessToken, logout } = usePrivy();
  const [hasRunLogin, setHasRunLogin] = useState(false);

  useEffect(() => {
    const tryLogin = async () => {
      if (!authenticated || !user || hasRunLogin) return;

      const email = user.google?.email || user.email?.address || "";

      if (!email) {
        toast.error("Missing account details.");
        await logout();
        return;
      }

      setHasRunLogin(true);
      toast.success("Successful Login");
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password: "",
        callbackUrl: "/dashboard",
      });
      if (!res.ok) {
        // Show error to user instead of redirecting
        toast.error("Invalid credentials");
        await logout();
        setHasRunLogin(false);
      } else {
        router.push(`/dashboard`);
      }
    };

    tryLogin();
  }, [authenticated, user, getAccessToken, router, logout, hasRunLogin]);

  return (
    <div className="flex flex-col gap-2">
      <LoginButton />
    </div>
  );
};
