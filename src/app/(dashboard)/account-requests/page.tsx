"use client";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import Link from "next/link";
import Image from "next/image";

// Mantine Imports
import { useDisclosure } from "@mantine/hooks";
import {
  Badge,
  Box,
  Divider,
  Drawer,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Paper,
  Stack,
} from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { UnstyledButton, rem, Text, Pagination } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Checkbox, Flex, TableTh, TableThead } from "@mantine/core";

// Tabler Imports
import {
  IconPointFilled,
  IconDots,
  IconEye,
  IconX,
  IconPdf,
} from "@tabler/icons-react";
import { IconTrash, IconListTree, IconSearch } from "@tabler/icons-react";

// Lib Imports
import {
  RequestData,
  useRequests,
  useUserRequests,
} from "@/lib/hooks/requests";
import {
  AllBusinessSkeleton,
  DynamicSkeleton,
  DynamicSkeleton2,
} from "@/lib/static";

// UI Imports
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import ModalComponent from "@/ui/components/Modal";
import styles from "./styles.module.scss";

// Asset Imports
import EmptyImage from "@/assets/empty.png";
import { Suspense, useState } from "react";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import { useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { activeBadgeColor, approvedBadgeColor } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";

function AccountRequests() {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );

  const { loading, requests, revalidate, meta } = useUserRequests({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });
  const { handleSuccess } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const [cancelOpened, { open: cancelOpen, close: cancelClose }] =
    useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

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

  const rows = requests.map((element, index) => (
    <TableTr
      style={{ cursor: "pointer" }}
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
    >
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
        <BadgeComponent status={element.status} />
      </TableTd>
      {/* <TableTd>
        {element.}
      </TableTd> */}

      {/* <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} status={element.status} />
      </TableTd> */}
    </TableTr>
  ));

  const accountDetails = [
    {
      label: "Account Name",
      value: `${selectedRequest?.firstName ?? ""} ${
        selectedRequest?.lastName ?? ""
      }`,
    },
    {
      label: "Country",
      value: selectedRequest?.Company.country,
    },
    { label: "Account Type", value: selectedRequest?.accountType },
    {
      label: "Date Created",
      value: dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    },
    { label: "Status", value: selectedRequest?.status },
  ];

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/dashboard" },
          { title: "Account Requests", href: "/accounts" },
        ]}
      /> */}

      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Account Requests
          </Text>
        </div>

        <Group justify="space-between" mt={30}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
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

        <Filter<FilterType> opened={openedFilter} toggle={toggle} form={form} />

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>Account Name</TableTh>
                <TableTh className={styles.table__th}>Type</TableTh>
                <TableTh className={styles.table__th}>Business</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                {/* <TableTh className={styles.table__th}>Action</TableTh> */}
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? DynamicSkeleton2(5) : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no account requests"
          text="When a request is created, it will appear here"
        />

        <PaginationComponent
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
          active={active}
          setActive={setActive}
          limit={limit}
          setLimit={setLimit}
        />
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

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        withCloseButton={false}
        size="30%"
      >
        <Flex justify="space-between" pb={28}>
          <Text fz={18} fw={600} c="#1D2939">
            Account Request Details
          </Text>

          <IconX onClick={closeDrawer} />
        </Flex>

        <Box>
          <Divider mb={20} />

          <Text fz={16} mb={24}>
            Account Details
          </Text>

          <Stack gap={28}>
            {accountDetails.map((item, index) => (
              <Group justify="space-between" key={index}>
                <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                  {item.label}
                </Text>
                {item.label !== "Status" ? (
                  <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
                    {item.value}
                  </Text>
                ) : (
                  <Badge
                    tt="capitalize"
                    variant="light"
                    color={approvedBadgeColor(item.value || "")}
                    w={90}
                    h={24}
                    fw={400}
                    fz={12}
                  >
                    {item.value}
                  </Badge>
                )}
              </Group>
            ))}
          </Stack>

          <Divider mt={30} mb={20} />

          <Text fz={16} mb={24}>
            Supporting Documents
          </Text>

          {selectedRequest?.accountType === "USER" && (
            <Stack gap={28}>
              <TextInput
                readOnly
                classNames={{
                  input: styles.input,
                  label: styles.label,
                  section: styles.section,
                  root: styles.input__root2,
                }}
                leftSection={<IconPdf />}
                leftSectionPointerEvents="none"
                rightSection={
                  <UnstyledButton
                    onClick={() =>
                      window.open(
                        selectedRequest.documentData.idFileUrl || "",
                        "_blank"
                      )
                    }
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="##475467">
                      View
                    </Text>
                  </UnstyledButton>
                }
                label="ID"
                placeholder={`Identification card`}
              />

              <TextInput
                readOnly
                classNames={{
                  input: styles.input,
                  label: styles.label,
                  section: styles.section,
                  root: styles.input__root2,
                }}
                leftSection={<IconPdf />}
                leftSectionPointerEvents="none"
                rightSection={
                  <UnstyledButton
                    onClick={() =>
                      window.open(
                        selectedRequest.documentData.poaFileUrl || "",
                        "_blank"
                      )
                    }
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="##475467">
                      View
                    </Text>
                  </UnstyledButton>
                }
                label="Proof of Address"
                placeholder={`Utility Bill`}
              />
            </Stack>
          )}
        </Box>
      </Drawer>
    </main>
  );
}

export default function AccountRequestsSus() {
  return (
    <Suspense>
      <AccountRequests />
    </Suspense>
  );
}
