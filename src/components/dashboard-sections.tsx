"use client";

import PrivyWrapper from "@/lib/context/privy-wrapper";
import { PartnerDashboard } from "./partner-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSectionsProps {
  apiKey: string;
  receivingWallet: string;
  shops: {
    id: string;
    name: string;
    email: string;
    mpcWallet: string;
    country: string;
    createdAt: string;
  }[];
  partnerBalance: string;
  sessionUser: any;
}

export function DashboardSections({
  apiKey,
  receivingWallet,
  shops,
  partnerBalance,
  sessionUser,
}: DashboardSectionsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnerDashboard.ApiKeySection
            apiKey={apiKey}
            sessionUser={sessionUser}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partner Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <PrivyWrapper>
            <PartnerDashboard.CommissionSection
              commission={partnerBalance}
              receivingWallet={receivingWallet}
            />
          </PrivyWrapper>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Associated Shops</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnerDashboard.ShopsSection shops={shops} />
        </CardContent>
      </Card>
    </>
  );
}
