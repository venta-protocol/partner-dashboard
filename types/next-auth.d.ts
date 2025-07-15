import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      partnerName: string;
      mpcWallet: string;
      website?: string;
      contactPhone?: string;
      apiKey?: string;
      receivingWallet?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
    email: string;
    partnerName: string;
    mpcWallet: string;
    website?: string;
    contactPhone?: string;
    apiKey?: string;
    receivingWallet?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    partnerName: string;
    mpcWallet: string;
    website?: string;
    contactPhone?: string;
    apiKey?: string;
    receivingWallet?: string;
  }
}
