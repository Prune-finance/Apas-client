import { z } from "zod";

export const TurnoverSchema = z.object({
  turnover: z.string().min(1, "Entity's annual turnover is required"),
});

export const ServicesSchema = z
  .array(
    z.object({
      name: z.string().min(1, "Service name is required"),
      accounts: z
        .array(z.string().min(2, "Account type is required"))
        .min(1, "At least one account type is required"),
    })
  )
  .min(1, "Select at least one service");
const positiveIntegerSchema = (fieldName: string) =>
  z.union([
    z.string().min(1, `${fieldName} is required`),
    z
      .number({ invalid_type_error: `${fieldName} must be a number` })
      .positive(`${fieldName} must be a positive number`)
      .int(`${fieldName} must be an integer`),
  ]);

export const VirtualAccountSchema = z.object({
  numberOfAccounts: positiveIntegerSchema(
    "Initial virtual account requirement"
  ),
  projectedTotalAccounts: positiveIntegerSchema(
    "Projected virtual accounts at full capacity"
  ),
  singleAccount: z.object({
    daily: positiveIntegerSchema(
      "Daily maximum transaction value for single virtual account"
    ),
    monthly: positiveIntegerSchema(
      "Monthly maximum transaction value for single virtual account"
    ),
    annually: positiveIntegerSchema(
      "Annual maximum transaction value for single virtual account"
    ),
  }),
  allAccounts: z.object({
    daily: positiveIntegerSchema(
      "Daily maximum transaction value for all virtual accounts"
    ),
    monthly: positiveIntegerSchema(
      "Monthly maximum transaction value for all virtual accounts"
    ),
    annually: positiveIntegerSchema(
      "Annual maximum transaction value for all virtual accounts"
    ),
  }),
  transactionCount: z.object({
    daily: positiveIntegerSchema("Daily maximum transaction count"),
    monthly: positiveIntegerSchema("Monthly maximum transaction count"),
    annually: positiveIntegerSchema("Annual maximum transaction count"),
  }),
});

export const OperationsAccountSchema = z.object({
  estimatedBalance: z.string().min(1, "Estimated balance is required"),
});

export const questionnaireSchema = z.object({
  turnover: z.string().min(1, "Turnover is required"),
  services: ServicesSchema,
  virtualAccount: VirtualAccountSchema,
  operationsAccount: OperationsAccountSchema,
});

export type VirtualAccountType = z.infer<typeof VirtualAccountSchema>;
export type QuestionnaireType = z.infer<typeof questionnaireSchema>;
export type OperationsAccountType = z.infer<typeof OperationsAccountSchema>;
export type ServicesType = z.infer<typeof ServicesSchema>;
export type TurnoverType = z.infer<typeof TurnoverSchema>;

export const questionnaireValues: QuestionnaireType = {
  turnover: "",
  services: [],
  virtualAccount: {
    numberOfAccounts: "",
    projectedTotalAccounts: "",
    singleAccount: {
      daily: "",
      monthly: "",
      annually: "",
    },
    allAccounts: {
      daily: "",
      monthly: "",
      annually: "",
    },
    transactionCount: {
      daily: "",
      monthly: "",
      annually: "",
    },
  },
  operationsAccount: {
    estimatedBalance: "",
  },
};
