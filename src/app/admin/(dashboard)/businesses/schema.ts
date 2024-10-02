import { z } from "zod";

export const businessFilterValues = {
  createdAt: [null, null] as [Date | null, Date | null] | null,
  status: null,
};

export const businessFilterSchema = z.object({
  createdAt: z.tuple([z.date().nullable(), z.date().nullable()]).nullable(),
  status: z.string().nullable(),
});

export type BusinessFilterType = z.infer<typeof businessFilterSchema>;
