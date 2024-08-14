import { TransactionType, TrxData } from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import {
  Badge,
  Box,
  Divider,
  Drawer,
  Flex,
  Group,
  Stack,
  Text,
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
import Transaction from "@/lib/store/transaction";

type Props = {
  // close: () => void;
  // transaction: TransactionType | null;
  // opened: boolean;
};

export const AccountTransactionDrawer = ({}: Props) => {
  const { data: transaction, close, opened, clearData } = Transaction();
  const beneficiaryDetails = {
    "Account Name": transaction?.recipientBankCountry,
    "Account Number/IBAN": transaction?.recipientIban,
    "Bank Name": transaction?.recipientBankAddress,
    BIC: transaction?.recipientBic,
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
    "Date & Time": dayjs(transaction?.createdAt).format(
      "Do MMMM, YYYY - hh:mmA"
    ),
    "Transaction ID": transaction?.id,
    Status: <BadgeComponent status={transaction?.status ?? ""} w={100} />,
  };

  const intermediaryDetails = {
    Name: "Blessing John",
    Email: "blessingjohn@gmail.com",
    Address: "5, Kalu Str, Maitia, Uk",
    Invoice: (
      <PrimaryBtn
        text="INV-0237"
        td="underline"
        variant="transparent"
        c="var(--prune-primary-700)"
        fz={14}
        fw={500}
        px={0}
      />
    ),
  };

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close();
        clearData();
      }}
      position="right"
      title={
        <Text ml={28} fz={18} fw={600} c="#1D2939">
          Transaction Details
        </Text>
      }
      closeButtonProps={{ mr: 28 }}
      //   withCloseButton={false}
      size="520px"
      padding={0}
    >
      <Divider mb={20} />

      <Box
        px={28}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
        mih="calc(100vh - 100px)"
      >
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12}>
            Amount Sent
          </Text>

          <Text c="#97AD05" fz={32} fw={600}>
            {formatNumber(transaction?.amount || 0, true, "EUR")}
          </Text>
        </Flex>

        <Divider my={20} />

        <Text fz={16} mb={24}>
          Beneficiary Details
        </Text>

        <Stack gap={28}>
          {Object.entries(beneficiaryDetails).map(([key, value], index) => (
            <Group key={index} justify="space-between">
              <Text fz={14} c="var(--prune-text-gray-400)" fw={400}>
                {`${key}:`}
              </Text>

              <Text fz={14} c="var(--prune-text-gray-600)" fw={500}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        {/* <Divider my={30} />

        <Text fz={16} mb={24}>
          Intermediary Details
        </Text>

        <Stack gap={28}>
          {Object.entries(intermediaryDetails).map(([key, value], index) => (
            <Group key={index} justify="space-between">
              <Text fz={14} c="var(--prune-text-gray-400)" fw={400}>
                {`${key}:`}
              </Text>

              <Text fz={14} c="var(--prune-text-gray-600)" fw={500}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack> */}

        <Divider my={30} />

        <Text fz={16} mb={24}>
          Other Details
        </Text>

        <Stack gap={28} mb={20}>
          {Object.entries(otherDetails).map(([key, value], index) => (
            <Group key={index} justify="space-between">
              <Text fz={14} c="var(--prune-text-gray-400)" fw={400}>
                {`${key}:`}
              </Text>

              <Text fz={14} c="var(--prune-text-gray-600)" fw={500}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        <PrimaryBtn
          icon={IconCircleArrowDown}
          text="Download Receipt"
          fullWidth
          //   flex={1}
          mt={"auto"}
          mb="md"
          fw={600}
        />
      </Box>
    </Drawer>
  );
};
