"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { UserMenu } from "./user-menu";

export function UserMenuWrapper({ sessionUser }: { sessionUser: any }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#000000",
        },
      }}
    >
      <UserMenu sessionUser={sessionUser} />
    </PrivyProvider>
  );
}
