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

export const PayoutRequestsTableHeaders = [
  "Beneficiary",
  "IBAN",
  "Bank",
  "Reference",
  "Amount",
  "Date",
  "Status",
];
