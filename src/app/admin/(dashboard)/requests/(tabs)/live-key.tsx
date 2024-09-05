import { Fragment, Suspense } from "react";
import Cookies from "js-cookie";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import axios from "axios";
import { useState } from "react";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
} from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { TableTr } from "@mantine/core";

import { IconDots, IconEye } from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconListTree } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

import { LiveKeyRequest, useLiveKeyRequests } from "@/lib/hooks/requests";
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
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput } from "@/ui/components/Inputs";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";

function LiveKey() {
  const searchParams = useSearchParams();

  const {
    rows: _limit = "10",
    status,
    createdAt,
    sort,
    type,
  } = Object.fromEntries(searchParams.entries());
  const { handleError, handleSuccess } = useNotification();
  const { requests, revalidate, meta, loading } = useLiveKeyRequests();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { push } = useRouter();
  const [selectedRequest, setSelectedRequest] = useState<LiveKeyRequest | null>(
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
    push(`/admin/requests/${id}/live-key`);
  };

  const rows = filteredSearch(requests, ["Company.name"], debouncedSearch).map(
    (element, index) => (
      <TableTr
        key={index}
        onClick={() => handleRowClick(element.id)}
        style={{ cursor: "pointer" }}
      >
        <TableTd>{element.Company.name}</TableTd>
        <TableTd>{dayjs(element.date).format("Do MMM, YYYY")}</TableTd>
        <TableTd>{dayjs(element.createdAt).format("Do MMM, YYYY")}</TableTd>

        <TableTd>
          <BadgeComponent status={element.status} />
        </TableTd>

        {/* <TableTd className={`${styles.table__td}`}>
          <MenuComponent request={element} />
        </TableTd> */}
      </TableTr>
    )
  );

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  return (
    <Fragment>
      <div className={`${styles.container__search__filter}`}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </div>

      <Filter<BusinessFilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
      />

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no live key requests"
        text="When a live key is requested, it will appear here"
      />

      <PaginationComponent
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
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
    </Fragment>
  );
}

const tableHeaders = [
  "Business Name",
  "Go Live Date",
  "Request Date",
  "Status",
  // "Action",
];

export default function LiveKeySuspense() {
  return (
    <Suspense>
      <LiveKey />
    </Suspense>
  );
}
