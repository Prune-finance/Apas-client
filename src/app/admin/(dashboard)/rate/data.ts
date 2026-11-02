export type RateStatus = "Enabled" | "Disabled" | "Pending" | "Scheduled";
export interface RatePair {
  base: string;
  quote: string;
  rate: number;
  adjustment: number;
  finalRate: number;
  status: RateStatus;
  effective: string;
  author: string;
}

// Design fixtures only; replace with the rates API when its contract is available.
export const initialRates: RatePair[] = [
  { base: "GBP", quote: "NGN", rate: 1807, adjustment: 0, finalRate: 1807, status: "Enabled", effective: "2025-12-12", author: "Caleb Nwosu" },
  { base: "USD", quote: "NGN", rate: 460, adjustment: -0.25, finalRate: 460, status: "Enabled", effective: "2026-01-10", author: "Aisha Bello" },
  { base: "EUR", quote: "NGN", rate: 1985, adjustment: 1.75, finalRate: 2014.78, status: "Pending", effective: "2026-02-05", author: "Chinedu Okeke" },
  { base: "JPY", quote: "NGN", rate: 3.45, adjustment: 0, finalRate: 3.45, status: "Disabled", effective: "2025-11-20", author: "Funmi Adeyemi" },
  { base: "CAD", quote: "NGN", rate: 360, adjustment: -0.25, finalRate: 358.2, status: "Scheduled", effective: "2026-03-15", author: "Emeka Udo" },
  { base: "AUD", quote: "NGN", rate: 310, adjustment: 0, finalRate: 310, status: "Enabled", effective: "2026-04-07", author: "Ngozi Eze" },
  { base: "CHF", quote: "NGN", rate: 2040, adjustment: -0.25, finalRate: 2046.12, status: "Enabled", effective: "2026-05-28", author: "Ibrahim Musa" },
];
