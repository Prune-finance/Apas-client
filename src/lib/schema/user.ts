import { z } from "zod";

export const PermissionSchema = z.array(
  z.array(
    z.object({
      title: z.string(),
      status: z.boolean(),
      id: z.string().uuid(),
    })
  )
);

export const newRoleSchema = z.object({
  title: z.string().min(1, "Role title is required"),
  description: z.string().min(1, "Role description is required"),

  permissions: PermissionSchema,
});

export const updateRoleSchema = z.object({
  title: z.string(),
  description: z.string(),
  permissions: PermissionSchema,
});

export type NewRoleType = z.infer<typeof newRoleSchema>;
export type UpdateRoleType = z.infer<typeof updateRoleSchema>;

export const validateInviteUser = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  roles: z.string().min(1, "Role is required"),
  // roles: z.array(z.string()).min(1, "Role is required"),
  permissions: PermissionSchema,
});

export const validateEditUser = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.string().min(1, "Role is required"),
  // roles: z.array(z.string()).min(1, "Role is required"),
  permissions: PermissionSchema,
});

export type InviteUserType = z.infer<typeof validateInviteUser>;

export const validateNewAdmin = z.object({
  email: z.string().email("Please provide a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string({ required_error: "Password is required" }).optional(),
  role: z.string().optional(),
});
