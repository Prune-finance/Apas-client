"use client";

import { Fragment, Suspense } from "react";

import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";

import Image from "next/image";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import {
  Badge,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Paper,
  Select,
  Skeleton,
  TableTd,
} from "@mantine/core";
import { Flex, Box, Divider, Button, TextInput } from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { TableTr, Pagination } from "@mantine/core";

import {
  IconArrowLeft,
  IconDots,
  IconEye,
  IconUserCheck,
} from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconListTree } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

import EmptyImage from "@/assets/empty.png";

import { approvedBadgeColor, formatNumber } from "@/lib/utils";
import {
  DebitRequest,
  IUserRequest,
  RequestData,
  useCompanyRequests,
  useDebitRequests,
} from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useForm, zodResolver } from "@mantine/form";
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../businesses/schema";
import Filter from "@/ui/components/Filter";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import PaginationComponent from "@/ui/components/Pagination";
import EmptyTable from "@/ui/components/EmptyTable";

function BusinessDebit() {
  const searchParams = useSearchParams();
  const params = useParams<{ slug?: string[] }>();
  const [id, tab] = params.slug ?? [];

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );
  const { handleError, handleSuccess } = useNotification();

  const [limit, setLimit] = useState<string | null>("10");
  const [active, setActive] = useState(1);

  const { loading, requests, revalidate, meta } = useCompanyRequests(
    {
      ...(isNaN(Number(limit))
        ? { limit: 10 }
        : { limit: parseInt(limit ?? "10", 10) }),
      ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
      ...(status && { status: status.toLowerCase() }),
      ...(sort && { sort: sort.toLowerCase() }),
      type: tab.toUpperCase(),
      page: active,
    },
    id,
    tab.toLowerCase() !== "debit"
  );
  const { push, back } = useRouter();
  const [selectedRequest, setSelectedRequest] = useState<IUserRequest | null>(
    null
  );
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/reject`,
        {},
        { withCredentials: true }
      );

      await revalidate();
      close();
      closeDrawer();
      handleSuccess("Action Completed", "Request Denied");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/approve`,
        {},
        { withCredentials: true }
      );

      await revalidate();
      closeApprove();
      closeDrawer();
      handleSuccess("Action Completed", "Request Approved");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const MenuComponent = ({ request }: { request: IUserRequest }) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <MenuItem
            // onClick={() => {
            //   setSelectedRequest(request);
            //   openDrawer();
            // }}
            fz={10}
            c="#667085"
            leftSection={
              <IconUserCheck
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Approve
          </MenuItem>
          <MenuItem
            // onClick={() => {
            //   setSelectedRequest(request);
            //   openDrawer();
            // }}
            fz={10}
            c="#667085"
            leftSection={
              <IconUserCheck
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Deny
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  const handleRowClick = (id: string) => {
    push(`/admin/requests/${id}/debit`);
  };

  const rows = filteredSearch(
    requests,
    ["Company.name", "firstName", "lastName"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      // onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{element.Company.name}</TableTd>
      {/* <TableTd className={styles.table__td}>{element.amount}</TableTd>
      <TableTd className={styles.table__td}>
        {`${element.Account.Company.name
          .toLowerCase()
          .split(" ")
          .join("")}@example.com`}
      </TableTd> */}
      <TableTd>
        {dayjs(element.createdAt).format("DD, MMM, YYYY - hh:mm A")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        <Badge
          tt="capitalize"
          variant="light"
          color={approvedBadgeColor(element.status)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>

      <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuComponent request={element} />
      </TableTd>
    </TableTr>
  ));

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "All Requests", href: "/admin/requests" },
          { title: tab, href: `/admin/requests/${id}/${tab}` },
        ]}
      />
      <div className={styles.table__container}>
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
          //   style={{ pointerEvents: !account ? "none" : "auto" }}
        >
          Back
        </Button>

        {!loading ? (
          <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
            {requests[0].Company.name}
          </Text>
        ) : (
          <Skeleton h={10} w={100} />
        )}

        <div className={`${styles.container__search__filter}`}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <Button
            // className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
            fz={12}
            fw={500}
            variant="default"
            onClick={toggle}
          >
            Filter
          </Button>
        </div>

        <Filter<BusinessFilterType>
          opened={openedFilter}
          toggle={toggle}
          form={form}
        />

        <TableComponent head={tableHeaders} rows={rows} loading={loading} />

        <EmptyTable
          loading={loading}
          rows={rows}
          title="There are no request"
          text="When a request is created, it will appear here"
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
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
              Request Details
            </Text>

            <IconX onClick={closeDrawer} />
          </Flex>

          <Box>
            <Flex direction="column">
              <Text c="#8B8B8B" fz={12} tt="uppercase">
                Amount
              </Text>

              {/* <Text c="#97AD05" fz={32} fw={600}>
                {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
              </Text> */}
            </Flex>

            <Divider my={30} />

            <Flex direction="column" gap={30}>
              <Flex justify="space-between">
                <Text fz={14} c="#8B8B8B">
                  Business Name:
                </Text>

                <Text fz={14}>{selectedRequest?.Company.name}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text fz={14} c="#8B8B8B">
                  Source Account:
                </Text>

                {/* <Text fz={14}>{selectedRequest?.accountName}</Text> */}
              </Flex>

              <Flex justify="space-between">
                <Text fz={14} c="#8B8B8B">
                  Date Created:
                </Text>

                <Text fz={14}>
                  {dayjs(selectedRequest?.createdAt).format("DD MMM, YYYY")}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text fz={14} c="#8B8B8B">
                  Status:
                </Text>

                <Text fz={14}>{selectedRequest?.status}</Text>
              </Flex>
            </Flex>

            <Divider my={30} />

            <Text fz={12} c="#1D2939" fw={600}>
              REASON FOR DEBIT
            </Text>

            <div
              style={{
                marginTop: "15px",
                background: "#F9F9F9",
                padding: "12px 16px",
              }}
            >
              <Text fz={12} c="#667085">
                {selectedRequest?.reason || ""}
              </Text>
            </div>

            {selectedRequest?.status === "PENDING" && (
              <Flex mt={40} justify="flex-end" gap={10}>
                <Button
                  onClick={open}
                  color="#D0D5DD"
                  variant="outline"
                  className={styles.cta}
                >
                  Deny
                </Button>

                <Button
                  className={styles.cta}
                  onClick={openApprove}
                  variant="filled"
                  color="#D4F307"
                >
                  Approve
                </Button>
              </Flex>
            )}
          </Box>
        </Drawer>

        <ModalComponent
          color="#FEF3F2"
          icon={<IconX color="#D92D20" />}
          opened={opened}
          close={close}
          action={handleRejectRequest}
          processing={processing}
          title="Deny This Debit Request?"
          text="This means you are rejecting the debit request of this business."
          customApproveMessage="Yes, Deny It"
        />

        <ModalComponent
          color="#ECFDF3"
          icon={<IconCheck color="#12B76A" />}
          opened={approveOpened}
          close={closeApprove}
          action={handleAcceptRequest}
          processing={processing}
          title="Approve This Debit Request?"
          text="This means you are accepting the debit request of this business"
          customApproveMessage="Yes, Approve It"
        />
      </div>
    </main>
  );
}

const tableHeaders = [
  "Business Name",
  // "Number of Requests",
  // "Contact Email",
  "Date Created",
  "Status",
  "Action",
];

export default function BusinessDebitSuspense() {
  return (
    <Suspense>
      <BusinessDebit />
    </Suspense>
  );
}
