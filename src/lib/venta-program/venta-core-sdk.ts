import { BN, Wallet, AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js";
import { VentaPay } from "./idl/types/venta_pay";
import ventaPayIDL from "./idl/idl/venta_pay.json";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { IdlAccounts, ProgramAccount } from "@coral-xyz/anchor";

export type Global = IdlAccounts<VentaPay>["global"];
export type Merchant = IdlAccounts<VentaPay>["merchant"];
export type Merchants = ProgramAccount<Merchant>[];

export class VentaCoreSDK {
  public connection: Connection;
  public admin: Wallet;
  public provider: AnchorProvider;
  public ventaPayProgram: Program<VentaPay>;
  public globalConfig: Global | undefined;
  public merchants: Merchants = [];

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.admin = wallet;
    this.connection = connection;

    // Initialize the program
    this.ventaPayProgram = new Program(
      ventaPayIDL as Idl,
      this.provider
    ) as unknown as Program<VentaPay>;
  }

  // Initialize SDK data
  async initialize(): Promise<void> {
    try {
      // Load global config
      const [globalConfigPDA] = this.getGlobalConfigPDA();
      const globalConfig = await this.ventaPayProgram.account.global.fetch(
        globalConfigPDA
      );

      // Assign results to class properties
      this.globalConfig = globalConfig;
    } catch (error: any) {
      console.error("Error during initialization:", error);
      throw new Error(`Failed to initialize VentaCoreSDK: ${error.message}`);
    }
  }

  // Static factory method that creates and initializes the SDK
  static async initialize(
    connection: Connection,
    wallet: Wallet
  ): Promise<VentaCoreSDK> {
    const sdk = new VentaCoreSDK(connection, wallet);
    await sdk.initialize();
    return sdk;
  }
  // Refresh method to update data
  async refresh(): Promise<void> {
    await this.initialize();
  }

  // ================= CORE PROGRAM PDA =================
  // PDA derivation helpers
  getGlobalConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      this.ventaPayProgram.programId
    );
  }

  getMerchantPDA(seed: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("merchant"), seed.toBuffer()],
      this.ventaPayProgram.programId
    );
  }

  // ================= VENTA PAY PROGRAM Data Fetching =================
  // Account data fetching methods
  async getGlobalConfig(): Promise<Global> {
    const [globalConfig] = this.getGlobalConfigPDA();
    const globalConfigData = await this.ventaPayProgram.account.global.fetch(
      globalConfig
    );
    this.globalConfig = globalConfigData;
    return globalConfigData;
  }

  async getMerchantAccount(seed: PublicKey): Promise<Merchant> {
    const [merchantAccount] = this.getMerchantPDA(seed);
    return this.ventaPayProgram.account.merchant.fetch(merchantAccount);
  }

  async getAllMerchantsByPartner(partner: PublicKey): Promise<Merchants> {
    const filter = [
      {
        memcmp: {
          offset: 8 + 32 + 32, //prepend for anchor's discriminator
          bytes: partner.toBase58(),
        },
      },
    ];
    return this.ventaPayProgram.account.merchant.all(filter);
  }

  // ================= VENTA PAY PROGRAM Instructions =================

  initOrUpdateGlobalIx(
    mainAuthority: PublicKey,
    managerAuthority: PublicKey,
    treasury: PublicKey,
    status:
      | { normalOperation: {} }
      | { haltDeposit: {} }
      | { haltAll: {} }
      | null,
    baseTxFeeBps: number
  ): Promise<TransactionInstruction> {
    const [global] = this.getGlobalConfigPDA();

    return this.ventaPayProgram.methods
      .initOrUpdateGlobal(
        mainAuthority, // main authority
        managerAuthority, // manager authority
        treasury, // treasury
        status,
        baseTxFeeBps
      )
      .accountsPartial({
        authority: this.admin.publicKey,
        global,
      })
      .instruction();
  }

  initOrUpdateMerchantIx(
    merchantSeed: PublicKey,
    acceptedMints: PublicKey[],
    currentAuthority: PublicKey,
    newAuthority: PublicKey | null,
    partner: PublicKey | null,
    wallet: PublicKey | null,
    txPartnerFeeBps: number | null,
    flags: number | null
  ): Promise<TransactionInstruction> {
    const [global] = this.getGlobalConfigPDA();
    const [merchant] = this.getMerchantPDA(merchantSeed);

    return this.ventaPayProgram.methods
      .initOrUpdateMerchant(
        merchantSeed,
        acceptedMints, // accepted mints
        newAuthority, // authority
        partner, // partner
        wallet, // wallet
        txPartnerFeeBps, // tx partner fee bps (1%)
        flags // flags
      )
      .accountsPartial({
        payer: this.admin.publicKey,
        authority: currentAuthority,
        global,
        merchant,
      })
      .instruction();
  }

  async makePaymentIx(
    amount: number,
    mint: PublicKey,
    buyer: PublicKey,
    buyerAta: PublicKey,
    merchantSeed: PublicKey,
    tokenProgram: PublicKey = TOKEN_PROGRAM_ID
  ): Promise<TransactionInstruction> {
    const [merchant] = this.getMerchantPDA(merchantSeed);
    const merchantAta = getAssociatedTokenAddressSync(
      mint,
      merchant,
      true,
      tokenProgram
    );
    const [global] = this.getGlobalConfigPDA();
    return this.ventaPayProgram.methods
      .makePayment(new BN(amount))
      .accountsPartial({
        global,
        merchant,
        mint,
        buyer,
        buyerAta,
        merchantAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
  }
}
