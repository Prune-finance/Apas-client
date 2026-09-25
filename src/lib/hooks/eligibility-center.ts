import { OnboardingBusiness } from "../interface";
import { IParams } from "../schema";
import { sanitizedQueryParams, sanitizeURL } from "../utils";
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
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
    // enabled: false,
  });

  return { loading, data, meta, revalidate };
}

export function useQuestionnairesAdmin(customParams: IParams = {}) {
  const {
    data,
    meta,
    loading,
    queryFn: revalidate,
  } = useAxios<QuestionnaireAdminItem[], QuestionnaireMeta>({
    baseURL: "questionnaire",
    endpoint: "/business/questionnaire/admin",
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
  });

  return { loading, data, meta, revalidate };
}

export function useQuestionnairesStats() {
  const { data, loading } = useAxios<QuestionnaireStats>({
    baseURL: "questionnaire",
    endpoint: "/business/questionnaire/admin/stats",
    dependencies: [],
  });

  return { loading, stats: data };
}

export function useSingleOnboardingBusiness(id: string) {
  const {
    data,
    loading,
    queryFn: revalidate,
  } = useAxios<OnboardingBusiness>({
    baseURL: "auth",
    endpoint: `/admin/onboardings/${id}`,
    dependencies: [id],
    enabled: !!!id,
  });

  return { loading, data, revalidate };
}

export function useSingleQuestionnaire(reference: string) {
  const {
    data,
    loading,
    queryFn: revalidate,
  } = useAxios<QuestionnaireDetail>({
    baseURL: "questionnaire",
    endpoint: `/business/questionnaire/admin/${reference}`,
    dependencies: [reference],
    enabled: !!!reference,
  });

  return { loading, data, revalidate };
}

export interface QuestionnaireDetail {
  reference: string;
  contactEmail: string;
  status: string;
  progress: {
    lastCompletedSection: number;
    nextSection: number | null;
    isComplete: boolean;
    sections: { number: number; title: string; completed: boolean }[];
  };
  answers: {
    contactEmail?: string;
    contactName?: string;
    contactDesignation?: string;
    contactPhoneCountryCode?: string;
    contactPhoneNumber?: string;
    businessEmail?: string;
    legalBusinessName?: string;
    tradingName?: string;
    countryCode?: string;
    businessAddress?: string;
    businessIndustry?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    businessDescription?: string;
    geographicFootprint?: string;
    isRegulated?: boolean;
    regulatoryLicence?: string;
    annualTurnover?: string;
    services?: { service: string; currencies: string[] }[];
    virtualAccounts?: {
      dayOneAccounts?: number;
      fullCapacityAccounts?: number;
      singleAccountMaxDaily?: string | number;
      singleAccountMaxMonthly?: string | number;
      singleAccountMaxAnnually?: string | number;
      allAccountsMaxDaily?: string | number;
      allAccountsMaxMonthly?: string | number;
      allAccountsMaxAnnually?: string | number;
      highestTransactionCount?: number;
    };
    operationsBalance?: string;
  };
  createdAt: string;
  submittedAt: string | null;
  decision: { decidedAt: string; decidedBy: { id: string; email: string }; reason: string | null } | null;
  onboarding: {
    linkSentAt: string | null;
    linkExpiresAt: string | null;
    linkExpired: boolean;
  } | null;
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
  makeContactPersonInitiator?: boolean;
  businessWebsite?: string;
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
  questionnaireSentAt: null;
  consentDesignation: string;
  consentEmail: string;
  consentSignature: string;
  consentSignedBy: string;
  consentPhoneNumber: string;
  documentData: Document;
  documents: Document[];
  questionnaireStatus: string;
  processStatus: string;
}

export interface Document {}

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

export interface QuestionnaireAdminItem {
  reference: string;
  contactEmail: string;
  status: string;
  progress: {
    isComplete: boolean;
    sections: { section: number; isComplete: boolean }[];
  };
  answers: {
    legalBusinessName?: string;
    countryCode?: string;
    services?: { name: string; currencies: string[] }[];
    [key: string]: unknown;
  };
  createdAt: string;
  submittedAt: string | null;
  decision: unknown;
  onboarding: unknown;
}

export interface QuestionnaireMeta {
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface QuestionnaireStats {
  totalLeads: number;
  inProgress: number;
  pending: number;
  approved: number;
  rejected: number;
  onboarded: number;
}
