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
  IconX,
} from "@tabler/icons-react";
import styles from "../styles.module.scss";

import { useParams, useRouter } from "next/navigation";

import InfoCards from "@/ui/components/Cards/InfoCards";
import Filter from "@/ui/components/Filter";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { formatNumber } from "@/lib/utils";
import Transaction from "@/lib/store/transaction";
import { useSingleAccount } from "@/lib/hooks/accounts";

export default function TransactionForAccount() {
  const params = useParams<{ id: string }>();

  const { loading, account } = useSingleAccount(params.id);
  const { back } = useRouter();

  const [opened, { toggle }] = useDisclosure(false);
  const { data, close, opened: openedDrawer } = Transaction();

  const infoDetails = [
    {
      title: "Total Business",
      value: 0,
    },
    {
      title: "Money In",
      value: 0,
      formatted: true,
    },
    {
      title: "Money Out",
      value: 0,
      formatted: true,
    },
    {
      title: "Total Transactions",
      value: 0,
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
          { title: "Accounts", href: "/admin/accounts" },
          ...(account?.accountName
            ? [
                {
                  title: account?.accountName,
                  href: `/admin/accounts/${params.id}`,
                },
              ]
            : []),
          {
            title: "Transactions",
            href: `/admin/accounts/${params.id}/transactions`,
          },
        ]}
      />

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

        <InfoCards title="Overview" details={infoDetails}>
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
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            // value={search}
            color="var(--prune-text-gray-200)"
            // onChange={(e) => setSearch(e.currentTarget.value)}
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
              c="#000"
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
              c="#000"
            >
              Download Statement
            </Button>
          </Flex>
        </Flex>

        <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

        <TableScrollContainer minWidth={500} mt={20}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                {tableHeaders.map((header) => (
                  <TableTd key={header} className={`${styles.table__th}`}>
                    {header}
                  </TableTd>
                ))}
              </TableTr>
            </TableThead>
            <TableTbody>
              <RowComponent data={tableData.slice(0, 3)} id={params.id} />
            </TableTbody>
          </Table>
        </TableScrollContainer>

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

const RowComponent = ({ data, id }: { data: TableData[]; id: string }) => {
  const { open, setData } = Transaction();
  return data.map((element) => (
    <TableTr
      key={element.AccName}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.AccName}</TableTd>
      <TableTd className={styles.table__td}>{element.Biz}</TableTd>
      <TableTd className={styles.table__td}>{element.AccNum}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <Group gap={3}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
          />
          {formatNumber(element.Amount)}
          {/* <Text fz={12}></Text> */}
        </Group>
      </TableTd>
      <TableTd className={styles.table__td}>{element.Date}</TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          w={90}
          size="xs"
          variant="light"
          tt="capitalize"
          color={element.Status === "successful" ? "green" : "red"}
        >
          {element.Status}
        </Badge>
      </TableTd>
    </TableTr>
  ));
};

const tableData = [
  {
    AccName: "Matthew Philips",
    Biz: "Wema",
    Amount: 200000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
  {
    AccName: "Agatha Goldie",
    Biz: "UBA",
    Amount: 300000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
  {
    AccName: "Omar Zeeda",
    Biz: "FCMB",
    Amount: 250000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "failed",
  },
  {
    AccName: "Sharon Akindele",
    Biz: "Zenith Bank",
    Amount: 400000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
  {
    AccName: "Bethel Teddy",
    Biz: "FCMB",
    Amount: 150000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
];

type TRXDrawerProps = { opened: boolean; close: () => void; data: TableData };

const TRXDrawer = ({ opened, close, data }: TRXDrawerProps) => {
  const { clearData } = Transaction();

  const senderDetails = [
    { title: "Account Name", value: data.AccName },
    { title: "Bank", value: data.Biz },
    { title: "Account Number", value: data.AccNum },
  ];

  const otherDetails = [
    { title: "Alert Type", value: "Credit" },
    { title: "Date & Time", value: data.Date },
    { title: "Transaction ID", value: "1234567890" },
    { title: "Status", value: data.Status },
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
            {formatNumber(data.Amount)}
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
                  w={90}
                  size="xs"
                  variant="light"
                  tt="capitalize"
                  color={detail.value === "successful" ? "green" : "red"}
                >
                  {detail.value}
                </Badge>
              ) : (
                <Group gap={0}>
                  {detail.title === "Alert Type" && (
                    <ActionIcon variant="transparent">
                      <IconArrowDownLeft size={14} />
                    </ActionIcon>
                  )}
                  <Text
                    c={
                      detail.title === "Alert Type"
                        ? "#0065FF"
                        : "var(--prune-text-gray-600)"
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
