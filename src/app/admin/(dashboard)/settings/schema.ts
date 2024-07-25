import { z } from "zod";

export const logFilterValues = {
  rows: null,
  sort: null,
  createdAt: null,
};

export const logFilterSchema = z.object({
  rows: z.string().nullable(),
  sort: z.string().nullable(),
  createdAt: z.date().nullable(),
});

export type LogFilterType = z.infer<typeof logFilterSchema>;
