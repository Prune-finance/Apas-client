import { TrxData } from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import {
  Drawer,
  Flex,
  Box,
  Divider,
  Text,
  Badge,
  Stack,
  Group,
} from "@mantine/core";
import {
  IconX,
  IconArrowUpRight,
  IconPointFilled,
  IconCircleArrowDown,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import styles from "./styles.module.scss";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";

interface TransactionDrawerProps {
  selectedRequest: TrxData | null;
  close: () => void;
  opened: boolean;
}

export const TransactionDrawer = ({
  selectedRequest,
  close,
  opened,
}: TransactionDrawerProps) => {
  const beneficiaryDetails = {
    "Account Name": "N/A",
    IBAN: selectedRequest?.recipientIban,
    BIC: selectedRequest?.recipientBic,
    "Bank Name": selectedRequest?.recipientBankAddress,
    "Bank Address": "N/A",
    Country: selectedRequest?.recipientBankCountry,
  };

  const senderDetails = {
    "Account Name": "N/A",
    IBAN: selectedRequest?.senderIban,
    BIC: "N/A",
  };

  const otherDetails = {
    "Alert Type": (
      <Badge
        leftSection={<IconArrowUpRight size={14} />}
        color="var(--prune-warning)"
        variant="transparent"
        tt="capitalize"
      >
        Debit
      </Badge>
    ),
    "Date and Time": dayjs(selectedRequest?.createdAt).format(
      "Do MMMM, YYYY - HH:mma"
    ),
    "Transaction ID": selectedRequest?.id,
    "Status:": <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };
  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      title={
        <Text fz={18} fw={600} c="#1D2939" ml={28}>
          Transaction Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      size="30%"
      padding={0}
    >
      <Divider mb={20} />
      <Box px={28} pb={28}>
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12}>
            Amount Sent
          </Text>

          <Text c="#97AD05" fz={32} fw={600}>
            {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
          </Text>
        </Flex>

        <Divider mt={30} mb={20} />

        <Text
          fz={16}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
          Beneficiary Details
        </Text>

        <Stack gap={24}>
          {Object.entries(beneficiaryDetails).map(([key, value]) => (
            <Group justify="space-between" key={key}>
              <Text fz={12} c="var(--prune-text-gray-500)">
                {key}:
              </Text>

              <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider mt={30} mb={20} />

        <Text
          fz={16}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
          Sender Details
        </Text>

        <Stack gap={24}>
          {Object.entries(senderDetails).map(([key, value]) => (
            <Group justify="space-between" key={key}>
              <Text fz={12} c="var(--prune-text-gray-500)">
                {key}:
              </Text>

              <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider mt={30} mb={20} />

        <Text
          fz={16}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
          Other Details
        </Text>

        <Stack gap={24}>
          {Object.entries(otherDetails).map(([key, value]) => (
            <Group justify="space-between" key={key}>
              <Text fz={12} c="var(--prune-text-gray-500)">
                {key}:
              </Text>

              <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider mt={30} mb={20} />

        <PrimaryBtn
          icon={IconCircleArrowDown}
          text="Download Receipt"
          fullWidth
          fw={600}
        />
      </Box>
    </Drawer>
  );
};
