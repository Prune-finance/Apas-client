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

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

const positiveIntegerSchema = (fieldName: string, max = MAX_SAFE) =>
  z.union([
    z.string().min(1, `${fieldName} is required`),
    z
      .number({ invalid_type_error: `${fieldName} must be a number` })
      .positive(`${fieldName} must be a positive number`)
      .int(`${fieldName} must be an integer`)
      .max(max, `${fieldName} must be ${max.toLocaleString()} or less`),
  ]);

const positiveNumberSchema = (fieldName: string, max = MAX_SAFE) =>
  z.union([
    z.string().min(1, `${fieldName} is required`),
    z
      .number({ invalid_type_error: `${fieldName} must be a number` })
      .positive(`${fieldName} must be a positive number`)
      .max(max, `${fieldName} must be ${max.toLocaleString()} or less`),
  ]);

const validatePeriodOrder = (
  values: { daily: string | number; monthly: string | number; annually: string | number },
  ctx: z.RefinementCtx
) => {
  const numericValue = (value: string | number) =>
    typeof value === "string" && value.trim() === "" ? NaN : Number(value);
  const daily = numericValue(values.daily);
  const monthly = numericValue(values.monthly);
  const annually = numericValue(values.annually);

  if (Number.isFinite(daily) && Number.isFinite(monthly) && monthly < daily) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["monthly"],
      message: "Monthly value must be greater than or equal to the daily value",
    });
  }

  if (Number.isFinite(monthly) && Number.isFinite(annually) && annually < monthly) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["annually"],
      message: "Yearly value must be greater than or equal to the monthly value",
    });
  }
};

export const VirtualAccountSchema = z
  .object({
    day_one_requirement: positiveIntegerSchema(
      "Initial virtual account requirement"
    ),
    total_number_of_virtual_accounts: positiveIntegerSchema(
      "Projected virtual accounts at full capacity"
    ),
    max_value_per_transaction: z
      .object({
        daily: positiveNumberSchema(
          "Daily maximum transaction value for single virtual account"
        ),
        monthly: positiveNumberSchema(
          "Monthly maximum transaction value for single virtual account"
        ),
        annually: positiveNumberSchema(
          "Annual maximum transaction value for single virtual account"
        ),
      })
      .superRefine(validatePeriodOrder),
    max_value_all_virtual_accounts: z
      .object({
        daily: positiveNumberSchema(
          "Daily maximum transaction value for all virtual accounts"
        ),
        monthly: positiveNumberSchema(
          "Monthly maximum transaction value for all virtual accounts"
        ),
        annually: positiveNumberSchema(
          "Annual maximum transaction value for all virtual accounts"
        ),
      })
      .superRefine(validatePeriodOrder),
    total_highest_transaction_count: z.object({
      daily: positiveIntegerSchema("Total highest transaction count"),
    }),
  })
  .superRefine((values, ctx) => {
    const dayOne = Number(values.day_one_requirement);
    const total = Number(values.total_number_of_virtual_accounts);
    if (
      Number.isFinite(dayOne) &&
      Number.isFinite(total) &&
      total < dayOne
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["total_number_of_virtual_accounts"],
        message:
          "Projected total must be greater than or equal to the day one requirement",
      });
    }
  });

// Operations Account
export const OperationsAccountSchema = z.object({
  estimated_balance: z.string().min(1, "Estimated balance is required"),
});

// Business Basic Info
export const BizBasicInfoSchema = z.object({
  businessName: z
    .string()
    .min(1, "Legal business name is required")
    .min(2, "Legal business name must be at least 2 characters")
    .max(100, "Legal business name cannot exceed 100 characters")
    .refine((v) => v.trim().length > 0, "Legal business name cannot be empty")
    .refine((v) => !/[<>{}[\]\\^`~]/.test(v), "Legal business name contains unsupported characters"),
  businessTradingName: z
    .string()
    .min(1, "Trading name is required")
    .min(2, "Trading name must be at least 2 characters")
    .max(50, "Trading name cannot exceed 50 characters")
    .refine((v) => v.trim().length > 0, "Trading name cannot be empty")
    .refine((v) => !/[<>{}[\]\\^`~]/.test(v), "Trading name contains unsupported characters"),
  businessCountry: z.string().min(1, "Country is required"),
  businessAddress: z
    .string()
    .min(1, "Business address is required")
    .min(5, "Business address must be at least 5 characters")
    .max(255, "Business address cannot exceed 255 characters")
    .refine((v) => v.trim().length > 0, "Business address cannot be empty"),
  businessIndustry: z.string().min(1, "Business industry is required"),
  businessEmail: z
    .string()
    .min(1, "Email address is required")
    .max(50, "Email address cannot exceed 50 characters")
    .email("Invalid email address")
    .refine((v) => !v.includes(" "), "Email address cannot contain spaces"),
  businessPhoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(7, "Phone number is too short")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain digits only"),
  countryCode: z.string().min(1, "Country code is required"),
  isRegulated: z.enum(["yes", "no"]),
  regulatoryDetails: z.string().optional(),
  geoFootprint: z
    .string({
      invalid_type_error:
        "Description of your geographic footprint is required",
    })
    .min(1, "Geo footprint is required")
    .min(10, "Geographic footprint must be at least 10 characters")
    .max(5000, "Geographic footprint cannot exceed 5000 characters")
    .refine((v) => v.trim().length > 0, "Geo footprint cannot be empty"),
  businessDescription: z
    .string()
    .min(1, "Business description is required")
    .min(10, "Business description must be at least 10 characters")
    .max(500, "Business description cannot exceed 500 characters")
    .refine((v) => v.trim().length > 0, "Business description cannot be empty"),
});

export const ContactPerson = z.object({
  contactName: z
    .string()
    .min(1, "Contact name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .refine((v) => v.trim().length > 0, "Name cannot be empty"),
  contactDesignation: z
    .string()
    .min(1, "Contact designation is required")
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation cannot exceed 50 characters")
    .refine((v) => v.trim().length > 0, "Designation cannot be empty"),
  contactEmail: z
    .string()
    .min(1, "Contact email address is required")
    .max(50, "Email address cannot exceed 50 characters")
    .email("Invalid email address")
    .refine((v) => !v.includes(" "), "Email address cannot contain spaces"),
  contactPhoneNumber: z
    .string()
    .min(1, "Contact phone number is required")
    .min(7, "Phone number is too short")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Contact phone number must contain digits only"),
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
  businessPhoneNumber: "",
  businessCountry: "",
  businessAddress: "",
  countryCode: "+234",
  businessIndustry: "",
  isRegulated: "no",
  regulatoryDetails: "",
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
    },
  },
  operationsAccounts: {
    estimated_balance: "",
  },
};
