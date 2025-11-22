import { Badge, TableTd, TableTr, TabsPanel, SimpleGrid } from "@mantine/core";
import localFont from "next/font/local";
import { BusinessData, useBusinessServices } from "@/lib/hooks/businesses";
import { useState, useEffect } from "react";
import {
  AccountData,
  useAdminGetCompanyCurrencyAccountsList,
  useBusinessDefaultAccount,
  useBusinessPayoutAccount,
} from "@/lib/hooks/accounts";

import { activeBadgeColor, getUserType, serialNumber } from "@/lib/utils";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useDebouncedValue } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

import { useParams, useRouter, useSearchParams } from "next/navigation";
// import styles from "@/ui/styles/singlebusiness.module.scss";
import styles from "@/ui/styles/business.module.scss";
import { TableComponent } from "@/ui/components/Table";

import { useBusinessTransactions } from "@/lib/hooks/transactions";
import PaginationComponent from "@/ui/components/Pagination";
import TabsComponent from "@/ui/components/Tabs";
import { AccountCard } from "@/ui/components/Cards/AccountCard";
import EmptyTable from "@/ui/components/EmptyTable";
import createAxiosInstance from "@/lib/axios";
import NewAccountCard from "@/ui/components/Cards/NewAccountCard";
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
  const axios = createAxiosInstance("accounts");
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

  const { account: defaultAccount, loading: loadingDefault, revalidate: revalidateDftAcct  } =
    useBusinessDefaultAccount(params.id);
  const { account: payoutAccount, loading: loadingPayout } =
    useBusinessPayoutAccount(params.id);
  const { services } = useBusinessServices(params.id);
  const {
    currencyAccount: companyCurrencyAccounts,
    loading: companyCurrencyAccountsLoading,
    revalidate: companyCurrencyAccountsRevalidate,
  } = useAdminGetCompanyCurrencyAccountsList(params.id, { type: "COMPANY_ACCOUNT"});
  

  const {
    currencyAccount: payoutCurrencyAccounts,
    loading: payoutCurrencyAccountsLoading,
    revalidate: payoutCurrencyAccountsRevalidate,
  } = useAdminGetCompanyCurrencyAccountsList(params.id, { type: "PAYOUT_ACCOUNT"});

  const {
    currencyAccount: issuedCurrencyAccounts,
    loading: issuedCurrencyAccountsLoading,
    revalidate: issuedCurrencyAccountsRevalidate,
  } = useAdminGetCompanyCurrencyAccountsList(params.id, { type: "ISSUED_ACCOUNT"});
  

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const fetchCompanyAccounts = async () => {
    if (!business) return;
    const params = new URLSearchParams(
      customParams as unknown as Record<string, string>
    );
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/admin/company/${business?.id}/accounts?${params}`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <TableTd className={styles.table__td}>
        {getUserType(element.type)}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
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

  const issuedAccountRows = filteredSearch(
    issuedCurrencyAccounts?.filter(account => account.currency === "GBP") || [],
    ["accountName", "accountNumber", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => push(`/admin/businesses/${params.id}/default/${element.id}?accountType=${element.accountType}`)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>
        {serialNumber(active, index, customParams.limit)}
      </TableTd>
      <TableTd className={styles.table__td}>{element.accountName}</TableTd>
      <TableTd className={styles.table__td}>{element.accountNumber}</TableTd>
      <TableTd className={styles.table__td}>
        {getUserType(element.accountType as any)}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
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

  const usdIssuedAccounts = issuedCurrencyAccounts?.filter(account => account.currency === "USD");

  const usdIssuedAccountRows = filteredSearch(
    usdIssuedAccounts || [],
    ["accountName", "accountNumber", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => push(`/admin/businesses/${params.id}/default/${element.id}?accountType=${element.accountType}&currency=${element.currency}`)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>
        {serialNumber(active, index, customParams.limit)}
      </TableTd>
      <TableTd className={styles.table__td}>{element.accountName}</TableTd>
      <TableTd className={styles.table__td}>{element.accountNumber}</TableTd>
      <TableTd className={styles.table__td}>
        {getUserType(element.accountType as any)}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY")}
      </TableTd>
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

  console.log({ defaultAccount, payoutAccount });
  console.log({ companyCurrencyAccounts, payoutCurrencyAccounts });
  return (
    <TabsComponent tabs={tabs} mt={24}>
      <TabsPanel value={tabs[0].value} mt={24}>
        <SimpleGrid cols={3}>
          {/* <AccountCard
            currency="EUR"
            bic="ARPYGB21XXX"
            balance={defaultAccount?.accountBalance ?? 0}
            iban={defaultAccount?.accountNumber ?? ""}
            loading={loadingDefault}
            badgeText="Main Account"
            link={`/admin/businesses/${params.id}/default?accountId=${defaultAccount?.id}`}
            business
          /> */}

          <NewAccountCard
            currency={"EUR"}
            companyName={defaultAccount?.accountName ?? "No Default Account"}
            link={`/admin/businesses/${params.id}/default?accountId=${defaultAccount?.id}`}
            iban={defaultAccount?.accountNumber ?? defaultAccount?.accountIban ?? "No Default Account"}
            bic={"ARPYGB21XXX"}
            balance={defaultAccount?.accountBalance ?? 0}
            loading={loadingDefault}
            business={false}
            refresh
            revalidate={revalidateDftAcct}
          />

        

          {payoutAccount && (
            <AccountCard
              currency="EUR"
              bic="ARPYGB21XXX"
              balance={payoutAccount?.accountBalance ?? 0}
              iban={payoutAccount?.accountNumber ?? ""}
              loading={loadingPayout}
              badgeText="Payout Account"
              link={`/admin/businesses/${params.id}/payout?accountId=${payoutAccount.id}`}
              business
              // disable
            >
              {/* <Switch
                readOnly
                label="Disabled"
                onChange={() => {}}
                checked={
                  !services.find(
                    (service) => service.serviceIdentifier === "PAYOUT_SERVICE"
                  )?.active
                }
                styles={{ label: { fontSize: "10px" } }}
                size="xs"
                labelPosition="left"
              /> */}
            </AccountCard>
          )}

           {payoutCurrencyAccounts &&
              payoutCurrencyAccounts?.length > 0 &&
              payoutCurrencyAccounts?.map((data) => (
                <NewAccountCard
                  key={data?.id}
                  currency={data?.AccountRequests?.Currency?.symbol}
                  companyName={data?.accountName ?? "No Default Account"}
                  link={`/admin/businesses/${params.id}/default/${data?.id}?currency=${data?.AccountRequests?.Currency?.symbol}`}
                  sortCode="041917"
                  iban={data?.accountIban ?? "No Default Account"}
                  bic={data?.accountBic ?? "No Default Account"}
                  accountNumber={data?.accountNumber}
                  walletId={data?.walletId ?? "No Default Account"}
                  walletOwner={data?.accountName ?? "No Default Account"}
                  balance={data?.accountBalance ?? 0}
                  loading={payoutCurrencyAccountsLoading}
                  business={false}
                  refresh
                  revalidate={payoutCurrencyAccountsRevalidate}
                />
            ))}

            {companyCurrencyAccounts &&
            companyCurrencyAccounts?.length > 0 &&
            companyCurrencyAccounts?.map((data) => (
              <NewAccountCard
                key={data?.id}
                currency={data?.AccountRequests?.Currency?.symbol}
                companyName={data?.accountName ?? "No Default Account"}
                link={`/admin/businesses/${params.id}/default/${data?.id}?currency=${data?.AccountRequests?.Currency?.symbol}`}
                sortCode="041917"
                accountNumber={data?.accountNumber}
                balance={data?.accountBalance ?? 0}
                iban={data?.accountIban ?? "No Default Account"}
                bic={"ARPYGB21"}
                loading={companyCurrencyAccountsLoading}
                business={false}
                refresh
                revalidate={companyCurrencyAccountsRevalidate}
              />
            ))}
        </SimpleGrid>
      </TabsPanel>

      <TabsPanel value={tabs[1].value}>
        <TabsComponent tabs={issuedAccountSubTabs} mt={24}>
          <TabsPanel value={issuedAccountSubTabs[0].value}>
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
          <TabsPanel value={issuedAccountSubTabs[1].value}>
            <TableComponent head={tableHead} rows={issuedAccountRows} loading={loading} />
            <EmptyTable
              rows={issuedAccountRows}
              loading={issuedCurrencyAccountsLoading}
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

          <TabsPanel value={issuedAccountSubTabs[2].value}>
            <TableComponent head={tableHead} rows={usdIssuedAccountRows} loading={loading} />
            <EmptyTable
              rows={usdIssuedAccountRows}
              loading={issuedCurrencyAccountsLoading}
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

const issuedAccountSubTabs = [
  { value: "eur-account", title: "🇪🇺 EUR Accounts" },
  { value: "gbp-accounts", title: "🇬🇧 GBP Accounts" },
  { value: "usd-accounts", title: "🇺🇸 USD Accounts" },
];