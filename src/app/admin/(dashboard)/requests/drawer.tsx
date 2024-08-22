import { DebitRequest, useCompanyDebitRequests } from "@/lib/hooks/requests";
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
import { closeButtonProps } from "../businesses/[id]/(tabs)/utils";
import { parseError } from "@/lib/actions/auth";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import Cookies from "js-cookie";

type Props = {
  opened: boolean;
  close: () => void;
  selectedRequest: DebitRequest | null;
  revalidate?: () => Promise<void>;
};

export default function DebitDrawer({
  opened,
  close,
  selectedRequest,
  revalidate,
}: Props) {
  const [openedDeny, { close: closeDeny, open: openDeny }] =
    useDisclosure(false);
  const [openedApprove, { close: closeApprove, open: openApprove }] =
    useDisclosure(false);

  const [processing, setProcessing] = useState(false);

  const { handleError, handleSuccess } = useNotification();

  const accountDetails = {
    "Business Name": selectedRequest?.Account.Company.name,
    "Account Name": selectedRequest?.Account.accountName,
    "Account Number": selectedRequest?.Account.accountNumber,
    "Date Created": dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status || ""} />,
  };

  const destDetails = {
    "Account Name":
      selectedRequest?.destinationFirstName &&
      selectedRequest?.destinationLastName
        ? `${selectedRequest?.destinationFirstName} ${selectedRequest?.destinationLastName}`
        : "N/A",
    Country: selectedRequest?.destinationCountry,
    IBAN: selectedRequest?.destinationIBAN,
    "Bank Name": selectedRequest?.destinationBank,
    "Bank Address": "N/A",
    BIC: selectedRequest?.destinationBIC,
    Reference: selectedRequest?.reference,
    Invoice: "N/A",
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate && revalidate();
      close();
      close();
      handleSuccess("Action Completed", "Request Denied");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate && revalidate();
      closeApprove();
      close();
      handleSuccess("Action Completed", "Request Approved");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      padding={0}
      size="30%"
      title={
        <Text fz={18} fw={600} c="#1D2939" ml={28}>
          Debit Request Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
    >
      <Divider mb={18} />

      <Box px={28} pb={28}>
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12} tt="uppercase">
            Amount
          </Text>

          <Text c="#97AD05" fz={32} fw={600}>
            {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
          </Text>
        </Flex>

        <Divider my={30} />

        <Text
          fz={16}
          fw={600}
          c="var(--prune-text-gray-800)"
          tt="uppercase"
          mb={24}
        >
          Account Details
        </Text>

        <Stack>
          {Object.entries(accountDetails).map(([title, value]) => (
            <Flex justify="space-between" key={title}>
              <Text fz={14} c="var(--prune-text-gray-500)">
                {`${title}:`}
              </Text>

              <Text fz={14} fw={600} c="var(--prune-text-gray-600)">
                {value}
              </Text>
            </Flex>
          ))}
        </Stack>

        <Divider my={30} />

        <Text
          fz={16}
          fw={600}
          c="var(--prune-text-gray-800)"
          tt="uppercase"
          mb={24}
        >
          Destination Details
        </Text>

        <Stack>
          {Object.entries(destDetails).map(([title, value]) => (
            <Flex justify="space-between" key={title}>
              <Text fz={14} c="var(--prune-text-gray-500)">
                {`${title}:`}
              </Text>

              <Text fz={14} fw={600} c="var(--prune-text-gray-600)">
                {value}
              </Text>
            </Flex>
          ))}
        </Stack>

        <Divider my={30} />

        <Text
          fz={16}
          fw={600}
          c="var(--prune-text-gray-800)"
          tt="uppercase"
          mb={24}
        >
          Reason:
        </Text>

        <div
          style={{
            marginTop: "15px",
            background: "#F9F9F9",
            padding: "12px 16px",
          }}
        >
          <Text fz={12} c="var(--prune-text-gray-600)">
            {selectedRequest?.reason || ""}
          </Text>
        </div>

        {selectedRequest?.status === "PENDING" && (
          <Flex mt={40} justify="flex-end" gap={10}>
            <SecondaryBtn action={openDeny} text="Deny" fw={600} />
            <PrimaryBtn action={openApprove} text="Approve" fw={600} />
          </Flex>
        )}
      </Box>

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={openedDeny}
        close={closeDeny}
        action={handleRejectRequest}
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
        action={handleAcceptRequest}
        processing={processing}
        title="Approve This Debit Request?"
        text="This means you are accepting the debit request of this business"
        customApproveMessage="Yes, Approve It"
      />
    </Drawer>
  );
}
