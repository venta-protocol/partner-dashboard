import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

export type TShop = InferSelectModel<typeof schema.shops>;
export enum CheckoutError {
  InsufficientAtaCreationPaymentAmount = "Merchant ATA not found, >= 30c required",
  InsufficientCustomerBalance = "Insufficient customer balance",
  CustomerAtaNotFound = "Customer ATA Not Found",
  Unauthorized = "Unauthorized",
  InvalidPaymentAmount = "Invalid payment amount",
  BulkCreditFullyUtilized = "Credits fully utilized",
}
