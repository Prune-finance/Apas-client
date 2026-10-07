import { IParams } from "@/lib/schema";

import { useState, useEffect, useMemo } from "react";
import createAxiosInstance from "@/lib/axios";
import { sanitizeURL } from "../utils";

const axios = createAxiosInstance("auth");
const questAxios = createAxiosInstance("questionnaire");

export function useBusiness(
  customParams: IParams = {},
  reqCount: boolean = false,
  otherReq: boolean = false
) {
  const obj = useMemo(() => {
    return {
      ...(customParams.period && { period: customParams.period }),
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.email && { email: customParams.email }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.search && { search: customParams.search }),
    };
  }, [customParams]);

  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [stats, setStats] = useState<{ [x: string]: number }[]>([]);
  const [statsMeta, setStatsMeta] = useState<StatsMeta>();
  const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  const params = sanitizeURL({
    ...customParams,
    reqCount: reqCount ? "true" : "",
    otherReq: otherReq ? "true" : "",
  });

  async function fetchBusinesses() {
    // const queryParams = {
    //   ...(customParams.limit && { limit: customParams.limit }),
    //   ...(customParams.date && { date: customParams.date }),
    //   ...(customParams.endDate && { endDate: customParams.endDate }),
    //   ...(customParams.status && { status: customParams.status }),
    //   ...(customParams.email && { email: customParams.email }),
    //   ...(customParams.business && { business: customParams.business }),
    //   ...(customParams.page && { page: customParams.page }),
    //   ...(reqCount && { reqCount: "true" }),
    //   ...(otherReq && { otherReq: "true" }),
    //   ...(customParams.type && { type: customParams.type }),
    //   ...(customParams.search && { search: customParams.search }),
    // };

    // const params = new URLSearchParams(queryParams as Record<string, string>);

    try {
      setLoading(true);
      const { data } = await questAxios.get(
        `/business/businesses?${params.toString()}`
      );

      setMeta(data.meta);
      setBusinesses(data.data);
    } catch (error) {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBusinessRegistrationStats() {
    const queryParams = {
      ...(customParams.period && { period: customParams.period }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      const { data } = await axios.get(`/admin/business-stats?${params}`);
      setStats(data.data);
      setStatsMeta(data.meta);
    } catch (error) {
      setStats([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBusinesses();
    fetchBusinessRegistrationStats();

    return () => {
      // Any cleanup code can go here
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return { loading, businesses, meta, stats, statsMeta };
}

export function useSingleBusiness(id: string) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [meta, setMeta] = useState<SingleBizMeta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchBusiness() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/businesses/${id}`);

      setBusiness(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchBusiness();
  }

  useEffect(() => {
    fetchBusiness();

    return () => {
      // Any cleanup code can go here
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { loading, business, revalidate, meta };
}

export function useBusinessDetail(id: string) {
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchBusiness() {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await questAxios.get(`/business/businesses/${id}`);
      setBusiness(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchBusiness();
  }

  useEffect(() => {
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { loading, business, revalidate };
}

export function useBusinessServices(id: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    try {
      setLoading(true);
      const { data } = await axios.get(`/admin/services/business/${id}`);

      setMeta(data.meta);
      setServices(data.data);
    } catch (error) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => fetchServices();

  useEffect(() => {
    fetchServices();

    return () => {
      // Any cleanup code can go here
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { loading, services, meta, revalidate };
}

export function useUserBusinessServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    try {
      setLoading(true);
      const { data } = await axios.get(`/auth/company/services`);

      setServices(data.data);
    } catch (error) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => fetchServices();

  useEffect(() => {
    fetchServices();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, services, revalidate };
}

export function useUserBusiness(customParams: IParams = {}) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [meta, setMeta] = useState<UserBusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchBusinesses() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);

    try {
      setLoading(true);
      const { data } = await axios.get(`/auth/company?${params.toString()}`);

      setMeta(data.meta);
      setBusiness(data.data);
    } catch (error) {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchBusinesses();

  useEffect(() => {
    fetchBusinesses();

    return () => {
      // Any cleanup code can go here
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, business, meta, revalidate };
}

export interface Director {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}
// export interface BusinessData {
//   id: string;
//   apiCalls: number;
//   contactEmail: string;
//   contactNumber: string | null;
//   date: Date;
//   updatedAt: Date;
//   deletedAt: null;
//   domain: string;
//   name: string;
//   staging: string;
//   kycTrusted: boolean;
//   country: string | null;
//   address: string | null;
//   legalEntity: string | null;
//   mermat: string | null;
//   cacCertificate: string | null;
//   directors: Director[];
//   shareholders: Director[];
//   companyStatus: "ACTIVE" | "INACTIVE";
// }

export interface BusinessMeta {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  counts: {
    onboarded: number;
    onboarding: number;
  };
}

export interface SingleBizMeta {
  activationLinkCount: number;
  activeActivationLink: ActiveActivationLink | null;
  users: number;
}

export interface ActiveActivationLink {
  id: string;
  status: string;
  token: string;
  createdAt: Date;
}

export interface UserBusinessMeta {
  activeLKReq: number;
  activePAReq: number;
  hasLiveKey: number;
  hasPayoutAccount: number;
}

export interface StatsMeta {
  monthDiff: number;
  weekCount: number;
}

export interface BusinessListItem {
  id: string;
  type: "ONBOARDING_APPLICATION" | "COMPANY";
  status: "ONBOARDING" | "ONBOARDED";
  businessName: string;
  tradingName: string;
  contactEmail: string;
  createdAt: string;
  state: "IN_PROGRESS" | "SUBMITTED" | "INACTIVE" | "ACTIVE";
  services: string[];
  verified: boolean;
  addedByAdmin: boolean;
  progress: {
    lastCompletedSection: number;
    totalSections: number;
    submittedAt: string | null;
  } | null;
}

export interface ApplicationSection {
  number: number;
  title: string;
  completed: boolean;
}

export interface ApplicationProgress {
  lastCompletedSection: number;
  nextSection: number | null;
  isComplete: boolean;
  sections: ApplicationSection[];
}

export interface OnboardingBusiness {
  businessName: string;
  tradingName: string;
  businessType: string | null;
  businessIndustry: string;
  countryCode: string;
  businessAddress: string;
  businessEmail: string;
  businessPhoneCountryCode: string;
  businessPhoneNumber: string;
  businessWebsite: string | null;
  businessDescription: string;
  contactIsInitiator: boolean;
}

export interface OnboardingContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  identityType: string | null;
  proofOfAddressType: string | null;
  identityDocument: string | null;
  proofOfAddressDocument: string | null;
}

export interface OnboardingDocuments {
  incorporationCertificate: string | null;
  memart: string | null;
  amlFramework: string | null;
  operationalLicence: string | null;
}

export interface QuestionnaireOnboarding {
  linkSentAt: string | null;
  linkExpiresAt: string | null;
  linkExpired: boolean;
  signedUpAt: string | null;
  applicationReference: string;
  applicationStatus: string;
  applicationSubmittedAt: string | null;
}

export interface QuestionnaireDecision {
  decidedAt: string;
  decidedBy: { id: string; email: string };
  reason: string | null;
}

export interface Questionnaire {
  reference: string;
  contactEmail: string;
  status: string;
  progress: ApplicationProgress;
  answers: Record<string, unknown>;
  createdAt: string;
  submittedAt: string | null;
  addedBy: unknown;
  decision: QuestionnaireDecision | null;
  onboarding: QuestionnaireOnboarding | null;
}

export interface BusinessDetail {
  id: string;
  type: "COMPANY" | "ONBOARDING_APPLICATION";
  status: "ONBOARDED" | "ONBOARDING";
  currentStatus?: string;
  applicationStatus?: string;
  services: string[];
  reference?: string;
  email?: string;
  submittedAt?: string | null;
  // COMPANY fields
  company?: BusinessData;
  serviceList?: { id: string; title: string; serviceCode: string; serviceIdentifier: string; currency: string }[];
  pricingPlan?: { id: string; name: string; cycle: string; cost: number };
  counts?: { users: number; accounts: number; companyAccounts: number; payoutAccounts: number };
  // ONBOARDING_APPLICATION fields
  progress?: ApplicationProgress;
  documentReview?: { state: string; total: number; approved: number; rejected: number; pending: number } | null;
  business?: OnboardingBusiness;
  contactPerson?: OnboardingContactPerson;
  ceo?: Record<string, unknown> | null;
  documents?: OnboardingDocuments;
  directors?: Record<string, unknown>[];
  shareholders?: Record<string, unknown>[];
  consent?: Record<string, unknown> | null;
  questionnaireReference?: string;
  reviewDocuments?: unknown[];
  questionnaire?: Questionnaire;
  addedBy?: unknown;
  editableByAdmin?: boolean;
  submittedByAdmin?: unknown;
  customerAccess?: unknown;
}

export interface BusinessData {
  id: string;
  contactEmail: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  domain: string;
  name: string;
  tradingName: string;
  staging: string;
  kycTrusted: boolean;
  address: string;
  country: string;
  legalEntity: string;
  cacCertificate: string;
  companyPOAUrl: string | null;
  mermat: string;
  businessBio: null | string;
  directorParticular: null | string;
  operationalLicense: null | string;
  shareholderParticular: null | string;
  amlCompliance: null | string;
  directors: Director[];
  shareholders: Director[];
  companyStatus: "ACTIVE" | "INACTIVE";
  apiCalls: number;
  _count: Count;
  pricingPlanId: null | string;
  pricingPlan: PricingPlan | null;
  otherDocuments: Record<string, string>;
  Accounts: Account[];
  Requests: { type: string; id: string }[];
  contactFirstName: string;
  contactIdType: string;
  contactIdUrl: string;
  contactIdUrlBack: string;
  contactLastName: string;
  contactPOAType: string;
  contactPOAUrl: string;
  documents: Document[];
  lastLogin: Date;
  lastLogIn?: Date;
  contactSignup: Date | null;
  contactCountryCode: string;
  accountRequestCount?: number;
}

export interface Account {
  id: string;
  debitRequestCount: number;
}

export interface Document {
  title: string;
  documentURL: string;
}

export interface OtherDocuments {
  title: string;
  documentURL: string;
}

export interface PricingPlan {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  name: string;
  cycle: string;
  cost: number;
  description: string | null;
  features: string[];
}

export interface Count {
  AccountRequests: number;
}

export interface Director {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}

export interface Service {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  title: string;
  serviceCode: string;
  serviceIdentifier: ServiceIdentifier;
  active: boolean;
}

const SERVICE_IDENTIFIER = [
  "ACCOUNT_SERVICE",
  "ISSUED_ACCOUNT_SERVICE",
  "PAYOUT_SERVICE",
  "LIVE_MODE_SERVICE",
] as const;

export type ServiceIdentifier = (typeof SERVICE_IDENTIFIER)[number];
