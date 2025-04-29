import { z } from "zod";
import {
  directorEtShareholderSchema,
  directorsSchema,
  documentSchema,
  shareholdersSchema,
  ShareholderValues,
} from "./business";

const emailSchema = z.string().email();

// const handleNullableString = (fieldName: string) =>
//   z.union([
//     z.literal(null),
//     z.preprocess(
//       (val) => (val === null ? undefined : val),
//       z
//         .string({
//           required_error: `${fieldName} is required`,
//           invalid_type_error: `${fieldName} is required`,
//         })
//         .min(1, `${fieldName} is required`)
//     ),
//   ]);

const handleNullableString = (fieldName: string) =>
  z
    .union([z.literal(null), z.string()])
    .refine((val) => val !== null && val.trim() !== "", {
      message: `${fieldName} is required`,
    });

export const onboardingBasicInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  tradingName: z.string().trim().optional(),
  country: handleNullableString("Country"),
  legalEntity: handleNullableString("Business Type"),
  businessIndustry: handleNullableString("Business Industry"),
  businessNumber: z.string().min(1, "Contact number is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Business Address is required"),
  businessBio: z.string(),
  contactEmail: z
    .string()
    .email("Please provide a valid contact email")
    .min(1, "Contact Email is required"),
  domain: z.string().url("Please provide a valid url"),
  // pricingPlan: handleNullableString("Pricing Plan"),
  contactFirstName: z.string().min(1, "Contact first name is required"),
  contactLastName: z.string().min(1, "Contact last name is required"),
  contactIdType: z.string().nullable(),
  contactPOAType: z.string().nullable(),
  contactIdUrl: z.string(),
  contactIdUrlBack: z.string(),
  contactPOAUrl: z.string(),
  contactCountryCode: z.string(),
});

export type OnboardingBasicInfoType = z.infer<typeof onboardingBasicInfoSchema>;

export const CEOSchema = z.object({
  ceoFirstName: z.string().min(1, "CEO first name is required"),
  ceoLastName: z.string().min(1, "CEO last name is required"),
  ceoEmail: z.string().email("Please provide a valid email"),
  ceoDOB: z
    .union([
      z.date({ required_error: "CEO Date of birth is required" }),
      z.string().nullable(),
    ])
    .refine((val) => val, { message: "CEO Date of birth is required" }),
  ceoIdType: handleNullableString("CEO ID Type"),
  ceoIdUrl: z.string(),
  ceoIdUrlBack: z.string(),
  ceoPOAUrl: z.string(),
  ceoPOAType: handleNullableString("CEO POA Type"),
});

export const onboardingDocumentSchema = z.object({
  cacCertificate: z.string().url("Certificate of Incorporation is required"),
  mermat: z.string().url("Memart document is required"),
  amlCompliance: z
    .string()
    .url("AML Compliance Framework document is required"),
  operationalLicense: z
    .string()
    .url("Operational License document is required")
    .nullable()
    .optional(),
});

export const onboardingSchema = onboardingBasicInfoSchema
  .merge(onboardingDocumentSchema)
  .merge(directorsSchema)
  .merge(shareholdersSchema)
  .merge(CEOSchema);

export type OnboardingType = z.infer<typeof onboardingSchema>;

export const newOnboardingValue: OnboardingType = {
  name: "",
  domain: "https://",
  country: null,
  legalEntity: null,
  // pricingPlan: null,
  businessIndustry: null,
  contactNumber: "+234",
  businessNumber: "+234",
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
  // companyPOAUrl: "",
  // shareholderParticular: null,
  // directorParticular: null,
  amlCompliance: "",
  operationalLicense: null,
  directors: [directorEtShareholderSchema],
  shareholders: [ShareholderValues],
  contactCountryCode: "+234",
  ceoFirstName: "",
  ceoLastName: "",
  ceoEmail: "",
  ceoDOB: null,
  ceoIdType: "",
  ceoIdUrl: "",
  ceoIdUrlBack: "",
  ceoPOAUrl: "",
  ceoPOAType: "",
};
