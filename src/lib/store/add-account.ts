import { create } from "zustand";

export interface AddAccountCurrencyState {
  addAccountCurrency: "EUR" | "GBP" | "NGN" | "GHS" | "USD";
  setAddAccountCurrency: (
    currency: "EUR" | "GBP" | "NGN" | "GHS" | "USD"
  ) => void;
}

const useAddAccountCurrencyStore = create<AddAccountCurrencyState>((set) => ({
  addAccountCurrency: "EUR",
  setAddAccountCurrency: (currency: "EUR" | "GBP" | "NGN" | "GHS" | "USD") =>
    set({ addAccountCurrency: currency }),
}));

export default useAddAccountCurrencyStore;
