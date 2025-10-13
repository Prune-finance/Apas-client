export interface AdminCurrencyStatsResponse {
  data: CurrencyStatsData;
  meta: CurrencyStatsMeta;
}

export const currencies = ["EUR", "GBP", "GHS", "USD"] as const;
export const accountType = [
  "COMPANY_ACCOUNT",
  "ISSUED_ACCOUNT",
  "PAYOUT_ACCOUNT",
] as const;

export type AccountType = (typeof accountType)[number];

// union type "EUR" | "GBP" | "GHS"
export type Currency = (typeof currencies)[number];

export interface CurrencyStatsData extends Record<Currency, CurrencyStats> {
  summary: Summary;
}

export interface CurrencyStats {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  totalTransactions: number;
  transactionVolume: number;
  inflow: number;
  outflow: number;
  growth: Growth;
  accountTypes: AccountTypes;
}

export interface AccountTypes {
  COMPANY_ACCOUNT: number;
  PAYOUT_ACCOUNT: number;
  ISSUED_ACCOUNT: number;
}

export interface Growth {
  accounts: number;
  transactions: number;
  volume: number;
}

export interface Summary {
  totalAccountsAllCurrencies: number;
  totalTransactionsAllCurrencies: number;
  totalVolumeAllCurrencies: number;
  mostActiveCurrency: string;
  period: string;
  generatedAt: Date;
}

export interface CurrencyStatsMeta {
  period: string;
  currencies: Currency[];
  generatedAt: Date;
  cacheKey: string;
}

export interface AccountStatistics {
  interval: Date;
  total: number;
}

export interface SingleAccountStatisticsData {
  statistics: Statistic[];
  totals: Totals;
  volume: Volume;
}

interface Statistic {
  bucket: string;
  inflow: number;
  outflow: number;
}

export interface Totals {
  inflow: number;
  outflow: number;
}

export interface Volume {
  completed: number;
  failed: number;
  cancelled: number;
  pending: number;
}

export interface SingleAccountStatisticsMeta {
  period: string;
  range: string;
}
