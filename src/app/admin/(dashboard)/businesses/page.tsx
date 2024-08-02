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
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
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
  IconSearch,
  IconTrash,
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
import { AllBusinessSkeleton, DynamicSkeleton2 } from "@/lib/static";
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
import InfoCards from "./InfoCards";
import ActiveBadge from "@/assets/active-badge.svg";
import { activeBadgeColor } from "@/lib/utils";
import { table } from "console";
import { TableComponent } from "@/ui/components/Table";

function Businesses() {
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const searchParams = useSearchParams();
  const limit = searchParams.get("rows")?.toLowerCase() || "10";
  const status = searchParams.get("status")?.toLowerCase();
  const createdAt = searchParams.get("createdAt");
  const sort = searchParams.get("sort")?.toLowerCase();

  const { loading, businesses, meta } = useBusiness({
    ...(isNaN(Number(limit)) ? { limit: 10 } : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status }),
    ...(sort && { sort }),
  });

  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { push } = useRouter();

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  const infoDetails = [
    {
      title: "Total Business",
      value: meta?.total || 0,
    },
    {
      title: "Money In",
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: 0,
    },
  ];

  const menuItems = [
    // {
    //   text: "View",
    //   icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
    //   link: true,
    //   href: "/admin/businesses",
    // },
    {
      text: "Deactivate",
      icon: <IconX style={{ width: rem(14), height: rem(14) }} />,
    },
    {
      text: "Download Report",
      icon: <IconDownload style={{ width: rem(14), height: rem(14) }} />,
    },
  ];

  const handleRowClick = (id: string) => {
    push(`/admin/businesses/${id}`);
  };

  const rows = filteredSearch(
    businesses,
    ["name", "contactEmail"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{index + 1}</TableTd>
      <TableTd className={styles.table__td}>
        <Group gap={9}>
          {element.name}

          {element.kycTrusted && (
            <Image
              width={20}
              height={20}
              src={ActiveBadge}
              alt="active badge"
            />
          )}
        </Group>
      </TableTd>
      <TableTd className={styles.table__td}>{element.contactEmail}</TableTd>
      {/* <TableTd className={styles.table__td}>{50}</TableTd> */}
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
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

      <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            {menuItems.map((items, index) => {
              // if (items.link)
              //   return (
              //     <Link key={index} href={`${items.href}/${element.id}`}>
              //       <MenuItem
              //         key={index}
              //         fz={10}
              //         c="#667085"
              //         leftSection={items.icon}
              //       >
              //         {items.text}
              //       </MenuItem>
              //     </Link>
              //   );
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
        <InfoCards title="Overview" details={infoDetails} loading={loading}>
          <Select
            data={["Last Week", "Last Month"]}
            variant="filled"
            placeholder="Last Week"
            defaultValue={"Last Week"}
            w={150}
            // h={22}
            color="var(--prune-text-gray-500)"
            styles={{
              input: {
                outline: "none",
                border: "none",
              },
            }}
          />
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
        <Filter<BusinessFilterType>
          opened={opened}
          toggle={toggle}
          form={form}
        />

        <TableComponent head={tableHeaders} rows={rows} loading={loading} />

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
        <div className={styles.pagination__container}>
          <Group gap={9}>
            <Text fz={14}>Showing:</Text>

            <Select
              data={["10", "20", "50", "100"]}
              defaultValue={"10"}
              w={60}
              // h={24}
              size="xs"
              withCheckIcon={false}
              {...form.getInputProps("rows")}
            />
          </Group>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>
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
