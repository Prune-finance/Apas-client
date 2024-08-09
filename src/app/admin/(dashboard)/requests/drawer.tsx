import { DebitRequest } from "@/lib/hooks/requests";
import { Box, Button, Divider, Drawer, Flex, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import styles from "@/ui/styles/accounts.module.scss";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

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

  const accountDetails = {
    "Source Account": selectedRequest?.Account.accountName,
    "Account Number": selectedRequest?.Account.accountNumber,
    "Date Created": dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status || ""} />,
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
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12} tt="uppercase">
            Amount
          </Text>

          <Text c="#97AD05" fz={32} fw={600}>
            {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
          </Text>
        </Flex>

        <Divider my={30} />

        <Text fz={12} fw={600} c="var(--prune-text-gray-800)">
          Account Details
        </Text>

        <Stack>
          {Object.entries(accountDetails).map(([title, value]) => (
            <Flex justify="space-between">
              <Text fz={14} c="var(--prune-text-gray-400)">
                {`${title}:`}
              </Text>

              {typeof value === "string" ? (
                <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
                  {value}
                </Text>
              ) : (
                value
              )}
            </Flex>
          ))}
        </Stack>

        <Divider my={30} />

        <Text fz={12} fw={600} c="var(--prune-text-gray-800)">
          Destination Details
        </Text>

        <Stack>
          {Object.entries(destDetails).map(([title, value]) => (
            <Flex justify="space-between">
              <Text fz={14} c="var(--prune-text-gray-400)">
                {`${title}:`}
              </Text>

              <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
                {value}
              </Text>
            </Flex>
          ))}
        </Stack>

        <Divider my={30} />

        <Text fz={16} c="var(--prune-text-gray-800)" fw={600}>
          Reason:
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
            {/* <Button
              onClick={openDeny}
              color="#D0D5DD"
              variant="outline"
              className={styles.cta}
            >
              Deny
            </Button> */}

            {/* <Button
              className={styles.cta}
              onClick={openApprove}
              variant="filled"
              color="#D4F307"
            >
              Approve
            </Button> */}
            <SecondaryBtn action={openDeny} text="Deny" />
            <PrimaryBtn action={openApprove} text="Approve" />
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
