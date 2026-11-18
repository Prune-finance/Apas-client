import createAxiosInstance from "@/lib/axios";
import User from "@/lib/store/user";
import useAxios from "./useAxios";

const axios = createAxiosInstance("auth");

// Access checks live in ./privileges; re-exported for existing imports
export { useAdminAccess } from "./privileges";

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

/**
 * One entry of a role's `permissions` (guide v11, POST/PATCH /admin/roles):
 * `{ id, privileges }` switches on just those privileges of the permission;
 * a bare permission id switches all of them on.
 */
export type RolePermissionEntry = string | { id: string; privileges: string[] };

export interface AdminRolePayload {
  title: string;
  description?: string;
  permissions: RolePermissionEntry[];
}

// The API does not return a status field, so a role is treated as
// deactivated once it has a deletedAt timestamp.
export const isRoleActive = (role: AdminRole) => !role.deletedAt;

export function useAdminRoles(paging: { page?: number; limit?: number } = {}) {
  const { data, loading, queryFn } = useAxios<AdminRole[]>({
    baseURL: "auth",
    endpoint: "/admin/roles",
    params: { audience: ADMIN_AUDIENCE, ...paging },
    dependencies: [paging.page, paging.limit],
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

/**
 * What can be ticked for a permission: its privileges, or the permission
 * itself when it has none. Picking any of them picks the parent permission.
 */
export const selectionKeys = (p: AdminPermission) =>
  p.privileges?.length ? p.privileges.map((pr) => pr.id) : [p.id];

/** Privileges switched on in a role (its responses list only those). */
export const countPrivileges = (role: AdminRole | null | undefined) =>
  (role?.permissions ?? []).reduce(
    (sum, p) => sum + (p.privileges?.length ?? 0),
    0
  );

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
