import { Button, Collapse, Flex, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IconCalendarMonth } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

type Props<T> = {
  opened: boolean;
  toggle: () => void;
  children?: ReactNode;
  form: UseFormReturnType<T>;
  isStatus?: boolean;
  approvalStatus?: boolean;
};

export default function Filter<T>({
  opened,
  toggle,
  children,
  form,
  isStatus,
  approvalStatus,
}: Props<T>) {
  const { push, replace } = useRouter();
  const pathname = usePathname();

  const handleApply = () => {
    const filteredValues = Object.fromEntries(
      Object.entries(form.values as Record<string, unknown>).filter(
        ([key, value]) => value !== null
      )
    ) as Record<string, string>;

    const params = new URLSearchParams(filteredValues).toString();

    replace(`${pathname}?${params}`);
    toggle();
  };

  return (
    <Collapse in={opened}>
      <Flex mt={24} gap={12}>
        {/* <Select
          placeholder="Sort"
          data={["Asc", "Desc"]}
          {...form.getInputProps("sort")}
          size="xs"
          w={120}
          h={36}
        /> */}
        {/* <Select
          placeholder="Rows"
          data={["10", "20", "50"]}
          {...form.getInputProps("rows")}
          size="xs"
          w={120}
          h={36}
        /> */}
        {children}

        <DateInput
          placeholder="Date Created"
          {...form.getInputProps("createdAt")}
          size="xs"
          w={120}
          h={36}
          rightSection={<IconCalendarMonth size={14} />}
        />
        {!isStatus && (
          <Select
            placeholder="Status"
            {...form.getInputProps("status")}
            data={!approvalStatus ? ["Active", "Inactive"] : approvalOptions}
            size="xs"
            w={120}
            h={36}
          />
        )}

        <Flex ml="auto" gap={12}>
          <Button
            variant="light"
            color="var(--prune-text-gray-700)"
            w={80}
            h={36}
            fz={12}
            onClick={handleApply}
          >
            Apply
          </Button>
          <Button
            variant="transparent"
            color="var(--prune-text-gray-700)"
            onClick={() => {
              form.reset();
              replace(pathname);
            }}
            // w={62}
            h={36}
            fz={12}
            px={0}
            fw={400}
          >
            Clear
          </Button>
        </Flex>
      </Flex>
    </Collapse>
  );
}

const approvalOptions = [
  "Approved",
  "Pending",
  "Rejected",
  "Confirmed",
  "Failed",
];
