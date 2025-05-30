import form from "@/app/auth/[id]/register/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import {
  Paper,
  Button,
  Title,
  Select,
  Flex,
  TextInput,
  Drawer,
  Text,
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Stack,
  TableTd,
  TableTr,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconSearch,
  IconListTree,
  IconArrowUpRight,
  IconCircleArrowDown,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import InfoCards from "../Cards/InfoCards";
import EmptyTable from "../EmptyTable";
import Filter from "../Filter";
import PaginationComponent from "../Pagination";
import { TableComponent } from "../Table";
import { useParams, useRouter } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import Transaction from "@/lib/store/transaction";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { TransactionType } from "@/lib/hooks/transactions";
import {
  frontendPagination,
  formatNumber,
  approvedBadgeColor,
} from "@/lib/utils";
import dayjs from "dayjs";

import styles from "./styles.module.scss";

type Props = {
  transactions: TransactionType[];
  loadingTrx: boolean;
};

export default function SingleAccountTransaction({
  transactions,
  loadingTrx,
}: Props) {
  const params = useParams<{ id: string }>();
  const { back } = useRouter();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);
  const { data, close, opened: openedDrawer } = Transaction();

  const infoDetails = [
    // {
    //   title: "Total Business",
    //   value: 0,
    // },
    {
      title: "Money In",
      value: 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money Out",
      value: transactions.reduce((acc, curr) => acc + curr.amount, 0),
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
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Paper p={20} mt={16}>
      <Button
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
      </Button>

      <Title c="var(--prune-text-gray-700)" fz={24} fw={600} my={28}>
        Transactions
      </Title>

      <InfoCards title="Overview" details={infoDetails} loading={loadingTrx}>
        <Select
          data={["Last Week", "Last Month"]}
          variant="filled"
          placeholder="Last Week"
          defaultValue={"Last Week"}
          w={120}
          // h={22}
          color="var(--prune-text-gray-500)"
          styles={{
            input: {
              outline: "none",
              border: "none",
            },
            option: { fontSize: "12px" },
          }}
        />
      </InfoCards>

      <Flex justify="space-between" align="center" mt={38}>
        <TextInput
          placeholder="Search here..."
          leftSectionPointerEvents="none"
          // leftSection={searchIcon}
          leftSection={<IconSearch style={{ width: 20, height: 20 }} />}
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

      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        approvalStatus
      />

      <TableComponent
        head={tableHeaders}
        rows={
          <RowComponent
            data={transactions}
            id={params.id}
            search={debouncedSearch}
            active={active}
            limit={limit}
          />
        }
        loading={loadingTrx}
      />

      <EmptyTable
        rows={transactions}
        loading={loadingTrx}
        title="There are no transactions"
        text="When transactions are created, it will appear here."
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil(
          filteredSearch(transactions, searchProps, search).length /
            parseInt(limit ?? "10", 10)
        )}
      />

      {data && <TRXDrawer opened={openedDrawer} close={close} data={data} />}
    </Paper>
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

const searchProps = ["senderIban", "recipientIban", "recipientBankAddress"];

const RowComponent = ({
  data,
  id,
  search,
  active,
  limit,
}: {
  data: TransactionType[];
  id: string;
  search: string;
  active: number;
  limit: string | null;
}) => {
  const { open, setData } = Transaction();
  return frontendPagination(
    filteredSearch(data, searchProps, search),
    active,
    parseInt(limit ?? "10", 10)
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
        {dayjs(element.createdAt).format("DD MMM, YYYY - hh:mm A")}
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
      value: dayjs(data.createdAt).format("DD MMM, YYYY - hh:mm A"),
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
                      <IconArrowUpRight
                        size={14}
                        color="var(--prune-warning)"
                      />
                    </ActionIcon>
                  )}
                  <Text c="var(--prune-text-gray-600)" fz={14} fw={600}>
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
