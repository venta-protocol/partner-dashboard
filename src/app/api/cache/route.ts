import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { invalidateCachedPartnerData } from "@/lib/cache/partner-data";

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await invalidateCachedPartnerData(session.user.id);

    return NextResponse.json(
      {
        message: "Cache invalidated successfully",
        userId: session.user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error invalidating cache:", error);
    return NextResponse.json(
      { message: "Failed to invalidate cache" },
      { status: 500 }
    );
  }
};
