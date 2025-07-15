import { redirect } from "next/navigation";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "./auth";

export default async function Home() {
  const session = await auth();

  if (session && session.user && session.user.id) {
    redirect("/dashboard");
  } else {
    redirect("/login?callbackUrl=/");
  }
}
