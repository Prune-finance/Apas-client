import { create } from "zustand";
import { TransactionType } from "../hooks/transactions";

type TableData = {
  AccName: string;
  Biz: string;
  Amount: number;
  Date: string;
  AccNum: string;
  Status: string;
};

const Transaction = create<TransactionState>((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  opened: false,
  open: () => set((state) => (!state.opened ? { opened: true } : state)),
  close: () => set((state) => (state.opened ? { opened: false } : state)),
  clearData: () => set(() => ({ data: null })),
}));

interface TransactionState {
  data: TransactionType | null;
  setData: (data: TransactionType) => void;
  opened: boolean;
  open: () => void;
  close: () => void;
  clearData: () => void;
}

export default Transaction;
