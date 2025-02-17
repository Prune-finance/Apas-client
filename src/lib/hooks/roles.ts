import { IParams } from "../schema";
import useAxios from "./useAxios";

export function useUserRoles(customParams: IParams = {}) {
  const { data, loading, queryFn } = useAxios<Role[]>({
    baseURL: "auth",
    endpoint: "roles",
    params: customParams,
    dependencies: [...Object.values(customParams)],
  });

  return { roles: data, loading, revalidate: queryFn };
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

export function useUserPermissionsByCategory() {
  const { data, loading, queryFn } = useAxios<PermissionsByCategory>({
    baseURL: "auth",
    endpoint: "roles/permissions",
    params: { category: true },
  });

  return { permissions: data, loading, revalidate: queryFn };
}

export interface Role {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  companyId: string;
  permissions: Permission[];
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
