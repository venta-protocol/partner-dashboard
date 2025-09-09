export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export type IShopData = {
  id: string;
  externalId: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export type IPartnerData = {
  partnerName: string;
  receivingWallet: string;
  apiKey: string;
  shops: IShopData[];
  partnerBalance: string;
};
