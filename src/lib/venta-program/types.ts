import { IdlAccounts, ProgramAccount } from "@coral-xyz/anchor";
import { VentaPay } from "./idl/types/venta_pay";

export type Global = IdlAccounts<VentaPay>["global"];
export type Merchant = IdlAccounts<VentaPay>["merchant"];
export type Merchants = ProgramAccount<Merchant>[];
