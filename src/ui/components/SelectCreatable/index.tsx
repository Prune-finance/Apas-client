import { useMemo, useState } from "react";
import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";
import classes from "@/app/admin/(dashboard)/pricing-plans/styles.module.scss";

const groceries = ["Enterprise", "Startup", "Business"];

export function MultiSelectCreatable({
  setSelectedValues,
  value,
  setValue,
  placeholder,
  multiSelectData,
}: {
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  value: string[];
  placeholder?: string;
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  multiSelectData?: string[];
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [data, setData] = useState<string[]>([]);
  // const [value, setValue] = useState<string[]>([]);
  // const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useMemo(
    () => multiSelectData?.length && setData([...multiSelectData]),
    [multiSelectData]
  );

  const exactOptionMatch = data.some((item) => item === search);

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      setData((current) => [...current, search]);
      setValue((current) => [...current, search]);
      setSelectedValues((current) => [...current, search]);
    } else {
      setSelectedValues((current) =>
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val]
      );
      setValue((current) =>
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val]
      );
    }
  };

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill
      key={item}
      withRemoveButton
      onRemove={() => handleValueRemove(item)}
      fz={14}
      display="none"
    >
      {item}
    </Pill>
  ));

  const options = data
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  // onDelete(item);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          classNames={{
            input: classes.custom_multiselect_active,
          }}
          styles={{
            input: {
              border: combobox.dropdownOpened
                ? "1px solid var(--prune-primary-700)"
                : "1px solid #eaecf0",
            },
          }}
          onClick={() => combobox.openDropdown()}
          size="lg"
          label="Features:"
          labelProps={{ fz: 14 }}
        >
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                // value={[]}
                classNames={{
                  field: classes.custom_multiselect,
                }}
                value={search}
                placeholder={placeholder}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}

          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}

          {exactOptionMatch &&
            search.trim().length > 0 &&
            options.length === 0 && (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
