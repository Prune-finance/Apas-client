import { DebitRequest } from "@/lib/hooks/requests";
import { Box, Button, Divider, Drawer, Flex, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import styles from "@/ui/styles/accounts.module.scss";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { useState } from "react";

type Props = {
  opened: boolean;
  close: () => void;
  selectedRequest: DebitRequest | null;
};

export default function DebitDrawer({ opened, close, selectedRequest }: Props) {
  const [openedDeny, { close: closeDeny, open: openDeny }] =
    useDisclosure(false);
  const [openedApprove, { close: closeApprove, open: openApprove }] =
    useDisclosure(false);

  const [processing, setProcessing] = useState(false);
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
          Request Details
        </Text>

        <IconX onClick={close} />
      </Flex>

      <Box>
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12} tt="uppercase">
            Amount
          </Text>

          {/* <Text c="#97AD05" fz={32} fw={600}>
                {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
              </Text> */}
        </Flex>

        <Divider my={30} />

        <Flex direction="column" gap={30}>
          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Business Name:
            </Text>

            <Text fz={14}>{selectedRequest?.Account.Company.name}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Source Account:
            </Text>

            <Text fz={14}>{selectedRequest?.Account.accountName}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Date Created:
            </Text>

            <Text fz={14}>
              {dayjs(selectedRequest?.createdAt).format("DD MMM, YYYY")}
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text fz={14} c="#8B8B8B">
              Status:
            </Text>

            <Text fz={14}>{selectedRequest?.status}</Text>
          </Flex>
        </Flex>

        <Divider my={30} />

        <Text fz={12} c="#1D2939" fw={600}>
          REASON FOR DEBIT
        </Text>

        <div
          style={{
            marginTop: "15px",
            background: "#F9F9F9",
            padding: "12px 16px",
          }}
        >
          <Text fz={12} c="#667085">
            {selectedRequest?.reason || ""}
          </Text>
        </div>

        {selectedRequest?.status === "PENDING" && (
          <Flex mt={40} justify="flex-end" gap={10}>
            <Button
              onClick={openDeny}
              color="#D0D5DD"
              variant="outline"
              className={styles.cta}
            >
              Deny
            </Button>

            <Button
              className={styles.cta}
              onClick={openApprove}
              variant="filled"
              color="#D4F307"
            >
              Approve
            </Button>
          </Flex>
        )}
      </Box>

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={opened}
        close={close}
        // action={handleRejectRequest}
        processing={processing}
        title="Deny This Debit Request?"
        text="This means you are rejecting the debit request of this business."
        customApproveMessage="Yes, Deny It"
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={openedApprove}
        close={closeApprove}
        // action={handleAcceptRequest}
        processing={processing}
        title="Approve This Debit Request?"
        text="This means you are accepting the debit request of this business"
        customApproveMessage="Yes, Approve It"
      />
    </Drawer>
  );
}
