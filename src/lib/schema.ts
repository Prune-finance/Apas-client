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

export const validateNewAdmin = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string({ required_error: "Password is required" }),
  role: z.string().optional(),
});

export const validateNewBusiness = z.object({
  domain: z.string().url("Please provide a valid url"),
});
