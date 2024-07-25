import { z } from "zod";

export const businessFilterValues = {
  rows: null,
  sort: null,
  createdAt: null,
  status: null,
};

export const businessFilterSchema = z.object({
  rows: z.string().nullable(),
  sort: z.string().nullable(),
  createdAt: z.date().nullable(),
  status: z.string().nullable(),
});

export type BusinessFilterType = z.infer<typeof businessFilterSchema>;
