"use client";
import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  TableTd,
  TableTr,
  UnstyledButton,
  ThemeIcon,
} from "@mantine/core";
import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";

import styles from "./styles.module.scss";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  IconAlignCenter,
  IconListTree,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import EmptyTable from "@/ui/components/EmptyTable";
import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import Filter from "@/ui/components/Filter";
import { TableComponent } from "@/ui/components/Table";
import PaginationComponent from "@/ui/components/Pagination";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { frontendPagination, calculateTotalPages } from "@/lib/utils";
import ModalProvider from "@/ui/components/Modal/ModalProvider";

import EUIcon from "@/assets/EU-icon.png";
import GBIcon from "@/assets/GB.png";
import USIcon from "@/assets/USD.png";
import NGIcon from "@/assets/Nigeria.png";
import GHIcon from "@/assets/GH.png";

type Beneficiary = {
  name: string;
  email: string;
  category: string;
  bank: string;
  accountNumber: string;
  currency: "EUR" | "GBP" | "USD" | "NGN" | "CAD" | "GHS";
};

const sampleBeneficiaries: Beneficiary[] = [
  {
    name: "John Smith",
    email: "john@example.com",
    category: "Vendors",
    bank: "Chase Bank",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
  {
    name: "Lukaku Tobi",
    email: "Lukaku@example.com",
    category: "Payroll",
    bank: "Bank of America",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
  {
    name: "Ebenezer Jude",
    email: "Jude@example.com",
    category: "Vendors",
    bank: "Wellsfargo",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
  {
    name: "C80 Limited",
    email: "C80@example.com",
    category: "Partner",
    bank: "Chase Bank",
    accountNumber: "GB847639735627",
    currency: "EUR",
  },
];

const tableHeaders = [
  "Name",
  "Category",
  "Bank",
  "Account Number",
  "Currency",
  "Action",
];

const currencyTabs = [
  {
    value: "EUR",
    icon: <Image width={18} height={18} src={EUIcon} alt="eur" />,
  },
  {
    value: "GBP",
    icon: <Image width={18} height={18} src={GBIcon} alt="gbp" />,
  },
  {
    value: "USD",
    icon: <Image width={18} height={18} src={USIcon} alt="usd" />,
  },
  {
    value: "NGN",
    icon: <Image width={18} height={18} src={NGIcon} alt="ngn" />,
  },
  {
    value: "CAD",
  },
  {
    value: "GHS",
    icon: <Image width={18} height={18} src={GHIcon} alt="ghs" />,
  },
];

const Beneficiaries = () => {
  const [currency, setCurrency] = useState<string>(currencyTabs[0].value);
  const [opened, { open, close }] = useDisclosure(false);

  const [openedFilter, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const filteredByCurrency = useMemo(
    () => sampleBeneficiaries.filter((b) => b.currency === currency),
    [currency]
  );

  const searched = useMemo(() => {
    if (!debouncedSearch) return filteredByCurrency;
    const lower = debouncedSearch.toLowerCase();
    return filteredByCurrency.filter(
      (b) =>
        b.name.toLowerCase().includes(lower) ||
        b.email.toLowerCase().includes(lower) ||
        b.bank.toLowerCase().includes(lower) ||
        b.accountNumber.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower)
    );
  }, [filteredByCurrency, debouncedSearch]);

  const rows = useMemo(
    () =>
      frontendPagination(searched, active, parseInt(limit ?? "10", 10)).map(
        (element, index) => (
          <TableTr key={`${element.email}-${index}`}>
            <TableTd>
              <Stack gap={0}>
                <Text fz={12} fw={500}>
                  {element.name}
                </Text>
                <Text fz={10} fw={400} c="#667085">
                  {element.email}
                </Text>
              </Stack>
            </TableTd>
            <TableTd>{element.category}</TableTd>
            <TableTd>{element.bank}</TableTd>
            <TableTd>{element.accountNumber}</TableTd>
            <TableTd>
              <Group gap={6}>
                {element.currency === "EUR" && (
                  <Image width={18} height={18} src={EUIcon} alt="eur" />
                )}
                {element.currency === "GBP" && (
                  <Image width={18} height={18} src={GBIcon} alt="gbp" />
                )}
                {element.currency === "USD" && (
                  <Image width={18} height={18} src={USIcon} alt="usd" />
                )}
                {element.currency === "NGN" && (
                  <Image width={18} height={18} src={NGIcon} alt="ngn" />
                )}
                {element.currency === "GHS" && (
                  <Image width={18} height={18} src={GHIcon} alt="ghs" />
                )}
                <Text fz={12} fw={500}>
                  {element.currency}
                </Text>
              </Group>
            </TableTd>
            <TableTd>
              <Group gap={10}>
                <UnstyledButton>
                  <ThemeIcon color="#EEF2F6" radius="md">
                    <IconPencil size={14} color="#475467" />
                  </ThemeIcon>
                </UnstyledButton>
                <UnstyledButton>
                  <ThemeIcon color="#FEF3F2" radius="md">
                    <IconTrash size={14} color="#D92D20" />
                  </ThemeIcon>
                </UnstyledButton>
              </Group>
            </TableTd>
          </TableTr>
        )
      ),
    [searched, active, limit]
  );

  return (
    <Box>
      <main className={styles.main}>
        <Paper className={styles.table__container}>
          <div className={styles.container__header}>
            <Stack gap={0}>
              <Text fz={18} fw={600}>
                Beneficiary Management
              </Text>
              <Text fz={14} fw={400} c="#667085">
                Manage your saved beneficiaries and categories
              </Text>
            </Stack>

            <Group gap={12}>
              <PrimaryBtn
                icon={IconPlus}
                text="New Beneficiary"
                action={open}
              />
            </Group>
          </div>

          <TabsComponent
            tabs={currencyTabs}
            styles={{ list: { marginTop: 24 } }}
            defaultValue={currency}
            onChange={(v) => setCurrency(v || "EUR")}
          >
            <TabsPanel value={currency}>
              <Group
                justify="space-between"
                mt={24}
                className={styles.container__search__filter}
              >
                <SearchInput
                  search={search}
                  setSearch={setSearch}
                  w={270}
                  placeholder="Search here......"
                />

                <Group gap={12}>
                  <SecondaryBtn
                    text="Filter"
                    icon={IconAlignCenter}
                    action={toggle}
                    fw={600}
                  />
                  <SecondaryBtn text="Export Beneficiary" fw={600} />
                </Group>
              </Group>

              <TableComponent
                head={tableHeaders}
                rows={rows}
                loading={false}
                mt={24}
              />

              <EmptyTable
                rows={searched}
                loading={false}
                title="There are no beneficiaries"
                text="When a beneficiary is created, it will appear here."
              />

              <PaginationComponent
                total={calculateTotalPages(limit, searched.length)}
                active={active}
                setActive={setActive}
                limit={limit}
                setLimit={setLimit}
              />
            </TabsPanel>
          </TabsComponent>
        </Paper>

        <ModalProvider
          opened={opened}
          onClose={close}
          close={close}
          title="New Beneficiary"
          size="lg"
        >
          <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
            Form coming soon
          </Text>
        </ModalProvider>
      </main>
    </Box>
  );
};

export default function BeneficiariesSuspense() {
  return (
    <Suspense>
      <Beneficiaries />
    </Suspense>
  );
}
