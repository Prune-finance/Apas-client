import User from "../store/user";
import { Permission } from "./roles";

export function useHasPermission(permission: string): boolean {
  const { user } = User();

<<<<<<< HEAD
  return (
    Boolean(
      user && user?.permissions && user?.permissions.includes(permission)
    ) || Boolean(user?.role === permission)
  );
=======
  return Boolean(
    user &&
      user?.permissions &&
      user?.permissions.includes(permission)
  ) || Boolean(user?.role === permission);
>>>>>>> 29d4f5cb3a1589b3f503f79db4dd805dfde6aa65
}
