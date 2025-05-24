import React from "react";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Modal, Text } from "@mantine/core";
import dayjs from "dayjs";
import { CurrencyRequest } from "@/lib/hooks/requests";
import AdvancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(AdvancedFormat);

interface CurrencyRequestProps {
  approveOpened: boolean;
  currencyOpenApprove: () => void;
  currencyRejectedApprove: () => void;
  closeApprove: () => void;
  selectedRequest: CurrencyRequest | null;
}

function SingleCurrencyModal({
  approveOpened,
  currencyOpenApprove,
  currencyRejectedApprove,
  closeApprove,
  selectedRequest,
}: CurrencyRequestProps) {
  return (
    <Modal
      opened={approveOpened}
      onClose={closeApprove}
      title={
        <Text tt="uppercase" fz={14} fw={600} c="#1D2939" ml={32}>
          {selectedRequest?.Currency?.symbol} Own ACCOUNT REQUEST
        </Text>
      }
      closeButtonProps={{
        style: {
          cursor: "pointer",
          position: "absolute",
          top: 16,
          right: 32,
        },
        onClick: closeApprove,
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
              dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY")}
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

      {selectedRequest?.status === "PENDING" && (
        <Flex justify="center" gap={15} px={32} py={15} bg="#F9F9F9">
          <SecondaryBtn
            text="Reject"
            action={() => {
              currencyRejectedApprove();
              closeApprove();
            }}
            fullWidth
          />

          <PrimaryBtn
            text={"Approved"}
            action={() => {
              currencyOpenApprove();
              closeApprove();
            }}
            loading={false}
            fullWidth
          />
        </Flex>
      )}
    </Modal>
  );
}

export default SingleCurrencyModal;
