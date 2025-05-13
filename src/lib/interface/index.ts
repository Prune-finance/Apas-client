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
  makeContactPersonInitiator: boolean;
  cacCertificate: string | null;
  mermat: string | null;
  amlCompliance: string | null;
  operationalLicense: string | null;
  ceoFirstName: string | null;
  ceoLastName: string | null;
  ceoEmail: string | null;
  ceoDOB: string | null;
  ceoPOAType: string | null;
  ceoPOAUrl: string | null;
  ceoIdType: string | null;
  ceoIdUrl: string | null;
  directors: Director[];
  shareholders: Director[];
  createdAt: Date;
  password: string;
  updatedAt: Date;
  migrated: boolean;
  questionnaireId: string;
}

export interface Director {}
