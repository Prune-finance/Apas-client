import { create } from "zustand";

export interface DebtorFormState {
  location: string;
  fullName: string | undefined;
  address: string | undefined;
  country: string | undefined;
  postCode: string | undefined;
  state: string | undefined;
  city: string | undefined;
  website: string | undefined;
  businessRegNo: string | undefined;
}

interface DebtorState {
  debtorRequestForm: DebtorFormState;
  setDebtorRequestForm: (form: DebtorFormState) => void;
}

const useDebtorStore = create<DebtorState>((set) => ({
  debtorRequestForm: {
    location: "self",
    fullName: "",
    address: "",
    country: "",
    postCode: "",
    state: "",
    city: "",
    website: "",
    businessRegNo: "",
  },
  setDebtorRequestForm: (form: DebtorFormState) =>
    set({ debtorRequestForm: form }),
}));

export default useDebtorStore;
