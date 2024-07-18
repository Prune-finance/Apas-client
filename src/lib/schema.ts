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
});

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
  contactNumber: "",
  contactEmail: "",
  cacCertificate: "",
  address: "",
  mermat: "",
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
  password: "",
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

export const validateNewAdmin = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string({ required_error: "Password is required" }),
  role: z.string().optional(),
});

export const validateNewBusiness = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Business name must be a minimum of 3 characters"),
  country: z.string().min(1, "Country is required"),
  legalEntity: z.string().min(1, "Legal Entity is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  contactEmail: z.string().email("Please provide a valid contact email"),
  cacCertificate: z.string().url("Cac certificate is required"),
  mermat: z.string().url("Mermat document is required"),
  domain: z.string().url("Please provide a valid url"),
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
