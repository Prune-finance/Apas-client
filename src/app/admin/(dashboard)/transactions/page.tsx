"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableThead,
  TableTr,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowDownLeft,
  IconArrowLeft,
  IconArrowUpRight,
  IconCircleArrowDown,
  IconListTree,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import styles from "./styles.module.scss";

import { useParams, useRouter } from "next/navigation";

import InfoCards from "@/ui/components/Cards/InfoCards";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { approvedBadgeColor, formatNumber } from "@/lib/utils";
import Transaction from "@/lib/store/transaction";
import { useSingleAccount } from "@/lib/hooks/accounts";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import { TransactionType, useTransactions } from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { useState } from "react";
import { filteredSearch } from "@/lib/search";

export default function TransactionForAccount() {
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const { loading, transactions, meta } = useTransactions();

  const [opened, { toggle }] = useDisclosure(false);
  const { data, close, opened: openedDrawer } = Transaction();

  const infoDetails = [
    {
      title: "Total Balance",
      value: meta?.total || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money In",
      value: meta?.in || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money Out",
      value: meta?.out || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
    },
  ];

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });
  return (
    <main>
      <Breadcrumbs
        items={[
          {
            title: "Transactions",
            href: `/admin/transactions`,
          },
        ]}
      />

      <Paper p={20} mt={16}>
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
        >
          Back
        </Button> */}

        <Title c="var(--prune-text-gray-700)" fz={24} fw={600} my={28}>
          Transactions
        </Title>

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

        <Flex justify="space-between" align="center" mt={38}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            // leftSection={searchIcon}
            leftSection={<IconSearch size={20} />}
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
              c="var(--prune-text-gray-800)"
            >
              Filter
            </Button>
            <Button
              // className={styles.filter__cta}
              leftSection={<IconArrowUpRight size={14} />}
              onClick={toggle}
              fz={12}
              fw={500}
              radius={4}
              variant="outline"
              color="var(--prune-text-gray-200)"
              c="var(--prune-text-gray-800)"
            >
              Export CSV
            </Button>
            <Button
              // className={styles.filter__cta}
              leftSection={<IconCircleArrowDown size={14} />}
              onClick={toggle}
              fz={12}
              fw={500}
              radius={4}
              variant="outline"
              color="var(--prune-text-gray-200)"
              c="var(--prune-text-gray-800)"
            >
              Download Statement
            </Button>
          </Flex>
        </Flex>

        <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

        <TableComponent
          head={tableHeaders}
          rows={
            <RowComponent
              data={transactions}
              id={params.id}
              search={debouncedSearch}
            />
          }
          loading={loading}
        />

        <EmptyTable
          rows={transactions}
          loading={loading}
          text="Transactions will be shown here"
          title="There are no transactions"
        />

        {data && <TRXDrawer opened={openedDrawer} close={close} data={data} />}
      </Paper>
    </main>
  );
}

const tableHeaders = [
  "Name",
  "Bank",
  "Account Number",
  "Amount",
  "Date",
  "Status",
];

type TableData = {
  AccName: string;
  Biz: string;
  Amount: number;
  Date: string;
  AccNum: string;
  Status: string;
};

const RowComponent = ({
  data,
  id,
  search,
}: {
  data: TransactionType[];
  id: string;
  search: string;
}) => {
  const { open, setData } = Transaction();
  return filteredSearch(
    data,
    ["senderIban", "recipientIban", "recipientBankAddress"],
    search
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.senderIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <Group gap={3}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
          />
          {formatNumber(element.amount, true, "EUR")}
          {/* <Text fz={12}></Text> */}
        </Group>
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY-hh:mmA")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          color={approvedBadgeColor(element.status.toUpperCase())}
          tt="capitalize"
          fz={10}
          fw={400}
          w={90}
          variant="light"
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>
    </TableTr>
  ));
};

type TRXDrawerProps = {
  opened: boolean;
  close: () => void;
  data: TransactionType;
};

const TRXDrawer = ({ opened, close, data }: TRXDrawerProps) => {
  const { clearData } = Transaction();

  const senderDetails = [
    { title: "Account Name", value: data.senderIban },
    { title: "Bank", value: data.recipientBankAddress },
    { title: "Account Number", value: data.recipientIban },
  ];

  const otherDetails = [
    { title: "Alert Type", value: "Debit" },
    {
      title: "Date & Time",
      value: dayjs(data.createdAt).format("DD MMM, YYYY-hh:mmA"),
    },
    { title: "Transaction ID", value: data.id },
    { title: "Status", value: data.status },
  ];
  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={() => {
        close();
        clearData();
      }}
      withCloseButton={false}
      padding={0}
    >
      <Flex justify="space-between" align="center" px={24} py={16}>
        <Text fz={20} fw={600}>
          Transactions Details
        </Text>

        <ActionIcon
          onClick={close}
          variant="transparent"
          color="var(--prune-text-gray-800)"
        >
          <IconX />
        </ActionIcon>
      </Flex>

      <Divider />
      <Box px={24} py={16}>
        <Stack gap={2}>
          <Text fz={12} c="var(--prune-text-gray-500)" fw={500}>
            Amount Received
          </Text>
          <Text c="var(--prune-primary-700)" fw={600} fz={32}>
            {formatNumber(data.amount, true, "EUR")}
          </Text>
        </Stack>

        <Divider my={24} />

        <Text fz={16} fw={600} c="var(--prune-text-gray-800)">
          Sender Details
        </Text>
        <Stack gap={12} mt={24}>
          {senderDetails.map((detail) => (
            <Group key={detail.title} justify="space-between">
              <Text c="var(--prune-text-gray-400)" fz={14} fw={400}>
                {detail.title}:
              </Text>
              <Text c="var(--prune-text-gray-600)" fz={14} fw={600}>
                {detail.value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider my={24} />

        <Text fz={16} fw={600} c="var(--prune-text-gray-800)">
          Other Details
        </Text>

        <Stack gap={12} mt={24}>
          {otherDetails.map((detail) => (
            <Group key={detail.title} justify="space-between">
              <Text c="var(--prune-text-gray-400)" fz={14} fw={400}>
                {detail.title}:
              </Text>
              {detail.title === "Status" ? (
                <Badge
                  color={approvedBadgeColor(detail.value.toUpperCase())}
                  tt="capitalize"
                  fz={10}
                  fw={400}
                  w={90}
                  variant="light"
                >
                  {detail.value.toLowerCase()}
                </Badge>
              ) : (
                <Group gap={0}>
                  {detail.title === "Alert Type" && (
                    <ActionIcon variant="transparent">
                      <IconArrowUpRight size={14} color="#D92D20" />
                    </ActionIcon>
                  )}
                  <Text
                    c={
                      // detail.title === "Alert Type"
                      //   ? "#D92D20"
                      "var(--prune-text-gray-600)"
                    }
                    fz={14}
                    fw={600}
                  >
                    {detail.value}
                  </Text>
                </Group>
              )}
            </Group>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
};
