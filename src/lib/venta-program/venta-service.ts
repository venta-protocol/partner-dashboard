import { VentaCoreSDK } from "./venta-core-sdk";
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getSimulationUnits } from "./utils";
import base58 from "bs58";
import { endpoint } from "../config";
import { BN, Wallet } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { CheckoutError } from "../types.db";
import { OP_PRIVATE_KEY } from "../config";
import { SupportedSplTokens } from "../constants";
// Singleton pattern for SDK instance

const ATA_FEES = 0.4;
const connection = new Connection(endpoint);

class VentaSDKService {
  private static serviceInstance: VentaSDKService;
  private static instance: VentaCoreSDK;
  private signers: Keypair[] = [];

  private constructor() {
    // Initialize signers from environment variables
    // for (let i = 1; i <= 6; i++) {
    const i = 0;
    const secretKey = OP_PRIVATE_KEY!;
    if (!secretKey) {
      throw new Error(`Missing SIGNER_${i} environment variable`);
    }
    const signer = Keypair.fromSecretKey(base58.decode(secretKey));
    this.signers.push(signer);
    // }
  }

  getSigner(): Keypair {
    const seconds = new Date().getSeconds();
    const index = Math.floor(seconds / 10) % 6;
    return this.signers[0];
  }

  static getService(): VentaSDKService {
    this.serviceInstance = new VentaSDKService();
    return this.serviceInstance;
  }

  static getInstance(): VentaCoreSDK {
    const secretKey = OP_PRIVATE_KEY!;
    const authority = Keypair.fromSecretKey(base58.decode(secretKey));
    const wallet = new NodeWallet(authority) as Wallet;
    this.instance = new VentaCoreSDK(connection, wallet);

    return this.instance;
  }

  async getMakePaymentTx(
    mintInfo: {
      mint: PublicKey;
      uri: string;
      symbol: string;
      decimal: number;
      tokenProgram: PublicKey;
    },
    amount: number,
    shopWallet: PublicKey,
    buyer: PublicKey,
    buyerAta: PublicKey
  ): Promise<{
    base64: string;
    signature: any;
    status: number;
    error?: string;
  }> {
    const shopAta = getAssociatedTokenAddressSync(
      mintInfo.mint,
      shopWallet,
      false,
      mintInfo.tokenProgram
    );
    // Create spl transfer ix

    const remainingIx = createTransferCheckedInstruction(
      buyerAta,
      mintInfo.mint,
      shopAta,
      buyer,
      new BN(amount),
      mintInfo.decimal,
      [],
      mintInfo.tokenProgram
    );
    const { data, status, error } = await this.simulateAndBuildTransaction(
      [remainingIx],
      []
    );

    if (error === CheckoutError.InsufficientCustomerBalance) {
      return {
        base64: "",
        signature: "",
        status: 400,
        error: CheckoutError.InsufficientCustomerBalance,
      };
    } else if (error === CheckoutError.CustomerAtaNotFound) {
      return {
        base64: "",
        signature: "",
        status: 400,
        error: CheckoutError.CustomerAtaNotFound,
      };
    }

    if (status !== 200 || !data || error) {
      if (amount < ATA_FEES) {
        return {
          base64: "",
          signature: "",
          status: 400,
          error: CheckoutError.InsufficientAtaCreationPaymentAmount,
        };
      }

      const feeAta = getAssociatedTokenAddressSync(
        mintInfo.mint,
        this.getSigner().publicKey,
        false,
        mintInfo.tokenProgram
      );
      const createShopAtaIx = createAssociatedTokenAccountInstruction(
        this.getSigner().publicKey,
        shopAta,
        shopWallet,
        mintInfo.mint,
        mintInfo.tokenProgram
      );
      const ataFeeIx = createTransferCheckedInstruction(
        buyerAta,
        mintInfo.mint,
        feeAta,
        buyer,
        new BN(ATA_FEES),
        mintInfo.decimal,
        [],
        mintInfo.tokenProgram
      );
      const remainingIx = createTransferCheckedInstruction(
        buyerAta,
        mintInfo.mint,
        shopAta,
        buyer,
        new BN(amount - ATA_FEES),
        mintInfo.decimal,
        [],
        mintInfo.tokenProgram
      );

      const { data, status, error } = await this.simulateAndBuildTransaction(
        [createShopAtaIx, ataFeeIx, remainingIx],
        []
      );

      if (status !== 200 || !data || error) {
        return {
          base64: "",
          signature: "",
          status: 400,
          error: error ?? CheckoutError.InsufficientCustomerBalance,
        };
      }

      return { ...data, status: 200 };
    }

    return { ...data, status: 200 };
  }

  async getBasicSplitPaymentTx(
    mintInfo: {
      mint: PublicKey;
      uri: string;
      symbol: string;
      decimal: number;
      tokenProgram: PublicKey;
    },
    buyer: PublicKey,
    buyerAta: PublicKey,
    totalPayableAmount: {
      wallet: PublicKey;
      amount: number;
    }[]
  ): Promise<{
    base64: string;
    signature: any;
    status: number;
    error?: string;
  }> {
    let ixs = [];

    console.log("totalPayableAmount", totalPayableAmount);
    for (const { wallet, amount } of totalPayableAmount) {
      const shopAta = getAssociatedTokenAddressSync(
        mintInfo.mint,
        wallet,
        false,
        mintInfo.tokenProgram
      );

      // Create spl transfer ix
      let amountToTransfer = amount;

      const remainingIx = createTransferCheckedInstruction(
        buyerAta,
        mintInfo.mint,
        shopAta,
        buyer,
        new BN(amountToTransfer),
        mintInfo.decimal,
        [],
        mintInfo.tokenProgram
      );
      ixs.push(remainingIx);
    }

    const { data, status, error } = await this.simulateAndBuildTransaction(
      ixs,
      []
    );

    if (error === CheckoutError.InsufficientCustomerBalance) {
      return {
        base64: "",
        signature: "",
        status: 400,
        error: CheckoutError.InsufficientCustomerBalance,
      };
    } else if (error === CheckoutError.CustomerAtaNotFound) {
      return {
        base64: "",
        signature: "",
        status: 400,
        error: CheckoutError.CustomerAtaNotFound,
      };
    }

    if (status !== 200 || !data) {
      // Recalculate fees, charge merchant ATA creation fees
      const newIxs = [];

      // Simulation fail due to merchant ATA not existing
      // Check which wallet is causing the error by getting ATA
      const allShopAtas: {
        wallet: PublicKey;
        ata: PublicKey;
        validAta: boolean;
        amount: number;
      }[] = [];

      await Promise.all(
        totalPayableAmount.map(async (info) => {
          const walletKey = info.wallet;
          const shopAta = getAssociatedTokenAddressSync(
            mintInfo.mint,
            walletKey,
            false,
            mintInfo.tokenProgram
          );
          await connection
            .getTokenAccountBalance(shopAta)
            .then(() => {
              allShopAtas.push({
                wallet: walletKey,
                ata: shopAta,
                validAta: true,
                amount: Number(info.amount.toFixed(2)),
              });
            })
            .catch(() => {
              allShopAtas.push({
                wallet: walletKey,
                ata: shopAta,
                validAta: false,
                amount: Number(info.amount.toFixed(2)),
              });
            });
        })
      );

      let totalFeeAmount = 0;

      for (const { validAta, amount, ata, wallet } of allShopAtas) {
        // Create spl transfer ix

        // Create Merchant ATA if not exist
        let amountToTransfer = amount;

        if (!validAta) {
          const createShopAtaIx = createAssociatedTokenAccountInstruction(
            this.getSigner().publicKey,
            ata,
            wallet,
            mintInfo.mint,
            mintInfo.tokenProgram
          );
          newIxs.push(createShopAtaIx);
          totalFeeAmount += ATA_FEES;
          amountToTransfer -= ATA_FEES;
        }

        const remainingIx = createTransferCheckedInstruction(
          buyerAta,
          mintInfo.mint,
          ata,
          buyer,
          new BN(amountToTransfer),
          mintInfo.decimal,
          [],
          mintInfo.tokenProgram
        );
        newIxs.push(remainingIx);
      }
      const feeAta = getAssociatedTokenAddressSync(
        mintInfo.mint,
        this.getSigner().publicKey,
        false,
        mintInfo.tokenProgram
      );
      const ataFeeIx = createTransferCheckedInstruction(
        buyerAta,
        mintInfo.mint,
        feeAta,
        buyer,
        new BN(totalFeeAmount),
        mintInfo.decimal,
        [],
        mintInfo.tokenProgram
      );
      newIxs.push(ataFeeIx);

      const { data, status, error } = await this.simulateAndBuildTransaction(
        newIxs,
        [],
        "Medium"
      );
      if (status !== 200 || !data || error) {
        return {
          base64: "",
          signature: "",
          status: 400,
          error: error ?? "Simulation failed",
        };
      }

      return { ...data, status: 200 };
    }

    return { ...data, status: 200 };
  }

  async getZeroCheckoutTx(buyer: PublicKey): Promise<{
    base64: string;
    signature: any;
    status: number;
    error?: string;
  }> {
    const signer = this.signers[0];
    console.log("signer", signer.publicKey.toBase58());
    let defaultMicroLamports = 200_000;
    let defaultComputeUnit = 500_000;
    try {
      const [{ data, error }, { blockhash }] = await Promise.all([
        getSimulationUnits(connection, [], signer.publicKey, [], "Low"),
        connection.getLatestBlockhash(),
      ]);
      const [priorityFees, units] = data;
      if (error || !units) {
        return {
          base64: "",
          signature: "",
          status: 400,
          error: error ?? "Simulation failed",
        };
      }

      defaultComputeUnit = units;
      defaultMicroLamports = priorityFees;
      const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: defaultComputeUnit,
      });
      const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: defaultMicroLamports,
      });
      computePriceIx.keys.push({
        pubkey: buyer,
        isSigner: true,
        isWritable: false,
      });

      console.log("defaultMicroLamports", defaultMicroLamports);
      console.log("defaultComputeUnit", defaultComputeUnit);

      let versionedTxn = new VersionedTransaction(
        new TransactionMessage({
          payerKey: signer.publicKey,
          recentBlockhash: blockhash,
          instructions: [computeLimitIx, computePriceIx],
        }).compileToV0Message()
      );

      versionedTxn.sign([signer]);

      const base64 = Buffer.from(versionedTxn.serialize()).toString("base64");

      const transactionSignature = bs58.encode(
        new Uint8Array(versionedTxn.signatures[0])
      );

      return {
        base64,
        signature: transactionSignature,
        status: 200,
        error: "",
      };
    } catch {
      return {
        base64: "",
        signature: "",
        status: 400,
        error: "Simulation failed",
      };
    }
  }

  async getWithdrawalTx(
    walletAddress: PublicKey,
    receivingWallet: PublicKey
  ): Promise<{
    base64: string;
    signature: any;
    status: number;
    error?: string;
  }> {
    const connection = new Connection(endpoint);
    const allBalances = await Promise.all(
      SupportedSplTokens.map(async (token) => {
        const mpcWalletAta = getAssociatedTokenAddressSync(
          new PublicKey(token.mint),
          new PublicKey(walletAddress),
          false,
          new PublicKey(token.tokenProgram)
        );
        const receivingWalletAta = getAssociatedTokenAddressSync(
          new PublicKey(token.mint),
          new PublicKey(receivingWallet),
          false,
          new PublicKey(token.tokenProgram)
        );
        const { value } = await connection
          .getTokenAccountBalance(mpcWalletAta)
          .catch((e) => {
            return {
              value: { amount: "-1" },
            };
          });
        if (Number(value.amount) > 0) {
          // Check if receiving wallet ata exists
          const receivingWalletAtaExists = await connection
            .getAccountInfo(receivingWalletAta)
            .then((x) => (x?.lamports ? true : false))
            .catch(() => false);
          return {
            amount: value.amount,
            receivingWalletAta,
            senderWalletAta: mpcWalletAta,
            senderWallet: walletAddress,
            token,
            receivingWalletAtaExists,
          };
        } else {
          return null;
        }
      })
    ).then((x) => x.filter((y) => y !== null));
    console.log("allBalances", allBalances);

    if (allBalances.length === 0) {
      return {
        base64: "",
        signature: "",
        status: 204,
        error: "No balances to withdraw",
      };
    }

    const txs = [];
    let totalFeeAmount = 0;
    let highestValueAccount = allBalances[0];
    allBalances.forEach((balance) => {
      if (!balance.receivingWalletAtaExists) {
        totalFeeAmount += 0.5;
      }
      if (Number(balance.amount) > Number(highestValueAccount.amount)) {
        highestValueAccount = balance;
      }
    });

    console.log("allBalances", allBalances);
    for (const balance of allBalances) {
      const {
        amount,
        senderWalletAta,
        receivingWalletAta,
        senderWallet,
        token,
        receivingWalletAtaExists,
      } = balance;
      if (Number(amount) > 0) {
        const mint = new PublicKey(token.mint);
        if (!receivingWalletAtaExists) {
          const createReceivingWalletAtaIx =
            createAssociatedTokenAccountInstruction(
              this.getSigner().publicKey,
              receivingWalletAta,
              receivingWallet,
              mint,
              new PublicKey(token.tokenProgram)
            );
          txs.push(createReceivingWalletAtaIx);
        }
        const withdrawalIx = createTransferCheckedInstruction(
          new PublicKey(senderWalletAta),
          mint,
          new PublicKey(receivingWalletAta),
          new PublicKey(senderWallet),
          highestValueAccount.token.symbol === balance.token.symbol
            ? Number(amount) - totalFeeAmount * 10 ** balance.token.decimal
            : Number(amount),
          token.decimal,
          [],
          new PublicKey(token.tokenProgram)
        );
        txs.push(withdrawalIx);
      }
    }
    if (totalFeeAmount > 0) {
      const feeAta = getAssociatedTokenAddressSync(
        new PublicKey(highestValueAccount.token.mint),
        this.getSigner().publicKey,
        false,
        new PublicKey(highestValueAccount.token.tokenProgram)
      );
      const feeIx = createTransferCheckedInstruction(
        new PublicKey(highestValueAccount.senderWalletAta),
        new PublicKey(highestValueAccount.token.mint),
        feeAta,
        new PublicKey(highestValueAccount.senderWallet),
        new BN(totalFeeAmount * 10 ** highestValueAccount.token.decimal),
        highestValueAccount.token.decimal,
        [],
        new PublicKey(highestValueAccount.token.tokenProgram)
      );
      txs.push(feeIx);
    }

    const signer = this.signers[0];
    console.log("signer", signer.publicKey.toBase58());
    let defaultMicroLamports = 200_000;
    let defaultComputeUnit = 500_000;
    try {
      const [{ data, error }, { blockhash }] = await Promise.all([
        getSimulationUnits(connection, txs, signer.publicKey, [], "Low"),
        connection.getLatestBlockhash(),
      ]);
      const [priorityFees, units] = data;
      if (error || !units) {
        return {
          base64: "",
          signature: "",
          status: 400,
          error: error ?? "Simulation failed",
        };
      }

      defaultComputeUnit = units;
      defaultMicroLamports = priorityFees;
      const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: defaultComputeUnit,
      });
      const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: defaultMicroLamports,
      });
      computePriceIx.keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      });

      console.log("defaultMicroLamports", defaultMicroLamports);
      console.log("defaultComputeUnit", defaultComputeUnit);

      let versionedTxn = new VersionedTransaction(
        new TransactionMessage({
          payerKey: signer.publicKey,
          recentBlockhash: blockhash,
          instructions: [computeLimitIx, computePriceIx, ...txs],
        }).compileToV0Message()
      );

      versionedTxn.sign([signer]);

      const base64 = Buffer.from(versionedTxn.serialize()).toString("base64");

      const transactionSignature = bs58.encode(
        new Uint8Array(versionedTxn.signatures[0])
      );

      return {
        base64,
        signature: transactionSignature,
        status: 200,
        error: "",
      };
    } catch {
      return {
        base64: "",
        signature: "",
        status: 400,
        error: "Simulation failed",
      };
    }
  }

  private async simulateAndBuildTransaction(
    ixs: TransactionInstruction[],
    lut: [],
    feeSetting = "Low"
  ): Promise<{
    data: { base64: string; signature: any } | null;
    status: number;
    error?: string | null;
  }> {
    // const signer = this.getSigner();
    const signer = this.signers[0];
    console.log("signer", signer.publicKey.toBase58());
    let defaultMicroLamports = 200_000;
    let defaultComputeUnit = 500_000;
    try {
      const [{ data, error }, { blockhash }] = await Promise.all([
        getSimulationUnits(connection, ixs, signer.publicKey, lut, feeSetting),
        connection.getLatestBlockhash(),
      ]);
      const [priorityFees, units] = data;
      if (!priorityFees || !units) {
        return { data: null, error, status: 400 };
      }

      defaultComputeUnit = units;
      defaultMicroLamports = priorityFees;
      const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: defaultComputeUnit,
      });
      const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: defaultMicroLamports,
      });
      console.log("defaultMicroLamports", defaultMicroLamports);
      console.log("defaultComputeUnit", defaultComputeUnit);

      ixs.unshift(computePriceIx);
      ixs.unshift(computeLimitIx);

      let versionedTxn = new VersionedTransaction(
        new TransactionMessage({
          payerKey: signer.publicKey,
          recentBlockhash: blockhash,
          instructions: ixs,
        }).compileToV0Message(lut)
      );

      versionedTxn.sign([signer]);

      const base64 = Buffer.from(versionedTxn.serialize()).toString("base64");

      const transactionSignature = bs58.encode(
        new Uint8Array(versionedTxn.signatures[0])
      );

      return {
        data: { base64, signature: transactionSignature },
        status: 200,
        error: null,
      };
    } catch (error: any) {
      console.log(error);
      return { data: null, status: 400, error };
    }
  }
}

export default VentaSDKService;
