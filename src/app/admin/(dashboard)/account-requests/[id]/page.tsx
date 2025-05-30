"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.scss";
import {
  Button,
  Flex,
  Group,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
  Image,
  Badge,
  TableTd,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  rem,
  UnstyledButton,
  Avatar,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconListTree,
  IconSearch,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import Filter from "@/ui/components/Filter";
import { useRequests } from "@/lib/hooks/requests";
import { Suspense, useState } from "react";
import dayjs from "dayjs";
import { DynamicSkeleton, DynamicSkeleton2 } from "@/lib/static";
import { filteredSearch } from "@/lib/search";
import { approvedBadgeColor, getInitials, getUserType } from "@/lib/utils";
import EmptyImage from "@/assets/empty.png";
import { TableComponent } from "@/ui/components/Table";
import { approveRequest, rejectRequest } from "@/lib/actions/account-requests";
import useNotification from "@/lib/hooks/notification";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { BackBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import { BadgeComponent } from "@/ui/components/Badge";

function BusinessAccountRequests() {
  const params = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const { status, endDate, date, accountType, country, firstName, lastName } =
    Object.fromEntries(searchParams.entries());

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const queryParams = {
    ...(date && { date: dayjs(date).format("DD-MM-YYYY") }),
    ...(endDate && { endDate: dayjs(endDate).format("DD-MM-YYYY") }),
    ...(status && { status: status.toUpperCase() }),
    ...(accountType && {
      accountType: accountType === "Individual" ? "USER" : "CORPORATE",
    }),
    ...(country && { country: country.toUpperCase() }),
    ...(lastName && { lastName }),
    ...(firstName && { firstName }),

    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  };

  const { loading, requests, meta, revalidate } = useRequests(
    queryParams,
    params.id
  );

  const { back, push } = useRouter();

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const handleRowClick = (id: string, status: string, accountId: string) => {
    if (status === "APPROVED") return push(`/admin/accounts/${accountId}`);

    push(`/admin/account-requests/${params.id}/${id}`);
  };

  const rows = requests.map((element, index) => (
    <TableTr
      key={index}
      onClick={() =>
        handleRowClick(element.id, element.status, element.Account?.id ?? "")
      }
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize">{element.firstName}</TableTd>
      <TableTd tt="capitalize">{element.lastName}</TableTd>
      <TableTd tt="capitalize">{getUserType(element.accountType)}</TableTd>
      <TableTd>{element?.country}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>

      {/* <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuComponent id={element.id} />
      </TableTd> */}
    </TableTr>
  ));

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Account Creation", href: "/admin/account-requests" },
          {
            title: meta?.companyName ?? "",
            href: `/admin/account-requests/${params.id}`,
            loading: loading,
          },
        ]}
      />

      <Paper p={28} className={styles.grid__container}>
        {/* <Button
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
        </Button> */}

        {/* <BackBtn /> */}

        <Group gap={9}>
          {!loading ? (
            <Avatar color="var(--prune-primary-700)" size={39} variant="filled">
              {getInitials(meta?.companyName || "")}
            </Avatar>
          ) : (
            <Skeleton circle h={39} w={39} />
          )}
          {!loading ? (
            <Text fz={20} fw={600} c="var(--prune-text-gray-700)">
              {meta?.companyName}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}

          {!loading ? (
            <Badge color="var(--prune-primary-700)" variant="light">
              {meta?.total}
            </Badge>
          ) : (
            <Skeleton h={10} w={40} />
          )}
        </Group>

        <Group
          justify="space-between"
          align="center"
          mt={24}
          // className={styles.container__search__filter}
        >
          <SearchInput search={search} setSearch={setSearch} />
          <SecondaryBtn
            text="Filter"
            icon={IconListTree}
            action={toggle}
            fw={600}
          />
        </Group>
        <Filter<FilterType>
          opened={opened}
          form={form}
          toggle={toggle}
          customStatusOption={["Approved", "Rejected", "Pending"]}
        >
          <TextBox
            placeholder="First Name"
            {...form.getInputProps("firstName")}
          />
          <TextBox
            placeholder="Last Name"
            {...form.getInputProps("lastName")}
          />

          {/* <SelectBox
            placeholder="User Type"
            {...form.getInputProps("accountType")}
            data={["Individual", "Corporate"]}
          /> */}

          <TextBox placeholder="Country" {...form.getInputProps("country")} />
        </Filter>

        <TableComponent head={tableHeaders} rows={rows} loading={loading} />

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no account requests"
          text="When a request is created, it will appear here."
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 1) / parseInt(limit ?? "10", 10))}
        />
      </Paper>
    </main>
  );
}

const tableHeaders = [
  "First Name",
  "Last Name",
  "User Type",
  "Country",
  "Date Created",
  "Status",
  // "Action",
];

export default function BusinessAccountRequestsSuspense() {
  return (
    <Suspense>
      <BusinessAccountRequests />
    </Suspense>
  );
}
