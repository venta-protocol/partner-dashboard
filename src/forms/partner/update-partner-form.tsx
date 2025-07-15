"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/forms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendBackendRequest, Endpoint, HttpMethod } from "@/lib/utils.client";

// ---------------------------------------------------------------
// Validation schema & types
// ---------------------------------------------------------------
const formSchema = z.object({
  partnerName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .or(z.literal(""))
    .optional(),
  receivingWallet: z.string().min(5, {
    message: "Please enter a valid wallet address.",
  }),
  contactPhone: z.string().optional(),
  defaultFeeBps: z.string().refine((val) => /^\d+$/.test(val), {
    message: "Must be a numeric value",
  }),
});

type FormData = z.infer<typeof formSchema>;

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------
export interface UpdateFormProps {
  id: string;
  partnerName: string;
  website?: string;
  receivingWallet: string;
  contactPhone?: string;
  defaultFeeBps?: number;
}

export const UpdateForm: FC<UpdateFormProps> = ({
  id,
  partnerName,
  website,
  receivingWallet,
  contactPhone,
  defaultFeeBps,
}) => {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName,
      website: website ?? "",
      receivingWallet,
      contactPhone: contactPhone ?? "",
      defaultFeeBps: defaultFeeBps ? defaultFeeBps.toString() : "0",
    },
  });

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await sendBackendRequest(Endpoint.PARTNER, HttpMethod.PUT, {
        action: "update",
        partnerName: data.partnerName,
        receivingWallet: data.receivingWallet,
        website: data.website,
        contactPhone: data.contactPhone,
        defaultFeeBps: parseInt(data.defaultFeeBps, 10),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error ?? "Failed to update partner info");
        return;
      }

      // Update local session so UI reflects immediately
      await update({
        user: {
          partnerName: data.partnerName,
          receivingWallet: data.receivingWallet,
          website: data.website,
          contactPhone: data.contactPhone,
        },
      });

      toast.success("Partner info updated successfully");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error updating partner info");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        {/* Partner Name */}
        <FormField
          control={form.control}
          name="partnerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Company" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Website */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Receiving Wallet */}
        <FormField
          control={form.control}
          name="receivingWallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiving Wallet</FormLabel>
              <FormControl>
                <Input placeholder="Wallet public key" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultFeeBps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Fee (%)</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="100" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};
