import { z } from "zod";

export const loginValues = {
  email: "",
  password: "",
};

export const validateLogin = z.object({
  email: z.string().email("Please provide a valid email"),
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
