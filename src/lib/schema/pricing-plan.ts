import { z } from "zod";

export const newPricingPlan = {
  name: "",
  cost: "",
  cycle: null,
  description: "",
  features: [""],
};

export const pricingPlanSchema = z
  .object({
    name: z
      .string()
      .min(3, "Pricing Plan name must be a minimum of 3 characters"),
    cost: z.union([z.number(), z.string()]).nullish(),
    cycle: z.string().nullable(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.cost) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cost is required",
        path: ["cost"],
      });
    }

    if (!data.cycle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cycle is required",
        path: ["cycle"],
      });
    }

    return data;
  });

export type PricingPlanType = z.infer<typeof pricingPlanSchema>;
