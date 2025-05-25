import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { BusinessAccountTableHeaders } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, TextBox, SelectBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { BusinessTransactionTableRows } from "@/ui/components/TableRows";
import { TabsPanel, Flex, Paper, Image } from "@mantine/core";
import { IconListTree, IconCircleArrowDown } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useDefaultAccountTransactions } from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import { calculateTotalPages } from "@/lib/utils";
import { useInfoDetails } from "@/lib/hooks/infoDetails";
import { useParam } from "@/lib/hooks/param";
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

const tabs = [
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
