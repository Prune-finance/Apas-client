import { useState } from "react";
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
} from "@mantine/core";
import { useUserAccounts } from "@/lib/hooks/accounts";
import { filteredSearch } from "@/lib/search";

interface Item {
  name: string;
  iban: string;
  bic: string;
}

function SelectOption({ name, iban, bic }: Item) {
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
          <Text inline fw={700} fz={11} truncate w="60%">
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
        </Group>
      </Stack>
    </Flex>
  );
}

interface Props {
  setValue: (val: string) => void;
  value: string;
}

export function SelectDropdownSearch({ value, setValue }: Props) {
  const [search, setSearch] = useState("");
  const { accounts, loading } = useUserAccounts({ limit: 1000 });
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
    accounts,
    ["accountName", "accountNumber"],
    search
  ).map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      <SelectOption
        name={item.accountName}
        iban={item.accountNumber}
        bic={String(item.accountId)}
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
          label={"Account"}
          size="md"
          radius="md"
        >
          {accounts.find((item) => item.id === value)?.accountName || (
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
            {options.length > 0 && !loading ? (
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
