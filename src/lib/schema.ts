import { z } from "zod";

export const loginValues = {
  email: "",
  password: "",
};

export const registerValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const validateLogin = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginType = z.infer<typeof validateLogin>;

export const validateRegister = z
  .object({
    email: z.string().email("Please provide a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .refine(
        (value) =>
          /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
            value
          ),
        `Password must contain at least 8 characters, 
          include at least one uppercase letter, 
          one lowercase letter, a number, and one special character`
      ),
    confirmPassword: z
      .string({
        required_error: "Confirm Password is required",
      })
      .min(1, "Confirm Password is required"),
  })
  .refine((values) => values.confirmPassword === values.password, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterType = z.infer<typeof validateRegister>;

export const directorEtShareholderSchema = {
  name: "",
  email: "",
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: "",
  identityFileUrlBack: "",
  proofOfAddressFileUrl: "",
};

export const newAdmin = {
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  password: "",
};

export const newUser = {
  email: "",
  firstName: "",
  lastName: "",
  role: "",
};

export const passwordChange = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// export const validatePasswordChange = z
//   .object({
//     oldPassword: z.string().min(1, "Old Password is required"),
//     newPassword: z
//       .string()
//       .min(1, "New Password is required")
//       .refine(
//         (value) =>
//           /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
//             value
//           ),
//         `Password must contain at least 8 characters,
//           include at least one uppercase letter,
//           one lowercase letter, a number, and one special character`
//       ),
//     confirmPassword: z.string().min(1, "Confirm the password provided above"),
//   })
//   .refine(
//     (data) => data.newPassword && data.newPassword === data.confirmPassword,
//     {
//       message: "Confirm the password. Ensure it matches with your new password",
//       path: ["confirmPassword"],
//     }
//   );

export const validatePasswordChange = z
  .object({
    oldPassword: z.string().min(1, "Old Password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*[0-9])/, "Password must contain at least one number")
      .regex(
        /(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordChangeType = z.infer<typeof validatePasswordChange>;

export const validateNewUser = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
});

export const validateRequest = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const validateNewAdmin = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string({ required_error: "Password is required" }),
  role: z.string().optional(),
});

export const contactPerson = {
  firstName: "",
  lastName: "",
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: "",
  identityFileUrlBack: "",
  proofOfAddressFileUrl: "",
};

export const newBusiness = {
  name: "",
  domain: "",
  country: null,
  legalEntity: null,
  pricingPlan: null,
  contactNumber: "+234",
  contactEmail: "",
  businessBio: "",
  contactFirstName: "",
  contactLastName: "",
  contactIdType: "",
  contactPOAType: "",
  contactIdUrl: "",
  contactIdUrlBack: "",
  contactPOAUrl: "",
  cacCertificate: "",
  address: "",
  mermat: "",
  amlCompliance: null,
  operationalLicense: null,
  shareholderParticular: "",
  directorParticular: "",
  directors: [directorEtShareholderSchema],
  shareholders: [directorEtShareholderSchema],
  contactCountryCode: "+234",
};

const emailSchema = z.string().email();

const contactPersonSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  identityType: z.string().nullable(),
  proofOfAddress: z.string().nullable(),
  identityFileUrl: z.string(),
  identityFileUrlBack: z.string(),
  proofOfAddressFileUrl: z.string(),
});

export const basicInfoSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Business name must be a minimum of 3 characters"),
    country: z.string().nullable(),
    legalEntity: z.string().nullable(),
    contactNumber: z.string().min(1, "Contact number is required"),
    address: z.string().min(1, "Business Address is required"),
    businessBio: z.string(),
    contactEmail: z
      .string()
      .email("Please provide a valid contact email")
      .min(1, "Contact Email is required"),
    domain: z.string().url("Please provide a valid url"),
    pricingPlan: z.string().nullable(),
    // contactPerson: contactPersonSchema,
    contactFirstName: z.string().min(1, "Contact first name is required"),
    contactLastName: z.string().min(1, "Contact last name is required"),
    contactIdType: z.string().nullable(),
    contactPOAType: z.string().nullable(),
    contactIdUrl: z.string(),
    contactIdUrlBack: z.string(),
    contactPOAUrl: z.string(),
    contactCountryCode: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Country is required",
        path: ["country"],
      });
    }

    if (!data.legalEntity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Legal Entity is required",
        path: ["legalEntity"],
      });
    }

    if (!data.pricingPlan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pricing Plan is required",
        path: ["pricingPlan"],
      });
    }

    return data;
  });

export type BasicInfoType = z.infer<typeof basicInfoSchema>;

export const documentSchema = z.object({
  cacCertificate: z.string().url("Cac certificate is required"),
  mermat: z.string().url("Memart document is required"),
  directorParticular: z
    .string()
    .url("Particular of Director document is required"),
  shareholderParticular: z
    .string()
    .url("Particular of Shareholder document is required"),
  operationalLicense: z
    .string()
    .url("Operational License document is required")
    .nullable()
    .optional(),
  amlCompliance: z
    .string()
    .url("AML Compliance Framework document is required")
    .nullable()
    .optional(),
});

export const directorsSchema = z.object({
  directors: z
    .object({
      name: z.string().min(1, "Director's name is required"),
      email: z.string().refine(
        (val) => {
          if (!val) return true;
          return emailSchema.safeParse(val).success;
        },
        { message: "Invalid director's email" }
      ),
      identityType: z.string().nullable(),
      proofOfAddress: z.string().nullable(),
      identityFileUrl: z.string(),
      identityFileUrlBack: z.string(),

      proofOfAddressFileUrl: z.string(),
    })
    .array()
    .optional(),
});

export const shareholdersSchema = z.object({
  shareholders: z
    .array(
      z.object({
        name: z.string(),
        email: z.string().refine(
          (val) => {
            if (!val) return true;
            return emailSchema.safeParse(val).success;
          },
          { message: "Invalid shareholder's email" }
        ),
        identityType: z.string().nullable(),
        proofOfAddress: z.string().nullable(),
        identityFileUrl: z.string(),
        identityFileUrlBack: z.string(),
        proofOfAddressFileUrl: z.string(),
      })
    )
    .optional(),
});

export const validateNewBusiness = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  country: z.string().min(1, "Country is required").nullable(),
  legalEntity: z.string().min(1, "Legal Entity is required").nullable(),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Business Address is required"),
  businessBio: z.string(),
  pricingPlan: z.string().min(1, "Pricing Plan is required").nullable(),
  contactEmail: z.string().email("Please provide a valid contact email"),
  contactFirstName: z.string().min(1, "Contact first name is required"),
  contactLastName: z.string().min(1, "Contact last name is required"),
  contactIdType: z.string().nullable(),
  contactPOAType: z.string().nullable(),
  contactIdUrl: z.string(),
  contactIdUrlBack: z.string(),
  contactPOAUrl: z.string(),
  contactCountryCode: z.string(),
  cacCertificate: z.string().url("Cac certificate is required"),
  mermat: z.string().url("Memart document is required"),
  directorParticular: z
    .string()
    .url("Particular of Director document is required"),
  shareholderParticular: z
    .string()
    .url("Particular of Shareholder document is required"),
  operationalLicense: z
    .string()
    .url("Operational License document is required")
    .nullable()
    .optional(),
  amlCompliance: z
    .string()
    .url("AML Compliance Framework is required")
    .nullable()
    .optional(),
  domain: z.string().url("Please provide a valid url"),
  directors: z
    .array(
      z.object({
        name: z.string().min(1, "Director's name is required"),
        email: z.string().refine(
          (val) => {
            if (!val) return true;
            return emailSchema.safeParse(val).success;
          },
          { message: "Invalid director's email" }
        ),
        identityType: z.string().nullable(),
        proofOfAddress: z.string().nullable(),
        identityFileUrl: z.string(),
        identityFileUrlBack: z.string(),
        proofOfAddressFileUrl: z.string(),
      })
    )
    .optional(),
  shareholders: z
    .object({
      name: z.string(),
      email: z.string().refine(
        (val) => {
          if (!val) return true;
          return emailSchema.safeParse(val).success;
        },
        { message: "Invalid shareholder's email" }
      ),
      identityType: z.string().nullable(),
      proofOfAddress: z.string().nullable(),
      identityFileUrl: z.string(),
      identityFileUrlBack: z.string(),
      proofOfAddressFileUrl: z.string(),
    })
    .array()
    .optional(),
});

export type NewBusinessType = z.infer<typeof validateNewBusiness>;

export const validateDirectors = z.object({
  name: z.string().min(3, "Director name is required"),
  email: z.string().refine(
    (val) => {
      if (!val) return true;
      return emailSchema.safeParse(val).success;
    },
    { message: "Invalid director's email" }
  ),
  identityType: z.string(),
  proofOfAddress: z.string(),
  identityFileUrl: z.string(),
  identityFileUrlBack: z.string(),
  proofOfAddressFileUrl: z.string(),
});

export const validateShareholder = z.object({
  name: z.string().min(3, "Shareholder name is required"),
  email: z.string().refine(
    (val) => {
      if (!val) return true;
      return emailSchema.safeParse(val).success;
    },
    { message: "Invalid shareholder's email" }
  ),
  identityType: z.string(),
  proofOfAddress: z.string(),
  identityFileUrl: z.string(),
  identityFileUrlBack: z.string(),
  proofOfAddressFileUrl: z.string(),
});

// export const debitRequest = {
//   account: "",
//   amount: "",
//   accountType: "",
//   destinationIBAN: "",
//   destinationBIC: "",
//   destinationCountry: "",
//   destinationBank: "",
//   reference: crypto.randomUUID(),
//   reason: "",
//   destinationFirstName: "",
//   destinationLastName: "",
//   accountBalance: 0,
// };

export const validateDebitRequest = z
  .object({
    account: z.string().min(3, "Account is required"),
    accountType: z.string(),
    amount: z
      .number({ invalid_type_error: "Amount is required" })
      .positive("A positive amount is required"),
    destinationIBAN: z.string().min(3, "Destination account is required"),
    destinationBIC: z.string().min(3, "BIC is required"),
    destinationCountry: z.string().min(2, "Country is required"),
    destinationBank: z.string().min(2, "Bank is required"),
    reference: z.string().min(2, "Reference number is required"),
    reason: z.string().min(2, "Narration is required"),
    destinationFirstName: z.string(),
    destinationLastName: z.string(),
    // accountBalance: z.number().positive("A positive amount is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount is required",
        path: ["amount"],
      });
    }

    // if (data?.amount > data?.accountBalance) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Amount must be less than or equal to account balance",
    //     path: ["amount"],
    //   });
    // }
    // return data;
  });

export const sendMoneyIndividualValidate = z.object({
  firstName: z.string().min(2, "First Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  destinationIBAN: z.string().min(3, "Destination account is required"),
  destinationBIC: z.string().min(3, "BIC is required"),
  destinationBank: z.string().min(2, "Bank is required"),
  bankAddress: z.string().min(2, "Bank Address is required"),
  destinationCountry: z.string().min(2, "Country is required"),
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .positive("A positive amount is required"),
  invoice: z.string(),
  narration: z.string().min(2, "Narration is required"),
  // accountBalance: z.number().positive("A positive amount is required"),
});

export const sendMoneyCompanyValidate = z.object({
  companyName: z.string().min(2, "First Name is required"),
  destinationIBAN: z.string().min(3, "Destination account is required"),
  destinationBIC: z.string().min(3, "BIC is required"),
  destinationBank: z.string().min(2, "Bank is required"),
  bankAddress: z.string().min(2, "Bank Address is required"),
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .positive("A positive amount is required"),
  invoice: z.string(),
  narration: z.string().min(2, "Narration is required"),
  // accountBalance: z.number().positive("A positive amount is required"),
});

// .refine((data) => data.accountBalance < data.amount, {
//   message: "Account balance must be greater than or equal to amount",
//   path: ["accountBalance"],
// })

export const FilterValues = {
  createdAt: [null, null] as [Date | null, Date | null] | null,
  status: null,
  contactEmail: "",
  name: "",
  email: "",
  accountName: "",
  accountNumber: "",
  type: null,
  accountType: null,
  country: "",
  senderName: "",
  senderIban: "",
  recipientName: "",
  recipientIban: "",
  amount: null,
  business: "",
  bank: "",
  beneficiaryName: "",
  destinationIban: "",
  destinationBank: "",
};

export const FilterSchema = z.object({
  createdAt: z.tuple([z.date().nullable(), z.date().nullable()]).nullable(),
  status: z.string().nullable(),
  contactEmail: z.string().nullable(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  accountName: z.string().nullable(),
  accountNumber: z.string().nullable(),
  type: z.string().nullable(),
  accountType: z.string().nullable(),
  country: z.string().nullable(),
  senderName: z.string().nullable(),
  senderIban: z.string().nullable(),
  recipientName: z.string().nullable(),
  recipientIban: z.string().nullable(),
  amount: z.number().nullable(),
  business: z.string().nullable(),
  bank: z.string().nullable(),
  beneficiaryName: z.string().nullable(),
  destinationIban: z.string().nullable(),
  destinationBank: z.string().nullable(),
});

export type FilterType = z.infer<typeof FilterSchema>;

export interface IParams {
  limit?: number;
  date?: string | null;
  endDate?: string | null;
  status?: string;
  business?: string;
  email?: string;
  name?: string;
  period?: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  country?: string;
  senderName?: string;
  senderIban?: string;
  recipientName?: string;
  recipientIban?: string;
  amount?: number;
  type?: string;
  page?: number;
  companyId?: string;
  not?: string;
  query?: string;
  bank?: string;
  beneficiaryName?: string;
  destinationIban?: string;
  destinationBank?: string;
}

export const removeDirectorValues = {
  reason: "",
  supportingDoc: "",
  supportingDocUrl: "",
};

export const removeDirectorSchema = z.object({
  reason: z.string().min(1, "Please enter a reason"),
  supportingDoc: z.string(),
  supportingDocUrl: z.string(),
});

export type RemoveDirectorType = z.infer<typeof removeDirectorSchema>;

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

export const resetPasswordValues = {
  password: "",
  confirmPassword: "",
  otp: "",
};

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*[0-9])/, "Password must contain at least one number")
      .regex(
        /(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    otp: z
      .union([
        z.string().min(6, "OTP must be 6 characters"),
        z.number().min(6, "OTP must be 6 characters"),
      ])
      .refine((data) => data, {
        message: "OTP is required to reset password",
        // path: ["otp"],
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const otherDocumentValues = {
  name: "",
  url: "",
};

export const otherDocumentSchema = z.object({
  name: z.string().min(1, "Document Name is required"),
  url: z
    .string()
    .url("Value must be a valid URL")
    .min(1, "Document URL is required"),
});

export type OtherDocumentType = z.infer<typeof otherDocumentSchema>;
