"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { sendBackendRequest } from "@/lib/utils.client";
import { Endpoint, HttpMethod } from "@/lib/utils.client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getAccessToken } from "@privy-io/react-auth";
import { useSignAndSendTransaction } from "@/lib/utils/useSignAndSendTransaction";
import { Connection } from "@solana/web3.js";
import { endpoint } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IShopData } from "@/lib/types.client";
import { Badge } from "./ui/badge";

interface ApiKeySectionProps {
  apiKey: string;
  sessionUser?: any;
}

interface CommissionSectionProps {
  commission: string;
  receivingWallet: string;
}

interface ShopsSectionProps {
  shops: IShopData[];
}

export const PartnerDashboard = {
  ApiKeySection: ({ apiKey, sessionUser }: ApiKeySectionProps) => {
    const [showApiKey, setShowApiKey] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [currentApiKey, setCurrentApiKey] = useState(apiKey);
    const [openRotateDialog, setOpenRotateDialog] = useState(false);
    const router = useRouter();
    const { update } = useSession();

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(currentApiKey);
        toast.success("API key copied to clipboard");
      } catch {
        toast.error("Failed to copy API key");
      }
    };

    const handleRotateApiKey = async () => {
      try {
        setIsRotating(true);
        const accessToken = await getAccessToken();

        const response = await sendBackendRequest(
          Endpoint.API_KEY,
          HttpMethod.PUT,
          {
            apiKey,
          },
          false,
          accessToken ?? ""
        );

        if (response.ok) {
          const { data } = await response.json();
          if (data) {
            setCurrentApiKey(data);
            await update({
              user: {
                apiKey: data,
              },
            });
            toast.success("API key rotated successfully");
          }
          setOpenRotateDialog(false);
          router.refresh();
        } else {
          toast.error("Failed to rotate API key");
        }
      } catch (error: unknown) {
        console.error("Error rotating API key:", error);
        toast.error("An error occurred while rotating the API key");
      } finally {
        setIsRotating(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type={showApiKey ? "text" : "password"}
              value={currentApiKey}
              readOnly
              className="font-mono"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <ClipboardIcon className="h-4 w-4" />
          </Button>
          <Dialog open={openRotateDialog} onOpenChange={setOpenRotateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isRotating}>
                {isRotating ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowPathIcon className="h-4 w-4" />
                )}
                <span className="ml-2">Rotate Key</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rotate API Key</DialogTitle>
                <DialogDescription>
                  Rotating your API key will immediately invalidate the current
                  key. Applications using the existing key will stop working
                  until they are updated. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setOpenRotateDialog(false)}
                  disabled={isRotating}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRotateApiKey}
                  loading={isRotating}
                >
                  Rotate Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep your API key secure. Never share it publicly.
        </p>
      </div>
    );
  },

  CommissionSection: ({
    commission,
    receivingWallet,
  }: CommissionSectionProps) => {
    const { signAndSendTransaction } = useSignAndSendTransaction();
    const [isTransferring, setIsTransferring] = useState(false);
    const router = useRouter();
    const handleWithdraw = async () => {
      setIsTransferring(true);
      // Send PUT request to /api/partner
      const response = await sendBackendRequest(
        Endpoint.PARTNER,
        HttpMethod.PUT,
        {
          action: "withdraw",
        }
      );

      // Display error message from response if response is not ok
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        setIsTransferring(false);
        return;
      }

      try {
        const { signature } = await signAndSendTransaction(data.base64, {
          buttonText: `Withdraw ${commission} USD`,
          description: "Send transfer request",
        });
        const connection = new Connection(endpoint, "processed");
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "processed"
        );

        if (confirmation && !confirmation.value?.err) {
          await sendBackendRequest(Endpoint.PARTNER, HttpMethod.PUT, {
            action: "refresh",
          });

          toast.success(`Successfully withdraw ${commission} USD`);
        } else {
          toast.error("Transaction failed, please try agian");
        }
      } catch (error: unknown) {
        console.error("Error transferring commission:", error);
      } finally {
        setIsTransferring(false);
      }
      router.refresh();
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${commission}</p>
            <p className="text-sm text-muted-foreground">
              Available for transfer
            </p>
          </div>
          <Button onClick={handleWithdraw} loading={isTransferring}>
            Transfer to Wallet
          </Button>
        </div>
        <div className="text-sm">
          <p className="font-medium">Receiving Wallet:</p>
          <p className="text-muted-foreground break-all">{receivingWallet}</p>
        </div>
      </div>
    );
  },

  ShopsSection: ({ shops }: ShopsSectionProps) => {
    return (
      <div className="space-y-4">
        {shops.length === 0 ? (
          <p className="text-muted-foreground">No shops associated yet.</p>
        ) : (
          <div className="grid gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col space-y-1">
                  <p className="font-semibold text-lg">{shop.name}</p>
                  <p className="text-sm text-muted-foreground">{shop.email}</p>
                  <p className="text-xs text-muted-foreground">
                    External ID:{" "}
                    <span className="font-mono">{shop.externalId}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:items-end mt-3 sm:mt-0 space-y-1">
                  <Badge
                    variant={shop.isActive ? "default" : "secondary"}
                    className={
                      shop.isActive
                        ? "bg-green-500/10 text-green-600 border-green-200"
                        : "bg-gray-200/70 text-gray-700 border-gray-300"
                    }
                  >
                    {shop.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(shop.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};
