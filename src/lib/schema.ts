import { z } from "zod";

export const loginValues = {
  email: "",
  password: "",
};

export const registerValues = {
  email: "",
  password: "",
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
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((values) => values.confirmPassword === values.password, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
  });

export const directorEtShareholderSchema = {
  name: "",
  email: "",
  identityType: "",
  proofOfAddress: "",
  identityFileUrl: "",
  identityFileUrlBack: "",
  proofOfAddressFileUrl: "",
};

export const newBusiness = {
  name: "",
  domain: "",
  country: "",
  legalEntity: "",
  pricingPlan: "",
  contactNumber: "",
  contactEmail: "",
  businessBio: "",
  cacCertificate: "",
  address: "",
  mermat: "",
  amlCompliance: null,
  operationalLicense: null,
  shareholderParticular: "",
  directorParticular: "",
  directors: [directorEtShareholderSchema],
  shareholders: [directorEtShareholderSchema],
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

export const debitRequest = {
  account: "",
  amount: "",
  destinationIBAN: "",
  destinationBIC: "",
  destinationCountry: "",
  destinationBank: "",
  reference: "",
  reason: "",
};

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

const emailSchema = z.string().email();

export const basicInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  country: z.string().min(1, "Country is required"),
  legalEntity: z.string().min(1, "Legal Entity is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Business Address is required"),
  businessBio: z.string(),
  contactEmail: z.string().email("Please provide a valid contact email"),
  domain: z.string().url("Please provide a valid url"),
  pricingPlan: z.string().min(1, "Pricing Plan is required"),
});

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

export const directorsSchema = z
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
      identityType: z.string(),
      proofOfAddress: z.string(),
      identityFileUrl: z.string(),
      identityFileUrlBack: z.string(),

      proofOfAddressFileUrl: z.string(),
    })
  )
  .optional();

export const shareholdersSchema = z
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
      identityType: z.string(),
      proofOfAddress: z.string(),
      identityFileUrl: z.string(),
      identityFileUrlBack: z.string(),
      proofOfAddressFileUrl: z.string(),
    })
  )
  .optional();

export const validateNewBusiness = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  country: z.string().min(1, "Country is required"),
  legalEntity: z.string().min(1, "Legal Entity is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Business Address is required"),
  businessBio: z.string(),
  pricingPlan: z.string().min(1, "Pricing Plan is required"),
  contactEmail: z.string().email("Please provide a valid contact email"),
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
        identityType: z.string(),
        proofOfAddress: z.string(),
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
      identityType: z.string(),
      proofOfAddress: z.string(),
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

export const validateDebitRequest = z.object({
  account: z.string().min(3, "Account is required"),
  amount: z.number().positive("A positive amount is required"),
  destinationIBAN: z.string().min(3, "Destination account is required"),
  destinationBIC: z.string().min(3, "BIC is required"),
  destinationCountry: z.string().min(2, "Country is required"),
  destinationBank: z.string().min(2, "Bank is required"),
  reference: z.string().min(2, "Reference number is required"),
  reason: z.string().min(2, "Reason is required"),
});

export const filterValues = {
  rows: null,
  sort: null,
  createdAt: null,
  status: null,
};

export const filterSchema = z.object({
  rows: z.string().nullable(),
  sort: z.string().nullable(),
  createdAt: z.date().nullable(),
  status: z.string().nullable(),
});

export type FilterType = z.infer<typeof filterSchema>;

export const removeDirectorValues = {
  reason: "",
  supportingDoc: "",
  supportingDocUrl: "",
};

export const removeDirectorSchema = z.object({
  reason: z.string(),
  supportingDoc: z.string(),
  supportingDocUrl: z.string(),
});

export type RemoveDirectorType = z.infer<typeof removeDirectorSchema>;
