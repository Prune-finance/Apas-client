import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
  TableTd,
  TableTr,
  UnstyledButton,
} from "@mantine/core";
import {
  IconHome2,
  IconBuildingSkyscraper,
  IconUsers,
  IconUserPlus,
  IconCreditCardPay,
  IconSettings,
  IconArrowsUpDown,
  IconDots,
  IconPointFilled,
  IconArrowsSort,
  IconPremiumRights,
  IconArrowUpRight,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import businessStyles from "@/ui/styles/business.module.scss";
import { TransactionType } from "./hooks/transactions";

export const AdminMainLinks = [
  {
    text: "Dashboard",
    link: "/admin/dashboard",
    icon: <IconHome2 size={16} />,
  },
  {
    text: "Businesses",
    link: "/admin/businesses",
    icon: <IconBuildingSkyscraper size={16} />,
  },
  {
    text: "Accounts",
    link: "/admin/accounts",
    icon: <IconUsers size={16} />,
  },
  {
    text: "Account Creation",
    link: "/admin/account-requests",
    icon: <IconUserPlus size={16} />,
  },
  {
    text: "Transactions",
    link: "/admin/transactions",
    icon: <IconArrowsSort size={16} />,
  },
  {
    text: "Payouts",
    link: "/admin/payouts",
    icon: <IconArrowUpRight size={16} />,
  },
  {
    text: "Requests",
    link: "/admin/requests",
    icon: <IconCreditCardPay size={16} />,
  },
];

export const AdminOtherLinks = [
  {
    text: "User Management",
    link: "/admin/users",
    icon: <IconUsers size={16} />,
  },
  {
    text: "Pricing Plans",
    link: "/admin/pricing-plans",
    icon: <IconPremiumRights size={16} />,
  },
  {
    text: "Settings",
    link: "/admin/settings",
    icon: <IconSettings size={16} />,
  },
];

export const UserMainLinks = [
  {
    text: "Dashboard",
    link: "/",
    icon: <IconHome2 size={16} />,
  },
  {
    text: "Accounts",
    link: "/accounts",
    icon: <IconUsers size={16} />,
  },
  {
    text: "Payouts",
    link: "/payouts",
    icon: <IconArrowUpRight size={16} />,
  },
  {
    text: "Debit Requests",
    link: "/debit-requests",
    icon: <IconCreditCardPay size={16} />,
  },
  {
    text: "Account Requests",
    link: "/account-requests",
    icon: <IconUserPlus size={16} />,
  },
  {
    text: "Transactions",
    link: "/transactions",
    icon: <IconArrowsUpDown size={16} />,
  },
];

export const UserOtherLinks = [
  // {
  //   text: "Roles & Permissions",
  //   link: "/roles",
  //   icon: <IconSettings size={16} />,
  // },
  {
    text: "Users",
    link: "/users",
    icon: <IconUsers size={16} />,
  },
  {
    text: "Settings",
    link: "/settings",
    icon: <IconSettings size={16} />,
  },
];

export const UserDashboardData = [
  {
    date: "Mar 22",
    Completed: 2890,
    Failed: 2338,
  },
  {
    date: "Mar 23",
    Completed: 2756,
    Failed: 2103,
  },
  {
    date: "Mar 24",
    Completed: 3322,
    Failed: 986,
  },
  {
    date: "Mar 25",
    Completed: 2108,
    Failed: 2809,
  },
  {
    date: "Mar 26",
    Completed: 1726,
    Failed: 2290,
  },
];

export const AllBusinessSkeleton = Array(3)
  .fill("")
  .map((_, index) => {
    return (
      <TableTr key={index}>
        <TableTd className={businessStyles.table__td}>
          <Skeleton h={10} w={5} />
        </TableTd>
        <TableTd className={businessStyles.table__td}>
          <Skeleton h={10} w={50} />
        </TableTd>
        <TableTd className={businessStyles.table__td}>
          <Skeleton h={10} w={50} />
        </TableTd>
        <TableTd className={`${businessStyles.table__td}`}>
          <Skeleton h={10} w={70} />
        </TableTd>
        <TableTd className={businessStyles.table__td}>
          <Skeleton h={20} w={40} />
        </TableTd>

        <TableTd className={`${businessStyles.table__td}`}>
          <Skeleton h={10} w={20} />
        </TableTd>
      </TableTr>
    );
  });

export const DynamicSkeleton = (number: number) =>
  Array(3)
    .fill("")
    .map((_, index) => {
      return (
        <TableTr key={index}>
          <TableTd className={businessStyles.table__td}>
            <Skeleton h={10} w={5} />
          </TableTd>
          <TableTd className={businessStyles.table__td}>
            <Skeleton h={10} w={50} />
          </TableTd>
          <TableTd className={businessStyles.table__td}>
            <Skeleton h={10} w={50} />
          </TableTd>
          <TableTd className={`${businessStyles.table__td}`}>
            <Skeleton h={10} w={70} />
          </TableTd>
          <TableTd className={businessStyles.table__td}>
            <Skeleton h={20} w={20} />
          </TableTd>

          {Array(number)
            .fill("")
            .map((_, index) => (
              <TableTd key={index} className={businessStyles.table__td}>
                <Skeleton h={10} w={40} />
              </TableTd>
            ))}

          <TableTd className={`${businessStyles.table__td}`}>
            <Skeleton h={10} w={20} />
          </TableTd>
        </TableTr>
      );
    });

export const DynamicSkeleton2 = (number: number) =>
  Array(3)
    .fill("")
    .map((_, index) => {
      return (
        <TableTr key={index}>
          {Array(number)
            .fill("")
            .map((_, index) => (
              <TableTd key={index} className={businessStyles.table__td}>
                <Skeleton h={10} w={40} />
              </TableTd>
            ))}
        </TableTr>
      );
    });

export const countries = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "United Kingdom",
];

export const OwnAccountTableHeaders = [
  "Beneficiary",
  "Type",
  "Amount",
  "Prune Ref",
  "Date & Time",
  "Status",
];

export const IssuedAccountTableHeaders = [
  "Sender Name",
  "Beneficiary",
  "Prune Ref",
  "Type",
  "Amount",
  "Transaction Ref",
  "Date",
  "Status",
];

export const BusinessAccountTableHeaders = [
  "Sender Name",
  "Beneficiary",
  "Type",
  "Amount",
  "Prune Ref",
  "Date & Time",
  "Status",
];

export const PayoutTableHeaders = [
  "Senders Name",
  "Prune Ref",
  "Beneficiary",
  "Type",
  "Amount",
  "Transaction Ref",
  "Date",
  "Status",
];

export const debitTableHeaders = [
  "Account Name",
  "Amount",
  "Date Created",
  "Status",
  // "Action",
];

export const InquiriesTableHeaders = [
  "Business Name",
  "Prune Reference",
  "Inquiry Type",
  "Date Requested",
  "Status",
];

export interface InquiryData {
  id: string;
  businessName: string;
  pruneReference: string;
  inquiryType: "QUERY" | "TRACE" | "RECALL";
  dateRequested: string;
  status: "CLOSED" | "PROCESSING";
}

export const inquiriesData: InquiryData[] = [
  {
    id: "1",
    businessName: "Tech Solutions",
    pruneReference: "PRN12345",
    inquiryType: "QUERY",
    dateRequested: "2024-09-15",
    status: "PROCESSING",
  },
  {
    id: "2",
    businessName: "Green Industries",
    pruneReference: "PRN67890",
    inquiryType: "RECALL",
    dateRequested: "2024-09-10",
    status: "CLOSED",
  },
  {
    id: "3",
    businessName: "Creative Studio",
    pruneReference: "PRN11223",
    inquiryType: "TRACE",
    dateRequested: "2024-09-12",
    status: "PROCESSING",
  },
];

type SenderType = "user" | "admin";

interface MessageBase {
  createdAt: Date;
  senderType: SenderType;
}

interface TextMessage extends MessageBase {
  type: "text";
  body: string;
}

interface FileMessage extends MessageBase {
  type: "file";
  file: string;
  extension: string;
}

interface FileTextMessage extends MessageBase {
  type: "file-text";
  body: string;
  file: string;
  extension: string;
}

type Message = TextMessage | FileMessage | FileTextMessage;

export interface Inquiry {
  transaction: TransactionType;
  user: string;
  business: string;
  createdAt: Date;
  messages: Message[];
  status: "CLOSED" | "PROCESSING";
}

const inquiry: Inquiry = {
  transaction: {
    id: "T003",
    senderIban: "US12345678901234567890",
    senderName: "Michael Smith",
    senderBic: "USABCDEF123",
    recipientIban: "JP09876543210987654321",
    recipientBic: "JPXYZ987654",
    recipientBankAddress: "789 Tokyo Lane, Tokyo, Japan",
    recipientBankCountry: "Japan",
    recipientName: "Hiroshi Tanaka",
    amount: 5000,
    reference: "Consulting Services",
    centrolinkRef: "REF202309180003",
    status: "PENDING",
    createdAt: new Date("2023-09-10T09:30:00Z"),
    updatedAt: new Date("2023-09-18T14:00:00Z"),
    destinationFirstName: "Hiroshi",
    destinationLastName: "Tanaka",
    type: "CREDIT",
    company: {
      id: "B001",
      contactEmail: "contact@business123.com",
      contactNumber: "+1234567890",
      createdAt: new Date("2023-01-01T10:00:00Z"),
      updatedAt: new Date("2023-09-18T12:00:00Z"),
      deletedAt: null,
      domain: "business123.com",
      name: "Business 123 Ltd.",
      staging: "staging.business123.com",
      kycTrusted: true,
      address: "123 Business Avenue, New York, USA",
      country: "USA",
      legalEntity: "Limited Liability Company",
      cacCertificate: "cac_certificate_url.pdf",
      mermat: "mermat_url.pdf",
      businessBio: "Business 123 is a leading provider of financial services.",
      directorParticular: "director_particulars_url.pdf",
      operationalLicense: "operational_license_url.pdf",
      shareholderParticular: "shareholder_particulars_url.pdf",
      amlCompliance: "aml_compliance_certificate.pdf",
      directors: [
        {
          name: "Jane Smith",
          email: "jane@business123.com",
          identityType: "Passport",
          proofOfAddress: "passport_url.pdf",
          identityFileUrl: "passport_url.pdf",
          identityFileUrlBack: "passport_back_url.pdf",
          proofOfAddressFileUrl: "passport_url.pdf",
        },
      ],
      shareholders: [
        {
          name: "Jane Smith",
          email: "jane@business123.com",
          identityType: "Passport",
          proofOfAddress: "passport_url.pdf",
          identityFileUrl: "passport_url.pdf",
          identityFileUrlBack: "passport_back_url.pdf",
          proofOfAddressFileUrl: "passport_url.pdf",
        },
      ],
      companyStatus: "ACTIVE",
      apiCalls: 1000,
      _count: {
        AccountRequests: 10,
      },
      pricingPlanId: "P001",
      pricingPlan: {
        id: "P001",
        name: "Premium",

        cost: 100,
        cycle: "Monthly",
        description: "Premium plan for businesses",
        features: ["API Access", "Priority Support"],
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        deletedAt: null,
      },
      otherDocuments: {
        tax_compliance: "tax_compliance_url.pdf",
        insurance: "insurance_certificate_url.pdf",
      },
      Accounts: [
        {
          DebitRequests: [{ id: "DR001" }, { id: "DR002" }],
        },
      ],
      Requests: [{ type: "Service Request", id: "REQ001" }],
      contactFirstName: "John",
      contactIdType: "Passport",
      contactIdUrl: "passport_url.pdf",
      contactIdUrlBack: "passport_back_url.pdf",
      contactLastName: "Doe",
      contactPOAType: "Utility Bill",
      contactPOAUrl: "utility_bill_url.pdf",
      documents: [
        {
          title: "Incorporation Certificate",
          documentURL: "incorporation_certificate_url.pdf",
        },
      ],
      lastLogin: new Date("2023-09-18T08:00:00Z"),
      contactSignup: new Date("2023-01-01T12:00:00Z"),
      contactCountryCode: "+1",
    },
  },
  user: "user789",
  business: "business123",
  createdAt: new Date("2023-09-10T09:35:00Z"),
  status: "PROCESSING",
  messages: [
    {
      type: "text",
      body: "Hello, could you provide an update on the status of my transaction?",
      createdAt: new Date("2023-09-10T09:40:00Z"),
      senderType: "user",
    },
    {
      type: "text",
      body: "Hi Michael, your transaction is currently pending and awaiting approval.",
      createdAt: new Date("2023-09-10T09:45:00Z"),
      senderType: "admin",
    },
    {
      type: "text",
      body: "Can you confirm if all documents are in order?",
      createdAt: new Date("2023-09-10T09:50:00Z"),
      senderType: "user",
    },
    {
      type: "file",
      file: "transaction_details.pdf",
      extension: "pdf",
      createdAt: new Date("2023-09-10T10:00:00Z"),
      senderType: "admin",
    },
    {
      type: "text",
      body: "I have attached the document for your reference. All looks fine on our end.",
      createdAt: new Date("2023-09-10T10:02:00Z"),
      senderType: "admin",
    },
    {
      type: "text",
      body: "Thank you! I'll review it. When should I expect completion?",
      createdAt: new Date("2023-09-10T10:10:00Z"),
      senderType: "user",
    },
    {
      type: "text",
      body: "The transaction should be completed within the next 24 hours.",
      createdAt: new Date("2023-09-10T10:15:00Z"),
      senderType: "admin",
    },
    {
      type: "file-text",
      body: "Here is a copy of the agreement for your records.",
      file: "agreement.pdf",
      extension: "pdf",
      createdAt: new Date("2023-09-10T10:30:00Z"),
      senderType: "admin",
    },
    {
      type: "text",
      body: "Received the agreement, thanks. Please let me know if there are any further steps on my part.",
      createdAt: new Date("2023-09-10T10:45:00Z"),
      senderType: "user",
    },
    {
      type: "text",
      body: "No further steps needed from your side. We'll notify you once the transaction is complete.",
      createdAt: new Date("2023-09-10T11:00:00Z"),
      senderType: "admin",
    },
  ],
};
