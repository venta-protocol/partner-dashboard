"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const LoginButton = ({
  loginText = "Login",
  logoutText = "Logout",
  isDisabled = false,
}: {
  loginText?: string;
  logoutText?: string;
  isDisabled?: boolean;
}) => {
  const { ready, authenticated, login } = usePrivy();
  const { logout } = usePrivy();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!ready || loading) return;

    setLoading(true);
    if (authenticated) {
      await logout();
    } else {
      login();
    }
    setLoading(false);
  };

  // Disable while loading or if Privy isn't ready
  const isButtonDisabled = !ready || loading || isDisabled;

  return (
    <Button
      disabled={isButtonDisabled}
      onClick={handleClick}
      type="button"
      className="w-full"
    >
      {loading ? "Loading..." : authenticated ? logoutText : loginText}
    </Button>
  );
};
