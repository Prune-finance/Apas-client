import { create } from "zustand";

type TableData = {
  name: string;
  cycle: string;
  amount: number;
  description: string;
  id: number;
};

const Plan = create<PlanState>((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  opened: false,
  open: () => set((state) => (!state.opened ? { opened: true } : state)),
  close: () => set((state) => (state.opened ? { opened: false } : state)),
  clearData: () => set(() => ({ data: null })),
}));

interface PlanState {
  data: TableData | null;
  setData: (data: TableData) => void;
  opened: boolean;
  open: () => void;
  close: () => void;
  clearData: () => void;
}

export default Plan;
