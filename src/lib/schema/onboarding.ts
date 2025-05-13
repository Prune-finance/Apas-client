import { z } from "zod";

const emailSchema = z.string().email();

const Director = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, "Director's first name is required"),
  lastName: z.string().min(1, "Director's last name is required"),
  dob: z
    .union([
      z.date({ required_error: "Director's Date of birth is required" }),
      z.string().nullable(),
    ])
    .refine((val) => val, {
      message: "Director's Date of birth is required",
    }),
  email: z.string().refine(
    (val) => {
      if (!val) return true;
      return emailSchema.safeParse(val).success;
    },
    { message: "Invalid director's email" }
  ),
  identityType: z.string().nullable(),
  proofOfAddress: z.string().nullable(),
  identityFileUrl: z.string().nullable(),
  identityFileUrlBack: z.string().nullable(),
  proofOfAddressFileUrl: z.string().nullable(),
});

export const onboardingDirectors = z.object({
  directors: z.array(Director).superRefine((directors, ctx) => {
    const emails = directors?.map((dir) => dir.email);
    const emailSet = new Set();
    emails?.forEach((email, index) => {
      if (emailSet.has(email) && email) {
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

export const onboardingShareholders = z.object({
  shareholders: z
    .array(
      z.object({
        id: z.string().uuid(),
        firstName: z.string().min(1, "Shareholder's first name is required"),
        lastName: z.string().min(1, "Shareholder's last name is required"),
        dob: z
          .union([
            z.date({
              required_error: "Shareholder's Date of birth is required",
            }),
            z.string().nullable(),
          ])
          .refine((val) => val, {
            message: "Shareholder's Date of birth is required",
          }),
        email: z.string().refine(
          (val) => {
            if (!val) return true;
            return emailSchema.safeParse(val).success;
          },
          { message: "Invalid shareholder's email" }
        ),
        identityType: z.string().nullable(),
        proofOfAddress: z.string().nullable(),
        identityFileUrl: z.string().nullable(),
        identityFileUrlBack: z.string().nullable(),
        proofOfAddressFileUrl: z.string().nullable(),
      })
    )
    .optional()
    .superRefine((shareholders, ctx) => {
      const emails = shareholders?.map((shareholder) => shareholder.email);
      const emailSet = new Set();
      emails?.forEach((email, index) => {
        if (emailSet.has(email) && email) {
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

const handleNullableString = (fieldName: string) =>
  z
    .union([z.literal(null), z.string()])
    .refine((val) => val !== null && val.trim() !== "", {
      message: `${fieldName} is required`,
    });

export const onboardingBasicInfoSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  businessTradingName: z.string().trim().optional(),
  businessCountry: handleNullableString("Country"),
  businessType: handleNullableString("Business Type"),
  businessIndustry: handleNullableString("Business Industry"),
  businessPhoneNumber: z.string().min(1, "Contact number is required"),
  contactPersonPhoneNumber: z.string().min(1, "Contact number is required"),
  businessAddress: z.string().min(1, "Business Address is required"),
  businessDescription: z.string(),
  businessEmail: z
    .string()
    .email("Please provide a valid contact email")
    .min(1, "Contact Email is required"),
  contactPersonEmail: z
    .string()
    .email("Please provide a valid contact email")
    .min(1, "Contact Email is required"),
  businessWebsite: z.string().url("Please provide a valid url"),
  contactPersonFirstName: z.string().min(1, "Contact first name is required"),
  contactPersonLastName: z.string().min(1, "Contact last name is required"),
  contactPersonIdType: z.string().nullable(),
  contactPersonPOAType: z.string().nullable(),
  contactPersonIdUrl: z.string(),
  contactPersonIdUrlBack: z.string(),
  contactPersonPOAUrl: z.string(),
  contactPersonPhoneNumberCode: z.string(),
  businessPhoneNumberCode: z.string(),
  makeContactPersonInitiator: z.boolean().default(false),
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
  .merge(onboardingDirectors)
  .merge(onboardingShareholders)
  .merge(CEOSchema);

export type OnboardingType = z.infer<typeof onboardingSchema>;

type DirectorType = z.infer<typeof Director>;

export const OnboardingDirectorValues: DirectorType = {
  id: crypto.randomUUID(),
  firstName: "",
  lastName: "",
  email: "",
  dob: null,
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: null,
  identityFileUrlBack: null,
  proofOfAddressFileUrl: null,
};

export const OnboardingShareholderValues: DirectorType = {
  id: crypto.randomUUID(),
  firstName: "",
  lastName: "",
  email: "",
  dob: null,
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: null,
  identityFileUrlBack: null,
  proofOfAddressFileUrl: null,
};

export const newOnboardingValue: OnboardingType = {
  businessName: "",
  businessTradingName: "",
  businessWebsite: "https://",
  businessCountry: null,
  businessType: null,
  businessIndustry: null,
  contactPersonPhoneNumber: "+234",
  businessPhoneNumber: "+234",
  businessEmail: "",
  businessDescription: "",
  contactPersonFirstName: "",
  contactPersonLastName: "",
  contactPersonEmail: "",
  contactPersonIdType: "",
  contactPersonPOAType: "",
  contactPersonIdUrl: "",
  contactPersonIdUrlBack: "",
  contactPersonPOAUrl: "",
  cacCertificate: "",
  businessAddress: "",
  mermat: "",
  amlCompliance: "",
  operationalLicense: null,
  directors: [OnboardingDirectorValues],
  shareholders: [OnboardingShareholderValues],
  contactPersonPhoneNumberCode: "+234",
  businessPhoneNumberCode: "+234",
  ceoFirstName: "",
  ceoLastName: "",
  ceoEmail: "",
  ceoDOB: null,
  ceoIdType: "",
  ceoIdUrl: "",
  ceoIdUrlBack: "",
  ceoPOAUrl: "",
  ceoPOAType: "",
  makeContactPersonInitiator: false,
};
