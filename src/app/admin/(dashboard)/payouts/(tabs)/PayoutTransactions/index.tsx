"use client";

import { usePayoutTransactions } from "@/lib/hooks/transactions";

import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";

import { IconArrowsSort, IconListTree, icons } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { Fragment, useState } from "react";
import { AllPayoutTransactions } from "./(tabs)/All";
import { CancelledPayoutTransactions } from "./(tabs)/Cancelled";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import Transaction from "@/lib/store/transaction";

export const PayoutTransactions = () => {
  const { transactions, loading, meta, revalidate } = usePayoutTransactions();

  const { data, opened, close } = Transaction();

  return (
    <Fragment>
      <TabsComponent tabs={tabs} mt={25} tt="capitalize" keepMounted={false}>
        <TabsPanel value={tabs[0].value}>
          <AllPayoutTransactions
            transactions={transactions.filter(
              (trx) => trx.status !== "CANCELLED"
            )}
            loading={loading}
          />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <CancelledPayoutTransactions
            transactions={transactions.filter(
              (trx) => trx.status === "CANCELLED"
            )}
            loading={loading}
          />
        </TabsPanel>
      </TabsComponent>

      <TransactionDrawer opened={opened} close={close} selectedRequest={data} />
    </Fragment>
  );
};

const tabs = [
  { value: "All", icon: <IconArrowsSort size={14} /> },
  { value: "Cancelled", icon: <IconArrowsSort size={14} /> },
];
