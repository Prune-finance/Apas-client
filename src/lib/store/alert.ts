import { create } from "zustand";

interface AlertState {
  open: () => void;
  close: () => void;
  opened: boolean;
}

export const AlertStore = create<AlertState>((set) => ({
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
  opened: true,
}));
