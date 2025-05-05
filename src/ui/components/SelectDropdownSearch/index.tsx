import { useEffect, useState } from "react";
import {
  Combobox,
  Group,
  Input,
  InputBase,
  useCombobox,
  Text,
  Avatar,
  Stack,
  ScrollArea,
  Flex,
  rem,
} from "@mantine/core";
import { AccountData, useUserAccounts } from "@/lib/hooks/accounts";
import { filteredSearch } from "@/lib/search";
import styles from "./styles.module.scss";
import { formatNumber } from "@/lib/utils";
import { countriesWithCode } from "@/lib/countries-codes-flags";

interface Item {
  name: string;
  iban: string;
  bic: string;
  acc: string;
}

function SelectOption({ name, iban, bic, acc }: Item) {
  return (
    <Flex
      // c="var(--prune-primary-900)"
      gap={8}
      align="center"
    >
      <Avatar color="var(--prune-primary-700)" variant="filled" size={28}>
        {name
          .split(" ")
          .map((i) => i.charAt(0))
          .join("")}
      </Avatar>
      <Stack gap={4}>
        <Text fz={12}>{name}</Text>
        <Group>
          <Text inline fw={700} fz={11}>
            IBAN:{" "}
            <Text span inherit fw={400}>
              {iban}
            </Text>
          </Text>
          <Text inline fw={700} fz={11}>
            BIC:{" "}
            <Text span inherit fw={400}>
              {bic}
            </Text>
          </Text>
          <Text inline fw={700} fz={11}>
            Account Balance:{" "}
            <Text span inherit fw={400}>
              {formatNumber(Number(acc), true, "EUR")}
            </Text>
          </Text>
        </Group>
      </Stack>
    </Flex>
  );
}

interface Props {
  setValue: (val: string) => void;
  value: string;
  label?: string;
  accountsData?: AccountData[];
  disabled?: boolean;
}

export function SelectDropdownSearch({
  value,
  setValue,
  label,
  accountsData,
  disabled,
}: Props) {
  const [search, setSearch] = useState("");
  const { accounts, loading } = useUserAccounts({ limit: 1000 });
  const [localAccounts, setLocalAccounts] = useState<AccountData[] | undefined>(
    accountsData
  );

  useEffect(() => {
    setLocalAccounts((prev) => (accounts.length > 0 ? accounts : accountsData));
  }, [accounts, accountsData]);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  // const [value, setValue] = useState<string | null>(null);

  // .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
  const options = filteredSearch(
    localAccounts ?? [],
    ["accountName", "accountNumber"],
    search
  ).map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      <SelectOption
        name={item?.accountName}
        iban={item?.accountNumber}
        bic={String(item?.accountId)}
        acc={String(item?.accountBalance)}
      />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          labelProps={{ mb: 10, fz: 12 }}
          label={label ?? "Account"}
          disabled={disabled}
          size="md"
          radius="md"
          classNames={{ input: styles.input }}
        >
          {localAccounts?.find((item) => item.id === value)?.accountName || (
            <Input.Placeholder>Select Account</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search for IBAN or Account Name"
        />
        <Combobox.Options>
          <ScrollArea h={209} scrollbars="y" scrollbarSize={3}>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Loading...</Combobox.Empty>
            )}
          </ScrollArea>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export function SelectCountryDialCode({ value, setValue }: Props) {
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  // const [value, setValue] = useState<string | null>(null);

  const options = countriesWithCode
    .filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item) => (
      <Combobox.Option value={item.value} key={item.value}>
        {item.label}
      </Combobox.Option>
    ));

  return (
    <Combobox
      width={300}
      store={combobox}
      withinPortal
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          styles={{
            input: {
              fontWeight: 500,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              // borderRight: "none",
              width: rem(50),
              marginLeft: rem(-2),
              // border: "1px solid var(--prune-primary-700)",
              fontSize: rem(12),
            },

            section: {
              width: rem(70),
            },
          }}
          classNames={{ input: styles.input_country_code }}
        >
          {countriesWithCode
            .find((val) => val.value === value)
            ?.label.split(" ")[0] || (
            <Input.Placeholder>{""}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search country code"
        />

        <ScrollArea.Autosize type="scroll" mah={200}>
          {options}
        </ScrollArea.Autosize>
      </Combobox.Dropdown>
    </Combobox>
  );
}
