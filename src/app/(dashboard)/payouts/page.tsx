"use client";
import dayjs from "dayjs";

import { Center, Group, Paper, SimpleGrid, Stack } from "@mantine/core";

import { Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";
import { Flex } from "@mantine/core";

import styles from "./styles.module.scss";
import {
  IconArrowUpRight,
  IconSearch,
  IconListTree,
  IconCheck,
} from "@tabler/icons-react";

import { formatNumber, frontendPagination } from "@/lib/utils";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TransactionType,
  TrxData,
  useUserDefaultTransactions,
  useUserTransactions,
} from "@/lib/hooks/transactions";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { Suspense, useState } from "react";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { filteredSearch } from "@/lib/search";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import { SearchInput } from "@/ui/components/Inputs";
import InfoCards from "@/ui/components/Cards/InfoCards";
import { PayoutDrawer } from "./drawer";
import {
  useUserDefaultAccount,
  useUserDefaultPayoutAccount,
} from "@/lib/hooks/accounts";
import {
  DefaultAccountHead,
  SingleAccountBody,
} from "@/ui/components/SingleAccount";
import { AccountCard } from "@/ui/components/Cards/AccountCard";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserBusiness } from "@/lib/hooks/businesses";

function PayoutTrx() {
  const searchParams = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<TrxData | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );

  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [chartFrequency, setChartFrequency] = useState<string>("monthly");

  const [processing, setProcessing] = useState(false);

  const { handleError, handleInfo, handleSuccess } = useNotification();

  const [openedDebit, { open, close }] = useDisclosure(false);

  const { loading: loadingAcct, account } = useUserDefaultPayoutAccount();
  const { business, meta, revalidate, loading } = useUserBusiness();

  const requestPayoutAccount = async () => {
    setProcessing(true);

    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/payout/request`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      revalidate();
      handleSuccess(
        "Request Sent",
        "You will receive a notification once your request has been approved."
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Group justify="space-between">
        <div
        // className={styles.container__header}
        >
          <Text fz={18} fw={600}>
            Payouts
          </Text>
          <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
            Here’s an overview of your payout account activities
          </Text>
        </div>

        {!Boolean(meta?.hasPayoutAccount) && (
          <PrimaryBtn
            fw={600}
            text={
              Boolean(meta?.activePAReq)
                ? "Request Sent"
                : "Request Payout Account"
            }
            {...(Boolean(meta?.activePAReq) && {
              icon: IconCheck,
            })}
            loading={loading || processing}
            loaderProps={{ type: "dots" }}
            disabled={Boolean(meta?.activePAReq)}
            action={requestPayoutAccount}
          />
        )}
      </Group>

      {Boolean(meta?.hasPayoutAccount) && (
        <SimpleGrid cols={3} mt={32}>
          <AccountCard
            balance={account?.accountBalance ?? 0}
            currency="EUR"
            companyName={account?.accountName ?? "No Default Account"}
            badgeText="Payout Account"
            iban={account?.accountNumber ?? "No Default Account"}
            bic={"ARPYGB21XXX"}
            loading={loadingAcct}
            link={`/payouts/${account?.id}`}
          />
        </SimpleGrid>
      )}

      {!Boolean(meta?.hasPayoutAccount) && (
        <Center h="calc(100vh - 10px)">
          <Stack>
            <EmptyTable
              rows={[]}
              loading={loading}
              title="You do not have a payout account now."
              text="Request for a payout account and  it would appear here."
            />

            <PrimaryBtn
              fw={600}
              text={
                Boolean(meta?.activePAReq)
                  ? "Request Sent"
                  : "Request Payout Account"
              }
              {...(Boolean(meta?.activePAReq) && {
                icon: IconCheck,
              })}
              loading={loading || processing}
              loaderProps={{ type: "dots" }}
              disabled={Boolean(meta?.activePAReq)}
              action={requestPayoutAccount}
            />
          </Stack>
        </Center>
      )}
    </main>
  );
}

export default function AccountTrxSuspense() {
  return (
    <Suspense>
      <PayoutTrx />
    </Suspense>
  );
}

const tableHeaders = [
  "Beneficiary Name",
  "Destination Account",
  "Bank",
  "Amount",
  "Date Created",
  "Status",
];
