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
import { Notification } from "./hooks/notifications";

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

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Activation Link Expired",
    description:
      "The activation link you received has expired. Please request a new activation link to proceed with your account setup.",
    companyId: "company1",
    userId: "user1",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    readAt: null,
  },
  {
    id: "2",
    title: "Business Account Activated",
    description:
      "Your business account has been successfully activated. You can now access all the features and services available to business accounts.",
    companyId: "company2",
    userId: "user2",
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02"),
    readAt: new Date(),
  },
  {
    id: "3",
    title: "Business Account Unfrozen",
    description:
      "Your business account has been unfrozen. You can now resume your activities and transactions without any restrictions.",
    companyId: "company3",
    userId: "user3",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03"),
    readAt: null,
  },
  {
    id: "4",
    title: "Business Account Frozen",
    description:
      "Your business account has been frozen due to suspicious activity. Please contact support to resolve this issue and unfreeze your account.",
    companyId: "company4",
    userId: "user4",
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2023-01-04"),
    readAt: new Date(),
  },
  {
    id: "5",
    title: "Business Account Deactivated",
    description:
      "Your business account has been deactivated. If you believe this is a mistake, please contact support to reactivate your account.",
    companyId: "company5",
    userId: "user5",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05"),
    readAt: null,
  },
  {
    id: "6",
    title: "Payout Account Approved",
    description:
      "Your payout account has been approved. You can now receive payouts to your designated account without any issues.",
    companyId: "company6",
    userId: "user6",
    createdAt: new Date("2023-01-06"),
    updatedAt: new Date("2023-01-06"),
    readAt: new Date(),
  },
  {
    id: "7",
    title: "Payout Account Rejected",
    description:
      "Your payout account has been rejected. Please review the provided information and submit a new request for approval.",
    companyId: "company7",
    userId: "user7",
    createdAt: new Date("2023-01-07"),
    updatedAt: new Date("2023-01-07"),
    readAt: null,
  },
  {
    id: "8",
    title: "Payout Account Trusted",
    description:
      "Your payout account has been marked as trusted. You can now enjoy faster and more secure transactions.",
    companyId: "company8",
    userId: "user8",
    createdAt: new Date("2023-01-08"),
    updatedAt: new Date("2023-01-08"),
    readAt: new Date(),
  },
  {
    id: "9",
    title: "New Inquiry Ticket",
    description:
      "A new inquiry ticket has been created for C80 Limited. Please review the details and respond accordingly. [Reference ID]",
    companyId: "company9",
    userId: "user9",
    createdAt: new Date("2023-01-09"),
    updatedAt: new Date("2023-01-09"),
    readAt: null,
  },
  {
    id: "10",
    title: "New Reply",
    description:
      "You have received a new reply from Primark Limited. Please review the response and take the necessary actions. [Reference ID]",
    companyId: "company10",
    userId: "user10",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
    readAt: new Date(),
  },
  {
    id: "11",
    title: "Account Verification Required",
    description:
      "Your account requires verification. Please submit the necessary documents to complete the verification process and avoid any interruptions.",
    companyId: "company11",
    userId: "user11",
    createdAt: new Date("2023-01-11"),
    updatedAt: new Date("2023-01-11"),
    readAt: null,
  },
  {
    id: "12",
    title: "Password Change Successful",
    description:
      "Your password has been successfully changed. If you did not request this change, please contact support immediately.",
    companyId: "company12",
    userId: "user12",
    createdAt: new Date("2023-01-12"),
    updatedAt: new Date("2023-01-12"),
    readAt: new Date(),
  },
  {
    id: "13",
    title: "Subscription Renewal",
    description:
      "Your subscription is due for renewal. Please ensure your payment information is up to date to avoid any service interruptions.",
    companyId: "company13",
    userId: "user13",
    createdAt: new Date("2023-01-13"),
    updatedAt: new Date("2023-01-13"),
    readAt: null,
  },
  {
    id: "14",
    title: "Service Downtime Notice",
    description:
      "We will be performing scheduled maintenance on our servers. During this time, our services may be temporarily unavailable. We apologize for any inconvenience.",
    companyId: "company14",
    userId: "user14",
    createdAt: new Date("2023-01-14"),
    updatedAt: new Date("2023-01-14"),
    readAt: new Date(),
  },
  {
    id: "15",
    title: "New Feature Release",
    description:
      "We are excited to announce the release of a new feature. Check out the latest addition to our platform and see how it can benefit you.",
    companyId: "company15",
    userId: "user15",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    readAt: null,
  },
  {
    id: "16",
    title: "Security Alert",
    description:
      "We have detected unusual activity on your account. Please review your recent activity and contact support if you notice anything suspicious.",
    companyId: "company16",
    userId: "user16",
    createdAt: new Date("2023-01-16"),
    updatedAt: new Date("2023-01-16"),
    readAt: new Date(),
  },
  {
    id: "17",
    title: "Welcome to Our Service",
    description:
      "Thank you for joining our service. We are thrilled to have you on board and look forward to providing you with the best experience possible.",
    companyId: "company17",
    userId: "user17",
    createdAt: new Date("2023-01-17"),
    updatedAt: new Date("2023-01-17"),
    readAt: null,
  },
  {
    id: "18",
    title: "Account Upgrade Available",
    description:
      "An upgrade is available for your account. Upgrade now to enjoy additional features and benefits exclusive to premium members.",
    companyId: "company18",
    userId: "user18",
    createdAt: new Date("2023-01-18"),
    updatedAt: new Date("2023-01-18"),
    readAt: new Date(),
  },
  {
    id: "19",
    title: "Payment Confirmation",
    description:
      "Your payment has been successfully processed. Thank you for your purchase. If you have any questions, please contact support.",
    companyId: "company19",
    userId: "user19",
    createdAt: new Date("2023-01-19"),
    updatedAt: new Date("2023-01-19"),
    readAt: null,
  },
  {
    id: "20",
    title: "Feedback Request",
    description:
      "We value your feedback. Please take a moment to share your thoughts and help us improve our services. Your input is greatly appreciated.",
    companyId: "company20",
    userId: "user20",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
    readAt: new Date(),
  },
];
