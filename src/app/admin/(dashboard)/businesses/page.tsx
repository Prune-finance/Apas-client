"use client";

import {
  Badge,
  Button,
  Flex,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Pagination,
  Select,
  TableTd,
  TableTr,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconDots,
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconEye,
  IconListTree,
  IconPlus,
  IconPointFilled,
  IconRosetteDiscountCheckFilled,
  IconSearch,
  IconTrash,
  IconUserCancel,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/business.module.scss";

import EmptyImage from "@/assets/empty.png";
import { useBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import {
  businessFilterSchema,
  BusinessFilterType,
  businessFilterValues,
} from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { filteredSearch } from "@/lib/search";

import { activeBadgeColor, serialNumber } from "@/lib/utils";
import { TableComponent } from "@/ui/components/Table";
import InfoCards from "@/ui/components/Cards/InfoCards";
import { useTransactions } from "@/lib/hooks/transactions";
import PaginationComponent from "@/ui/components/Pagination";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { TextBox } from "@/ui/components/Inputs";

function Businesses() {
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, date, endDate, name, contactEmail } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(name && { business: name }),
    ...(contactEmail && { email: contactEmail }),
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedSearch,
  };

  const { loading, businesses, meta } = useBusiness(queryParams);

  const {
    loading: loadingTrx,
    meta: trxMeta,
    transactions,
  } = useTransactions();

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
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Businesses", href: "/admin/businesses" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Businesses
          </Text>
        </div>
        <InfoCards
          title="Overview"
          details={infoDetails}
          loading={loading || loadingTrx}
        >
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
        <div
          className={`${styles.container__search__filter} ${switzer.className}`}
        >
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            value={search}
            color="var(--prune-text-gray-200)"
            onChange={(e) => setSearch(e.currentTarget.value)}
            c="#000"
            w={324}
            styles={{ input: { border: "1px solid #F5F5F5" } }}
          />

          <Flex gap={12}>
            <Button
              // className={styles.filter__cta}
              leftSection={<IconListTree size={14} />}
              onClick={toggle}
              fz={12}
              fw={500}
              radius={4}
              variant="outline"
              color="var(--prune-text-gray-200)"
              c="#000"
              pl={0}
            >
              Filter
            </Button>

            <Button
              component={Link}
              href="/admin/businesses/new"
              leftSection={<IconPlus size={16} />}
              variant="filled"
              radius={4}
              fz={12}
              c="#000"
              color="var(--prune-primary-600)"
              pl={0}
            >
              New Business
            </Button>
          </Flex>
        </div>
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
      </div>
    </main>
  );
}

export default function BusinessesSuspense() {
  return (
    <Suspense>
      <Businesses />
    </Suspense>
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
