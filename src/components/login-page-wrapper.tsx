"use client";

import { EmailForm } from "@/forms/login/email-login-form";
import PrivyWrapper from "@/lib/context/privy-wrapper";

export function LoginPageWrapper() {
  return (
    <PrivyWrapper>
      <EmailForm />
    </PrivyWrapper>
  );
}
