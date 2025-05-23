"use client";

import {
  OnboardingBusinessData,
  useOnboardingBusiness,
} from "@/lib/hooks/eligibility-center";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { calculateTotalPages } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn, PrimaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import {
  Box,
  Flex,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  rem,
  TableTd,
  TableTr,
  UnstyledButton,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconDownload,
  IconListTree,
  IconPlus,
} from "@tabler/icons-react";
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

  const { status, date, endDate, name, contactEmail } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    status: status ? status.toUpperCase() : "",
    business: name,
    email: contactEmail,
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedSearch,
  };

  const { data, meta, loading, revalidate } =
    useOnboardingBusiness(queryParams);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const infoDetails = [
    {
      title: "Onboarding Business",
      value: meta?.onboarded || 0,
    },
    {
      title: "In Review",
      value: meta?.pending || 0,
    },
    {
      title: "Docs Submitted",
      value: meta?.pending || 0,
    },
    {
      title: "Pending",
      value: meta?.pending || 0,
    },
  ];
  return (
    <Box>
      <InfoCards title="Overview" details={infoDetails} loading={loading}>
        {/* <Select
            data={["Last Week", "Last Month"]}
            variant="filled"
            placeholder="Last Week"
            defaultValue={"Last Week"}
            w={130}
            // h={22}
            color="var(--prune-text-gray-500)"
            styles={{
              input: {
                outline: "none",
                border: "none",
              },
            }}
          /> */}
      </InfoCards>

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
        rows={<Rows data={data} />}
        loading={loading}
        layout="auto"
      />

      <EmptyTable
        loading={loading}
        rows={data || []}
        title="There are no businesses."
        text="When a business is created, it will appear here"
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
  // "Transactions",
  "Date Created",
  "Status",
  "Action",
];

const Rows = ({ data }: { data: OnboardingBusinessData[] | null }) => {
  const { push } = useRouter();
  const menuItems = [
    // {
    //   text: "Deactivate",
    //   icon: <IconUserCancel style={{ width: rem(14), height: rem(14) }} />,
    // },
    {
      text: "Download Report",
      icon: <IconDownload style={{ width: rem(14), height: rem(14) }} />,
    },
  ];

  return data?.map((row) => (
    <TableTr
      key={row.id}
      onClick={() => push(`/admin/eligibility-center/${row.id}`)}
      style={{ cursor: "pointer" }}
    >
      <TableTd w="20%">{row.businessName}</TableTd>
      <TableTd>{row.contactPersonEmail}</TableTd>
      <TableTd>{dayjs(row.createdAt).format("Do MMMM, YYYY")}</TableTd>

      <TableTd>
        <BadgeComponent
          stage
          status={row?.processStatus || "QUESTIONNAIRE"}
          c={row?.status === "ACTIVATION" ? "var(--prune-text-gray-800)" : ""}
          w={150}
        />
      </TableTd>
      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            {menuItems.map((items, index) => {
              return (
                <MenuItem
                  key={index}
                  fz={10}
                  c="#667085"
                  leftSection={items.icon}
                >
                  {items.text}
                </MenuItem>
              );
            })}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));
};
