import { z } from "zod";

export const TurnoverSchema = z.object({
  annualTurnover: z.string().min(1, "Entity's annual turnover is required"),
});

// Services
export const ServicesSchema = z
  .array(
    z.object({
      name: z.string().min(1, "Service name is required"),
      currencies: z
        .array(z.string().min(1, "Currency is required"))
        .min(1, "At least one currency is required"),
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
  day_one_requirement: positiveIntegerSchema(
    "Initial virtual account requirement"
  ),
  total_number_of_virtual_accounts: positiveIntegerSchema(
    "Projected virtual accounts at full capacity"
  ),
  max_value_per_transaction: z.object({
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
  max_value_all_virtual_accounts: z.object({
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
  total_highest_transaction_count: z.object({
    daily: positiveIntegerSchema("Daily maximum transaction count"),
    monthly: positiveIntegerSchema("Monthly maximum transaction count"),
    annually: positiveIntegerSchema("Annual maximum transaction count"),
  }),
});

// Operations Account
export const OperationsAccountSchema = z.object({
  estimated_balance: z.string().min(1, "Estimated balance is required"),
});

// Business Basic Info
export const BizBasicInfoSchema = z.object({
  businessName: z.string().min(1, "Legal business name is required"),
  businessTradingName: z.string().min(1, "Trading name is required"),
  businessCountry: z.string().min(1, "Country is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessIndustry: z.string().min(1, "Business industry is required"),
  businessEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Email address is required"),
  businessPhoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]*$/, "Phone number must be a valid number"),
  countryCode: z.string().min(1, "Country code is required"),
  isRegulated: z.enum(["yes", "no"]),
  geoFootprint: z.string().min(1, "Geo footprint is required"),
  businessDescription: z.string().min(1, "Business description is required"),
});

export const ContactPerson = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  contactDesignation: z.string().min(1, "Contact designation is required"),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Contact email address is required"),
  contactPhoneNumber: z
    .string()
    .min(10, "Contact phone number is required")
    .regex(/^\+?[0-9]*$/, "Contact phone number must be a valid number"),
  contactCountryCode: z.string().min(1, "Contact country code is required"),
});

export const questionnaireSchema = z
  .object({
    services: ServicesSchema,
    virtualAccounts: VirtualAccountSchema,
    operationsAccounts: OperationsAccountSchema,
  })
  .merge(BizBasicInfoSchema)
  .merge(TurnoverSchema);
// .merge(ContactPerson);

export type VirtualAccountType = z.infer<typeof VirtualAccountSchema>;
export type QuestionnaireType = z.infer<typeof questionnaireSchema>;
export type OperationsAccountType = z.infer<typeof OperationsAccountSchema>;
export type ServicesType = z.infer<typeof ServicesSchema>;
export type TurnoverType = z.infer<typeof TurnoverSchema>;

export const questionnaireValues: QuestionnaireType = {
  businessName: "",
  businessTradingName: "",
  businessEmail: "",
  businessPhoneNumber: "+234",
  businessCountry: "",
  businessAddress: "",
  countryCode: "+234",
  businessIndustry: "",
  isRegulated: "no",
  geoFootprint: "",
  businessDescription: "",
  annualTurnover: "",
  services: [],
  virtualAccounts: {
    day_one_requirement: "",
    total_number_of_virtual_accounts: "",
    max_value_per_transaction: {
      daily: "",
      monthly: "",
      annually: "",
    },
    max_value_all_virtual_accounts: {
      daily: "",
      monthly: "",
      annually: "",
    },
    total_highest_transaction_count: {
      daily: "",
      monthly: "",
      annually: "",
    },
  },
  operationsAccounts: {
    estimated_balance: "",
  },
};
