import { IParams } from "../schema";
import { sanitizeURL } from "../utils";
import useAxios from "./useAxios";

export function useOnboardingBusiness(customParams: IParams = {}) {
  const {
    data,
    meta,
    loading,
    queryFn: revalidate,
  } = useAxios<OnboardingBusinessData[], Meta>({
    baseURL: "auth",
    endpoint: "/admin/onboardings",
    params: sanitizeURL(customParams),
    dependencies: [...Object.values(customParams)],
    enabled: false,
  });

  return { loading, data, meta, revalidate };
}

export function useSingleOnboardingBusiness(id: string) {
  const {
    data,
    loading,
    queryFn: revalidate,
  } = useAxios<OnboardingBusinessData>({
    baseURL: "auth",
    endpoint: `/admin/onboardings/${id}`,
    dependencies: [id],
    enabled: !!!id,
  });

  return { loading, data, revalidate };
}

export interface OnboardingBusinessData {
  id: string;
  businessName: string;
  businessTradingName: string;
  businessAddress: string;
  businessIndustry: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessCountry: string;
  businessDescription: string;
  isRegulated: boolean;
  annualTurnover: string;
  services: Service[];
  virtualAccounts: VirtualAccounts;
  operationsAccounts: OperationsAccounts;
  onboardingStatus: string;
  status: string;
  token: string;
  hasActualBusinessAccount: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  contactPersonDesignation: string;
  contactPersonEmail: string;
  contactPersonName: string;
  contactPersonPhoneNumber: string;
  geoFootprint: string;
  OnboardingBusiness: OnboardingBusiness[];
}

export interface OnboardingBusiness {
  id: string;
  businessName: string;
  businessCountry: string;
  createdAt: Date;
}

export interface OperationsAccounts {
  estimated_balance: string;
}

export interface Service {
  name: string;
  currencies: string[];
}

export interface VirtualAccounts {
  day_one_requirement: string;
  max_value_per_transaction: MaxValueAllVirtualAccounts;
  max_value_all_virtual_accounts: MaxValueAllVirtualAccounts;
  total_highest_transaction_count: MaxValueAllVirtualAccounts;
  total_number_of_virtual_accounts: string;
}

export interface MaxValueAllVirtualAccounts {
  daily: string;
  monthly: string;
  annually: string;
}

export interface Meta {
  total: number;
  rejected: number;
  pending: number;
  approved: number;
  currentPage: number;
  totalPages: number;
  onboarded: number;
}
