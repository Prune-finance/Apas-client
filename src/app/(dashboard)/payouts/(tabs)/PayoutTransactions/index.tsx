"use client";

import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";

import { IconArrowsSort } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { Fragment, Suspense } from "react";
import { AllPayoutTransactions } from "./(tabs)/All";
import { CancelledPayoutTransactions } from "./(tabs)/Cancelled";

const PayoutTrx = () => {
  return (
    <Fragment>
      <TabsComponent tabs={tabs} mt={25} tt="capitalize" keepMounted={false}>
        <TabsPanel value={tabs[0].value}>
          <AllPayoutTransactions />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <CancelledPayoutTransactions />
        </TabsPanel>
      </TabsComponent>
    </Fragment>
  );
};

const tabs = [
  { value: "All", icon: <IconArrowsSort size={14} /> },
  { value: "Cancelled", icon: <IconArrowsSort size={14} /> },
];

export const PayoutTransactions = () => {
  return (
    <Suspense>
      <PayoutTrx />
    </Suspense>
  );
};
