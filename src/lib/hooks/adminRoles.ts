import createAxiosInstance from "@/lib/axios";
import useAxios from "./useAxios";

const axios = createAxiosInstance("auth");

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
};

/**
 * Admins pick privileges. A permission without privileges is picked by its
 * own id. Selections are resolved to permission ids on submit, so a
 * permission is only sent when at least one of its privileges is picked.
 */
export const selectionKeys = (p: AdminPermission) =>
  p.privileges?.length ? p.privileges.map((pr) => pr.id) : [p.id];

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
