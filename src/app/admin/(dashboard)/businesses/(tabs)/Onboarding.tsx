"use client";

import { useBusiness } from "@/lib/hooks/businesses";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { activeBadgeColor, calculateTotalPages } from "@/lib/utils";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Badge, Box, Flex, TableTd, TableTr } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OnboardingBusinesses() {
  const searchParams = useSearchParams();
  const [opened, { toggle }] = useDisclosure(false);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { date, endDate, name, contactEmail } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    status: "ONBOARDING",
    business: name,
    email: contactEmail,
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedSearch,
  };

  const { businesses, meta, loading } = useBusiness(queryParams);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const { push } = useRouter();

  const rows = businesses.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => push(`/admin/eligibility-center/${element.id}`)}
      style={{ cursor: "pointer" }}
    >
      <TableTd w="25%">{element.businessName}</TableTd>
      <TableTd tt="lowercase">{element.contactEmail}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>
      <TableTd>
        <Badge
          tt="capitalize"
          variant="light"
          color={activeBadgeColor(element.state)}
          fz={11}
        >
          {element.state.replace(/_/g, " ").toLowerCase()}
        </Badge>
      </TableTd>
    </TableTr>
  ));

  return (
    <Box>
      <Flex justify="space-between" align="center" mt={24}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          text="Filter"
          action={toggle}
          fw={600}
          fz={12}
          leftSection={<IconListTree size={16} />}
        />
      </Flex>

      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        customStatusOption={["Active", "Inactive"]}
      >
        <TextBox placeholder="Business" {...form.getInputProps("name")} />
        <TextBox placeholder="Email" {...form.getInputProps("contactEmail")} />
      </Filter>

      <TableComponent
        head={tableHeaders}
        rows={rows}
        loading={loading}
        layout="auto"
      />

      <EmptyTable
        loading={loading}
        rows={businesses}
        title="There are no businesses currently onboarding."
        text="When a business starts the onboarding process, it will appear here"
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total)}
      />
    </Box>
  );
}

const tableHeaders = [
  "Business",
  "Contact Email",
  "Date Created",
  "Status",
];
