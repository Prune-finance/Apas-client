import { create } from "zustand";
import { Onboarding as IOnboarding, OnboardingBusiness } from "../interface";

const Onboarding = create<OnboardingState>((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  business: null,
  setBusiness: (data) => set(() => ({ business: data })),
}));

interface OnboardingState {
  data: IOnboarding | null;
  setData: (data: IOnboarding) => void;
  business: OnboardingBusiness | null;
  setBusiness: (data: OnboardingBusiness) => void;
}

export default Onboarding;
