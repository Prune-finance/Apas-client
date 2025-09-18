import { create } from "zustand";

export interface TransferCurrencySwitchState {
  transferCurrency: "BankTransfer" | "MobileMoney";
  setTransferCurrency: (currency: "BankTransfer" | "MobileMoney") => void;
}

const useTransferCurrencySwitchStore = create<TransferCurrencySwitchState>(
  (set) => ({
    transferCurrency: "BankTransfer",
    setTransferCurrency: (currency: "BankTransfer" | "MobileMoney") =>
      set({ transferCurrency: currency }),
  })
);

export default useTransferCurrencySwitchStore;
