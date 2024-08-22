import { Fragment, Suspense, useMemo } from "react";
import Cookies from "js-cookie";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import axios from "axios";
import { useState } from "react";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import {
  Badge,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
} from "@mantine/core";
import { Flex, Box, Divider, Button } from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { TableTr } from "@mantine/core";

import {
  IconDots,
  IconDotsVertical,
  IconEye,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconListTree } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

import { formatNumber } from "@/lib/utils";
import {
  DebitRequest,
  IUserRequest,
  useAllRequests,
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
import { useRouter, useSearchParams } from "next/navigation";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import { useBusiness } from "@/lib/hooks/businesses";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { BadgeComponent } from "@/ui/components/Badge";
import { SearchInput } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import RequestDrawer from "../RequestDrawer";

function Reactivate() {
  const searchParams = useSearchParams();

  const {
    rows: _limit = "10",
    status,
    createdAt,
    sort,
  } = Object.fromEntries(searchParams.entries());
  const { handleError, handleSuccess } = useNotification();

  const { push } = useRouter();
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

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(createdAt && { date: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
  };

  const { requests, revalidate, loading, meta } = useAllRequests();

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/business/${selectedRequest.companyId}/requests/all/${selectedRequest.id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      close();
      closeDrawer();
      handleSuccess(
        "Action Completed",
        `${(type ?? "").replace(/^./, (letter) =>
          letter.toUpperCase()
        )} Request Denied`
      );
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/business/${selectedRequest.companyId}/requests/all/${selectedRequest.id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      closeApprove();
      closeDrawer();
      handleSuccess(
        "Action Completed",
        `${(type ?? "").replace(/^./, (letter) =>
          letter.toUpperCase()
        )} Request Approved`
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const type = useMemo(() => {
    switch (selectedRequest?.type) {
      case "ACTIVATE":
        return "reactivate";
      case "DEACTIVATE":
        return "deactivate";
      default:
        return selectedRequest?.type.toLowerCase();
    }
  }, [selectedRequest]);

  const menuItems = {
    approve: <IconUserCheck size={14} />,
    deny: <IconUserX size={14} />,
  };

  const MenuComponent = ({ request }: { request: IUserRequest }) => {
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
    ["name", "contactEmail"],
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
      <TableTd>{element.Company.name}</TableTd>
      <TableTd className={styles.table__td}>
        {element.accountId.split("-").pop()}
      </TableTd>
      <TableTd className={styles.table__td}>
        {element.accountId.split("-").pop()}
      </TableTd>
      <TableTd className={styles.table__td}>
        {element.accountId.split("-").pop()}
      </TableTd>
      <TableTd tt="capitalize" className={styles.table__td}>
        {element.type.toLowerCase()}
      </TableTd>
      <TableTd tt="capitalize" className={styles.table__td}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        <BadgeComponent status={element.status} />
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
    <Fragment>
      <Group mt={32} justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          icon={IconListTree}
          action={toggle}
          text="Filter"
          fw={600}
        />
      </Group>

      <Filter<BusinessFilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
      />

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no businesses"
        text="When a business is created, it will appear here"
      />

      <PaginationComponent
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <RequestDrawer
        opened={drawerOpened}
        close={closeDrawer}
        selectedRequest={selectedRequest}
        type={type as string}
        rejectFunc={handleRejectRequest}
        approveFunc={handleAcceptRequest}
        processing={processing}
      />

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={opened}
        close={close}
        action={handleRejectRequest}
        processing={processing}
        title={`Deny This ${type} Request?`}
        text={`This means you are rejecting the ${type} request for this business.`}
        customApproveMessage="Yes, Deny It"
        addReason
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={approveOpened}
        close={closeApprove}
        action={handleAcceptRequest}
        processing={processing}
        title={`Approve This ${type} Request?`}
        text={`This means you are accepting the ${type} request for this business`}
        customApproveMessage="Yes, Approve It"
      />
    </Fragment>
  );
}

const tableHeaders = [
  "Business Name",
  "Account Name",
  "IBAN",
  "User Type",
  "Request Type",
  "Date",
  "Status",
  "Action",
];

export default function ReactivateSuspense() {
  return (
    <Suspense>
      <Reactivate />
    </Suspense>
  );
}
