import { Fragment, Suspense, useMemo } from "react";
import Cookies from "js-cookie";

import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";

import Image from "next/image";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { Group, TableTd } from "@mantine/core";
import { Flex, Box, Divider, Button } from "@mantine/core";
import { Text, Drawer } from "@mantine/core";
import { TableTr } from "@mantine/core";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconListTree } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

import EmptyImage from "@/assets/empty.png";

import { formatNumber } from "@/lib/utils";
import {
  DebitRequest,
  useCompanyWithDebitRequests,
  useDebitRequests,
} from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useForm, zodResolver } from "@mantine/form";

import Filter from "@/ui/components/Filter";
import { useRouter, useSearchParams } from "next/navigation";
import { TableComponent } from "@/ui/components/Table";
import { BadgeComponent } from "@/ui/components/Badge";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import PaginationComponent from "@/ui/components/Pagination";

function Debit() {
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState<string | null>("10");
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, endDate, date, business } = Object.fromEntries(
    searchParams.entries()
  );
  const { handleError, handleSuccess } = useNotification();

  const queryParams = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(business && { business }),
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedSearch,
  };

  const { requests, revalidate } = useDebitRequests(queryParams);

  // const { businesses, loading } = useBusiness(queryParams, undefined, true);
  const { businesses, loading, meta } =
    useCompanyWithDebitRequests(queryParams);
  const { push } = useRouter();
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

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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

  const handleRowClick = (id: string) => {
    push(`/admin/requests/${id}/debit`);
  };

  const rows = businesses.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{element.name}</TableTd>
      <TableTd className={styles.table__td}>
        {element.Accounts.reduce(
          (acc, curr) => acc + curr.debitRequestCount,
          0
        )}
      </TableTd>
      <TableTd
        className={styles.table__td}
        tt="lowercase"
        style={{ wordBreak: "break-word" }}
      >
        {element.contactEmail}
      </TableTd>
      <TableTd>
        <BadgeComponent status={element.companyStatus} active />
      </TableTd>
    </TableTr>
  ));

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Fragment>
      <Group justify="space-between" mt={32}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          text="Filter"
          action={toggle}
          fw={600}
          icon={IconListTree}
        />
      </Group>

      <Filter<FilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
        noDate
        customStatusOption={["Active", "Inactive"]}
      >
        <TextBox
          placeholder="Business Name"
          {...form.getInputProps("business")}
        />
      </Filter>

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      {!loading && !!!rows.length && (
        <Flex direction="column" align="center" mt={70}>
          <Image src={EmptyImage} alt="no content" width={156} height={120} />
          <Text mt={14} fz={14} c="#1D2939">
            There are no debit requests.
          </Text>
          <Text fz={10} c="#667085">
            When a business is created, it will appear here
          </Text>
        </Flex>
      )}

      {/* <div className={styles.pagination__container}>
        <Group gap={9}>
          <Text fz={14}>Showing:</Text>

          <Select
            data={["10", "20", "50", "100"]}
            defaultValue={"10"}
            w={60}
            // h={24}
            size="xs"
            withCheckIcon={false}
          />
        </Group>
        <Pagination
          autoContrast
          color="#fff"
          total={1}
          classNames={{ control: styles.control, root: styles.pagination }}
        />
      </div> */}

      <PaginationComponent
        active={active}
        limit={limit}
        setActive={setActive}
        setLimit={setLimit}
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

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Flex>

          <Divider my={30} />

          <Flex direction="column" gap={30}>
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Business Name:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.Company.name}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Source Account:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.accountName}</Text>
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
    </Fragment>
  );
}

const tableHeaders = [
  "Business Name",
  "Number of Requests",
  "Contact Email",
  "Status",
  // "Action",
];

export default function DebitSuspense() {
  return (
    <Suspense>
      <Debit />
    </Suspense>
  );
}
