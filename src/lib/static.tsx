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

interface Notification {
  title: string;
  text: string;
  createdAt: Date;
  status: "unread" | "read";
}

export const notifications: Notification[] = [
  {
    title: "Activation Link Expired",
    text: "The activation link you received has expired. Please request a new activation link to proceed with your account setup.",
    createdAt: new Date("2023-01-01"),
    status: "unread",
  },
  {
    title: "Business Account Activated",
    text: "Your business account has been successfully activated. You can now access all the features and services available to business accounts.",
    createdAt: new Date("2023-01-02"),
    status: "read",
  },
  {
    title: "Business Account Unfrozen",
    text: "Your business account has been unfrozen. You can now resume your activities and transactions without any restrictions.",
    createdAt: new Date("2023-01-03"),
    status: "unread",
  },
  {
    title: "Business Account Frozen",
    text: "Your business account has been frozen due to suspicious activity. Please contact support to resolve this issue and unfreeze your account.",
    createdAt: new Date("2023-01-04"),
    status: "read",
  },
  {
    title: "Business Account Deactivated",
    text: "Your business account has been deactivated. If you believe this is a mistake, please contact support to reactivate your account.",
    createdAt: new Date("2023-01-05"),
    status: "unread",
  },
  {
    title: "Payout Account Approved",
    text: "Your payout account has been approved. You can now receive payouts to your designated account without any issues.",
    createdAt: new Date("2023-01-06"),
    status: "read",
  },
  {
    title: "Payout Account Rejected",
    text: "Your payout account has been rejected. Please review the provided information and submit a new request for approval.",
    createdAt: new Date("2023-01-07"),
    status: "unread",
  },
  {
    title: "Payout Account Trusted",
    text: "Your payout account has been marked as trusted. You can now enjoy faster and more secure transactions.",
    createdAt: new Date("2023-01-08"),
    status: "read",
  },
  {
    title: "New Inquiry Ticket",
    text: "A new inquiry ticket has been created for C80 Limited. Please review the details and respond accordingly. [Reference ID]",
    createdAt: new Date("2023-01-09"),
    status: "unread",
  },
  {
    title: "New Reply",
    text: "You have received a new reply from Primark Limited. Please review the response and take the necessary actions. [Reference ID]",
    createdAt: new Date("2023-01-10"),
    status: "read",
  },
  {
    title: "Account Verification Required",
    text: "Your account requires verification. Please submit the necessary documents to complete the verification process and avoid any interruptions.",
    createdAt: new Date("2023-01-11"),
    status: "unread",
  },
  {
    title: "Password Change Successful",
    text: "Your password has been successfully changed. If you did not request this change, please contact support immediately.",
    createdAt: new Date("2023-01-12"),
    status: "read",
  },
  {
    title: "Subscription Renewal",
    text: "Your subscription is due for renewal. Please ensure your payment information is up to date to avoid any service interruptions.",
    createdAt: new Date("2023-01-13"),
    status: "unread",
  },
  {
    title: "Service Downtime Notice",
    text: "We will be performing scheduled maintenance on our servers. During this time, our services may be temporarily unavailable. We apologize for any inconvenience.",
    createdAt: new Date("2023-01-14"),
    status: "read",
  },
  {
    title: "New Feature Release",
    text: "We are excited to announce the release of a new feature. Check out the latest addition to our platform and see how it can benefit you.",
    createdAt: new Date("2023-01-15"),
    status: "unread",
  },
  {
    title: "Security Alert",
    text: "We have detected unusual activity on your account. Please review your recent activity and contact support if you notice anything suspicious.",
    createdAt: new Date("2023-01-16"),
    status: "read",
  },
  {
    title: "Welcome to Our Service",
    text: "Thank you for joining our service. We are thrilled to have you on board and look forward to providing you with the best experience possible.",
    createdAt: new Date("2023-01-17"),
    status: "unread",
  },
  {
    title: "Account Upgrade Available",
    text: "An upgrade is available for your account. Upgrade now to enjoy additional features and benefits exclusive to premium members.",
    createdAt: new Date("2023-01-18"),
    status: "read",
  },
  {
    title: "Payment Confirmation",
    text: "Your payment has been successfully processed. Thank you for your purchase. If you have any questions, please contact support.",
    createdAt: new Date("2023-01-19"),
    status: "unread",
  },
  {
    title: "Feedback Request",
    text: "We value your feedback. Please take a moment to share your thoughts and help us improve our services. Your input is greatly appreciated.",
    createdAt: new Date("2023-01-20"),
    status: "read",
  },
];
