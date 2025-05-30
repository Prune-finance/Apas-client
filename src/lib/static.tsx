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
  IconRosetteDiscountCheck,
  IconArrowsRightLeft,
  IconCreditCard,
  IconDatabase,
  IconMoneybag,
  IconSearch,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import businessStyles from "@/ui/styles/business.module.scss";
import { TransactionType } from "./hooks/transactions";
import { Notification } from "./hooks/notifications";
import { formatNumber } from "./utils";

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
    text: "Eligibility Center",
    link: "/admin/eligibility-center",
    icon: <IconRosetteDiscountCheck size={16} />,
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
    text: "Payouts",
    link: "/payouts",
    icon: <IconArrowUpRight size={16} />,
  },
  {
    text: "Transactions",
    link: "/transactions",
    icon: <IconArrowsUpDown size={16} />,
  },
];

export const UserOtherLinks = [
  {
    text: "User Management",
    link: "/users",
    icon: <IconUsers size={16} />,
  },
  // {
  //   text: "Roles & Permissions",
  //   link: "/roles",
  //   icon: <IconSettings size={16} />,
  // },
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

export const PayoutRequestsTableHeaders = [
  "Beneficiary",
  "IBAN",
  "Bank",
  "Reference",
  "Amount",
  "Date",
  "Status",
];

export const businessIndustries: string[] = [
  "Agriculture",
  "Automotive",
  "Banking & Financial Services",
  "Construction",
  "Consulting",
  "Consumer Goods",
  "E-commerce",
  "Education",
  "Energy & Utilities",
  "Entertainment & Media",
  "Environmental Services",
  "Fashion & Apparel",
  "Food & Beverage",
  "Government",
  "Healthcare & Medical",
  "Hospitality",
  "Insurance",
  "Legal Services",
  "Logistics & Transportation",
  "Manufacturing",
  "Marketing & Advertising",
  "Nonprofit & NGOs",
  "Pharmaceuticals & Biotechnology",
  "Real Estate",
  "Retail",
  "Software & Technology",
  "Telecommunications",
  "Travel & Tourism",
  "Wholesale & Distribution",
];

export const operationsAccountEstimatedBalance = {
  "less-than-10000": `Less than ${formatNumber(10000, true, "GBP")}`,
  "between-10000-50000": `Between ${formatNumber(
    10000,
    true,
    "GBP"
  )} - ${formatNumber(50000, true, "GBP")}`,
  "between-50000-100000": `Between ${formatNumber(
    50000,
    true,
    "GBP"
  )} - ${formatNumber(100000, true, "GBP")}`,
  "between-100000-500000": `Between ${formatNumber(
    100000,
    true,
    "GBP"
  )} - ${formatNumber(500000, true, "GBP")}`,
  "above-500000": `Above ${formatNumber(500000, true, "GBP")}`,
} as const;

const currencies = ["EUR", "GBP", "USD", "NGN"];

export const serviceCategories = [
  {
    title: "Operations Account",
    description:
      "Prune Payments payout service gives the business access to payouts.",
    accounts: currencies,
    icon: IconDatabase,
  },
  {
    title: "Virtual Account Services",
    description:
      "The account service lets businesses issue user accounts to clients.",
    accounts: currencies,
    icon: IconCreditCard,
  },
  {
    title: "Payout Services",
    description:
      "This helps businesses manage and disburse funds to recipients.",
    accounts: currencies,
    icon: IconMoneybag,
  },
  {
    title: "Account Lookup Services",
    description:
      "This helps businesses quickly verify and access account details for transactions.",
    accounts: currencies,
    icon: IconSearch,
  },
  {
    title: "Remittance",
    description:
      "This helps businesses quickly verify and access account details for transactions.",
    accounts: currencies,
    icon: IconArrowsRightLeft,
  },
];
