import { TabsPanel, Flex, Paper, Image } from "@mantine/core";

import { Dispatch, SetStateAction, useState } from "react";

import TabsComponent from "@/ui/components/Tabs";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import { EURBusinessAccountTransactions } from "./EURBusiness";
import { GBPBusinessAccountTransactions } from "./GBPBusiness";

interface Props {
  panelValue: string;
  customStatusOption: string[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}
export const BusinessAccountTransactions = ({
  panelValue,
  customStatusOption,
  active,
  setActive,
}: Props) => {
  return (
    <TabsPanel value={panelValue}>
      <Paper>
        <TabsComponent
          tt="capitalize"
          tabs={tabs}
          defaultValue={tabs[0].value}
          mt={32}
          keepMounted={false}
        >
          <TabsPanel value="eur-account">
            <EURBusinessAccountTransactions
              panelValue={"eur-account"}
              customStatusOption={customStatusOption}
              active={active}
              setActive={setActive}
            />
          </TabsPanel>
          <TabsPanel value="gbp-accounts">
            <GBPBusinessAccountTransactions
              panelValue={"gbp-accounts"}
              customStatusOption={customStatusOption}
              active={active}
              setActive={setActive}
            />
          </TabsPanel>
        </TabsComponent>
      </Paper>
    </TabsPanel>
  );
};

export const tabs = [
  {
    title: "EUR Transaction",
    value: "eur-account",
    icon: <Image src={EUIcon.src} alt="icon" h={20} w={20} />,
  },
  {
    title: "GBP Transactions",
    value: "gbp-accounts",
    icon: <Image src={GBPIcon.src} alt="icon" h={20} w={20} />,
  },
];
