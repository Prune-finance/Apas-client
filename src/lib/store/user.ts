import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AdminData, UserData } from "../hooks/admins";

const User = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isIdle: false,
      setIsIdle: (state) => set(() => ({ isIdle: state })),
      setUser: (user) => set(() => ({ user })),
      removeUser: () => set(() => ({ user: null })),
    }),
    {
      name: "prune-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface UserState {
  user: null | UserData;
  isIdle: boolean;
  setIsIdle: (state: boolean) => void;
  setUser: (user: UserData | null) => void;
  removeUser: () => void;
}

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   createdAt: Date;
//   company?: { name: string; id: string };
//   companyId: string;
// }

export default User;
