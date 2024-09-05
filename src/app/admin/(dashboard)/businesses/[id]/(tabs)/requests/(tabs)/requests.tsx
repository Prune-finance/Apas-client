import { parseError } from "@/lib/actions/auth";
import { IUserRequest, useAllCompanyRequests } from "@/lib/hooks/requests";
import { filteredSearch } from "@/lib/search";
import { getUserType } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import {
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Select,
  TableTd,
  TableTr,
  UnstyledButton,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconUserCheck,
  IconUserX,
  IconDotsVertical,
  IconCheck,
  IconListTree,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../../../schema";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/notification";
import RequestDrawer from "@/app/admin/(dashboard)/requests/RequestDrawer";
import PaginationComponent from "@/ui/components/Pagination";
import EmptyTable from "@/ui/components/EmptyTable";
import { TableComponent } from "@/ui/components/Table";
import Filter from "@/ui/components/Filter";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import ModalComponent from "@/ui/components/Modal";

export const OtherRequests = () => {
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<string | null>("");
  const [limit, setLimit] = useState<string | null>("10");
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { handleError, handleSuccess } = useNotification();

  const { requests, revalidate, loading, meta } = useAllCompanyRequests(id, {
    ...(type === "All" || !type ? {} : { type }),
  });

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
      <TableTd>{element.Account.accountName}</TableTd>

      <TableTd tt="capitalize">
        {getUserType(element.Account.type ?? "USER")}
      </TableTd>
      <TableTd tt="capitalize">{element.type.toLowerCase()}</TableTd>
      <TableTd tt="capitalize">
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>

      {/* <TableTd onClick={(e) => e.stopPropagation()}>
        <MenuComponent request={element} />
      </TableTd> */}
    </TableTr>
  ));

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  return (
    <Box>
      <Group mt={32} justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <Group>
          <Select
            placeholder="Type"
            data={["All", "Freeze", "Unfreeze", "Activate", "Deactivate"]}
            w={120}
            styles={{ option: { fontSize: 12 }, input: { fontSize: 12 } }}
            value={type}
            onChange={(e) => setType(e)}
          />
          <SecondaryBtn
            icon={IconListTree}
            action={toggle}
            text="Filter"
            fw={600}
          />
        </Group>
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
        title="There are no requests"
        text="When a request is made, it will appear here"
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
    </Box>
  );
};

const tableHeaders = [
  "Account Name",
  "User Type",
  "Request Type",
  "Date",
  "Status",
];
