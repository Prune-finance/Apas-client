"use client";
import dayjs from "dayjs";

import React, { Suspense, useMemo, useState } from "react";

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  Alert,
  Box,
  Flex,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  TabsPanel,
} from "@mantine/core";
import { Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

import styles from "./styles.module.scss";
import {
  IconBrandLinktree,
  IconX,
  IconCheck,
  IconUsers,
  IconExclamationCircle,
  IconListTree,
  IconInfoCircle,
} from "@tabler/icons-react";

import ModalComponent from "./modal";
import {
  useUserAccounts,
  useUserCurrencyAccount,
  useUserDefaultAccount,
} from "@/lib/hooks/accounts";
import { formatNumber, getUserType } from "@/lib/utils";

import useNotification from "@/lib/hooks/notification";
import { useForm, zodResolver } from "@mantine/form";
import { validateRequest } from "@/lib/schema";
import { FilterValues, FilterSchema, FilterType } from "@/lib/schema";
import { useRouter, useSearchParams } from "next/navigation";
import Filter from "@/ui/components/Filter";
import DebitRequestModal from "../debit-requests/new/modal";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import TabsComponent from "@/ui/components/Tabs";
import { parseError } from "@/lib/actions/auth";
import { PendingAccounts } from "./PendingAccounts";
import RequestModalComponent from "@/ui/components/Modal";
import createAxiosInstance from "@/lib/axios";
import { SendMoney } from "@/ui/components/SingleAccount/(tabs)/SendMoney";
import User from "@/lib/store/user";
import { useHasPermission } from "@/lib/hooks/checkPermission";
import AddAccount from "./AddAccount";
import SuccessModal from "@/ui/components/SuccessModal";
import PendingModalImage from "@/assets/add-account-success.png";

function Accounts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const axios = createAxiosInstance("accounts");

  const { status, date, endDate, accountName, accountNumber, type, tab } =
    Object.fromEntries(searchParams.entries());

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    accountName,
    accountNumber,
    status: status ? status.toUpperCase() : "",
    type: type ? (type === "Individual" ? "USER" : "CORPORATE") : "",
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  };

  const {
    loading,
    accounts,
    revalidate,
    meta,
    statusLoading,
    issuanceRequests,
    revalidateIssuance,
  } = useUserAccounts(queryParams);

  const {
    account,
    loading: loadingDftAcct,
    revalidate: revalidateDftAcct,
  } = useUserDefaultAccount();

  const { currencyAccount, loading: currencyLoading } =
    useUserCurrencyAccount();

  const { handleSuccess, handleError } = useNotification();
  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [unfreezeOpened, { open: unfreezeOpen, close: unfreezeClose }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [debitOpened, { open: debitOpen, close: debitClose }] =
    useDisclosure(false);
  const [sendMoneyOpened, { open: sendMoneyOpen, close: sendMoneyClose }] =
    useDisclosure(false);
  const [
    requestAccessOpened,
    { open: requestAccessOpen, close: requestAccessClose },
  ] = useDisclosure(false);

  const [addAccountOpened, { open: addAccountOpen, close: addAccountClose }] =
    useDisclosure(false);

  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const isInitiator = useHasPermission("INITIATOR");
  const canSendMoney =
    useHasPermission("Transaction Initiation") || isInitiator;

  const { user } = User();
  const stage =
    typeof window !== "undefined"
      ? window.localStorage.getItem("stage")
      : "TEST";

  const [openedAlert, { open: openAlert, close: closeAlert }] =
    useDisclosure(true);

  const form = useForm<FilterType>({
    initialValues: { ...FilterValues, type: null },
    validate: zodResolver(FilterSchema),
  });

  const { pendingRequest, approvedRequest } = useMemo(() => {
    const hasPending = (issuanceRequests ?? []).some(
      (request) => request.status === "PENDING"
    );
    const hasApproved = (issuanceRequests ?? []).some(
      (request) => request.status === "APPROVED"
    );

    return { pendingRequest: hasPending, approvedRequest: hasApproved };
  }, [issuanceRequests]);

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const freezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      const { hasErrors } = requestForm.validate();
      if (hasErrors) return;
      await axios.patch(`/accounts/${id}/freeze`, {
        reason,
        ...(supportingDocumentName && { supportingDocumentName }),
        ...(supportingDocumentUrl && { supportingDocumentUrl }),
      });

      revalidate();
      handleSuccess("Action Completed", "Freeze request submitted");
      freezeClose();
      requestForm.reset();
    } catch (error) {
      handleError("Freeze Request Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const deactivateAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      const { hasErrors } = requestForm.validate();
      if (hasErrors) return;

      await axios.patch(`/accounts/${id}/deactivate`, {
        reason,
        ...(supportingDocumentName && { supportingDocumentName }),
        ...(supportingDocumentUrl && { supportingDocumentUrl }),
      });

      requestForm.reset();
      revalidate();
      handleSuccess(
        "Action Completed",
        "Account Deactivation request submitted"
      );
      close();
    } catch (error) {
      handleError("Deactivation Request Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const activateAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      const { hasErrors } = requestForm.validate();
      if (hasErrors) return;

      await axios.patch(`/accounts/${id}/activate`, {
        reason,
        ...(supportingDocumentName && { supportingDocumentName }),
        ...(supportingDocumentUrl && { supportingDocumentUrl }),
      });

      requestForm.reset();
      revalidate();
      handleSuccess("Action Completed", "Account Activation request submitted");
      activateClose();
    } catch (error) {
      handleError("Activation Request Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const unfreezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      const { hasErrors } = requestForm.validate();
      if (hasErrors) return;

      await axios.patch(`/accounts/${id}/unfreeze`, {
        reason,
        ...(supportingDocumentName && { supportingDocumentName }),
        ...(supportingDocumentUrl && { supportingDocumentUrl }),
      });

      requestForm.reset();
      revalidate();
      handleSuccess("Action Completed", "Account Unfreeze request submitted");
      unfreezeClose();
    } catch (error) {
      handleError("Unfreeze Request Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseSuccessModal = () => {
    closeSuccess();
  };

  const rows = (accounts ?? []).map((element, index) => (
    <TableTr key={index} style={{ cursor: "pointer" }}>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
        tt="capitalize"
      >
        {/* {`${element.accountName}`}{" "} */}
        <Text fz={12} inline tt="capitalize">
          {element.accountName}

          <Text span inherit fz={12} c="#c6a700" fw={600}>
            {element.staging === "TEST" ? " (TEST)" : ""}
          </Text>
        </Text>
      </TableTd>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
      >
        {element.accountNumber}
      </TableTd>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
      >
        {formatNumber(element.accountBalance, true, "EUR")}
      </TableTd>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
        tt="capitalize"
      >
        {getUserType(element.type ?? "USER")}
      </TableTd>
      {/* <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
      >
        {element.Company.name}
      </TableTd> */}
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={`${styles.table__td}`}
      >
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
      >
        <BadgeComponent status={element.status} active />
      </TableTd>

      {/* <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} status={element.status} />
      </TableTd> */}
    </TableTr>
  ));

  const handleRequestAccess = async () => {
    setProcessing(true);
    try {
      await axios.get(`/accounts/account-issuance`);
      handleSuccess(
        "Request Sent",
        "You will receive as notification once your request has been approved"
      );
      revalidateIssuance();
      requestAccessClose();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs items={[{ title: "Accounts", href: "/accounts" }]} /> */}

      <Paper className={styles.table__container}>
        <Flex justify="space-between" align="center">
          <div>
            <Text fz={18} fw={600}>
              Accounts
            </Text>
            <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
              Here’s an overview of your accounts
            </Text>
          </div>

          <Flex align="center" gap={16}>
            {/* <SecondaryBtn
              text="Create Account"
              action={addAccountOpen}
              fw={600}
            /> */}

            <PrimaryBtn
              text={tab === tabs[1].value ? "Debit Request" : "Send Money"}
              fw={600}
              action={tab === tabs[1].value ? debitOpen : sendMoneyOpen}
              display={
                tab === tabs[1].value || (tab !== tabs[1].value && canSendMoney)
                  ? "block"
                  : "none"
              }
            />
          </Flex>
        </Flex>

        <TabsComponent
          tabs={tabs}
          mt={32}
          defaultValue={
            tabs.find((_tab) => _tab.value === tab)?.value ?? tabs[0].value
          }
          onChange={(value) => {
            window.history.pushState({}, "", "?tab=" + value);
          }}
        >
          <TabsPanel value={tabs[0].value}>
            <SimpleGrid cols={3} mt={32}>
              <AccountCard
                balance={account?.accountBalance ?? 0}
                currency="EUR"
                companyName={account?.accountName ?? "No Default Account"}
                iban={account?.accountNumber ?? "No Default Account"}
                bic={"ARPYGB21XXX"}
                loading={loadingDftAcct}
                link={`/accounts/default`}
                business={false}
                refresh
                revalidate={revalidateDftAcct}
              />

              <NewAccountCard
                currency={"EUR"}
                companyName={account?.accountName ?? "No Default Account"}
                link={`/accounts/default`}
                iban={account?.accountNumber ?? "No Default Account"}
                bic={"ARPYGB21XXX"}
                balance={account?.accountBalance ?? 0}
                loading={loadingDftAcct}
                business={false}
                refresh
                revalidate={revalidateDftAcct}
              />

              {currencyAccount &&
                currencyAccount?.length > 0 &&
                currencyAccount?.map((data) => (
                  <NewAccountCard
                    key={data?.id}
                    currency={data?.AccountRequests?.Currency?.symbol}
                    companyName={data?.accountName ?? "No Default Account"}
                    link={`/accounts/default/${data?.id}`}
                    sortCode="041719"
                    accountNumber={data?.accountNumber}
                    balance={data?.accountBalance ?? 0}
                    loading={currencyLoading}
                    business={false}
                    refresh
                    revalidate={revalidateDftAcct}
                  />
                ))}

              {currencyLoading && (
                <NewAccountCard
                  key="1"
                  currency={"GBP"}
                  companyName={""}
                  link={`/accounts/default/`}
                  sortCode=""
                  accountNumber={""}
                  balance={0}
                  loading={currencyLoading}
                  business={false}
                  refresh
                  revalidate={revalidateDftAcct}
                />
              )}
            </SimpleGrid>
          </TabsPanel>

          <TabsPanel value={tabs[1].value}>
            {stage !== "LIVE" &&
              !statusLoading &&
              !approvedRequest &&
              openedAlert && (
                <Alert
                  variant="light"
                  color="#D1B933"
                  mb={28}
                  mt={30}
                  radius={8}
                  style={{ border: "1px solid #D1B933" }}
                  withCloseButton
                  onClose={closeAlert}
                  icon={<IconInfoCircle />}
                  title="Please know that you are in test mode. To go live, request for Live keys by clicking the “request live keys” button below."
                ></Alert>
              )}
            <TabsComponent
              tabs={issuedAccountTabs}
              mt={30}
              tt="capitalize"
              fz={12}
              style={{ position: "relative" }}
            >
              <TabsPanel value={issuedAccountTabs[0].value}>
                <Group justify="space-between" mt={30}>
                  <SearchInput search={search} setSearch={setSearch} />

                  <SecondaryBtn
                    text="Filter"
                    action={toggle}
                    icon={IconListTree}
                    fw={600}
                  />
                </Group>

                <Filter<FilterType>
                  opened={openedFilter}
                  toggle={toggle}
                  form={form}
                >
                  <TextBox
                    placeholder="Account Name"
                    {...form.getInputProps("accountName")}
                  />

                  <TextBox
                    placeholder="Account Number"
                    {...form.getInputProps("accountNumber")}
                  />

                  <SelectBox
                    placeholder="Type"
                    {...form.getInputProps("type")}
                    data={["Corporate", "Individual"]}
                    clearable
                  />
                </Filter>

                <TableComponent
                  head={tableHeaders}
                  rows={rows}
                  loading={loading}
                />

                <EmptyTable
                  rows={rows}
                  loading={loading}
                  title="There are no accounts"
                  text="When an account is created, it will appear here"
                />

                <PaginationComponent
                  total={Math.ceil(
                    (meta?.total ?? 0) / parseInt(limit ?? "10", 10)
                  )}
                  active={active}
                  setActive={setActive}
                  limit={limit}
                  setLimit={setLimit}
                />
              </TabsPanel>

              <TabsPanel value={issuedAccountTabs[1].value}>
                <PendingAccounts />
              </TabsPanel>

              {!statusLoading && !approvedRequest && (
                <Box pos="absolute" top={-10} right={0}>
                  <PrimaryBtn
                    text={
                      pendingRequest ? "Request Sent ✓" : "Request Live Keys"
                    }
                    fw={600}
                    action={requestAccessOpen}
                    disabled={pendingRequest || statusLoading}
                  />
                </Box>
              )}
            </TabsComponent>
          </TabsPanel>
        </TabsComponent>

        <Modal
          opened={addAccountOpened}
          onClose={addAccountClose}
          centered
          size={460}
          padding={30}
        >
          <AddAccount onClose={addAccountClose} openSuccess={openSuccess} />
        </Modal>

        <SuccessModal
          size={460}
          openedSuccess={openedSuccess}
          handleCloseSuccessModal={handleCloseSuccessModal}
          image={PendingModalImage.src}
          style={{ height: 190, width: "100%", marginBottom: 10 }}
          desc={
            <Text fz={14} c="#667085">
              You have successfully requested a naira account.
            </Text>
          }
          title="Account Requested Successfully."
        />

        <SendMoney
          opened={sendMoneyOpened}
          closeMoney={sendMoneyClose}
          openSendMoney={sendMoneyOpen}
        />

        <Modal
          size="xl"
          opened={debitOpened}
          onClose={debitClose}
          centered
          withCloseButton={false}
        >
          <DebitRequestModal
            close={debitClose}
            selectedId={rowId || ""}
            accountsData={accounts || []}
          />
        </Modal>

        <RequestModalComponent
          processing={processing}
          color="#f9f6e6"
          action={handleRequestAccess}
          icon={<IconExclamationCircle color="#c6a700" />}
          opened={requestAccessOpened}
          close={requestAccessClose}
          title="Requesting Access"
          text="This means that all the data in your test environment will be cleared and you would have access to your Live Keys"
          customApproveMessage="Yes, Proceed"
        />

        <ModalComponent
          processing={processing}
          action={() => freezeAccount(rowId || "")}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={freezeOpened}
          close={freezeClose}
          title="Freeze this Account?"
          form={requestForm}
          text="You are about to request for this account to be frozen. This means no activity can be carried out in the account anymore. Please state your reason below"
        />

        <ModalComponent
          processing={processing}
          action={() => unfreezeAccount(rowId || "")}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={unfreezeOpened}
          close={unfreezeClose}
          form={requestForm}
          title="Unfreeze this Account?"
          text="You are about to request for this account to be unfrozen. This means full activity can be carried out in the account again. Please state your reason below"
        />

        <ModalComponent
          processing={processing}
          action={() => deactivateAccount(rowId || "")}
          color="#FEF3F2"
          icon={<IconX color="#D92D20" />}
          opened={opened}
          close={close}
          form={requestForm}
          title="Deactivate This Account?"
          text="You are about to request for this account to be deactivated. This means the account will be inactive. Please state your reason below"
        />

        <ModalComponent
          processing={processing}
          action={() => activateAccount(rowId || "")}
          color="#ECFDF3"
          icon={<IconCheck color="#12B76A" />}
          opened={activateOpened}
          close={activateClose}
          form={requestForm}
          title="Activate This Account?"
          text="You are about to request for this account to be activated. This means the account will become active. Please state your reason below"
        />
      </Paper>
    </main>
  );
}

export default function AccountSuspense() {
  return (
    <Suspense>
      <Accounts />
    </Suspense>
  );
}

const tableHeaders = [
  "Account Name",
  "IBAN",
  "Account Balance",
  "Account Type",
  // "Business",
  "Date Created",
  "Status",
  // "Action",
];

const tabs = [{ value: "Own Account" }, { value: "Issued Accounts" }];

const issuedAccountTabs = [
  { value: "All Accounts", icon: <IconUsers size={14} /> },
  { value: "Pending Accounts", icon: <IconUsers size={14} /> },
];
