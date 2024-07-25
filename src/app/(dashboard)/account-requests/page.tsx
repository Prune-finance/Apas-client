"use client";
import dayjs from "dayjs";

import Link from "next/link";
import Image from "next/image";

// Mantine Imports
import { useDisclosure } from "@mantine/hooks";
import { Menu, MenuDropdown, MenuItem, MenuTarget, Paper } from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { UnstyledButton, rem, Text, Pagination } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Checkbox, Flex, TableTh, TableThead } from "@mantine/core";

// Tabler Imports
import { IconPointFilled, IconDots, IconEye, IconX } from "@tabler/icons-react";
import { IconTrash, IconListTree, IconSearch } from "@tabler/icons-react";

// Lib Imports
import { useRequests, useUserRequests } from "@/lib/hooks/requests";
import { AllBusinessSkeleton, DynamicSkeleton } from "@/lib/static";

// UI Imports
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

// Asset Imports
import EmptyImage from "@/assets/empty.png";
import { useState } from "react";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";

export default function AccountRequests() {
  const searchParams = useSearchParams();

  const {
    rows: limit = "10",
    status,
    createdAt,
    sort,
  } = Object.fromEntries(searchParams.entries());

  const { loading, requests, revalidate } = useUserRequests({
    ...(isNaN(Number(limit)) ? { limit: 10 } : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
  });
  const { handleSuccess } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const [cancelOpened, { open: cancelOpen, close: cancelClose }] =
    useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const cancelRequest = async (id: string) => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/requests/${id}/cancel`,
        {},
        { withCredentials: true }
      );

      revalidate();
      handleSuccess("Action Completed", "Account frozen");
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
          {/* {status === "PENDING" && (
            <MenuItem
              onClick={() => {
                setRowId(id);
                cancelOpen();
              }}
              fz={10}
              c="#667085"
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Cancel Request
            </MenuItem>
          )} */}

          {/* <MenuItem
            onClick={open}
            fz={10}
            c="#667085"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Delete
          </MenuItem> */}
        </MenuDropdown>
      </Menu>
    );
  };

  const rows = requests.map((element, index) => (
    <TableTr key={index}>
      <TableTd className={styles.table__td}>
        <Checkbox />
      </TableTd>
      <TableTd
        className={styles.table__td}
      >{`${element.firstName} ${element.lastName}`}</TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {element.accountType.toLowerCase()}
      </TableTd>
      <TableTd className={styles.table__td}>{element.Company.name}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <div
          className={styles.table__td__status}
          style={{
            background:
              element.status === "PENDING"
                ? "#FFFAEB"
                : element.status === "REJECTED"
                ? "#FCF1F2"
                : element.status === "CANCELLED"
                ? "#F2F4F7"
                : "#ECFDF3",
          }}
        >
          <IconPointFilled
            size={14}
            color={
              element.status === "PENDING"
                ? "#C6A700"
                : element.status === "REJECTED"
                ? "#D92D20"
                : element.status === "CANCELLED"
                ? "#344054"
                : "#12B76A"
            }
          />
          <Text
            tt="capitalize"
            fz={12}
            c={
              element.status === "PENDING"
                ? "#C6A700"
                : element.status === "REJECTED"
                ? "#D92D20"
                : element.status === "CANCELLED"
                ? "#344054"
                : "#12B76A"
            }
          >
            {element.status.toLowerCase()}
          </Text>
        </div>
      </TableTd>
      {/* <TableTd>
        {element.}
      </TableTd> */}

      {/* <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} status={element.status} />
      </TableTd> */}
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      <Breadcrumbs items={[{ title: "Account Requests", href: "/accounts" }]} />

      <Paper withBorder className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Account Requests
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
            fz={12}
            fw={500}
            onClick={toggle}
          >
            Filter
          </Button>
        </div>

        <Filter<FilterType> opened={openedFilter} toggle={toggle} form={form} />

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>
                  <Checkbox />
                </TableTh>
                <TableTh className={styles.table__th}>Account Name</TableTh>
                <TableTh className={styles.table__th}>Type</TableTh>
                <TableTh className={styles.table__th}>Business</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                <TableTh className={styles.table__th}>Action</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? DynamicSkeleton(1) : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no account requests.
            </Text>
            <Text fz={10} c="#667085">
              When a request is created, it will appear here
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
      </Paper>

      <ModalComponent
        processing={processing}
        action={() => cancelRequest(rowId || "")}
        color="#F2F4F7"
        icon={<IconX color="#344054" />}
        opened={cancelOpened}
        close={cancelClose}
        title="Cancel Account Request?"
        text="You are about to cancel this account request"
      />

      <ModalComponent
        color="#FEF3F2"
        icon={<IconTrash color="#D92D20" />}
        opened={opened}
        close={close}
        title="Delete Account Request?"
        text="You are about to delete this account request"
      />
    </main>
  );
}
