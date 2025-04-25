import { Fragment, Suspense } from "react";

import Cookies from "js-cookie";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import axios from "axios";
import { useState } from "react";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { Group, Stack, TableTd } from "@mantine/core";
import { Flex, Box, Divider } from "@mantine/core";
import { Text, Drawer } from "@mantine/core";
import { TableTr } from "@mantine/core";

import { IconX, IconCheck, IconListTree } from "@tabler/icons-react";

import styles from "@/ui/styles/accounts.module.scss";

import { PayoutAccount, usePayoutRequests } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useForm, zodResolver } from "@mantine/form";

import Filter from "@/ui/components/Filter";
import { useSearchParams } from "next/navigation";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { BadgeComponent } from "@/ui/components/Badge";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "../../../businesses/[id]/(tabs)/utils";
import { validateRequest } from "@/lib/schema";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import Link from "next/link";
import ModalComponent from "@/ui/components/Modal";
import RejectModalComponent from "@/ui/components/Modal/RejectModalComponent";

function AccountPayout() {
  const searchParams = useSearchParams();

  const { business, status, endDate, date } = Object.fromEntries(
    searchParams.entries()
  );
  const { handleError, handleSuccess } = useNotification();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(business && { business }),
    search: debouncedSearch,
  };

  const { requests, revalidate, meta, loading } =
    usePayoutRequests(queryParams);

  const [selectedRequest, setSelectedRequest] = useState<PayoutAccount | null>(
    null
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const BusinessDetails = {
    "Business Name": (
      <Link
        href={`/admin/businesses/${selectedRequest?.Company?.id}`}
        target="_blank"
        style={{ textDecoration: "underline" }}
      >
        {selectedRequest?.Company?.name}
      </Link>
    ),
    "Request Date": dayjs(selectedRequest?.createdAt).format("DD MMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests/payout/${selectedRequest.id}/reject`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      close();
      closeDrawer();
      requestForm.reset();
      handleSuccess("Action Completed", `Payout Request Rejected`);
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
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests/payout/${selectedRequest.id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      closeApprove();
      closeDrawer();
      handleSuccess("Action Completed", `Payout Request Approved`);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
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
      <TableTd>{element?.Company?.name ?? "N/A"}</TableTd>
      <TableTd tt="capitalize">{"Payout Account"}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>

      <TableTd className={`${styles.table__td}`}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

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
            Payout Account Request Details
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

      <RejectModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={opened}
        close={close}
        action={handleRejectRequest}
        processing={processing}
        title="Reject This Payout Account Request?"
        text="This means you are rejecting the payout account request of this business."
        customApproveMessage="Yes, Reject It"
        form={requestForm}
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={approveOpened}
        close={closeApprove}
        action={handleAcceptRequest}
        processing={processing}
        title="Approve This Payout Account Request?"
        text="This means you are accepting the payout account request of this business"
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

export default function PayoutAccountService() {
  return (
    <Suspense>
      <AccountPayout />
    </Suspense>
  );
}
