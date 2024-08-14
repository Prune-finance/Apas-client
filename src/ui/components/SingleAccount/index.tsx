import {
  Grid,
  Paper,
  Text,
  Button,
  Stack,
  Flex,
  Skeleton,
  GridCol,
  CopyButton,
  ActionIcon,
  NativeSelect,
  Tooltip,
  Group,
  rem,
  Badge,
  TableTd,
  TableTr,
  Box,
  SimpleGrid,
  TabsPanel,
  ThemeIcon,
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBrandLinktree,
  IconCheck,
  IconCircleArrowDown,
  IconCopy,
  IconListTree,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import TransactionStatistics from "@/app/admin/(dashboard)/accounts/[id]/TransactionStats";
import { approvedBadgeColor, formatNumber } from "@/lib/utils";
import Link from "next/link";
import InfoCards from "../Cards/InfoCards";
import { DonutChartComponent } from "../Charts";
import EmptyTable from "../EmptyTable";
import { TableComponent } from "../Table";
import { Account, AccountData, useSingleAccount } from "@/lib/hooks/accounts";
import styles from "./styles.module.scss";
import { TransactionType, TrxData } from "@/lib/hooks/transactions";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { BadgeComponent } from "../Badge";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useForm, zodResolver } from "@mantine/form";
import { validateRequest } from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import ModalComponent from "@/app/admin/(dashboard)/accounts/modal";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import TabsComponent from "../Tabs";
import { GiEuropeanFlag } from "react-icons/gi";
import { SearchInput } from "../Inputs";

type Param = { id: string };
interface Props {
  account: Account | null;
  setChartFrequency: Dispatch<SetStateAction<string>>;
  transactions: TransactionType[];
  params: Param;
  loading: boolean;
  trxLoading: boolean;
  revalidate?: () => void;
}

export function SingleAccount({
  account,
  setChartFrequency,
  transactions,
  params,
  loading,
  trxLoading,
  revalidate,
}: Props) {
  const { back } = useRouter();
  const pathname = usePathname();
  const { handleError, handleSuccess } = useNotification();

  const [opened, { open, close }] = useDisclosure(false);
  const [openedFreeze, { open: openFreeze, close: closeFreeze }] =
    useDisclosure(false);
  const [processing, setProcessing] = useState(false);

  const accountDetails = [
    {
      title: "Euro Account",
      value: account?.accountBalance,
      // value: transactions.reduce((acc, cur) => acc + cur.amount, 0),
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Dollar Account",
      value: 0,
      formatted: true,
      currency: "USD",
      locale: "en-US",
    },
    { title: "Pound Account", value: 0, formatted: true, currency: "GBP" },
  ];

  const flexedGroupDetails = [
    // { title: "Bank", value: "Wema" },
    { title: "Account Name", value: account?.accountName },
    { title: "Account No", value: account?.accountNumber },
    { title: "Account Type", value: account?.type },
  ];

  const lineData = useMemo(() => {
    const arr: {
      month: string;
      Inflow: number;
      Outflow: number;
    }[] = [];

    transactions.map((trx) => {
      let successful = 0,
        pending = 0,
        failed = 0;

      const month = dayjs(trx.createdAt).format("MMM DD");
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : (successful += trx.amount);

      // arr.push({ month, Inflow: 0, Outflow: pending + successful + failed });
      arr.push({ month, Inflow: 0, Outflow: trx.amount });
    });

    return arr;
  }, [transactions]);

  const donutData = useMemo(() => {
    let completed = 0,
      pending = 0,
      failed = 0;
    transactions.map((trx) => {
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : trx.status === "REJECTED"
        ? (failed += trx.amount)
        : (completed += trx.amount);
    });

    return [
      { name: "Completed", value: completed, color: "#039855" },
      { name: "Pending", value: pending, color: "#F79009" },
      { name: "Failed", value: failed, color: "#D92D20" },
    ];
  }, [transactions]);

  const totalTrxVolume = donutData.reduce((acc, cur) => acc + cur.value, 0);

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const unfreezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/unfreeze`,
        {
          reason,
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
          ...(supportingDocumentName && { supportingDocumentName }),
        },
        { withCredentials: true }
      );

      revalidate && revalidate();
      handleSuccess("Action Completed", "Account unfrozen");
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const freezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/freeze`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { withCredentials: true }
      );

      revalidate && revalidate();
      handleSuccess("Action Completed", "Account frozen");
      closeFreeze();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Paper p={28} className={styles.grid__container}>
      <Button
        fz={14}
        c="var(--prune-text-gray-500)"
        fw={400}
        px={0}
        variant="transparent"
        onClick={back}
        leftSection={
          <IconArrowLeft
            color="#1D2939"
            style={{ width: "70%", height: "70%" }}
          />
        }
        style={{ pointerEvents: !account ? "none" : "auto" }}
      >
        Back
      </Button>

      <Flex justify="space-between" align="flex-start" mt={20}>
        <Stack gap={8}>
          {account?.accountName ? (
            <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
              {account?.accountName}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}

          {/* <Group gap={3}>
            <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
              Last Seen:
            </Text>

            {account?.createdAt ? (
              <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
                {dayjs(account?.createdAt).format("Do, MMMM YYYY")}
              </Text>
            ) : (
              <Skeleton h={10} w={50} />
            )}
          </Group> */}
        </Stack>

        <Flex gap={10}>
          <SecondaryBtn
            action={() => {
              if (account?.status === "FROZEN") return open();
              openFreeze();
            }}
            loading={loading}
            loaderProps={{ type: "dots" }}
            text={
              account?.status === "FROZEN"
                ? "Unfreeze Account"
                : "Freeze Account"
            }
          />

          {/* <Button
              // onClick={() => {
              //   updateDirector(index, form.values);
              //   setEditing(false);
              // }}
              // className={styles.edit}
              variant="filled"
              color="var(--prune-primary-600)"
              fz={12}
              fw={500}
              c="var(--prune-text-gray-800)"
            >
              Debit Account
            </Button> */}
        </Flex>
      </Flex>

      <Grid>
        <GridCol span={8}>
          <InfoCards
            title="Account Overview"
            details={accountDetails}
            loading={loading}
          />
        </GridCol>

        <GridCol span={4}>
          <InfoCards
            title="Bank Details"
            details={flexedGroupDetails}
            flexedGroup
            loading={loading}
            h={190}
          >
            <CopyButton value={account?.accountNumber || ""} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                    h={10}
                  >
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </InfoCards>
        </GridCol>

        <GridCol span={8.3}>
          <TransactionStatistics
            setChartFrequency={setChartFrequency}
            lineData={lineData}
          />
        </GridCol>

        <GridCol span={3.7}>
          <Paper
            px="auto"
            style={{ border: "1px solid #f5f5f5" }}
            w="100%"
            h="100%"
            pt={20}
          >
            <Flex px={10} justify="space-between" align="center">
              <Text fz={16} fw={600} tt="capitalize">
                Transaction Volume
              </Text>

              <Flex>
                <NativeSelect
                  classNames={{
                    wrapper: styles.select__wrapper,
                    input: styles.select__input,
                  }}
                  onChange={(event) =>
                    setChartFrequency(event.currentTarget.value)
                  }
                  data={["Monthly", "Weekly"]}
                />
              </Flex>
            </Flex>

            <Flex justify="center" my={37} h={150}>
              <DonutChartComponent
                data={
                  !totalTrxVolume
                    ? [
                        {
                          name: "No Data",
                          value: 100,
                          color: "var(--prune-text-gray-300)",
                        },
                      ]
                    : donutData
                }
                startAngle={180}
                endAngle={0}
                withLabels={formatNumber(totalTrxVolume, true, "EUR")}
              />
            </Flex>

            <Group justify="space-between" px={10} gap={15}>
              {donutData.map((item, index) => {
                return (
                  <Stack
                    key={index}
                    gap={6}
                    pl={9}
                    style={{ borderLeft: `3px solid ${item.color}` }}
                  >
                    <Text fz={12} c="var(--prune-text-gray-800)" fw={400}>
                      {item.name}
                    </Text>

                    <Text fz={16} fw={700} c="var(--prune-text-gray-800)">
                      {formatNumber(item.value, true, "EUR")}
                    </Text>
                  </Stack>
                );
              })}
            </Group>
          </Paper>
        </GridCol>

        <GridCol span={12}>
          <Paper style={{ border: "1px solid #f5f5f5" }}>
            <div className={styles.payout__table}>
              <Group justify="space-between">
                <Text
                  // className={styles.table__text}
                  lts={0.5}
                  fz={16}
                  fw={600}
                  tt="capitalize"
                >
                  Transaction History
                </Text>

                <Button
                  // leftSection={<IconCircleChevronRight size={18} />}
                  variant="transparent"
                  fz={12}
                  c="var(--prune-primary-800)"
                  td="underline"
                  component={Link}
                  href={`${pathname}/transactions`}
                >
                  See All Transactions
                </Button>
              </Group>

              <TableComponent
                head={tableHeaders}
                rows={<RowComponent data={transactions.slice(0, 3)} />}
                loading={trxLoading}
              />

              <EmptyTable
                rows={transactions}
                loading={trxLoading}
                title="There are no recent transactions"
                text="When transactions are created, recent transactions will appear here."
              />
            </div>
          </Paper>
        </GridCol>
      </Grid>

      <ModalComponent
        processing={processing}
        action={() => unfreezeAccount(account?.id || "")}
        form={requestForm}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={opened}
        close={close}
        title="Unfreeze this Account?"
        text="You are about to unfreeze this account. This means full activity can be carried out in the account again."
      />

      <ModalComponent
        processing={processing}
        action={() => freezeAccount(account?.id || "")}
        form={requestForm}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={openedFreeze}
        close={closeFreeze}
        title="Freeze this Account?"
        text="You are about to freeze this account. This means no activity can be carried out on this account anymore."
      />
    </Paper>
  );
}

const tableHeaders = [
  "Beneficiary",
  "IBAN",
  // "Account Number",
  "Amount",
  "Date",
  "Status",
];

const RowComponent = ({
  data,
}: // id,
{
  data: TransactionType[];
  // id: string;
}) => {
  const { push } = useRouter();
  const handleRowClick = (id: string) => {
    push(`/admin/accounts/${id}/transactions`);
  };
  return data.map((element) => (
    <TableTr
      key={element.id}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.senderIban}</TableTd>
      {/* <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd> */}
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <Group gap={3}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
          />
          {formatNumber(element.amount, true, "EUR")}
          {/* <Text fz={12}></Text> */}
        </Group>
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};

interface SingleAccountProps {
  account: AccountData | null;
  transactions: TransactionType[];
  loading: boolean;
  loadingTrx: boolean;
}

export const SingleAccountBody = ({
  account,
  transactions,
  loading,
  loadingTrx,
}: SingleAccountProps) => {
  const totalBal = transactions.reduce((prv, curr) => prv + curr.amount, 0);
  const info = {
    "Account Balance": formatNumber(account?.accountBalance ?? 0, true, "EUR"),
    "No. of Transaction": transactions.length,
    Currency: "EUR",
    "Date Created": dayjs(account?.createdAt).format("Do MMMM, YYYY"),
    "Account Type": account?.type,
    "Last Seen": dayjs(account?.updatedAt).format("Do MMMM, YYYY"),
  };
  const accountDetails = {
    "Account Name": account?.accountName,
    "IBAN/Account Number": account?.accountNumber,
    BIC: "233423421",
    "Bank Name": "Community Federal Savings Bank",
    "Bank Address": "Via Alessandro Specchi, 16, 00186 Roma",
    "Bank Country": "France",
  };

  const overviewDetails = [
    {
      title: "Total Balance",
      value: totalBal,
    },
    { title: "Money In", value: 0 },
    { title: "Money Out", value: totalBal },
  ];
  return (
    <Box mt={32}>
      <Grid>
        <GridCol span={8}>
          <SimpleGrid cols={3} verticalSpacing={28}>
            {Object.entries(info).map(([key, value]) => (
              <Stack gap={2} key={key}>
                <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
                  {key}
                </Text>
                {!loading || !loadingTrx ? (
                  <Text fz={14} fw={500} c="var(--prune-text-gray-800)">
                    {value}
                  </Text>
                ) : (
                  <Skeleton w={100} h={10} />
                )}
              </Stack>
            ))}
          </SimpleGrid>
        </GridCol>
      </Grid>

      <TabsComponent tabs={tabs} mt={40}>
        <TabsPanel value={tabs[0].value} mt={28}>
          <Group gap={7}>
            <ThemeIcon radius="xl" color="#0052B4">
              <GiEuropeanFlag />
            </ThemeIcon>
            <Text fz={16} fw={500}>
              EUR Account Details
            </Text>
            <CopyButton value={account?.accountNumber ?? ""}>
              {({ copied, copy }) => (
                <PrimaryBtn
                  text={copied ? "Copied" : "Copy Detail"}
                  action={copy}
                  td="underline"
                  c="var(--prune-primary-800)"
                  variant="light"
                  radius="xl"
                  size="xs"
                />
              )}
            </CopyButton>
          </Group>

          <Paper
            withBorder
            p={16}
            mt={12}
            style={{ border: "1px solid #f5f5f5" }}
          >
            <Grid>
              <GridCol span={9}>
                <SimpleGrid cols={3} verticalSpacing={28}>
                  {Object.entries(accountDetails).map(([key, value]) => (
                    <Stack gap={2} key={key}>
                      <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
                        {key}
                      </Text>
                      {!loading || !loadingTrx ? (
                        <Text fz={14} fw={500} c="var(--prune-text-gray-800)">
                          {value}
                        </Text>
                      ) : (
                        <Skeleton w={100} h={10} />
                      )}
                    </Stack>
                  ))}
                </SimpleGrid>
              </GridCol>
            </Grid>
          </Paper>
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <InfoCards title="Overview" details={overviewDetails} />

          <Group mt={32} justify="space-between">
            <SearchInput />

            <Group gap={12}>
              <SecondaryBtn text="Filter" icon={IconListTree} />
              <SecondaryBtn text="Filter" icon={IconArrowUpRight} />
              <SecondaryBtn
                text="Download Statement"
                icon={IconCircleArrowDown}
              />
            </Group>
          </Group>

          <TableComponent
            rows={<RowComponent data={transactions} />}
            head={tableHeaders}
            loading={loadingTrx}
          />

          <EmptyTable
            loading={loadingTrx}
            rows={transactions}
            title="There are no transactions for this account"
            text="When a transaction is recorded, it will appear here"
          />
        </TabsPanel>
        <TabsPanel value={tabs[2].value}>
          <Text>Tabs 3</Text>
        </TabsPanel>
      </TabsComponent>
    </Box>
  );
};

const tabs = [
  { value: "Account Details" },
  { value: "Transactions" },
  { value: "Analytics" },
];
