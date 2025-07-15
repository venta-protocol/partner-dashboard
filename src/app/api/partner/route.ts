import { NextRequest, NextResponse } from "next/server";
import { backend_path } from "@/lib/config";
import { auth } from "@/app/auth";
import { PublicKey } from "@solana/web3.js";
import VentaSDKService from "@/lib/venta-program/venta-service";
import { invalidateCachedPartnerData } from "@/lib/cache/partner-data";

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const [session, data] = await Promise.all([auth(), req.json()]);

  console.log("session", session?.user);
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.mpcWallet ||
    !session.user.receivingWallet ||
    !data.action
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }

  if (data.action === "withdraw") {
    // 1. Create withdraw from privy wallet to receiving wallet
    const { mpcWallet, receivingWallet } = session.user;

    if (mpcWallet === receivingWallet) {
      return NextResponse.json(
        { error: "MPC wallet and receiving wallet cannot be the same" },
        { status: 400 }
      );
    }

    const service = VentaSDKService.getService();
    const { base64, signature, status, error } = await service.getWithdrawalTx(
      new PublicKey(mpcWallet),
      new PublicKey(receivingWallet)
    );

    if (status === 204 || status === 400) {
      return NextResponse.json({ error }, { status: 400 });
    } else if (status === 500) {
      return NextResponse.json({ error }, { status: 500 });
    }

    try {
      // Invalidate cache after withdrawal since balance will change
      await invalidateCachedPartnerData(session.user.id);

      return NextResponse.json(
        {
          message: "Withdrawal transaction created successfully",
          base64,
          signature,
        },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } else if (data.action === "update") {
    const {
      partnerName,
      receivingWallet,
      website,
      contactPhone,
      defaultFeeBps,
    } = data;

    const apiKey = session.user.apiKey;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 400 });
    }

    const updateRes = await fetch(`${backend_path}/v1/partner/profile`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        partnerName,
        receivingWallet,
        website,
        contactPhone,
        defaultFeeBps,
      }),
    });

    const { data: updateData, success } = await updateRes.json();
    if (!updateRes.ok || !success) {
      return NextResponse.json(
        { error: "Failed to update partner info" },
        { status: 500 }
      );
    }
    if (updateData.statusCode !== 200) {
      return NextResponse.json(
        { error: "Failed to update partner info" },
        { status: updateData.statusCode }
      );
    }

    // Invalidate cache after successful update
    await invalidateCachedPartnerData(session.user.id);

    return NextResponse.json(
      {
        message: "Partner info updated successfully",
        data: updateData,
      },
      { status: 200 }
    );
  }
};
