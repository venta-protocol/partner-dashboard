// components/PrivyWrapper.tsx
"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { PRIVY_APP_ID } from "../config";

export default function PrivyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/venta_solana_pay_qr.png",
          walletChainType: "solana-only",
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
          solana: {},
        },
        externalWallets: {
          walletConnect: {
            enabled: true,
          },
          solana: {
            // connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
