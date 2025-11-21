import { create } from "zustand";

export interface USDTransferCurrencySwitchState {
  transferCurrency: "WithinUSA" | "OutsideUSA";
  setTransferCurrency: (currency: "WithinUSA" | "OutsideUSA") => void;
}

const USDuseTransferCurrencySwitchStore =
  create<USDTransferCurrencySwitchState>((set) => ({
    transferCurrency: "WithinUSA",
    setTransferCurrency: (currency: "WithinUSA" | "OutsideUSA") =>
      set({ transferCurrency: currency }),
  }));

export default USDuseTransferCurrencySwitchStore;
