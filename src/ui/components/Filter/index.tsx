import { Button, Collapse, Flex, Group, Select, Text } from "@mantine/core";
import { DateInput, DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IconCalendarMonth, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { SecondaryBtn } from "../Buttons";
import dayjs from "dayjs";

type Props<T> = {
  opened: boolean;
  toggle: () => void;
  children?: ReactNode;
  form: UseFormReturnType<T>;
  isStatus?: boolean;
  approvalStatus?: boolean;
  frozenStatus?: boolean;
  customStatusOption?: string[];
};

export default function Filter<T>({
  opened,
  toggle,
  children,
  form,
  isStatus,
  approvalStatus,
  frozenStatus,
  customStatusOption,
}: Props<T>) {
  const { push, replace } = useRouter();
  const pathname = usePathname();

  // const handleApply = () => {
  //   const filteredValues = Object.fromEntries(
  //     Object.entries(form.values as Record<string, unknown>).filter(
  //       ([key, value]) => value !== null
  //     ).map(([key, val]) => ({
  //       createdAt: val[0].
  //       ...val
  //     }))
  //   ) as Record<string, string>;

  //   const params = new URLSearchParams(filteredValues).toString();

  //   replace(`${pathname}?${params}`);
  //   toggle();
  // };

  const handleApply = () => {
    const filteredValues = Object.fromEntries(
      Object.entries(form.values as Record<string, unknown>)
        .filter(([key, value]) => value)
        .map(([key, val]) => {
          // Format the createdAt field if it exists and is valid
          if (key === "createdAt" && Array.isArray(val) && val.length === 2) {
            const [startDate, endDate] = val as [Date | null, Date | null];
            const formattedCreatedAt = `${dayjs(startDate).format(
              "YYYY-MM-DD"
            )} - ${dayjs(endDate).format("YYYY-MM-DD")}`;
            return [key, formattedCreatedAt];
          }

          // Format the status field if it exists and is valid, turning it to uppercase
          if (key === "status" && typeof val === "string") {
            const status = val.toUpperCase();
            return [key, status];
          }

          // Return other fields as they are
          return [key, val];
        })
    ) as Record<string, string>;

    const params = new URLSearchParams(filteredValues).toString();

    replace(`${pathname}?${params}`);
  };

  return (
    <Collapse in={opened}>
      <Group justify="space-between" align="center" mt={24} mb={20}>
        <Text fz={14} fw={600} c="var(--prune-text-gray-700)">
          Filter By
        </Text>

        <SecondaryBtn icon={IconX} action={toggle} text="Close" p={10} />
      </Group>
      <Flex gap={12} align="center" h={40}>
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

        <DatePickerInput
          placeholder="Date Range"
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps("createdAt")}
          size="xs"
          w={210}
          h={36}
          type="range"
          allowSingleDateInRange
          leftSection={<IconCalendarMonth size={14} />}
          numberOfColumns={2}
          clearable
        />
        {!isStatus && (
          <Select
            placeholder="Status"
            {...form.getInputProps("status")}
            data={
              customStatusOption && customStatusOption?.length > 0
                ? customStatusOption
                : approvalStatus
                ? approvalOptions
                : frozenStatus
                ? frozenActiveOptions
                : ["Active", "Inactive", "Frozen", "Deactivated"]
            }
            size="xs"
            w={120}
            h={36}
          />
        )}

        <Flex
          // ml="auto"
          gap={12}
        >
          <Button
            variant="light"
            color="var(--prune-text-gray-700)"
            w={80}
            // h={30}
            fz={12}
            size="xs"
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
            // h={36}
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
  "Cancelled",
  "Pending",
  "Rejected",
  "Confirmed",
  "Failed",
];

const frozenActiveOptions = ["Active", "Inactive", "Frozen"];
