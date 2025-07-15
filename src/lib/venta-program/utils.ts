import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { CheckoutError } from "../types.db";

export const getSimulationUnits = async (
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  addressLookupTableAccounts: AddressLookupTableAccount[] = [],
  priorityLevel = "Low"
): Promise<{
  status: number;
  data: [number, number | undefined];
  error?: string | null;
}> => {
  const startSimulateTime = Date.now();

  try {
    const testInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
      ...instructions,
    ];

    const msg = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: PublicKey.default.toString(),
      instructions: testInstructions,
    });
    const testVersionedTxn = new VersionedTransaction(
      addressLookupTableAccounts.length
        ? msg.compileToV0Message(addressLookupTableAccounts)
        : msg.compileToV0Message()
    );

    const [priorityFeesRes, simulation]: any = await Promise.all([
      fetch(connection.rpcEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getPriorityFeeEstimate",
          params: [
            {
              transaction: bs58.encode(testVersionedTxn.serialize()), // Pass the serialized transaction in Base58
              options: { priorityLevel },
            },
          ],
        }),
      }).then((x) => x.json()),
      connection.simulateTransaction(testVersionedTxn, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      }),
    ]);
    const endSimulateTime = Date.now();
    const simulateDuration = endSimulateTime - startSimulateTime;
    console.log("Simulate Duration (ms):", simulateDuration);

    console.log("simulation", simulation);
    if (simulation.value.err) {
      const errorMessage = simulation.value.logs.find((log: string) =>
        log.includes("Error")
      );
      if (errorMessage.includes("Error Code: Unauthorized")) {
        return {
          status: 400,
          data: [0, undefined],
          error: CheckoutError.Unauthorized,
        };
      } else if (errorMessage.includes("insufficient lamports")) {
        return {
          status: 400,
          data: [0, undefined],
          error: CheckoutError.InsufficientAtaCreationPaymentAmount,
        };
      } else if (errorMessage.includes("Error: insufficient funds")) {
        return {
          status: 400,
          data: [0, undefined],
          error: CheckoutError.InsufficientCustomerBalance,
        };
      } else if (errorMessage.includes("Error: InvalidAccountData")) {
        return {
          status: 400,
          data: [0, undefined],
          error: CheckoutError.CustomerAtaNotFound,
        };
      } else if (errorMessage.includes("Error Code: InsufficientBalance.")) {
        return {
          status: 400,
          data: [0, undefined],
          error: CheckoutError.BulkCreditFullyUtilized,
        };
      }
      // Generate random 6 digit number
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      return {
        status: 400,
        data: [0, undefined],
        error:
          simulation.value.logs.find((log: string) =>
            log.includes("Error Code:")
          ) ?? `Error Code: ${randomNumber}, contact support`,
      };
    }

    //! TODO: Update for mainnet
    const priorityFees = 100000;
    priorityFeesRes;

    return {
      status: 200,
      data: [
        priorityFees ? priorityFees : 1000,
        simulation.value.unitsConsumed,
      ],
      error: null,
    };
  } catch (error: any) {
    console.error("Error in getSimulationUnits:", error);
    return { status: 400, data: [0, undefined], error: error.logs };
  }
};
