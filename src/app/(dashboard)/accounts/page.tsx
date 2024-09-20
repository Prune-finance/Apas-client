"use client";
import dayjs from "dayjs";
import Cookies from "js-cookie";

import React, { Suspense, useMemo, useState } from "react";

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  TabsPanel,
} from "@mantine/core";
import { UnstyledButton, rem, Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

import styles from "./styles.module.scss";
import {
  IconDots,
  IconBrandLinktree,
  IconX,
  IconSearch,
  IconCheck,
  IconArrowDownLeft,
  IconTrash,
  IconUsers,
  IconExclamationCircle,
} from "@tabler/icons-react";

import ModalComponent from "./modal";
import { useUserAccounts, useUserDefaultAccount } from "@/lib/hooks/accounts";
import { formatNumber, getUserType } from "@/lib/utils";

import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { useForm, zodResolver } from "@mantine/form";
import { filterValues, validateRequest } from "@/lib/schema";
import { accountFilterSchema } from "@/app/admin/(dashboard)/account-requests/schema";
import { AccountFilterType } from "@/app/admin/(dashboard)/accounts/schema";
import { useRouter, useSearchParams } from "next/navigation";
import Filter from "@/ui/components/Filter";
import { filteredSearch } from "@/lib/search";
import DebitRequestModal from "../debit-requests/new/modal";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import TabsComponent from "@/ui/components/Tabs";
import { AccountCard } from "@/ui/components/Cards/AccountCard";
import { parseError } from "@/lib/actions/auth";
import { PendingAccounts } from "./PendingAccounts";
import RequestModalComponent from "@/ui/components/Modal";

function Accounts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { status, createdAt, sort, type, tab } = Object.fromEntries(
    searchParams.entries()
  );

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const {
    loading,
    accounts,
    revalidate,
    meta,
    statusLoading,
    issuanceRequests,
    revalidateIssuance,
  } = useUserAccounts({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type === "Individual" ? "USER" : "CORPORATE" }),
    page: active,
  });

  const { account, loading: loadingDftAcct } = useUserDefaultAccount();

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
  const [
    requestAccessOpened,
    { open: requestAccessOpen, close: requestAccessClose },
  ] = useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const form = useForm<AccountFilterType>({
    initialValues: { ...filterValues, type: null },
    validate: zodResolver(accountFilterSchema),
  });

  const { pendingRequest, approvedRequest } = useMemo(() => {
    const hasPending = issuanceRequests.some(
      (request) => request.status === "PENDING"
    );
    const hasApproved = issuanceRequests.some(
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/freeze`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

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

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/deactivate`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

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

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/activate`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

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

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/unfreeze`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

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

  // const MenuComponent = ({ id, status }: { id: string; status: string }) => {
  //   return (
  //     <Menu shadow="md" width={150}>
  //       <MenuTarget>
  //         <UnstyledButton>
  //           <IconDots size={17} />
  //         </UnstyledButton>
  //       </MenuTarget>

  //       <MenuDropdown>
  //         {/* <Link href={`/accounts/${id}`}>
  //           <MenuItem
  //             fz={10}
  //             c="#667085"
  //             leftSection={
  //               <IconEye style={{ width: rem(14), height: rem(14) }} />
  //             }
  //           >
  //             View
  //           </MenuItem>
  //         </Link> */}

  //         {status === "ACTIVE" && (
  //           <MenuItem
  //             onClick={() => {
  //               setRowId(id);
  //               debitOpen();
  //             }}
  //             fz={10}
  //             c="#667085"
  //             leftSection={
  //               <IconArrowDownLeft
  //                 style={{ width: rem(14), height: rem(14) }}
  //               />
  //             }
  //           >
  //             Debit Account
  //           </MenuItem>
  //         )}

  //         <MenuItem
  //           onClick={() => {
  //             setRowId(id);
  //             if (status === "FROZEN") return unfreezeOpen();
  //             freezeOpen();
  //           }}
  //           fz={10}
  //           c="#667085"
  //           leftSection={
  //             <IconBrandLinktree style={{ width: rem(14), height: rem(14) }} />
  //           }
  //         >
  //           {status === "FROZEN" ? "Unfreeze" : "Freeze"}
  //         </MenuItem>

  //         <MenuItem
  //           onClick={() => {
  //             setRowId(id);
  //             if (status === "INACTIVE") return activateOpen();
  //             open();
  //           }}
  //           fz={10}
  //           c="#667085"
  //           leftSection={
  //             <IconTrash style={{ width: rem(14), height: rem(14) }} />
  //           }
  //         >
  //           {status === "INACTIVE" ? "Activate" : "Deactivate"}
  //         </MenuItem>
  //       </MenuDropdown>
  //     </Menu>
  //   );
  // };

  const rows = filteredSearch(
    accounts,
    ["accountName", "accountNumber", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr key={index} style={{ cursor: "pointer" }}>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
        tt="capitalize"
      >
        {/* {`${element.accountName}`}{" "} */}
        <Text fz={12} inline>
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
      await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/account-issuance`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
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
        <div
        // className={styles.container__header}
        >
          <Text fz={18} fw={600}>
            Accounts
          </Text>
          <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
            Here’s an overview of your accounts
          </Text>
        </div>

        <TabsComponent
          tabs={tabs}
          mt={32}
          defaultValue={
            tabs.find((_tab) => _tab.value === tab)?.value ?? tabs[0].value
          }
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
              />
            </SimpleGrid>
          </TabsPanel>

          <TabsPanel value={tabs[1].value}>
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

                  <SecondaryBtn text="Filter" action={toggle} />
                </Group>

                <Filter opened={openedFilter} toggle={toggle} form={form}>
                  <Select
                    placeholder="Type"
                    {...form.getInputProps("type")}
                    data={["Corporate", "Individual"]}
                    size="xs"
                    w={120}
                    h={36}
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
                    text={pendingRequest ? "Request Sent ✓" : "Request Access"}
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
          size="xl"
          opened={debitOpened}
          onClose={debitClose}
          centered
          withCloseButton={false}
        >
          <DebitRequestModal
            close={debitClose}
            selectedId={rowId || ""}
            accountsData={accounts}
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
