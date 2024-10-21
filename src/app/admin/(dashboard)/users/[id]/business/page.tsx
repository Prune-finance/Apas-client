"use client";

import { Group, Skeleton, TableTd, TableTr, Text } from "@mantine/core";
import {
  IconListTree,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import styles from "@/ui/styles/business.module.scss";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { filteredSearch } from "@/lib/search";

import { TableComponent } from "@/ui/components/Table";

import PaginationComponent from "@/ui/components/Pagination";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { BadgeComponent } from "@/ui/components/Badge";
import { useBusinessUsers } from "@/lib/hooks/admins";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import EmptyTable from "@/ui/components/EmptyTable";

export default function AllBusinessUsers() {
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, date, endDate, name, email } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && {
      status:
        status.toUpperCase() === "PENDING"
          ? "INVITE_PENDING"
          : status.toUpperCase(),
    }),
    // ...(name && { business: name }),
    ...(email && { email }),
    limit: parseInt(limit ?? "10", 10),
    page: active,
  };

  const { loading, users, meta } = useBusinessUsers(queryParams, id);

  const { business, loading: loadingBiz } = useSingleBusiness(id);

  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { push } = useRouter();

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const handleRowClick = (userId: string) => {
    push(`/admin/users/${id}/business/${userId}`);
  };

  const rows = filteredSearch(users, ["name", "email"], debouncedSearch).map(
    (element, index) => (
      <TableTr
        key={index}
        onClick={() => handleRowClick(element.id)}
        style={{ cursor: "pointer" }}
      >
        <TableTd tt="lowercase" style={{ wordBreak: "break-word" }} w="20%">
          {element.email}
        </TableTd>

        <TableTd>{"User"}</TableTd>
        <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
        <TableTd>
          {element.lastLogin ? dayjs(element.lastLogin).fromNow() : "Nil"}
        </TableTd>

        <TableTd>
          <BadgeComponent
            status={
              element.status === "INVITE_PENDING" ? "PENDING" : element.status
            }
            active
          />
        </TableTd>
      </TableTr>
    )
  );

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "User Management", href: "/admin/users?tab=Business Users" },

          {
            title: `${business?.name}`,
            href: `/admin/users/${id}/business`,
            loading: loadingBiz,
          },
        ]}
      />

      <Group gap={8} mt={25}>
        {business?.kycTrusted && (
          <IconRosetteDiscountCheckFilled
            size={25}
            color="var(--prune-primary-700)"
          />
        )}
        {business ? (
          <Text fz={18} fw={600}>
            {business.name}
          </Text>
        ) : (
          <Skeleton h={10} w={100} />
        )}

        {business ? (
          <BadgeComponent status={business.companyStatus} active />
        ) : (
          <Skeleton h={10} w={100} />
        )}
      </Group>

      <Group justify="space-between" mt={32} className={switzer.className}>
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
        toggle={toggle}
        form={form}
        customStatusOption={["Active", "Inactive", "Pending"]}
      >
        {/* <TextBox placeholder="Business" {...form.getInputProps("name")} /> */}

        <TextBox placeholder="Email" {...form.getInputProps("email")} />
      </Filter>

      <TableComponent
        head={tableHeaders}
        rows={rows}
        loading={loading}
        // layout="auto"
      />

      <EmptyTable
        title="There are no users for this business."
        text="When a user is added, it will appear here"
        loading={loading}
        rows={rows}
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
      />
    </main>
  );
}

const tableHeaders = [
  "Email",
  "Role",
  "Date Created",
  "Last Active",
  "Status",
  // "Action",
];
