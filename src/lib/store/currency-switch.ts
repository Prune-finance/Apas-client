import { create } from "zustand";

export interface CurrencySwitchState {
  switchCurrency: "EUR" | "GBP" | "NGN";
  setSwitchCurrency: (currency: "EUR" | "GBP" | "NGN") => void;
}

const useCurrencySwitchStore = create<CurrencySwitchState>((set) => ({
  switchCurrency: "EUR",
  setSwitchCurrency: (currency: "EUR" | "GBP" | "NGN") =>
    set({ switchCurrency: currency }),
}));

export default useCurrencySwitchStore;
