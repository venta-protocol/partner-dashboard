import { redirect } from "next/navigation";
import { IPartnerData } from "@/lib/types.client";
import AccessDeny from "@/components/access-deny";
import { auth } from "@/app/auth";
import { DashboardSections } from "@/components/dashboard-sections";
import { UserMenuWrapper } from "@/components/user-menu-wrapper";
import { Connection, PublicKey } from "@solana/web3.js";
import { SupportedSplTokens } from "@/lib/constants";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { backend_path, endpoint } from "@/lib/config";
import {
  getCachedPartnerData,
  setCachedPartnerData,
} from "@/lib/cache/partner-data";
import { SessionProvider } from "next-auth/react";

async function fetchPartnerDataFromAPIs(session: any): Promise<IPartnerData> {
  console.log("Fetching fresh partner data from APIs...");

  const connection = new Connection(endpoint, "processed");
  const [allBalances, partnerDataRes] = await Promise.all([
    Promise.all(
      SupportedSplTokens.map(async (token) => {
        const mpcWalletAta = getAssociatedTokenAddressSync(
          new PublicKey(token.mint),
          new PublicKey(session.user.mpcWallet!),
          false,
          new PublicKey(token.tokenProgram)
        );
        const { value } = await connection
          .getTokenAccountBalance(mpcWalletAta)
          .catch((e) => {
            return {
              value: { amount: "-1" },
            };
          });
        if (Number(value.amount) > 0) {
          return Number(value.amount) / 10 ** token.decimal;
        } else {
          return null;
        }
      })
    ),
    fetch(`${backend_path}/v1/partner/all-shops`, {
      method: "GET",
      headers: { "x-api-key": session.user.apiKey },
    }),
  ]);

  const { data: partnerData, success } = await partnerDataRes.json();
  if (!partnerData || !success) {
    redirect("/login?callbackUrl=/");
  }
  console.log("partnerData", partnerData);

  const totalBalance = allBalances
    .filter((balance): balance is number => balance !== null)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);

  return {
    apiKey: session.user.apiKey,
    partnerName: session.user.partnerName,
    shops: partnerData.shops ?? [],
    receivingWallet: session.user.receivingWallet,
    partnerBalance: totalBalance.toString(),
  };
}

/**
 * Gets partner information with 10-minute caching
 *
 * Cache is automatically invalidated when:
 * - Partner profile is updated (name, wallet, etc.)
 * - API key is rotated
 * - Shops are created or updated
 * - Withdrawal operations are performed
 *
 * Manual cache invalidation available via DELETE /api/cache
 */
async function getPartnerInfo(): Promise<IPartnerData | null> {
  const session = await auth();
  console.log("session", session);
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.email ||
    !session.user.partnerName ||
    !session.user.receivingWallet ||
    !session.user.apiKey
  ) {
    redirect("/login?callbackUrl=/");
  }

  // Try to get cached data first (10-minute TTL)
  const cachedData = await getCachedPartnerData(session.user.id);
  if (cachedData) {
    return cachedData;
  }

  // Cache miss - fetch fresh data from APIs
  const freshData = await fetchPartnerDataFromAPIs(session);

  // Cache the fresh data for 10 minutes
  await setCachedPartnerData(session.user.id, freshData);

  return freshData;
}

export default async function Dashboard() {
  const [shop, session] = await Promise.all([getPartnerInfo(), auth()]);

  if (!shop || !session?.user) {
    return <AccessDeny />;
  }

  return (
    <SessionProvider session={session}>
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome {shop.partnerName}</h1>
          <UserMenuWrapper sessionUser={session.user} />
        </div>
        <DashboardSections
          apiKey={session.user.apiKey || shop.apiKey}
          receivingWallet={session.user.receivingWallet || shop.receivingWallet}
          shops={shop.shops}
          partnerBalance={shop.partnerBalance}
          sessionUser={session.user}
        />
      </main>
    </SessionProvider>
  );
}
