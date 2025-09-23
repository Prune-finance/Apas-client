"use client";

import { Center, SimpleGrid } from "@mantine/core";

import EmptyTable from "@/ui/components/EmptyTable";
import {
  useUserDefaultPayoutAccount,
  useUserDefaultPayoutAccountGBP,
} from "@/lib/hooks/accounts";

import { AccountCard } from "@/ui/components/Cards/AccountCard";

import { UserBusinessMeta, useUserBusiness } from "@/lib/hooks/businesses";
import NewAccountCard from "@/ui/components/Cards/NewAccountCard";

interface Props {
  meta?: UserBusinessMeta;
  loading: boolean;
}

export const PayoutAccount = ({ meta, loading }: Props) => {
  const {
    loading: loadingAcct,
    account,
    revalidate,
  } = useUserDefaultPayoutAccount();
  const {
    loading: loadingAcctGBP,
    account: currencyAccount,
    revalidate: revalidateGBP,
  } = useUserDefaultPayoutAccountGBP();

  return (
    <main>
      {loading && (
        <SimpleGrid cols={3} mt={32}>
          <NewAccountCard
            currency={""}
            companyName={""}
            link={`/accounts/default/1`}
            sortCode=""
            accountNumber=""
            balance={0}
            loading={loading}
            business={false}
          />
        </SimpleGrid>
      )}

      {Boolean(meta?.hasPayoutAccount) && (
        <SimpleGrid cols={3} mt={32}>
          <NewAccountCard
            currency={"EUR"}
            companyName={account?.accountName ?? "No Default Account"}
            link={`/payouts/${account?.accountNumber}/account`}
            iban={account?.accountNumber ?? "No Default Account"}
            bic={"ARPYGB21XXX"}
            balance={account?.accountBalance ?? 0}
            loading={loadingAcct}
            business={false}
            refresh
            revalidate={revalidate}
          />

          {currencyAccount &&
            currencyAccount?.length > 0 &&
            currencyAccount?.map((data) => (
              <NewAccountCard
                key={data?.id}
                currency={data?.AccountRequests?.Currency?.symbol}
                companyName={data?.accountName ?? "No Default Account"}
                walletOwner={data?.accountName ?? "No Default Account"}
                walletId={data?.walletId ?? "No Default Account"}
                link={`/accounts/default/${data?.id}?accountType=PAYOUT_ACCOUNT&currency=${data?.AccountRequests?.Currency?.symbol}`}
                sortCode="041917"
                accountNumber={data?.accountNumber}
                balance={data?.accountBalance ?? 0}
                loading={loadingAcctGBP}
                business={false}
                refresh
                revalidate={revalidateGBP}
              />
            ))}
        </SimpleGrid>
      )}

      {!Boolean(meta?.hasPayoutAccount) && (
        <Center h="calc(100vh - 250px)">
          <EmptyTable
            rows={[]}
            loading={loading}
            title="You do not have a payout account now."
            text="Your payout account would appear here once your request is approved."
          />
        </Center>
      )}
    </main>
  );
};
