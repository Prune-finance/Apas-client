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
  Avatar,
  Modal,
  Switch,
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowUpRight,
  IconBrandLinktree,
  IconCheck,
  IconCircleArrowDown,
  IconCopy,
  IconExclamationCircle,
  IconInfoCircle,
  IconListTree,
  IconRosetteDiscountCheckFilled,
  IconShieldCheck,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import TransactionStatistics from "@/app/admin/(dashboard)/accounts/[id]/TransactionStats";
import {
  approvedBadgeColor,
  formatNumber,
  getInitials,
  getUserType,
} from "@/lib/utils";
import Link from "next/link";
import InfoCards from "../Cards/InfoCards";
import { DonutChartComponent } from "../Charts";
import EmptyTable from "../EmptyTable";
import { TableComponent } from "../Table";
import {
  Account,
  AccountData,
  DefaultAccount,
  useSingleAccount,
} from "@/lib/hooks/accounts";
import styles from "./styles.module.scss";
import { TransactionType, TrxData } from "@/lib/hooks/transactions";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { BadgeComponent } from "../Badge";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import { useForm, zodResolver } from "@mantine/form";
import { validateRequest } from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import ModalComponent from "@/app/admin/(dashboard)/accounts/modal";
import OriginalModalComponent from "../Modal";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import TabsComponent from "../Tabs";
import { GiEuropeanFlag } from "react-icons/gi";
import { SearchInput } from "../Inputs";
import AccountDetails from "./(tabs)/AccountDetails";
import { Transactions } from "./(tabs)/Transactions";
import { Analytics } from "./(tabs)/Analytics";
import { BusinessData } from "@/lib/hooks/businesses";
import { Documents } from "./(tabs)/Documents";
import DefaultAccountDetails from "./(defaultTabs)/DefaultAccountDetails";
import { DefaultDocuments } from "./(defaultTabs)/DefaultDocuments";
import SendMoneyModal from "./sendMoneyModal";
import PreviewState from "./previewState";
import SuccessModal from "../SuccessModal";
// import SuccessModalImage from "@/assets/success-modal-image.png";
import PendingModalImage from "@/assets/pending-image.png";
import createAxiosInstance from "@/lib/axios";

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
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
            <CopyButton
              value={`Account Name: ${
                account?.accountName ?? ""
              },\nAccount No: ${account?.accountNumber ?? ""},\nAccount Type:${
                account?.type ?? ""
              }`}
              timeout={2000}
            >
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

interface Meta {
  out: number;
  total: number;
  in: number;
  totalAmount: number;
}
interface SingleAccountProps {
  account: Account | null;
  transactions: TransactionType[];
  loading: boolean;
  loadingTrx: boolean;
  setChartFrequency: Dispatch<SetStateAction<string>>;
  business?: BusinessData | null;
  admin?: boolean;
  payout?: boolean;
  isDefault?: boolean;
  trxMeta: Meta | null;
  children: React.ReactNode;
  accountID?: string;
  location?: string;
}

export const SingleAccountBody = ({
  account,
  transactions,
  loading,
  loadingTrx,
  setChartFrequency,
  business,
  admin,
  payout,
  isDefault,
  trxMeta,
  children,
  accountID,
  location,
}: SingleAccountProps) => {
  const info = {
    "Account Balance": formatNumber(account?.accountBalance ?? 0, true, "EUR"),
    "No. of Transaction": trxMeta?.total ?? 0,
    Currency: "EUR",
    ...(business && { "Created By": business?.name }),
    "Date Created": dayjs(account?.createdAt).format("Do MMMM, YYYY"),
    "Last Activity": dayjs(account?.updatedAt).format("Do MMMM, YYYY"),
    "Account Type": payout ? (
      <Text fw={600} fz={14} c="var(--prune-primary-800)">
        Payout Account
      </Text>
    ) : (
      getUserType(account?.type as "USER" | "CORPORATE")
    ),
  };

  const tabs = [
    { value: "Account Details" },
    { value: "Transactions" },
    { value: "Statistics" },
    { value: "Documents" },
  ];

  return (
    <Box mt={32}>
      <Grid>
        <GridCol span={!admin ? 8 : 9}>
          <SimpleGrid cols={!admin ? 3 : 4} verticalSpacing={28}>
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
          <AccountDetails account={account} loading={loading} />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <Transactions
            transactions={transactions}
            location={location ?? "admin-account"}
            loading={loadingTrx}
            payout={payout}
            meta={trxMeta}
            children={children}
            accountID={accountID}
          />
        </TabsPanel>
        <TabsPanel value={tabs[2].value} mt={28}>
          <Analytics
            transactions={transactions}
            setChartFrequency={setChartFrequency}
          />
        </TabsPanel>
        <TabsPanel value={tabs[3].value} mt={28}>
          <Documents account={account} admin={admin} />
        </TabsPanel>
      </TabsComponent>
    </Box>
  );
};

interface SingleDefaultAccountProps
  extends Omit<SingleAccountProps, "account"> {
  account: DefaultAccount | null;
  location?: string;
}

export const SingleDefaultAccountBody = ({
  account,
  transactions,
  loading,
  loadingTrx,
  setChartFrequency,
  business,
  admin,
  payout,
  isDefault,
  trxMeta,
  children,
  location,
}: SingleDefaultAccountProps) => {
  const info = {
    "Account Balance": formatNumber(account?.accountBalance ?? 0, true, "EUR"),
    "No. of Transaction": trxMeta?.total ?? 0,
    Currency: "EUR",
    ...(business && !payout && { "Created By": business?.name }),
    "Date Created": dayjs(account?.createdAt).format("Do MMMM, YYYY"),
    "Last Activity": dayjs(business?.lastLogin).format("Do MMMM, YYYY"),
    "Account Type": payout ? (
      <Text fw={600} fz={14} c="var(--prune-primary-800)">
        Payout Account
      </Text>
    ) : isDefault ? (
      "Main Account"
    ) : (
      getUserType(account?.type ?? "USER")
    ),
  };

  const tabs = [
    { value: "Account Details" },
    { value: "Transactions" },
    { value: "Statistics" },
    ...(!payout ? [{ value: "Documents" }] : []),
  ];

  return (
    <Box mt={32}>
      <Grid>
        <GridCol span={!admin ? 8 : 9}>
          <SimpleGrid cols={!admin ? 3 : 4} verticalSpacing={28}>
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
          <DefaultAccountDetails account={account} loading={loading} />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <Transactions
            accountID={account?.id}
            transactions={transactions}
            loading={loadingTrx}
            payout={payout}
            meta={trxMeta}
            children={children}
            location={location ?? "default"}
          />
        </TabsPanel>
        <TabsPanel value={tabs[2].value} mt={28}>
          <Analytics
            transactions={transactions}
            setChartFrequency={setChartFrequency}
          />
        </TabsPanel>
        {!payout && (
          <TabsPanel value={tabs[3].value} mt={28}>
            <DefaultDocuments account={account} isDefault={isDefault} />
          </TabsPanel>
        )}
      </TabsComponent>
    </Box>
  );
};

interface IssuedAccountHeadProps {
  loading: boolean;
  account: Account | null;
  open: () => void;
  openFreeze?: () => void;
  admin?: boolean;
  payout?: boolean;
}

export const IssuedAccountHead = ({
  loading,
  account,
  open,
  openFreeze,
  admin,
}: IssuedAccountHeadProps) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      className={styles.main__header}
    >
      <Group gap={12} align="center">
        {!loading ? (
          <Avatar
            variant="filled"
            size="lg"
            color="var(--prune-primary-700)"
          >{`${account?.firstName.charAt(0)}${account?.lastName.charAt(
            0
          )}`}</Avatar>
        ) : (
          <Skeleton circle h={50} w={50} />
        )}

        <Stack gap={2}>
          {!loading ? (
            <Text fz={24} className={styles.main__header__text} m={0} p={0}>
              {account?.accountName}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}

          {!loading ? (
            <Text
              fz={10}
              fw={400}
              className={styles.main__header__text}
              m={0}
              p={0}
            >
              {account?.accountNumber ?? ""}
            </Text>
          ) : (
            <Skeleton h={10} w={50} />
          )}
        </Stack>

        {!loading ? (
          <BadgeComponent status={account?.status ?? ""} active />
        ) : (
          <Skeleton w={60} h={10} />
        )}
      </Group>

      <Flex gap={10}>
        {!admin ? (
          <PrimaryBtn text="Debit Account" fw={600} action={open} />
        ) : (
          <SecondaryBtn
            action={() => {
              if (account?.status === "FROZEN") return open();
              openFreeze && openFreeze();
            }}
            loading={loading}
            loaderProps={{ type: "dots" }}
            text={
              account?.status === "FROZEN"
                ? "Unfreeze Account"
                : "Freeze Account"
            }
          />
        )}
      </Flex>
    </Flex>
  );
};

interface DefaultAccountHeadProps
  extends Omit<IssuedAccountHeadProps, "account"> {
  account: DefaultAccount | null;
  business: BusinessData | null;
  loadingBiz: boolean;
  revalidate?: () => void;
}

export interface RequestForm {
  amount: string;
  destinationIBAN: string;
  destinationBIC: string;
  destinationBank: string;
  bankAddress: string;
  destinationCountry: string;
  reference: string; // generated using crypto.randomUUID()
  firstName: string;
  lastName: string;
  invoice: string;
  narration: string;
}

export const DefaultAccountHead = ({
  loading,
  account,
  open,
  payout,
  business,
  loadingBiz,
  admin,
  revalidate,
}: DefaultAccountHeadProps) => {
  const [opened, { open: openMoney, close: closeMoney }] = useDisclosure(false);
  const [openedPreview, { open: openPreview, close: closePreview }] =
    useDisclosure(false);
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);
  const [openedTrust, { open: openTrust, close: closeTrust }] =
    useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [processingTrust, setProcessingTrust] = useState(false);
  const [sectionState, setSectionState] = useState("");
  const [moneySent, setMoneySent] = useState(0);
  const [receiverName, setReceiverName] = useState("");
  const axios = createAxiosInstance("payouts");

  const matches = useMediaQuery("(max-width: 768px)");

  const [requestForm, setRequestForm] = useState<RequestForm>({
    firstName: "",
    lastName: "",
    amount: "",
    destinationIBAN: "",
    destinationBIC: "",
    destinationBank: "",
    bankAddress: "",
    destinationCountry: "",
    reference: crypto.randomUUID(),
    invoice: "",
    narration: "",
  });

  const [companyRequestForm, setCompanyRequestForm] = useState({
    amount: "",
    companyName: "",
    destinationIBAN: "",
    destinationBIC: "",
    destinationBank: "",
    bankAddress: "",
    destinationCountry: "",
    invoice: "",
    reference: crypto.randomUUID(),
    narration: "",
  });

  const sendMoneyRequest = async () => {
    setProcessing(true);
    try {
      const {
        firstName,
        lastName,
        destinationIBAN,
        destinationBIC,
        destinationBank,
        bankAddress,
        destinationCountry,
        amount,
        invoice,
        narration,
      } = requestForm;

      const { data } = await axios.post(`/payout/send-money`, {
        amount,
        destinationIBAN,
        destinationBIC,
        destinationBank,
        bankAddress,
        destinationCountry,
        reference: crypto.randomUUID(),
        beneficiaryFullName: `${firstName} ${lastName}`,
        invoice,
        narration,
      });
      setMoneySent(Number(amount));
      setReceiverName(`${firstName} ${lastName}`);
      closePreview();
      openSuccess();
      // handleSuccess("Action Completed", "You have successfully sent money");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const sendMoneyCompanyRequest = async () => {
    setProcessing(true);
    try {
      const {
        companyName,
        destinationIBAN,
        destinationBIC,
        destinationBank,
        bankAddress,
        destinationCountry,
        amount,
        invoice,
        narration,
        reference,
      } = companyRequestForm;
      const { data } = await axios.post(`/payout/send-money`, {
        amount,
        destinationIBAN,
        destinationBIC,
        destinationBank,
        bankAddress,
        destinationCountry,
        reference: crypto.randomUUID(),
        beneficiaryFullName: companyName,
        invoice,
        narration,
      });
      setMoneySent(Number(amount));
      setReceiverName(companyName);
      closePreview();
      openSuccess();
      // handleSuccess("Action Completed", "You have successfully sent money");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
      close();
    }
  };

  const handleCloseSuccessModal = () => {
    // router.push("/admin/businesses");
    closeSuccess();
  };

  const handleAccountTrust = async () => {
    if (!account) return;
    setProcessingTrust(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/payout/account/${account?.id}/trust`,
        {
          isTrusted: account?.isTrusted ? false : true,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("auth")}` },
        }
      );
      revalidate && revalidate();
      handleSuccess(
        "Action Completed",
        `Payout account is ${account.isTrusted ? "untrusted" : "trusted"}`
      );
      closeTrust();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingTrust(false);
    }
  };

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        className={styles.main__header}
      >
        <Group gap={12} align="center">
          {!loading ? (
            <Avatar size="lg" color="var(--prune-primary-700)" variant="filled">
              {getInitials(account?.accountName ?? "")}
            </Avatar>
          ) : (
            <Skeleton circle h={50} w={50} />
          )}

          <Stack gap={2}>
            {!loading ? (
              <Group gap={5}>
                <Text fz={24} className={styles.main__header__text} m={0} p={0}>
                  {account?.accountName}
                </Text>

                {account?.isTrusted && (
                  <IconRosetteDiscountCheckFilled
                    size={25}
                    color="var(--prune-primary-700)"
                  />
                )}
              </Group>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {!loadingBiz ? (
              <Text
                fz={10}
                fw={400}
                className={styles.main__header__text}
                m={0}
                p={0}
              >
                {business?.contactEmail ?? ""}
              </Text>
            ) : (
              <Skeleton h={10} w={50} />
            )}
          </Stack>

          {!loading ? (
            <BadgeComponent status={account?.status ?? ""} active />
          ) : (
            <Skeleton w={60} h={10} />
          )}
        </Group>

        <Flex gap={10}>
          {!payout && !admin && (
            <PrimaryBtn text="Send Money" fw={600} action={openMoney} />
          )}
          {/* {!payout && <SecondaryBtn text="Freeze Account" fw={600} />} */}
          {payout && admin && (
            <Button
              onClick={openTrust}
              color="#f6f6f6"
              c="var(--prune-text-gray-700)"
              fz={12}
              fw={600}
              h={32}
              radius={4}
            >
              <Switch
                label={`${account?.isTrusted ? "Untrust" : "Trust"} this User`}
                checked={account?.isTrusted}
                onChange={(e) => {
                  openTrust();
                }}
                labelPosition="left"
                fz={12}
                size="xs"
                color="var(--prune-success-500)"
              />
            </Button>
          )}
        </Flex>
      </Flex>

      <OriginalModalComponent
        opened={openedTrust}
        close={closeTrust}
        title={`${account?.isTrusted ? "Untrust" : "Trust"} This User?`}
        text={`${
          account?.isTrusted
            ? "By untrusting this business, you're revoking their ability to automatically disburse funds from their Payout accounts."
            : "By trusting this business, you're granting them the ability to automatically disburse funds from their Payout accounts."
        }`}
        action={handleAccountTrust}
        customApproveMessage="Yes, Proceed"
        icon={
          account?.isTrusted ? (
            <IconExclamationCircle color="#C6A700" />
          ) : (
            <IconShieldCheck color="#12B76A" />
          )
        }
        processing={processingTrust}
        color={account?.isTrusted ? "#F9F6E6" : "#ECFDF3"}
      />

      <Modal
        opened={opened}
        onClose={closeMoney}
        size={matches ? "90%" : 630}
        withCloseButton={false}
      >
        <SendMoneyModal
          account={account}
          close={closeMoney}
          openPreview={openPreview}
          setRequestForm={setRequestForm}
          setCompanyRequestForm={setCompanyRequestForm}
          setSectionState={setSectionState}
        />
      </Modal>

      <Modal
        opened={openedPreview}
        onClose={closePreview}
        size={"35%"}
        centered
        withCloseButton={false}
      >
        <PreviewState
          requestForm={requestForm}
          account={account}
          closePreview={closePreview}
          sendMoneyRequest={sendMoneyRequest}
          processing={processing}
          sectionState={sectionState}
        />
      </Modal>

      <Modal
        opened={openedPreview}
        onClose={closePreview}
        size={"35%"}
        centered
        withCloseButton={false}
      >
        <PreviewState
          requestForm={requestForm}
          companyRequestForm={companyRequestForm}
          account={account}
          closePreview={closePreview}
          sendMoneyRequest={
            sectionState === "Company"
              ? sendMoneyCompanyRequest
              : sendMoneyRequest
          }
          processing={processing}
          sectionState={sectionState}
        />
      </Modal>

      <SuccessModal
        openedSuccess={openedSuccess}
        handleCloseSuccessModal={handleCloseSuccessModal}
        image={PendingModalImage.src}
        style={{ height: 120, width: 120, marginBottom: 10 }}
        desc={
          <Text fz={12}>
            Your transfer of{" "}
            <Text inherit span fw={600} c="#97AD05">
              {formatNumber(moneySent, true, "EUR")}
            </Text>{" "}
            to {receiverName} is in progress. It should be completed within the
            next 10 minutes. Please wait for confirm.
          </Text>
        }
        title="Transaction Processing"
      />
    </>
  );
};
