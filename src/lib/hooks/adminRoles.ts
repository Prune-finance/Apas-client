import createAxiosInstance from "@/lib/axios";
import User from "@/lib/store/user";
import useAxios from "./useAxios";

const axios = createAxiosInstance("auth");

/**
 * Access for the signed-in admin, from the /admin/me result stored at login.
 * Only a Super Admin can create, edit, (de)activate or assign roles; the
 * server enforces it too and answers 403 otherwise.
 */
export function useAdminAccess() {
  const user = User((s) => s.user);
  const privileges = user?.privileges ?? [];
  const isSuperAdmin = user?.role === "Superadmin";

  return {
    isSuperAdmin,
    privileges,
    can: (action: string) => isSuperAdmin || privileges.includes(action),
  };
}

/** Re-fetch /admin/me so stored roles and privileges stay current. */
export async function refreshAdminMe() {
  try {
    const { data } = await axios.get("/admin/me");
    if (data?.data) User.getState().setUser(data.data);
  } catch {
    // keep the stored copy; the server still enforces access
  }
}

export const ADMIN_AUDIENCE = "ADMIN";

export interface AdminPrivilege {
  id: string;
  permissionId: string;
  title: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPermission {
  id: string;
  title: string;
  action: string;
  category: string;
  description: string | null;
  audience: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  privileges: AdminPrivilege[];
}

export interface AdminRole {
  id: string;
  title: string;
  description: string | null;
  companyId: string | null;
  isApplicationRole: boolean;
  audience: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  permissions: AdminPermission[];
}

export interface AdminRolePayload {
  title: string;
  description?: string;
  permissions: string[];
}

// The API does not return a status field, so a role is treated as
// deactivated once it has a deletedAt timestamp.
export const isRoleActive = (role: AdminRole) => !role.deletedAt;

export function useAdminRoles() {
  const { data, loading, queryFn } = useAxios<AdminRole[]>({
    baseURL: "auth",
    endpoint: "/admin/roles",
    params: { audience: ADMIN_AUDIENCE },
    dependencies: [],
  });

  return { roles: data, loading, revalidate: queryFn };
}

export function useAdminRole(id: string) {
  const { data, loading, queryFn } = useAxios<AdminRole>({
    baseURL: "auth",
    endpoint: `/admin/roles/${id}`,
    dependencies: [id],
    // useAxios skips the automatic fetch when `enabled` is true
    enabled: !id,
  });

  return { role: data, loading, revalidate: queryFn };
}

export interface AdminAccess {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  roles: AdminRole[];
  privileges: string[];
}

export function useAdminAccessById(adminId: string | undefined) {
  const { data, loading } = useAxios<AdminAccess>({
    baseURL: "auth",
    endpoint: `/admin/roles/admins/${adminId}`,
    dependencies: [adminId],
    enabled: !adminId,
  });

  return { access: data, loading };
}

export function useAdminPermissions() {
  const { data, loading } = useAxios<AdminPermission[]>({
    baseURL: "auth",
    endpoint: "/admin/permissions",
    params: { audience: ADMIN_AUDIENCE },
    dependencies: [],
  });

  return { permissions: data, loading };
}

export const adminRolesApi = {
  create: (body: AdminRolePayload) =>
    axios.post("/admin/roles", { ...body, audience: ADMIN_AUDIENCE }),
  update: (id: string, body: AdminRolePayload) =>
    axios.patch(`/admin/roles/${id}`, body),
  activate: (id: string) => axios.patch(`/admin/roles/${id}/activate`),
  deactivate: (id: string) => axios.patch(`/admin/roles/${id}/deactivate`),
  assignToAdmin: (adminId: string, roleIds: string[]) =>
    axios.patch(`/admin/roles/admins/${adminId}`, { roles: roleIds }),
};

export function groupPermissionsByCategory(permissions: AdminPermission[]) {
  return permissions.reduce<Record<string, AdminPermission[]>>((acc, p) => {
    const key = p.category || "OTHERS";
    (acc[key] ||= []).push(p);
    return acc;
  }, {});
}

export const formatCategory = (category: string) =>
  category
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
