import { z } from "zod";

export const directorEtShareholderSchema = {
  id: crypto.randomUUID(),
  name: "",
  email: "",
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: "",
  identityFileUrlBack: "",
  proofOfAddressFileUrl: "",
};

export const ShareholderValues = {
  id: crypto.randomUUID(),
  name: "",
  email: "",
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: "",
  identityFileUrlBack: "",
  proofOfAddressFileUrl: "",
};

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
  domain: "https://",
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
  companyPOAUrl: "",
  amlCompliance: null,
  operationalLicense: null,
  shareholderParticular: null,
  directorParticular: null,
  directors: [directorEtShareholderSchema],
  shareholders: [ShareholderValues],
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
    tradingName: z.string().trim().optional(),
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
  cacCertificate: z.string().url("Certificate of Incorporation is required"),
  mermat: z.string().url("Memart document is required"),
  companyPOAUrl: z.string().url("Corporate Proof of Address is required"),
  directorParticular: z
    .string()
    .url("Particular of Director document is required")
    .nullable()
    .optional(),
  shareholderParticular: z
    .string()
    .url("Particular of Shareholder document is required")
    .nullable()
    .optional(),
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
      id: z.string().uuid(),
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
    .optional()
    .superRefine((directors, ctx) => {
      const emails = directors?.map((dir) => dir.email);
      const emailSet = new Set();
      emails?.forEach((email, index) => {
        if (emailSet.has(email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate email found: ${email}`,
            path: [index, "email"],
            // path: ["directors", index, "email"],
          });
        } else {
          emailSet.add(email);
        }
      });
    }),
});

export const shareholdersSchema = z.object({
  shareholders: z
    .array(
      z.object({
        id: z.string().uuid(),
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
    .optional()
    .superRefine((shareholders, ctx) => {
      const emails = shareholders?.map((shareholder) => shareholder.email);
      const emailSet = new Set();
      emails?.forEach((email, index) => {
        if (emailSet.has(email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate email found: ${email}`,
            path: [index, "email"],
          });
        } else {
          emailSet.add(email);
        }
      });
    }),
});

export const validateNewBusiness = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  tradingName: z.string().trim().optional(),
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
  cacCertificate: z.string().url("Certificate of Incorporation is required"),
  mermat: z.string().url("Memart document is required"),
  companyPOAUrl: z.string().url("Corporate Proof of Address is required"),
  directorParticular: z
    .string()
    .url("Particular of Director document is required")
    .nullable()
    .optional(),
  shareholderParticular: z
    .string()
    .url("Particular of Shareholder document is required")
    .nullable()
    .optional(),
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
        id: z.string().uuid(),
        name: z.string().min(1, "Director's name is required"),
        email: z.string().refine(
          (val) => {
            if (!val) return true;
            return emailSchema.safeParse(val).success;
          },
          { message: "Invalid director's email" }
        ),
        identityType: z
          .string({ invalid_type_error: "Identity Type is required" })
          .nullable(),
        proofOfAddress: z
          .string({ invalid_type_error: "Proof of Address is required" })
          .nullable(),
        identityFileUrl: z.string(),
        identityFileUrlBack: z.string(),
        proofOfAddressFileUrl: z.string(),
      })
    )
    .optional(),
  shareholders: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().refine(
        (val) => {
          if (!val) return true;
          return emailSchema.safeParse(val).success;
        },
        { message: "Invalid shareholder's email" }
      ),
      identityType: z
        .string({ invalid_type_error: "Identity Type is required" })
        .nullable(),
      proofOfAddress: z
        .string({ invalid_type_error: "Proof of Address is required" })
        .nullable(),
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
  identityType: z.string({
    invalid_type_error: "Identity Type is required",
  }),
  proofOfAddress: z.string().nullable(),
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
  identityType: z.string({ invalid_type_error: "Identity Type is required" }),
  proofOfAddress: z.string().nullable(),
  identityFileUrl: z.string(),
  identityFileUrlBack: z.string(),
  proofOfAddressFileUrl: z.string(),
});

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
