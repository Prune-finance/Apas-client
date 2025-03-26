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
  Select,
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

import { formatNumber, getUserType } from "@/lib/utils";
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
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import RequestDrawer from "../RequestDrawer";
import { FilterType, FilterValues, FilterSchema } from "@/lib/schema";

function Reactivate() {
  const searchParams = useSearchParams();

  const {
    status,
    date,
    endDate,
    business,
    accountName,
    accountNumber,
    accountType,
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
  const [type, setType] = useState<string | null>("");

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(business && { business }),
    ...(accountName && { accountName }),
    ...(accountNumber && { accountNumber }),
    ...(accountType && {
      accountType:
        accountType.toLowerCase() === "individual" ? "USER" : "CORPORATE",
    }),
    search: debouncedSearch,
  };

  const { requests, revalidate, loading, meta } = useAllRequests({
    ...(type === "All" || !type ? {} : { type }),
    ...queryParams,
  });

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
        `${(requestType ?? "").replace(/^./, (letter) =>
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
        `${(requestType ?? "").replace(/^./, (letter) =>
          letter.toUpperCase()
        )} Request Approved`
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const requestType = useMemo(() => {
    switch (selectedRequest?.type) {
      case "ACTIVATE":
        return "reactivate";
      case "ACCOUNT_ISSUANCE":
        return "account issuance";
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

  const rows = requests.map((element, index) => (
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
        {element?.Account?.accountName ?? "N/A"}
      </TableTd>
      <TableTd className={styles.table__td} style={{ wordBreak: "break-word" }}>
        {element?.Account?.accountNumber ?? "N/A"}
      </TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {getUserType(element?.Account?.type ?? "USER")}
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

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Fragment>
      <Group mt={32} justify="space-between" align="center">
        <SearchInput search={search} setSearch={setSearch} />

        <Flex align="center" gap={20}>
          <SelectBox
            data={["All", "Freeze", "Unfreeze", "Activate", "Deactivate"]}
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e)}
            clearable
            styles={{
              input: { height: rem(36), fontSize: 12 },
              option: { fontSize: 12 },
            }}
          />
          <SecondaryBtn
            icon={IconListTree}
            action={toggle}
            text="Filter"
            fw={600}
          />
        </Flex>
      </Group>

      <Filter<FilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
        customStatusOption={["Approved", "Rejected", "Pending"]}
      >
        <TextBox
          placeholder="Business Name"
          {...form.getInputProps("business")}
        />

        <TextBox
          placeholder="Account Name"
          {...form.getInputProps("accountName")}
        />

        <TextBox placeholder="IBAN" {...form.getInputProps("accountNumber")} />

        <SelectBox
          placeholder="User Type"
          data={["Individual", "Corporate"]}
          {...form.getInputProps("accountType")}
          clearable
        />
      </Filter>

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
        type={requestType as string}
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
        title={`Deny This ${requestType} Request?`}
        text={`This means you are rejecting the ${requestType} request for this business.`}
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
        title={`Approve This ${requestType} Request?`}
        text={`This means you are accepting the ${requestType} request for this business`}
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
