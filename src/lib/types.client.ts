export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export type IPartnerData = {
  partnerName: string;
  receivingWallet: string;
  apiKey: string;
  shops: {
    id: string;
    name: string;
    email: string;
    mpcWallet: string;
    country: string;
    createdAt: string;
  }[];
  partnerBalance: string;
};