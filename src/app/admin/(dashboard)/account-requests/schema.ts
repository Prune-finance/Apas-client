import { z } from "zod";

export const accountFilterValues = {
  rows: null,
  sort: null,
  createdAt: null,
  status: null,
  type: null,
};

export const accountFilterSchema = z.object({
  rows: z.string().nullable(),
  sort: z.string().nullable(),
  createdAt: z.date().nullable(),
  status: z.string().nullable(),
  type: z.string().nullable(),
});

export type AccountFilterType = z.infer<typeof accountFilterSchema>;
