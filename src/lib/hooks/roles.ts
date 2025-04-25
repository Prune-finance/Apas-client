import { IParams } from "@/lib/schema";
import useAxios from "./useAxios";

export function useUserRoles(customParams: IParams = {}) {
  const { data, loading, meta, queryFn } = useAxios<Role[], RoleMeta>({
    baseURL: "auth",
    endpoint: "roles",
    params: customParams,
    dependencies: [...Object.values(customParams)],
  });

  return { roles: data, loading, revalidate: queryFn, meta };
}

export function useSingleUserRoles(id: string) {
  const { data, loading, queryFn } = useAxios<Role>({
    baseURL: "auth",
    endpoint: `roles/${id}`,
    dependencies: [id],
    enabled: !!!id,
  });

  return { role: data, loading, revalidate: queryFn };
}

export function useDeactivatedUserRoles(customParams: IParams = {}) {
  const { data, loading, queryFn } = useAxios<Role[]>({
    baseURL: "auth",
    endpoint: "roles/deactivated",
    params: customParams,
    dependencies: [...Object.values(customParams)],
  });

  return { roles: data, loading, revalidate: queryFn };
}

export function useUserPermissionsByCategory({ search }: { search?: string }) {
  const { data, loading, queryFn } = useAxios<PermissionsByCategory>({
    baseURL: "auth",
    endpoint: "roles/permissions",
    params: { category: true, search },
    dependencies: [search],
  });

  return { permissions: data, loading, revalidate: queryFn };
}

export interface Role {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  companyId: string;
  permissions: Permission[];
  isApplicationRole: boolean;
}

export interface RoleMeta {
  total: 1;
  page: 1;
  limit: 10;
}

export interface Permission {
  id: string;
  title: string;
  action: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PermissionsByCategory {
  "ACCOUNT MANAGEMENT": Permission[];
  "DEBIT REQUESTS": Permission[];
  "PAYOUT MANAGEMENT": Permission[];
  "PAYOUT INQUIRY": Permission[];
  "TRANSACTION TRACKING": Permission[];
  "USER MANAGEMENT": Permission[];
  SETTINGS: Permission[];
}

// Function to transform permissions into PermissionsByCategory
export function transformPermissionsToCategory(
  permissions: Permission[]
): PermissionsByCategory {
  return permissions.reduce((acc, permission) => {
    const category = permission.category as keyof PermissionsByCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as PermissionsByCategory);
}
