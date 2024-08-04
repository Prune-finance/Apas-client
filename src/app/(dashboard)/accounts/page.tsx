"use client";
import dayjs from "dayjs";

import React, { Suspense, useState } from "react";
import Image from "next/image";

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Modal,
  Paper,
  Select,
} from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { UnstyledButton, rem, Text, Pagination } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Flex, TableTh, TableThead } from "@mantine/core";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import {
  IconPointFilled,
  IconDots,
  IconEye,
  IconBrandLinktree,
  IconX,
  IconListTree,
  IconSearch,
  IconCheck,
  IconArrowDownLeft,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";

import ModalComponent from "./modal";
import { useAccounts, useUserAccounts } from "@/lib/hooks/accounts";
import { DynamicSkeleton, DynamicSkeleton2 } from "@/lib/static";
import { formatNumber } from "@/lib/utils";

import EmptyImage from "@/assets/empty.png";
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
import { z } from "zod";
import PaginationComponent from "@/ui/components/Pagination";

function Accounts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const {
    rows: srchRows = "10",
    status,
    createdAt,
    sort,
    type,
  } = Object.fromEntries(searchParams.entries());

  const { loading, accounts, revalidate, meta } = useUserAccounts({
    ...(!limit || isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type.toLowerCase() }),
    page: active,
  });

  const { handleSuccess } = useNotification();
  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [unfreezeOpened, { open: unfreezeOpen, close: unfreezeClose }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [debitOpened, { open: debitOpen, close: debitClose }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const form = useForm<AccountFilterType>({
    initialValues: { ...filterValues, type: null },
    validate: zodResolver(accountFilterSchema),
  });

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
        { withCredentials: true }
      );

      revalidate();
      handleSuccess("Action Completed", "Freeze request submitted");
      freezeClose();
      requestForm.reset();
    } catch (error) {
      console.log(error);
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
        { withCredentials: true }
      );

      requestForm.reset();
      revalidate();
      handleSuccess(
        "Action Completed",
        "Account Deactivation request submitted"
      );
      close();
    } catch (error) {
      console.log(error);
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
        { withCredentials: true }
      );

      requestForm.reset();
      revalidate();
      handleSuccess("Action Completed", "Account Activation request submitted");
      activateClose();
    } catch (error) {
      console.log(error);
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
        { withCredentials: true }
      );

      requestForm.reset();
      revalidate();
      handleSuccess("Action Completed", "Account Unfreeze request submitted");
      unfreezeClose();
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const MenuComponent = ({ id, status }: { id: string; status: string }) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          {/* <Link href={`/accounts/${id}`}>
            <MenuItem
              fz={10}
              c="#667085"
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
            >
              View
            </MenuItem>
          </Link> */}

          <MenuItem
            onClick={() => {
              setRowId(id);
              debitOpen();
            }}
            fz={10}
            c="#667085"
            leftSection={
              <IconArrowDownLeft style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Debit Account
          </MenuItem>

          <MenuItem
            onClick={() => {
              setRowId(id);
              if (status === "FROZEN") return unfreezeOpen();
              freezeOpen();
            }}
            fz={10}
            c="#667085"
            leftSection={
              <IconBrandLinktree style={{ width: rem(14), height: rem(14) }} />
            }
          >
            {status === "FROZEN" ? "Unfreeze" : "Freeze"}
          </MenuItem>

          <MenuItem
            onClick={() => {
              setRowId(id);
              if (status === "INACTIVE") return activateOpen();
              open();
            }}
            fz={10}
            c="#667085"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            {status === "INACTIVE" ? "Activate" : "Deactivate"}
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

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
        {element.accountName}
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
        {element.type.toLowerCase()}
      </TableTd>
      <TableTd
        onClick={() => router.push(`/accounts/${element.id}`)}
        className={styles.table__td}
      >
        {element.Company.name}
      </TableTd>
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
        <div
          className={styles.table__td__status}
          style={{
            // background: "#ECFDF3",
            background:
              element.status === "ACTIVE"
                ? "#ECFDF3"
                : element.status === "FROZEN"
                ? "#F2F4F7"
                : "#FEF3F2",
          }}
        >
          <IconPointFilled
            size={14}
            color={
              element.status === "ACTIVE"
                ? "#12B76A"
                : element.status === "FROZEN"
                ? "#344054"
                : "#D92D20"
            }
          />
          <Text
            tt="capitalize"
            fz={12}
            c={
              element.status === "ACTIVE"
                ? "#12B76A"
                : element.status === "FROZEN"
                ? "#344054"
                : "#D92D20"
            }
          >
            {element.status.toLowerCase()}
          </Text>
        </div>
      </TableTd>

      <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} status={element.status} />
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs items={[{ title: "Accounts", href: "/accounts" }]} /> */}

      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Accounts
          </Text>
        </div>

        <Group justify="space-between" mt={30}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            w={324}
            styles={{ input: { border: "1px solid #F5F5F5" } }}
          />

          <Button
            // className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
            fz={12}
            fw={500}
            onClick={toggle}
            variant="outline"
            c="var(--prune-text-gray-800)"
            color="var(--prune-text-gray-200)"
          >
            Filter
          </Button>
        </Group>

        <Filter opened={openedFilter} toggle={toggle} form={form}>
          <Select
            placeholder="Type"
            {...form.getInputProps("type")}
            data={["Corporate", "User"]}
            size="xs"
            w={120}
            h={36}
          />
        </Filter>

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>Account Name</TableTh>
                <TableTh className={styles.table__th}>Account Number</TableTh>
                <TableTh className={styles.table__th}>Account Balance</TableTh>
                <TableTh className={styles.table__th}>Type</TableTh>
                <TableTh className={styles.table__th}>Business</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                <TableTh className={styles.table__th}>Action</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? DynamicSkeleton2(8) : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no accounts.
            </Text>
            <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text>
          </Flex>
        )}

        <Modal
          size="xl"
          opened={debitOpened}
          onClose={debitClose}
          centered
          withCloseButton={false}
        >
          <DebitRequestModal close={debitClose} selectedId={rowId || ""} />
        </Modal>

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

      {/* <div className={styles.pagination__container}> */}
      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
      />
      {/* </div> */}
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
