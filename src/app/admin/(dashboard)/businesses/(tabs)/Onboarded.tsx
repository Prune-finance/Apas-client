"use client";

import {
  Badge,
  Flex,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
  TableTr,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconDownload,
  IconListTree,
  IconPlus,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useBusiness } from "@/lib/hooks/businesses";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  activeBadgeColor,
  calculateTotalPages,
  serialNumber,
} from "@/lib/utils";
import { TableComponent } from "@/ui/components/Table";
import InfoCards from "@/ui/components/Cards/InfoCards";
import PaginationComponent from "@/ui/components/Pagination";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";

export default function OnboardedBusinesses() {
  const searchParams = useSearchParams();

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

  const { loading, businesses, meta } = useBusiness(queryParams);
  usePaginationReset({ queryParams, setActive });

  const [opened, { toggle }] = useDisclosure(false);

  const { push } = useRouter();

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const infoDetails = [
    {
      title: "Total Business",
      value: meta?.total || 0,
    },
    {
      title: "Money In",
      value: meta?.in || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: meta?.out || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: meta?.totalTrx || 0,
    },
  ];

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

  const handleRowClick = (id: string) => {
    push(`/admin/businesses/${id}`);
  };

  // filteredSearch(businesses, ["name", "contactEmail"], debouncedSearch);

  const rows = businesses.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd w="10%">
        {serialNumber(active, index, parseInt(limit ?? "10", 10))}
      </TableTd>
      <TableTd w="30%">
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
      <TableTd style={{ wordBreak: "break-word" }}>
        {element.contactEmail}
      </TableTd>
      <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>
      <TableTd>
        <Badge
          tt="capitalize"
          variant="light"
          color={activeBadgeColor(element.companyStatus)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.companyStatus.toLowerCase()}
        </Badge>
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

  return (
    <main>
      {/* <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Businesses", href: "/admin/businesses" },
        ]}
      /> */}

      <div>
        {/* <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Businesses
          </Text>
        </div> */}
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

          <Flex gap={12}>
            <SecondaryBtn
              text="Filter"
              action={toggle}
              fw={600}
              fz={12}
              leftSection={<IconListTree size={16} />}
            />
            <PrimaryBtn
              text="New Business"
              link="/admin/businesses/new"
              leftSection={<IconPlus size={16} />}
              fw={600}
              fz={12}
            />
          </Flex>
        </Flex>
        <Filter<FilterType>
          opened={opened}
          toggle={toggle}
          form={form}
          customStatusOption={["Active", "Inactive"]}
        >
          <TextBox placeholder="Business" {...form.getInputProps("name")} />

          <TextBox
            placeholder="Email"
            {...form.getInputProps("contactEmail")}
          />
        </Filter>

        <TableComponent
          head={tableHeaders}
          rows={rows}
          loading={loading}
          layout="auto"
        />

        <EmptyTable
          loading={loading}
          rows={rows}
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
      </div>
    </main>
  );
}

const tableHeaders = [
  "S/N",
  "Business",
  "Contact Email",
  // "Transactions",
  "Date Created",
  "Status",
  "Action",
];
