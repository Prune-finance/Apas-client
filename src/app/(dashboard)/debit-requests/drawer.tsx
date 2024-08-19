import { DebitRequest } from "@/lib/hooks/requests";
import { formatNumber } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Drawer, Flex, Box, Divider, Text, Stack, Group } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
type Props = {
  opened: boolean;
  close: () => void;
  selectedRequest: DebitRequest | null;
};

export const DebitRequestDrawer = ({
  opened,
  close,
  selectedRequest,
}: Props) => {
  const accountDetails = {
    "Source Account": selectedRequest?.Account.accountName,
    "Date Created": dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };

  const destDetails = {
    IBAN: selectedRequest?.destinationIBAN,
    BIC: selectedRequest?.destinationBIC,
    Country: selectedRequest?.destinationCountry,
    Bank: selectedRequest?.destinationBank,
    Reference: selectedRequest?.reference,
  };

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
          Debit Request Details
        </Text>

        <IconX onClick={close} />
      </Flex>

      <Box>
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Text c="#8B8B8B" fz={12} tt="uppercase">
              Amount
            </Text>

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Stack>

          <PrimaryBtn text="Cancel Request" color="#B42318" c="#fff" fw={600} />
        </Group>

        <Divider mt={30} mb={20} />

        <Text fz={16} mb={24} fw={500}>
          Account Details
        </Text>

        <Flex direction="column" gap={30}>
          {Object.entries(accountDetails).map(([key, value]) => (
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                {`${key}:`}
              </Text>

              <Text fz={14}>{value}</Text>
            </Flex>
          ))}
        </Flex>

        <Divider my={30} />

        <Text fz={16} mb={24} fw={500}>
          Destination Details
        </Text>

        <Flex direction="column" gap={30}>
          {Object.entries(destDetails).map(([key, value]) => (
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                {`${key}:`}
              </Text>

              <Text fz={14}>{value}</Text>
            </Flex>
          ))}
        </Flex>

        <Divider my={30} />

        <Text fz={16} c="#1D2939" fw={500}>
          Reason
        </Text>

        <div
          style={{
            marginTop: "15px",
            background: "#F9F9F9",
            padding: "12px 16px",
          }}
        >
          <Text fz={14} c="#667085">
            {selectedRequest?.reason || ""}
          </Text>
        </div>
      </Box>
    </Drawer>
  );
};
