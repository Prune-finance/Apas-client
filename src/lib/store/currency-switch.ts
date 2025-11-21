import { create } from "zustand";

export interface CurrencySwitchState {
  switchCurrency: "EUR" | "GBP" | "NGN" | "GHS" | "USD";
  setSwitchCurrency: (currency: "EUR" | "GBP" | "NGN" | "GHS" | "USD") => void;
}

const useCurrencySwitchStore = create<CurrencySwitchState>((set) => ({
  switchCurrency: "EUR",
  setSwitchCurrency: (currency: "EUR" | "GBP" | "NGN" | "GHS" | "USD") =>
    set({ switchCurrency: currency }),
}));

export default useCurrencySwitchStore;
