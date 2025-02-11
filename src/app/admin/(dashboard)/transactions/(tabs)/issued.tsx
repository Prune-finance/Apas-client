import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { IssuedAccountTableHeaders } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, TextBox, SelectBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { IssuedTransactionTableRows } from "@/ui/components/TableRows";
import { TabsPanel, Flex } from "@mantine/core";
import { IconListTree, IconCircleArrowDown } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useTransactions } from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import { calculateTotalPages } from "@/lib/utils";
import { useInfoDetails } from "@/lib/hooks/infoDetails";
import { useParam } from "@/lib/hooks/param";

interface Props {
  panelValue: string;
  customStatusOption: string[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}
export const IssuedAccountTransactions = ({
  panelValue,
  customStatusOption,
  active,
  setActive,
}: Props) => {
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const searchParams = useSearchParams();

  const {
    status,
    type,
    senderName,
    date,
    endDate,
    recipientName,
    recipientIban,
  } = Object.fromEntries(searchParams.entries());

  const { param } = useParam({
    status,
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    type,
    senderName,
    recipientName,
    recipientIban,
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  });

  const { transactions, loading, meta } = useTransactions(undefined, param);
  const { infoDetails } = useInfoDetails(meta);

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <TabsPanel value={panelValue}>
      <InfoCards title="Overview" details={infoDetails} loading={loading}>
        {/* <Select
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
          /> */}
      </InfoCards>
      <Flex justify="space-between" align="center" mt={38}>
        <SearchInput search={search} setSearch={setSearch} />

        <Flex gap={12}>
          <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
          <SecondaryBtn
            text="Download Statement"
            // action={toggle}
            icon={IconCircleArrowDown}
          />
        </Flex>
      </Flex>

      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        customStatusOption={customStatusOption}
      >
        <TextBox
          placeholder="Sender Name"
          {...form.getInputProps("senderName")}
        />
        <TextBox
          placeholder="Beneficiary Name"
          {...form.getInputProps("recipientName")}
        />
        <TextBox
          placeholder="Beneficiary IBAN"
          {...form.getInputProps("recipientIban")}
        />
        <SelectBox
          placeholder="Type"
          {...form.getInputProps("type")}
          data={["DEBIT", "CREDIT"]}
        />
      </Filter>
      <TableComponent
        head={IssuedAccountTableHeaders}
        rows={<IssuedTransactionTableRows data={transactions} />}
        loading={loading}
      />
      <EmptyTable
        rows={transactions}
        loading={loading}
        text="Transactions will be shown here"
        title="There are no transactions"
      />
      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total || 0)}
      />
    </TabsPanel>
  );
};
