import { z } from "zod";

export const loginValues = {
  email: "",
  password: "",
};

export const registerValues = {
  email: "",
  password: "",
  confirmPassword: "",
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
    confirmPassword: z
      .string({
        required_error: "Confirm Password is required",
      })
      .min(1, "Confirm Password is required"),
  })
  .refine((values) => values.confirmPassword === values.password, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterType = z.infer<typeof validateRegister>;

export const newAdmin = {
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  password: "",
};

export const inviteUser = {
  email: "",
  firstName: "",
  lastName: "",
  // roleId: "",
  permissions: [],
  roles: "",
  // roles: [],
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

export const validatePasswordChange = z
  .object({
    oldPassword: z.string().min(1, "Old Password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*[0-9])/, "Password must contain at least one number")
      .regex(
        /(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordChangeType = z.infer<typeof validatePasswordChange>;

export const validateNewUser = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
});

export const resetPasswordValues = {
  password: "",
  confirmPassword: "",
  otp: "",
};

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*[0-9])/, "Password must contain at least one number")
      .regex(
        /(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    otp: z
      .union([
        z.string().min(6, "OTP must be 6 characters"),
        z.number().min(6, "OTP must be 6 characters"),
      ])
      .refine((data) => data, {
        message: "OTP is required to reset password",
        // path: ["otp"],
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
