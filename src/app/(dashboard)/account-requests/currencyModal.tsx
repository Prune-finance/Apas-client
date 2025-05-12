import React from "react";
import { BadgeComponent } from "@/ui/components/Badge";

import { Box, Flex, Modal, Text } from "@mantine/core";
import dayjs from "dayjs";
import { CurrencyRequest } from "@/lib/hooks/requests";

interface CurrencyRequestProps {
  opened: boolean;
  close: () => void;
  selectedRequest: CurrencyRequest | null;
}

function CurrencyModal({
  opened,
  close,

  selectedRequest,
}: CurrencyRequestProps) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text tt="uppercase" fz={14} fw={600} c="#1D2939" ml={32}>
          {selectedRequest?.Currency?.symbol} ACCOUNT REQUEST
        </Text>
      }
      closeButtonProps={{
        style: {
          cursor: "pointer",
          position: "absolute",
          top: 16,
          right: 32,
        },
        onClick: close,
      }}
      size={400}
      padding={0}
      centered
    >
      <Box px={32} mb={30}>
        <Flex justify="space-between" align="center" mb={16} gap={5}>
          <Text fz={12} fw={400} c="#667085">
            Business Name:
          </Text>
          <Text fz={12} fw={500} c="#344054">
            {selectedRequest?.accountName}
          </Text>
        </Flex>
        <Flex justify="space-between" align="center" mb={16} gap={5}>
          <Text fz={12} fw={400} c="#667085">
            Request Date:
          </Text>
          <Text fz={12} fw={500} c="#344054">
            {selectedRequest?.createdAt &&
              dayjs(selectedRequest?.createdAt).format("DD/MM/YYYY")}
          </Text>
        </Flex>
        <Flex justify="space-between" align="center" gap={5}>
          <Text fz={12} fw={400} c="#667085">
            Status:
          </Text>
          <Text fz={14} fw={500} c="#667085">
            {selectedRequest?.status && (
              <BadgeComponent status={selectedRequest?.status} />
            )}
          </Text>
        </Flex>

        <Flex direction="column" align="flex-start" mt={20} gap={8}>
          <Text fz={12} fw={400} c="#667085">
            Reason from Business:
          </Text>

          <Box
            p={12}
            style={{ border: "1px solid #EAECF0", borderRadius: 4 }}
            bg="#FAFAFA"
            w="100%"
          >
            <Text fz={12} fw={400} c="#1D2939">
              {selectedRequest?.reason ?? "No reason provided"}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Modal>
  );
}

export default CurrencyModal;
