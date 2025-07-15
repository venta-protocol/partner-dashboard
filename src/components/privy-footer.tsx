"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { usePrivy } from "@privy-io/react-auth";
import dynamic from "next/dynamic";

const PrivyWrapper = dynamic(() => import("@/lib/context/privy-wrapper"), {
  ssr: false,
  loading: () => (
    <div className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none">
      Sign Out
    </div>
  ),
});

const SignoutButton = () => {
  const { logout } = usePrivy();

  const handleLogout = async () => {
    await logout();
    await nextAuthSignOut({ callbackUrl: "/login" });
  };

  return (
    <button
      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
      onClick={handleLogout}
    >
      Sign Out
    </button>
  );
};

const PrivyFooter = () => {
  return (
    <PrivyWrapper>
      <SignoutButton />
    </PrivyWrapper>
  );
};

export default PrivyFooter;
