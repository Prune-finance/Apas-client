import Cookies from "js-cookie";

import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  UnstyledButton,
  rem,
  Badge,
  TableTd,
  TableTr,
  TabsPanel,
  SimpleGrid,
} from "@mantine/core";
import { IconBrandLinktree, IconDots, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import localFont from "next/font/local";
import axios from "axios";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState, useEffect, useMemo } from "react";
import { AccountData, useBusinessDefaultAccount } from "@/lib/hooks/accounts";

import { activeBadgeColor, formatNumber, serialNumber } from "@/lib/utils";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

import { useParams, useRouter, useSearchParams } from "next/navigation";
// import styles from "@/ui/styles/singlebusiness.module.scss";
import styles from "@/ui/styles/business.module.scss";
import { TableComponent } from "@/ui/components/Table";

import {
  useBusinessTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";
import PaginationComponent from "@/ui/components/Pagination";
import TabsComponent from "@/ui/components/Tabs";
import { AccountCard } from "@/ui/components/Cards/AccountCard";
import EmptyTable from "@/ui/components/EmptyTable";

const switzer = localFont({
  src: "../../../../../../assets/fonts/Switzer-Regular.woff2",
});

export default function Accounts({
  business,
}: {
  business: BusinessData | null;
}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  // const [defaultAccount, setDefaultAccount] = useState<AccountData | null>(
  //   null
  // );
  const [meta, setMeta] = useState<{ total: number } | null>(null);
  const { handleError } = useNotification();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { push } = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const status = searchParams.get("status")?.toUpperCase();
  const createdAt = searchParams.get("createdAt");

  const customParams = {
    page: active,
    limit: isNaN(Number(limit)) ? 10 : parseInt(limit ?? "10", 10),
    ...(status && { status }),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
  };
  const {
    loading: loadingTrx,
    transactions,
    meta: bizTrxMeta,
  } = useBusinessTransactions(params.id, customParams);

  const { account: defaultAccount } = useBusinessDefaultAccount(params.id);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const fetchCompanyAccounts = async () => {
    if (!business) return;
    const params = new URLSearchParams(
      customParams as unknown as Record<string, string>
    );
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/company/${business?.id}/accounts?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setAccounts(data.data);
      setMeta(data.meta);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  // const fetchCompanyDefaultAccount = async () => {
  //   if (!business) return;
  //   const params = new URLSearchParams(
  //     customParams as unknown as Record<string, string>
  //   );
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.get(
  //       `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/company/${business?.id}/default-account?${params}`,
  //       { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
  //     );

  //     setDefaultAccount(data.data);
  //   } catch (error) {
  //     handleError("An error occurred", parseError(error));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchCompanyAccounts();
    // fetchCompanyDefaultAccount();
  }, [
    business,
    customParams.limit,
    customParams.page,
    customParams.date,
    customParams.status,
  ]);

  const volumeDetails = [
    ...(Object.keys(bizTrxMeta?.hva ?? {}).length > 0
      ? [
          {
            title: bizTrxMeta?.hva.accountName || "",
            value: bizTrxMeta?.hva.amount,
            formatted: true,
            currency: "EUR",
            flexedGroup: true,
          },
        ]
      : []),
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
      <TableTd className={styles.table__td}>
        {serialNumber(active, index, customParams.limit)}
      </TableTd>
      <TableTd className={styles.table__td}>{element.accountName}</TableTd>
      <TableTd className={styles.table__td}>{element.accountNumber}</TableTd>
      <TableTd className={styles.table__td}>{element.type}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
      {/* <TableTd>{element.accountBalance}</TableTd> */}
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
    <TabsComponent tabs={tabs} mt={24}>
      <TabsPanel value={tabs[0].value} mt={24}>
        <SimpleGrid cols={3}>
          <AccountCard
            currency="EUR"
            bic="ARPYGB21XXX"
            balance={defaultAccount?.accountBalance ?? 0}
            iban={defaultAccount?.accountNumber ?? ""}
            loading={loading}
            badgeText="Main Account"
            link={`/admin/businesses/${params.id}/default`}
          />
        </SimpleGrid>
      </TabsPanel>

      <TabsPanel value={tabs[1].value}>
        <TableComponent head={tableHead} rows={rows} loading={loading} />

        <EmptyTable
          rows={rows}
          loading={loading}
          text="When an account is created, it will appear here"
          title="There are no accounts"
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil(
            (meta?.total ?? 0) / (parseInt(limit ?? "10", 10) || 10)
          )}
        />
      </TabsPanel>
    </TabsComponent>
  );
}

const tabs = [{ value: "Own Account" }, { value: "Issued Accounts" }];

const tableHead = [
  "S/N",
  "Account Name",
  "Account Number",
  "Type",
  "Date Created",
  // "Transactions",
  "Status",
];

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
