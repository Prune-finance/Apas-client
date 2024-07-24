"use client";

import {
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
  IconDownload,
  IconEye,
  IconListTree,
  IconPlus,
  IconPointFilled,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/business.module.scss";

import EmptyImage from "@/assets/empty.png";
import { useBusiness } from "@/lib/hooks/businesses";
import { AllBusinessSkeleton } from "@/lib/static";
import { switzer } from "@/app/layout";
import Filter from "@/ui/components/Filter";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import {
  businessFilterSchema,
  BusinessFilterType,
  businessFilterValues,
} from "./schema";
import { useSearchParams } from "next/navigation";

export default function Businesses() {
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const searchParams = useSearchParams();
  const limit = searchParams.get("rows")?.toLowerCase() || "10";
  const status = searchParams.get("status")?.toLowerCase();
  const createdAt = searchParams.get("createdAt");
  const sort = searchParams.get("sort")?.toLowerCase();

  const { loading, businesses } = useBusiness({
    ...(limit && { limit: parseInt(limit) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status }),
    ...(sort && { sort }),
  });

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  const menuItems = [
    {
      text: "View",
      icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
      link: true,
      href: "/admin/businesses",
    },
    {
      text: "Deactivate",
      icon: <IconTrash style={{ width: rem(14), height: rem(14) }} />,
    },
    {
      text: "Download Report",
      icon: <IconDownload style={{ width: rem(14), height: rem(14) }} />,
    },
  ];

  const rows = businesses.map((element, index) => (
    <TableTr key={index}>
      <TableTd className={styles.table__td}>{index + 1}</TableTd>
      <TableTd className={styles.table__td}>{element.name}</TableTd>
      <TableTd className={styles.table__td}>{element.contactEmail}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          <IconPointFilled size={14} color="#12B76A" />
          <Text tt="capitalize" fz={12} c="#12B76A">
            Active
          </Text>
        </div>
      </TableTd>

      <TableTd className={`${styles.table__td}`}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDots size={17} />
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            {menuItems.map((items, index) => {
              if (items.link)
                return (
                  <Link key={index} href={`${items.href}/${element.id}`}>
                    <MenuItem
                      key={index}
                      fz={10}
                      c="#667085"
                      leftSection={items.icon}
                    >
                      {items.text}
                    </MenuItem>
                  </Link>
                );
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

          <Link href="/admin/businesses/new">
            <Button
              leftSection={<IconPlus color="#344054" size={16} />}
              className={styles.login__cta}
              variant="filled"
              color="var(--prune-primary-600)"
            >
              New Business
            </Button>
          </Link>
        </div>

        <div
          className={`${styles.container__search__filter} ${switzer.className}`}
        >
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            classNames={{ wrapper: styles.search, input: styles.input__search }}
          />

          <Button
            className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
            onClick={toggle}
            fz={12}
            fw={500}
          >
            Filter
          </Button>
        </div>

        <Filter<BusinessFilterType> opened={opened} toggle={toggle} form={form}>
          <DateInput
            placeholder="Date"
            {...form.getInputProps("createdAt")}
            size="xs"
            w={120}
            h={36}
          />
          <Select
            placeholder="Status"
            {...form.getInputProps("status")}
            data={["Active", "Inactive"]}
            size="xs"
            w={120}
            h={36}
          />
        </Filter>

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>S/N</TableTh>
                <TableTh className={styles.table__th}>Business Name</TableTh>
                <TableTh className={styles.table__th}>Contact Email</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                <TableTh className={styles.table__th}>Action</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? AllBusinessSkeleton : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

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
          <Text fz={14}>Rows: {businesses.length}</Text>
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
