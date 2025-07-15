import { NextRequest, NextResponse } from "next/server";
import { backend_path } from "@/lib/config";
import { auth } from "@/app/auth";
import { invalidateCachedPartnerData } from "@/lib/cache/partner-data";

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const session = await auth();
  const { apiKey } = await req.json();
  console.log("session", session);
  console.log("apiKey", apiKey);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "User not found" }, { status: 500 });
  }

  const response = await fetch(`${backend_path}/v1/partner/rotate`, {
    method: "PUT",
    headers: {
      "x-api-key": apiKey,
    },
  });

  const { data, success } = await response.json();
  if (!response.ok || !success) {
    return NextResponse.json(
      { message: "Failed to rotate API key" },
      { status: 500 }
    );
  }

  console.log("data", data);
  try {
    // Invalidate cache after API key rotation
    await invalidateCachedPartnerData(session.user.id);

    return NextResponse.json(
      { message: "API key rotated successfully", data: data.apiKey },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
