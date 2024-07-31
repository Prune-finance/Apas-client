import { AgGridReact } from "ag-grid-react";

import {
  Text,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  UnstyledButton,
  rem,
  Flex,
  Box,
  Paper,
  Button,
  TextInput,
  Badge,
  Group,
  TableTd,
  TableTr,
  Table,
  TableScrollContainer,
  TableTh,
  TableThead,
  TableTbody,
  Image,
  Pagination,
  Select,
} from "@mantine/core";
import {
  IconBrandLinktree,
  IconDots,
  IconDotsVertical,
  IconEye,
  IconListTree,
  IconPlus,
  IconPointFilled,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import localFont from "next/font/local";
import axios from "axios";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState, useEffect, useMemo } from "react";
import { AccountData } from "@/lib/hooks/accounts";
import { CardOne } from "@/ui/components/Cards";
import { activeBadgeColor, formatNumber } from "@/lib/utils";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import InfoCards from "../../InfoCards";
import Filter from "@/ui/components/Filter";
import { BusinessFilterType } from "../../schema";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

import { useRouter } from "next/navigation";
// import styles from "@/ui/styles/singlebusiness.module.scss";
import styles from "@/ui/styles/business.module.scss";
import { AllBusinessSkeleton } from "@/lib/static";
import EmptyImage from "@/assets/empty.png";
import { TableComponent } from "@/ui/components/Table";

const switzer = localFont({
  src: "../../../../../../assets/fonts/Switzer-Regular.woff2",
});

export default function Accounts({
  business,
}: {
  business: BusinessData | null;
}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const { handleError } = useNotification();

  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { push } = useRouter();

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const fetchCompanyAccounts = async () => {
    if (!business) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/company/${business?.id}/accounts`,
        { withCredentials: true }
      );

      setAccounts(data.data);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyAccounts();
  }, [business]);

  const volumeDetails = [
    { title: "Sandra Damasus", value: 0, formatted: true },
  ];

  const overviewDetails = [
    { title: "Total Balance", value: 0, formatted: true },
    { title: "Money In", value: 0, formatted: true },
    { title: "Money Out", value: 0, formatted: true },
    { title: "Total Transactions", value: 0 },
  ];

  const handleRowClick = (id: string) => {
    push(`/admin/businesses/accounts/${id}`);
  };

  const rows = filteredSearch(
    accounts,
    ["accountName", "accountNumber", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{index + 1}</TableTd>
      <TableTd className={styles.table__td}>{element.accountName}</TableTd>
      <TableTd className={styles.table__td}>{element.accountNumber}</TableTd>
      <TableTd className={styles.table__td}>{element.type}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
      <TableTd>{element.accountBalance}</TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={activeBadgeColor(element.status)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>
    </TableTr>
  ));

  return (
    <Box>
      <Flex gap={20} my={24}>
        <InfoCards title="Highest Volume Account" details={volumeDetails} />

        <Box flex={1}>
          <InfoCards title="Overview" details={overviewDetails} />
        </Box>
      </Flex>

      <Flex justify="space-between" align="center" mt={28} mb={24}>
        <TextInput
          placeholder="Search here..."
          leftSectionPointerEvents="none"
          leftSection={<IconSearch style={{ width: 20, height: 20 }} />}
          // classNames={{ wrapper: styles.search, input: styles.input__search }}
          value={search}
          color="var(--prune-text-gray-200)"
          onChange={(e) => setSearch(e.currentTarget.value)}
          c="#000"
        />

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
      </Flex>

      <Filter<BusinessFilterType> opened={opened} toggle={toggle} form={form} />

      <TableComponent head={tableHead} rows={rows} loading={loading} />

      {!loading && !!!rows.length && (
        <Flex direction="column" align="center" mt={70}>
          <Image src={EmptyImage.src} alt="no content" w={156} h={120} />
          <Text mt={14} fz={14} c="#1D2939">
            There are no accounts.
          </Text>
          <Text fz={10} c="#667085">
            When an account is created, it will appear here
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
          />
        </Group>
        <Pagination
          autoContrast
          color="#fff"
          total={1}
          classNames={{ control: styles.control, root: styles.pagination }}
        />
      </div>
    </Box>
  );
}

const tableHead = [
  "S/N",
  "Account Name",
  "Account Number",
  "Type",
  "Date Created",
  "Transactions",
  "Status",
];

{
  /* <Paper withBorder>
        <div
          className={`${switzer.className} ${styles.accounts___container} ag-theme-quartz`}
          style={{ height: 500 }}
        >
          <Text fz={14} fw={500} mx={20} mb={24}>
            All Accounts
          </Text>

          <AgGridReact
            rowData={rowData}
            // @ts-ignore
            columnDefs={colDefs}
          />
        </div>
      </Paper> */
}

{
  /* <CardOne
          flex={1}
          title="Total Balance"
          stat={accounts.reduce((prv, curr) => {
            return curr.accountBalance + prv;
          }, 0)}
          formatted
          colored
          withBorder
          currency="EUR"
          text={
            <Text fz={10}>
              This shows the total balance of all the accounts under this
              business
            </Text>
          }
        />

        <CardOne
          flex={1}
          title="Total Inflow"
          stat={accounts.reduce((prv, curr) => {
            return curr.accountBalance + prv;
          }, 0)}
          formatted
          withBorder
          currency="EUR"
          text={
            <Text fz={10}>
              This shows the total inflow amount of all the accounts under this
              business.
            </Text>
          }
        />

        <CardOne
          flex={1}
          title="Total Outflow"
          stat={0}
          formatted
          withBorder
          currency="EUR"
          text={
            <Text fz={10}>
              This shows the total outflow amount of all the accounts under this
              business.
            </Text>
          }
        /> */
}

// const CustomButtonComponent = (props: any) => {
//   return (
//     <div className={styles.table__td__container}>
//       <div className={styles.table__td__status}>
//         <IconPointFilled size={14} color="#12B76A" />
//         <Text tt="capitalize" fz={12} c="#12B76A">
//           {props.value}
//         </Text>
//       </div>
//     </div>
//   );
// };

const MenuComponent = (props: any) => {
  return (
    <Menu shadow="md" width={150}>
      <MenuTarget>
        <UnstyledButton>
          <IconDots size={17} />
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        <Link
          href={`/admin/businesses/accounts/${props.data["ACCOUNT NUMBER"]}`}
        >
          <MenuItem
            fz={10}
            c="#667085"
            leftSection={
              <IconEye
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            View
          </MenuItem>
        </Link>

        <MenuItem
          fz={10}
          c="#667085"
          leftSection={
            <IconBrandLinktree
              color="#667085"
              style={{ width: rem(14), height: rem(14) }}
            />
          }
        >
          Freeze
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};

// const colDefs = [
//   {
//     field: "ACCOUNT NAME",
//     filter: true,
//     floatingFilter: true,
//     checkboxSelection: true,
//   },
//   {
//     field: "ACCOUNT NUMBER",
//     filter: true,
//     floatingFilter: true,
//     cellStyle: { color: "#667085" },
//   },
//   { field: "ACCOUNT BALANCE", filter: true, floatingFilter: true },
//   { field: "TYPE", filter: true, floatingFilter: true },
//   {
//     field: "BUSINESS",
//     filter: true,
//     floatingFilter: true,
//     cellStyle: { color: "#667085" },
//   },
//   {
//     field: "DATE CREATED",
//     filter: true,
//     floatingFilter: true,
//     cellStyle: { color: "#667085" },
//   },
//   {
//     field: "STATUS",
//     cellRenderer: CustomButtonComponent,
//   },
//   {
//     field: "ACTION",
//     cellRenderer: MenuComponent,
//   },
// ];
