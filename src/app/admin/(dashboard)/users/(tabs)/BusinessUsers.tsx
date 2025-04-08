"use client";

import { Flex, Group, TableTd, TableTr, Text } from "@mantine/core";
import {
  IconListTree,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import styles from "@/ui/styles/business.module.scss";

import EmptyImage from "@/assets/empty.png";
import { useBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { filteredSearch } from "@/lib/search";

import { sanitizeURL, serialNumber } from "@/lib/utils";
import { TableComponent } from "@/ui/components/Table";

import PaginationComponent from "@/ui/components/Pagination";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { BadgeComponent } from "@/ui/components/Badge";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";

export default function BusinessUsers() {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, date, endDate, name, email } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    status: status ? status.toUpperCase() : "",
    business: name,
    email,
    search: debouncedSearch,
    limit: parseInt(limit ?? "10", 10),
    page: active,
  };

  const { loading, businesses, meta } = useBusiness(queryParams);
  usePaginationReset({ queryParams, setActive });

  const [opened, { toggle }] = useDisclosure(false);

  const { push } = useRouter();

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const handleRowClick = (id: string) => {
    push(`/admin/users/${id}/business`);
  };

  const rows = businesses.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd w="10%">
        {serialNumber(active, index, parseInt(limit ?? "10", 10))}
      </TableTd>
      <TableTd w="25%">
        <Flex wrap="nowrap" gap={9} align="center">
          {element.kycTrusted && (
            <IconRosetteDiscountCheckFilled
              size={25}
              color="var(--prune-primary-700)"
            />
          )}
          {element.name}
        </Flex>
      </TableTd>
      <TableTd tt="lowercase">{element.contactEmail}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.companyStatus} active />
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
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
        customStatusOption={["Active", "Inactive"]}
      >
        <TextBox placeholder="Business" {...form.getInputProps("name")} />

        <TextBox placeholder="Email" {...form.getInputProps("email")} />
      </Filter>

      <TableComponent
        head={tableHeaders}
        rows={rows}
        loading={loading}
        layout="auto"
      />

      {!loading && !!!rows.length && (
        <Flex direction="column" align="center" mt={70}>
          <Image src={EmptyImage} alt="no content" width={156} height={120} />
          <Text mt={14} fz={14} c="#1D2939">
            There are no businesses.
          </Text>
          <Text fz={10} c="#667085">
            When a business is created, it will appear here
          </Text>
        </Flex>
      )}
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
  "S/N",
  "Business",
  "Contact Email",
  "Date Created",
  "Status",
];
