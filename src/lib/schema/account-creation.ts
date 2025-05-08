import { z } from "zod";

export const accountCreation = z.object({
  type: z.string().min(1, "Account type is required"),
  currency: z.string().min(1, "Currency is required"),
  reason: z.string().min(1, "Reason is required"),
});

export type accountCreationType = z.infer<typeof accountCreation>;
