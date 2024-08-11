import { create } from "zustand";
import { PricingPlan } from "../hooks/pricing-plan";

const Plan = create<PlanState>((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  opened: false,
  open: () => set((state) => (!state.opened ? { opened: true } : state)),
  close: () => set((state) => (state.opened ? { opened: false } : state)),
  clearData: () => set(() => ({ data: null })),
}));

interface PlanState {
  data: PricingPlan | null;
  setData: (data: PricingPlan) => void;
  opened: boolean;
  open: () => void;
  close: () => void;
  clearData: () => void;
}

export default Plan;
