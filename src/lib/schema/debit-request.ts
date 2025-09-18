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

export const currencyRequest = z.object({
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

// export const sendMoneyIndividualValidate = z.object({
//   firstName: z.string().min(2, "First Name is required"),
//   lastName: z.string().min(2, "Last Name is required"),
//   destinationIBAN: z.string().min(3, "Destination account is required"),
//   destinationBIC: z.string().min(3, "BIC is required"),
//   destinationBank: z.string().min(2, "Bank is required"),
//   bankAddress: z.string().optional(),
//   // bankAddress: z.string().min(2, "Bank Address is required"),
//   destinationCountry: z.string().min(2, "Country is required"),
//   amount: z
//     .number({ invalid_type_error: "Amount is required" })
//     .positive("A positive amount is required"),
//   invoice: z.string(),
//   narration: z.string().min(2, "Narration is required"),
//   // accountBalance: z.number().positive("A positive amount is required"),
// });

export const sendMoneyIndividualValidate = z
  .object({
    firstName: z
      .string()
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name cannot exceed 50 characters"),
    lastName: z
      .string()
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name cannot exceed 50 characters"),
    destinationIBAN: z
      .string()
      .regex(/^$|^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "Invalid IBAN format") // Allows empty string
      .optional(),
    destinationBIC: z
      .string()
      .regex(/^$|^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid BIC format") // Allows empty string
      .optional(),
    destinationAccountNumber: z
      .string()
      .regex(/^$|^[0-9]{8,17}$/, "Invalid account number format (8-17 digits)") // Allows empty string
      .optional(),
    destinationSortCode: z
      .string()
      .regex(
        /^$|^\d{2}-\d{2}-\d{2}$|^\d{6}$/,
        "Sort code must be in format 00-00-00 or 000000"
      ) // Allows empty string
      .optional(),

    accountNumber: z
      .string()
      .regex(
        /^$|^[0-9]{8,17}$|^PR-GH\d+$/,
        "Invalid account number format (8-17 digits or PR-GH format for GHS)"
      ) // Allows empty string or PR-GH format
      .optional(),

    phoneNumber: z
      .string()
      .regex(/^$|^[0-9]{10,15}$/, "Invalid phone number format (10-15 digits)") // Allows empty string
      .optional(),

    destinationBank: z
      .string()
      .min(2, "Bank name must be at least 2 characters")
      .max(100, "Bank name cannot exceed 100 characters"),
    bankAddress: z
      .string()
      .max(200, "Bank address cannot exceed 200 characters")
      .optional(),
    destinationCountry: z
      .string()
      // .min(2, "Country must be at least 2 characters")
      // .max(50, "Country cannot exceed 50 characters")
      .optional(),
    amount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be positive")
      .max(1000000, "Amount cannot exceed 1,000,000")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Amount can have maximum 2 decimal places",
      }),
    invoice: z.string().optional(),

    narration: z
      .string()
      .min(2, "Narration must be at least 2 characters")
      .max(100, "Narration cannot exceed 100 characters"),
    currency: z.enum(["EUR", "GBP", "GHS"], {
      errorMap: () => ({ message: "Currency must be either EUR, GBP or GHS" }),
    }),
    gshTransferType: z.enum(["BankTransfer", "MobileMoney"], {
      errorMap: () => ({
        message: "Transfer type must be either BankTransfer or MobileMoney",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.currency === "EUR") {
      if (!data.destinationIBAN || data.destinationIBAN.trim() === "") {
        ctx.addIssue({
          path: ["destinationIBAN"],
          code: z.ZodIssueCode.custom,
          message: "IBAN is required for EUR transfers",
        });
      }
      if (!data.destinationBIC || data.destinationBIC.trim() === "") {
        ctx.addIssue({
          path: ["destinationBIC"],
          code: z.ZodIssueCode.custom,
          message: "BIC is required for EUR transfers",
        });
      }
      if (!data.destinationCountry || data.destinationCountry.trim() === "") {
        ctx.addIssue({
          path: ["destinationCountry"],
          code: z.ZodIssueCode.custom,
          message: "Country is required for EUR transfers",
        });
      }
    }

    if (data.currency === "GBP") {
      if (
        !data.destinationAccountNumber ||
        data.destinationAccountNumber.trim() === ""
      ) {
        ctx.addIssue({
          path: ["destinationAccountNumber"],
          code: z.ZodIssueCode.custom,
          message: "Account Number is required for GBP transfers",
        });
      }
      if (!data.destinationSortCode || data.destinationSortCode.trim() === "") {
        ctx.addIssue({
          path: ["destinationSortCode"],
          code: z.ZodIssueCode.custom,
          message: "Sort Code is required for GBP transfers",
        });
      }
      if (!data.destinationCountry || data.destinationCountry.trim() === "") {
        ctx.addIssue({
          path: ["destinationCountry"],
          code: z.ZodIssueCode.custom,
          message: "Country is required for GBP transfers",
        });
      }
    }

    if (data.currency === "GHS" && data.gshTransferType === "BankTransfer") {
      if (!data.accountNumber || data.accountNumber.trim() === "") {
        ctx.addIssue({
          path: ["accountNumber"],
          code: z.ZodIssueCode.custom,
          message: "Account Number is required for GHS bank transfers",
        });
      }
    }

    if (data.currency === "GHS" && data.gshTransferType === "MobileMoney") {
      if (!data.phoneNumber || data.phoneNumber.trim() === "") {
        ctx.addIssue({
          path: ["phoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "Phone Number is required for GHS MobileMoney transfers",
        });
      }
    }
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

// export const sendMoneyCompanyValidate = z.object({
//   companyName: z.string().min(2, "First Name is required"),
//   destinationIBAN: z.string().min(3, "Destination account is required"),
//   destinationBIC: z.string().min(3, "BIC is required"),
//   destinationBank: z.string().min(2, "Bank is required"),
//   bankAddress: z.string().optional(),
//   // bankAddress: z.string().min(2, "Bank Address is required"),
//   amount: z
//     .number({ invalid_type_error: "Amount is required" })
//     .positive("A positive amount is required"),
//   invoice: z.string(),
//   narration: z.string().min(2, "Narration is required"),
//   // accountBalance: z.number().positive("A positive amount is required"),
// });

export const sendMoneyCompanyValidate = z
  .object({
    companyName: z
      .string()
      .min(2, "Company must be at least 2 characters")
      .max(50, "Company cannot exceed 50 characters"),

    destinationIBAN: z
      .string()
      .regex(/^$|^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "Invalid IBAN format") // Allows empty string
      .optional(),
    destinationBIC: z
      .string()
      .regex(/^$|^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid BIC format") // Allows empty string
      .optional(),
    destinationAccountNumber: z
      .string()
      .regex(/^$|^[0-9]{8,17}$/, "Invalid account number format (8-17 digits)") // Allows empty string
      .optional(),
    destinationSortCode: z
      .string()
      .regex(
        /^$|^\d{2}-\d{2}-\d{2}$|^\d{6}$/,
        "Sort code must be in format 00-00-00 or 000000"
      ) // Allows empty string
      .optional(),
    destinationBank: z
      .string()
      .min(2, "Bank name must be at least 2 characters")
      .max(100, "Bank name cannot exceed 100 characters"),
    bankAddress: z
      .string()
      .max(200, "Bank address cannot exceed 200 characters")
      .optional(),
    destinationCountry: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country cannot exceed 50 characters"),
    amount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be positive")
      .max(1000000, "Amount cannot exceed 1,000,000")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Amount can have maximum 2 decimal places",
      }),
    invoice: z.string().optional(),

    narration: z
      .string()
      .min(2, "Narration must be at least 2 characters")
      .max(100, "Narration cannot exceed 100 characters"),
    currency: z.enum(["EUR", "GBP"], {
      errorMap: () => ({ message: "Currency must be either EUR or GBP" }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.currency === "EUR") {
      if (!data.destinationIBAN || data.destinationIBAN.trim() === "") {
        ctx.addIssue({
          path: ["destinationIBAN"],
          code: z.ZodIssueCode.custom,
          message: "IBAN is required for EUR transfers",
        });
      }
      if (!data.destinationBIC || data.destinationBIC.trim() === "") {
        ctx.addIssue({
          path: ["destinationBIC"],
          code: z.ZodIssueCode.custom,
          message: "BIC is required for EUR transfers",
        });
      }
    }

    if (data.currency === "GBP") {
      if (
        !data.destinationAccountNumber ||
        data.destinationAccountNumber.trim() === ""
      ) {
        ctx.addIssue({
          path: ["destinationAccountNumber"],
          code: z.ZodIssueCode.custom,
          message: "Account Number is required for GBP transfers",
        });
      }
      if (!data.destinationSortCode || data.destinationSortCode.trim() === "") {
        ctx.addIssue({
          path: ["destinationSortCode"],
          code: z.ZodIssueCode.custom,
          message: "Sort Code is required for GBP transfers",
        });
      }
    }
  });
