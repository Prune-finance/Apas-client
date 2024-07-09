"use client";
import dayjs from "dayjs";

import React, { useState } from "react";
import Image from "next/image";

// Mantine Imports
import { useDisclosure } from "@mantine/hooks";
import { Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { UnstyledButton, rem, Text, Pagination } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Checkbox, Flex, TableTh, TableThead } from "@mantine/core";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";
import {
  IconPointFilled,
  IconDots,
  IconEye,
  IconBrandLinktree,
  IconX,
  IconTrash,
  IconListTree,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

import ModalComponent from "@/ui/components/Modal";
import { useAccounts } from "@/lib/hooks/accounts";
import { DynamicSkeleton } from "@/lib/static";
import { formatNumber } from "@/lib/utils";

import EmptyImage from "@/assets/empty.png";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";

export default function Accounts() {
  const { loading, accounts, revalidate } = useAccounts();
  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const { handleError } = useNotification();

  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const freezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/freeze`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const deactivateAccount = async (id: string) => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/deactivate`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const unfreezeAccount = async (id: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/unfreeze`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
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
          <Link href={`/admin/accounts/${id}`}>
            <MenuItem
              fz={10}
              c="#667085"
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
            >
              View
            </MenuItem>
          </Link>

          <MenuItem
            onClick={() => {
              setRowId(id);
              freezeOpen();
            }}
            fz={10}
            c="#667085"
            leftSection={
              <IconBrandLinktree style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Freeze
          </MenuItem>

          <MenuItem
            onClick={open}
            fz={10}
            c="#667085"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Deactivate
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  const rows = accounts.map((element, index) => (
    <TableTr key={index}>
      <TableTd className={styles.table__td}>
        <Checkbox />
      </TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {element.accountName}
      </TableTd>
      <TableTd className={styles.table__td}>{element.accountNumber}</TableTd>
      <TableTd className={styles.table__td}>
        {formatNumber(element.accountBalance, true, "EUR")}
      </TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {element.type.toLowerCase()}
      </TableTd>
      <TableTd className={styles.table__td}>{element.Company.name}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
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
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Accounts", href: "/admin/accounts" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Accounts
          </Text>
        </div>

        <div className={styles.container__search__filter}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            classNames={{ wrapper: styles.search, input: styles.input__search }}
          />

          <Button
            className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
          >
            <Text fz={12} fw={500}>
              Filter
            </Text>
          </Button>
        </div>

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>
                  <Checkbox />
                </TableTh>
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
            <TableTbody>{loading ? DynamicSkeleton(3) : rows}</TableTbody>
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

        <div className={styles.pagination__container}>
          <Text fz={14}>Rows: {rows.length}</Text>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>

        <ModalComponent
          processing={processing}
          action={() => freezeAccount(rowId || "")}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={freezeOpened}
          close={freezeClose}
          title="Freeze this Account?"
          text="You are about to freeze this account.This means no activity can be carried out in the account anymore."
        />

        <ModalComponent
          processing={processing}
          action={() => deactivateAccount(rowId || "")}
          color="#FEF3F2"
          icon={<IconX color="#D92D20" />}
          opened={opened}
          close={close}
          title="Deactivate This Account?"
          text="You are about to deactivate this account.This means the account will be inactive."
        />
      </div>
    </main>
  );
}
