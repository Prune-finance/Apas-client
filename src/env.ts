import { z } from "zod";

const envVariables = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string(),
  NEXT_PUBLIC_ACCOUNTS_URL: z.string(),
  NEXT_PUBLIC_PAYOUT_URL: z.string(),
  NEXT_PUBLIC_AUTH_BASE_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
