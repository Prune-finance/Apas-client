"use client";

import { Center, SimpleGrid } from "@mantine/core";

import EmptyTable from "@/ui/components/EmptyTable";
import { useUserDefaultPayoutAccount } from "@/lib/hooks/accounts";

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

  return (
    <main>
      {Boolean(meta?.hasPayoutAccount) && (
        <SimpleGrid cols={3} mt={32}>
          <NewAccountCard
            currency={"EUR"}
            companyName={account?.accountName ?? "No Default Account"}
            link={`/accounts/default`}
            iban={account?.accountNumber ?? "No Default Account"}
            bic={"ARPYGB21XXX"}
            balance={account?.accountBalance ?? 0}
            loading={loadingAcct}
            business={false}
            refresh
            revalidate={revalidate}
          />

          <NewAccountCard
            currency={"GBP"}
            companyName={account?.accountName ?? "No Default Account"}
            link={`/accounts/default/1`}
            sortCode="567890"
            accountNumber="567890"
            balance={account?.accountBalance ?? 0}
            loading={loadingAcct}
            business={false}
            refresh
            revalidate={revalidate}
          />

          {/* <AccountCard
            balance={account?.accountBalance ?? 0}
            currency="EUR"
            companyName={account?.accountName ?? "No Default Account"}
            badgeText="Payout Account"
            iban={account?.accountNumber ?? "No Default Account"}
            bic={"ARPYGB21XXX"}
            loading={loadingAcct}
            link={`/payouts/${account?.id}/account`}
            refresh
            revalidate={revalidate}
          /> */}
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
