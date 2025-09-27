import { create } from "zustand";

export interface CurrencySwitchState {
  switchCurrency: "EUR" | "GBP" | "NGN" | "GHS";
  setSwitchCurrency: (currency: "EUR" | "GBP" | "NGN" | "GHS") => void;
}

const useCurrencySwitchStore = create<CurrencySwitchState>((set) => ({
  switchCurrency: "EUR",
  setSwitchCurrency: (currency: "EUR" | "GBP" | "NGN" | "GHS") =>
    set({ switchCurrency: currency }),
}));

export default useCurrencySwitchStore;
