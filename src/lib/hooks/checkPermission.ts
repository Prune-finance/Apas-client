import User from "../store/user";
import { Permission } from "./roles";

export function useHasPermission(permission: string): boolean {
  const { user } = User();

  return (
    Boolean(
      user && user?.permissions && user?.permissions.includes(permission)
    ) || Boolean(user?.role === permission)
  );
}
