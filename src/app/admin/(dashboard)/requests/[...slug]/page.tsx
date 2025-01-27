"use client";

import { Suspense } from "react";

import dayjs from "dayjs";
import { useState } from "react";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import {
  Avatar,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
  TableTd,
} from "@mantine/core";
import { Flex, Box, Divider, Button, TextInput } from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { TableTr, Pagination } from "@mantine/core";

import {
  IconDotsVertical,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconListTree } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

import { formatNumber, getInitials } from "@/lib/utils";
import { DebitRequest, useCompanyDebitRequests } from "@/lib/hooks/requests";
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
import { BadgeComponent } from "@/ui/components/Badge";
import { BackBtn, PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import DebitDrawer from "../drawer";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import { debitTableHeaders } from "@/lib/static";
import createAxiosInstance from "@/lib/axios";

function CompanyRequestType() {
  const searchParams = useSearchParams();
  const params = useParams<{ slug?: string[] }>();
  const [id, tab] = params.slug ?? [];
  const axios = createAxiosInstance("payouts");

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );
  const { handleError, handleSuccess } = useNotification();

  const [limit, setLimit] = useState<string | null>("10");
  const [active, setActive] = useState(1);

  const { loading, requests, revalidate, meta } = useCompanyDebitRequests(id, {
    page: active,
    limit: parseInt(limit ?? "10", 10),
  });
  const { business, loading: loadingBusiness } = useSingleBusiness(id);
  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `/admin/debit/requests/${selectedRequest.id}/reject`,
        {}
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
        `/admin/debit/requests/${selectedRequest.id}/approve`,
        {}
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

  const menuItems = {
    approve: <IconUserCheck size={14} />,
    deny: <IconUserX size={14} />,
  };

  const MenuComponent = ({ request }: { request: DebitRequest }) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDotsVertical size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          {Object.entries(menuItems).map(([key, value]) => (
            <MenuItem
              key={key}
              onClick={() => {
                if (key === "approve") {
                  setSelectedRequest(request);
                  return openApprove();
                }
                if (key === "deny") {
                  setSelectedRequest(request);
                  return open();
                }
              }}
              fz={10}
              c="#667085"
              leftSection={value}
              tt="capitalize"
            >
              {key}
            </MenuItem>
          ))}
        </MenuDropdown>
      </Menu>
    );
  };

  const rows = filteredSearch(
    requests,
    ["destinationFirstName", "destinationLastName"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{element.Account.accountName}</TableTd>
      <TableTd className={styles.table__td}>
        {formatNumber(element.amount, true, "EUR")}
      </TableTd>

      <TableTd>
        {dayjs(element.createdAt).format("DD, MMM, YYYY - hh:mm A")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        <BadgeComponent status={element.status} />
      </TableTd>

      {/* <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuComponent request={element} />
      </TableTd> */}
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
        <BackBtn />

        <Group gap={7} mt={24}>
          {!loadingBusiness ? (
            <Avatar color="var(--prune-primary-700)" size={39} variant="filled">
              {getInitials(business?.name ?? "")}
            </Avatar>
          ) : (
            <Skeleton circle h={39} w={39} />
          )}

          {!loadingBusiness ? (
            <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
              {business?.name}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}
        </Group>

        <Group justify="space-between" mt={32}>
          <SearchInput search={search} setSearch={setSearch} />

          <SecondaryBtn
            text="Filter"
            action={toggle}
            fw={600}
            icon={IconListTree}
          />
        </Group>

        {tab.toLowerCase() !== "debit" ? (
          <>
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
              text="When a request is made, it will appear here"
            />
          </>
        ) : (
          <>
            <TableComponent
              head={debitTableHeaders}
              rows={rows}
              loading={loading}
            />

            <EmptyTable
              rows={rows}
              loading={loading}
              title="There are no debit requests"
              text="When a debit request is made, it will appear here"
            />
          </>
        )}

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />

        <DebitDrawer
          opened={drawerOpened}
          close={closeDrawer}
          selectedRequest={selectedRequest}
          revalidate={revalidate}
        />

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
      <CompanyRequestType />
    </Suspense>
  );
}
