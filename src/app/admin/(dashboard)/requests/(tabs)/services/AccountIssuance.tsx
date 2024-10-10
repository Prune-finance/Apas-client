import { Fragment, Suspense, useMemo } from "react";

import Cookies from "js-cookie";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import axios from "axios";
import { useState } from "react";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import {
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  TableTd,
} from "@mantine/core";
import { Flex, Box, Divider } from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { TableTr } from "@mantine/core";

import { IconDots, IconEye, IconListTree } from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

import { IUserRequest, useAllRequests } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useForm, zodResolver } from "@mantine/form";
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../../businesses/schema";
import Filter from "@/ui/components/Filter";
import { useRouter, useSearchParams } from "next/navigation";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { BadgeComponent } from "@/ui/components/Badge";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "../../../businesses/[id]/(tabs)/utils";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";

function AccountIssuance() {
  const searchParams = useSearchParams();

  const { status, date, endDate, business } = Object.fromEntries(
    searchParams.entries()
  );
  const { handleError, handleSuccess } = useNotification();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(business && { business }),
  };

  const { requests, revalidate, loading, meta } = useAllRequests({
    type: "ACCOUNT_ISSUANCE",
    ...queryParams,
  });

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

  const BusinessDetails = {
    "Business Name": selectedRequest?.Company.name,
    "Request Date": dayjs(selectedRequest?.createdAt).format("DD MMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

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

  const rows = filteredSearch(requests, ["companyName"], debouncedSearch).map(
    (element, index) => (
      <TableTr
        key={index}
        onClick={() => {
          setSelectedRequest(element);
          openDrawer();
        }}
        style={{ cursor: "pointer" }}
      >
        <TableTd>{element?.Company?.name ?? "N/A"}</TableTd>
        <TableTd tt="capitalize">
          {element?.type.split("_").join(" ").toLowerCase() ?? "N/A"}
        </TableTd>
        <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>

        <TableTd className={`${styles.table__td}`}>
          <BadgeComponent status={element.status} />
        </TableTd>
      </TableTr>
    )
  );

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Fragment>
      <Group justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          text="Filter"
          action={toggle}
          icon={IconListTree}
          fw={600}
        />
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
      </Filter>

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no requests"
        text="When an account is freezed, it will appear here"
      />

      <PaginationComponent
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="30%"
        title={
          <Text fz={18} fw={600} c="#1D2939" ml={24}>
            Account Issuance Request Details
          </Text>
        }
        closeButtonProps={{ ...closeButtonProps, mr: 24 }}
        padding={0}
      >
        {/* <Stack>
          <Box></Box>
        </Stack> */}
        <Divider mb={30} />
        <Stack px={24} pb={24} justify="space-between" h="calc(100vh - 100px)">
          <Box flex={1}>
            <Text
              fz={14}
              fw={600}
              c="var(--prune-text-gray-800)"
              tt="uppercase"
              mb={20}
            >
              Business Details
            </Text>

            <Flex direction="column" gap={30}>
              {Object.entries(BusinessDetails).map(([title, value]) => (
                <Flex justify="space-between" key={title}>
                  <Text fz={12} c="var(--prune-text-gray-500)" fw={400}>
                    {title}:
                  </Text>
                  <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                    {value}
                  </Text>
                </Flex>
              ))}
            </Flex>

            <Divider my={30} />
          </Box>

          {selectedRequest?.status === "PENDING" && (
            <Flex mt={40} justify="flex-end" gap={10}>
              <SecondaryBtn text="Reject" action={open} />
              <PrimaryBtn text="Approve" action={openApprove} />
            </Flex>
          )}
        </Stack>
      </Drawer>

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={opened}
        close={close}
        action={handleRejectRequest}
        processing={processing}
        title="Reject This Account Issuance Request?"
        text="This means you are rejecting the account issuance request of this business."
        customApproveMessage="Yes, Reject It"
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={approveOpened}
        close={closeApprove}
        action={handleAcceptRequest}
        processing={processing}
        title="Approve This Account Issuance Request?"
        text="This means you are accepting the  account issuance request of this business"
        customApproveMessage="Yes, Approve It"
      />
    </Fragment>
  );
}

const tableHeaders = [
  "Business Name",
  "Request Type",
  "Requests Date",
  // "Contact Email",
  "Status",
  // "Action",
];

export default function AccountIssuanceComponent() {
  return (
    <Suspense>
      <AccountIssuance />
    </Suspense>
  );
}
