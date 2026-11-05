import { z } from "zod";
import "./error-map";

const emailSchema = z.string().email();

// Mantine's zodResolver keeps only the LAST issue per field, so each of these rules
// reports a single, most-relevant message instead of chaining checks.
const nameField = (label: string) =>
  z.string().superRefine((v, ctx) => {
    const message = !v
      ? `${label} is required`
      : !v.trim()
      ? `${label} cannot be only spaces`
      : v.trim().length < 2
      ? `${label} must be at least 2 characters`
      : v.length > 50
      ? `${label} cannot exceed 50 characters`
      : null;
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  });

const requiredEmail = (who: string) =>
  z.string().superRefine((v, ctx) => {
    const message = !v?.trim()
      ? `${who} email is required`
      : !emailSchema.safeParse(v.trim()).success
      ? `Invalid ${who === who.toUpperCase() ? who : who.toLowerCase()} email`
      : null;
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  });

const Director = z.object({
  id: z.string().uuid(),
  first_name: nameField("Director's first name"),
  last_name: nameField("Director's last name"),
  date_of_birth: z
    .union([
      z.date({ required_error: "Director's Date of birth is required" }),
      z.string().nullable(),
    ])
    .refine((val) => val, {
      message: "Director's Date of birth is required",
    })
    .refine(
      (val) => {
        if (!val) return true;
        const dob = new Date(val as string | Date);
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 18);
        return dob <= minAge;
      },
      { message: "Director must be at least 18 years old" }
    ),
  email: requiredEmail("Director's"),
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
        first_name: nameField("Shareholder's first name"),
        last_name: nameField("Shareholder's last name"),
        date_of_birth: z
          .union([
            z.date({
              required_error: "Shareholder's Date of birth is required",
            }),
            z.string().nullable(),
          ])
          .refine((val) => val, {
            message: "Shareholder's Date of birth is required",
          })
          .refine(
            (val) => {
              if (!val) return true;
              const dob = new Date(val as string | Date);
              const minAge = new Date();
              minAge.setFullYear(minAge.getFullYear() - 18);
              return dob <= minAge;
            },
            { message: "Shareholder must be at least 18 years old" }
          ),
        email: requiredEmail("Shareholder's"),
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
  businessTradingName: z.string().trim().nullish(),
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
  businessWebsite: z.string().optional().nullable(),
  contactPersonFirstName: nameField("Contact first name"),
  contactPersonLastName: nameField("Contact last name"),
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
  ceoFirstName: nameField("CEO first name"),
  ceoLastName: nameField("CEO last name"),
  ceoEmail: requiredEmail("CEO"),
  ceoDOB: z
    .union([
      z.date({ required_error: "CEO Date of birth is required" }),
      z.string().nullable(),
    ])
    .refine((val) => val, { message: "CEO Date of birth is required" })
    .refine(
      (val) => {
        if (!val) return true;
        const dob = new Date(val as string | Date);
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 18);
        return dob <= minAge;
      },
      { message: "CEO must be at least 18 years old" }
    ),
  ceoIdType: handleNullableString("CEO ID Type"),
  ceoIdUrl: z.string(),
  ceoIdUrlBack: z.string(),
  ceoPOAUrl: z.string(),
  ceoPOAType: handleNullableString("CEO POA Type"),
});

export const onboardingDocumentSchema = z.object({
  cacCertificate: z.string(),
  mermat: z.string(),
  amlCompliance: z.string(),
  operationalLicense: z.string().nullable().optional(),
});

export const onboardingSchema = onboardingBasicInfoSchema
  .merge(onboardingDocumentSchema)
  .merge(onboardingDirectors)
  .merge(onboardingShareholders)
  .merge(CEOSchema);

export type OnboardingType = z.infer<typeof onboardingSchema>;

export type DirectorType = z.infer<typeof Director>;

export const OnboardingDirectorValues: DirectorType = {
  id: crypto.randomUUID(),
  first_name: "",
  last_name: "",
  email: "",
  date_of_birth: null,
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: null,
  identityFileUrlBack: null,
  proofOfAddressFileUrl: null,
};

export const OnboardingShareholderValues: DirectorType = {
  id: crypto.randomUUID(),
  first_name: "",
  last_name: "",
  email: "",
  date_of_birth: null,
  identityType: null,
  proofOfAddress: null,
  identityFileUrl: null,
  identityFileUrlBack: null,
  proofOfAddressFileUrl: null,
};

export const newOnboardingValue: OnboardingType = {
  businessName: "",
  businessTradingName: "",
  businessWebsite: "",
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
