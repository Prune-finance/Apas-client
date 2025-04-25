import { z } from "zod";

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

export const validateRequest = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const validateDebitRequest = z
  .object({
    account: z.string().min(3, "Account is required"),
    accountType: z.string(),
    amount: z
      .number({ invalid_type_error: "Amount is required" })
      .positive("A positive amount is required"),
    destinationIBAN: z
      .string()
      .min(3, "Destination account is required")
      .trim(),
    destinationBIC: z.string().min(3, "BIC is required").trim(),
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
  bankAddress: z.string().optional(),
  // bankAddress: z.string().min(2, "Bank Address is required"),
  destinationCountry: z.string().min(2, "Country is required"),
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .positive("A positive amount is required"),
  invoice: z.string(),
  narration: z.string().min(2, "Narration is required"),
  // accountBalance: z.number().positive("A positive amount is required"),
});

export const DebtorFormSelf = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  address: z.string().min(2, "Address is required"),
  country: z.string().min(2, "Country is required"),
  postCode: z.string().min(2, "Post Code is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  website: z.string().url("Website is required"),
  businessRegNo: z.string().min(2, "Business Registration Number is required"),
});

export const DebtorFormCompany = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  address: z.string().min(2, "Address is required"),
  country: z.string().min(2, "Country is required"),
  postCode: z.string().min(2, "Post Code is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  website: z.string().url("Website is required"),
  businessRegNo: z.string().min(2, "Business Registration Number is required"),
});

export const DebtorFormIndividual = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  address: z.string().min(2, "Address is required"),
  country: z.string().min(2, "Country is required"),
  postCode: z.string().min(2, "Post Code is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  idType: z.string().min(2, "ID Type is required"),
  idNumber: z.string().min(2, "ID Number is required"),
});

export const sendMoneyCompanyValidate = z.object({
  companyName: z.string().min(2, "First Name is required"),
  destinationIBAN: z.string().min(3, "Destination account is required"),
  destinationBIC: z.string().min(3, "BIC is required"),
  destinationBank: z.string().min(2, "Bank is required"),
  bankAddress: z.string().optional(),
  // bankAddress: z.string().min(2, "Bank Address is required"),
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .positive("A positive amount is required"),
  invoice: z.string(),
  narration: z.string().min(2, "Narration is required"),
  // accountBalance: z.number().positive("A positive amount is required"),
});
