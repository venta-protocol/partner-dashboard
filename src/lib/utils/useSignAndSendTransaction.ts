import { useSendTransaction } from "@privy-io/react-auth/solana";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { endpoint } from "@/lib/config";
import { toast } from "sonner";

interface TransactionOptions {
  buttonText?: string;
  description?: string;
}

export const useSignAndSendTransaction = () => {
  const { sendTransaction } = useSendTransaction();

  const signAndSendTransaction = async (
    base64Transaction: string,
    options?: TransactionOptions
  ) => {
    try {
      // Convert base64 to Uint8Array
      const serializedTransaction = Uint8Array.from(
        Buffer.from(base64Transaction, "base64")
      );

      // Deserialize the transaction
      const tx = VersionedTransaction.deserialize(serializedTransaction);

      // Send the transaction
      const signature = await sendTransaction({
        transaction: tx,
        connection: new Connection(endpoint),
        uiOptions: {
          buttonText: options?.buttonText ?? "Confirm Transaction",
          description: options?.description ?? "Sign transaction",
        },
      });

      return signature;
    } catch (error: any) {
      toast.error(`Transaction failed: ${error.message}`);
      throw error;
    }
  };

  return { signAndSendTransaction };
};
