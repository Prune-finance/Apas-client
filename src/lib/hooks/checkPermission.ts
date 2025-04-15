import User from "../store/user";
import { Permission } from "./roles";

export function useHasPermission(permission: string): boolean {
  const { user } = User();

  return Boolean(
    user &&
      user?.permissions &&
      user?.permissions.includes(permission)
<<<<<<< HEAD
  );
=======
  ) || Boolean(user?.role === permission);
>>>>>>> b34ef3222f57189f7e3a5dcc7d165dcfd10941df
}
