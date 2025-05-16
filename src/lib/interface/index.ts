import { STAGE } from "../utils";

export interface Onboarding {
  id: string;
  businessEmail: string;
  businessName: string;
  businessTradingName: string;
  businessAddress: string;
  businessPhoneNumber: string;
  services: Service[];
  virtualAccounts: VirtualAccounts;
  operationsAccounts: OperationsAccounts;
}

export interface OperationsAccounts {
  estimated_balance: string;
}

export interface Service {
  name: string;
  currencies: string[];
}

export interface VirtualAccounts {
  day_one_requirement: number;
  max_value_per_transaction: MaxValueAllVirtualAccounts;
  max_value_all_virtual_accounts: MaxValueAllVirtualAccounts;
  total_highest_transaction_count: MaxValueAllVirtualAccounts;
  total_number_of_virtual_accounts: number;
}

export interface MaxValueAllVirtualAccounts {
  daily: number;
  monthly: number;
  annually: number;
}

export interface OnboardingBusiness {
  id: string;
  businessName: string | null;
  businessTradingName: string | null;
  businessType: string | null;
  businessIndustry: string | null;
  businessCountry: string | null;
  businessAddress: string | null;
  businessEmail: string;
  businessPhoneNumber: string | null;
  businessWebsite: string | null;
  businessDescription: string | null;
  contactPersonFirstName: string | null;
  contactPersonLastName: string | null;
  contactPersonEmail: string | null;
  contactPersonPhoneNumber: string | null;
  contactPersonPOAType: string | null;
  contactPersonPOAUrl: string | null;
  contactPersonIdType: string | null;
  contactPersonIdUrl: string | null;
  contactPersonIdUrlBack: string | null;
  makeContactPersonInitiator: boolean;
  cacCertificate: string | null;
  mermat: string | null;
  amlCompliance: string | null;
  operationalLicense: string | null;
  ceoFirstName: string | null;
  ceoLastName: string | null;
  ceoEmail: string | null;
  ceoDOB: Date | null;
  ceoPOAType: string | null;
  ceoPOAUrl: string | null;
  ceoIdType: string | null;
  ceoIdUrl: string | null;
  ceoIdUrlBack: string | null;
  directors: Director[];
  shareholders: Director[];
  createdAt: Date;
  password: string;
  updatedAt: Date;
  migrated: boolean;
  questionnaireId: string;
  stageIdentifier: number;
  geoFootprint: string;
  questionnaireSentAt: null;
  consentDesignation: string;
  consentEmail: string;
  consentSignature: string;
  consentSignedBy: string;
  consentPhoneNumber: string;
  documentData: Document;
  documents: Document[];
  onboardingStatus: string;
  questionnaireStatus: string;
  processStatus: STAGE;
  hasActualBusinessAccount: boolean;
  token: string;
  status: STAGE;
  services: Service[];
  virtualAccounts: VirtualAccounts;
  operationsAccounts: OperationsAccounts;
}

export interface Director {
  id: string;
  firstName: string;
  lastName: string;
  dob: string | Date | null;
  email: string;
  identityType: string | null;
  proofOfAddress: string | null;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}

export interface Document {}
