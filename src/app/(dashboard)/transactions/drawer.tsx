import { TrxData } from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import { Drawer, Flex, Box, Divider, Text } from "@mantine/core";
import { IconX, IconArrowUpRight, IconPointFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import styles from "./styles.module.scss";
import { BadgeComponent } from "@/ui/components/Badge";

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
  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      withCloseButton={false}
      size="30%"
    >
      <Flex justify="space-between" pb={28}>
        <Text fz={18} fw={600} c="#1D2939">
          Transaction Details
        </Text>

        <IconX onClick={close} />
      </Flex>

      <Box>
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12}>
            Amount Sent
          </Text>

          <Text c="#97AD05" fz={32} fw={600}>
            {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
          </Text>
        </Flex>

        <Divider mt={30} mb={20} />

        <Text fz={16} mb={24}>
          Receiver Details
        </Text>

        <Flex direction="column" gap={30}>
          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Account IBAN:
            </Text>

            <Text fz={14}>{selectedRequest?.recipientIban}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Bank:
            </Text>

            <Text fz={14}>{selectedRequest?.recipientBankAddress}</Text>
          </Flex>
        </Flex>

        <Divider my={30} />

        <Text fz={16} mb={24}>
          Other Details
        </Text>

        <Flex direction="column" gap={30}>
          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Alert Type
            </Text>

            <Flex align="center">
              <IconArrowUpRight
                color="#F04438"
                size={16}
                className={styles.table__td__icon}
                // style={{ marginTop: "-20px" }}
              />

              <Text c="#F04438" fz={14}>
                Debit
              </Text>
            </Flex>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Date and Time
            </Text>

            <Text fz={14}>
              {dayjs(selectedRequest?.createdAt).format(
                "DD MMMM, YYYY - HH:mm"
              )}
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Transaction ID
            </Text>

            <Text fz={14}>{selectedRequest?.id}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Status:
            </Text>

            <BadgeComponent status={selectedRequest?.status ?? ""} />
          </Flex>
        </Flex>
      </Box>
    </Drawer>
  );
};
