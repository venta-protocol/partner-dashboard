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
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password: "",
        callbackUrl: "/dashboard",
      });

      console.log("NextAuth signIn response:", res);

      if (res?.error) {
        // Show error to user instead of redirecting
        let errorMessage = "Invalid credentials - Access denied";
        toast.error(errorMessage);
        await logout();
        setHasRunLogin(false);
      } else if (res?.ok) {
        toast.success("Successful Login");
        router.push(`/dashboard`);
      } else {
        // Fallback error handling
        toast.error("Login failed - Please try again");
        await logout();
        setHasRunLogin(false);
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
