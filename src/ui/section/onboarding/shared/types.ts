export interface RefOption {
  value: string;
  label: string;
}

export interface CompanyDocument extends RefOption {
  required: boolean;
}

export interface ReferenceData {
  businessTypes: RefOption[];
  identityTypes: RefOption[];
  proofOfAddressTypes: RefOption[];
  companyDocuments: CompanyDocument[];
}

export const DEFAULT_REF_DATA: ReferenceData = {
  businessTypes: [],
  identityTypes: [],
  proofOfAddressTypes: [],
  companyDocuments: [],
};
