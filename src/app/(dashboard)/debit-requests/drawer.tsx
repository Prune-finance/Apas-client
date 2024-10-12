import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { DebitRequest } from "@/lib/hooks/requests";
import { formatNumber } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";
import { Drawer, Flex, Box, Divider, Text, Stack, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Dispatch, SetStateAction, useState } from "react";
import Cookies from "js-cookie";
import { notifications } from "@mantine/notifications";

dayjs.extend(advancedFormat);
type Props = {
  opened: boolean;
  close: () => void;
  selectedRequest: DebitRequest | null;
  revalidate: () => void;
  setSelectedRequest: Dispatch<SetStateAction<DebitRequest | null>>;
};
export const DebitRequestDrawer = ({
  opened,
  close,
  selectedRequest,
  revalidate,
  setSelectedRequest,
}: Props) => {
  const [openedCancel, { open, close: closeCancel }] = useDisclosure(false);
  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState("");

  const { handleError, handleSuccess, handleInfo } = useNotification();
  const accountDetails = {
    "Source Account": selectedRequest?.Account.accountName,
    "Date Created": dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };

  const destDetails = {
    Name: `${selectedRequest?.destinationFirstName} ${selectedRequest?.destinationLastName}`,
    "Account Name":
      selectedRequest?.destinationFirstName &&
      selectedRequest?.destinationLastName
        ? `${selectedRequest?.destinationFirstName} ${selectedRequest?.destinationLastName}`
        : "N/A",
    IBAN: selectedRequest?.destinationIBAN,
    BIC: selectedRequest?.destinationBIC,
    Country: selectedRequest?.destinationCountry,
    Bank: selectedRequest?.destinationBank,
    Reference: selectedRequest?.reference,
  };

  const cancelRequest = async () => {
    notifications.clean();
    if (!reason)
      return handleInfo("Please enter a reason for cancelling the request", "");

    if (!selectedRequest) return;
    setProcessing(true);

    try {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/debit/request/${selectedRequest?.id}/cancel`,
        {
          reason: reason,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess("Cancel Request Successful", "");
      closeCancel();
      revalidate();
      setReason("");

      setSelectedRequest((prev) => {
        if (!prev) return prev; // or return null;
        return {
          ...prev,
          status: res.data.status,
          id: res.data.id,
        };
      });
    } catch (error) {
      handleError("Cancel Request Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      size="30%"
      title={
        <Text fz={18} fw={600} c="#1D2939" ml={28}>
          Debit Request Details
        </Text>
      }
      padding={0}
    >
      {/* <Flex justify="space-between" pb={28}>
        <Text fz={18} fw={600} c="#1D2939">
          Debit Request Details
        </Text>

        <IconX onClick={close} />
      </Flex> */}
      <Divider mb={20} />

      <Box px={28} pb={28}>
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Text c="#8B8B8B" fz={12} tt="uppercase">
              Amount
            </Text>

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Stack>

          {accountDetails?.Status?.props?.status === "PENDING" && (
            <PrimaryBtn
              text="Cancel Request"
              color="#B42318"
              c="#fff"
              fw={600}
              action={open}
            />
          )}
        </Group>
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

        <Flex direction="column" gap={30}>
          {Object.entries(accountDetails).map(([key, value]) => (
            <Flex justify="space-between" key={key}>
              <Text fz={12} c="var(--prune-text-gray-500)">
                {`${key}:`}
              </Text>

              <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                {value}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Divider my={30} />

        <Text
          fz={16}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
          Beneficiary Details
        </Text>

        <Flex direction="column" gap={30}>
          {Object.entries(destDetails).map(([key, value]) => (
            <Flex justify="space-between" key={key}>
              <Text fz={12} c="var(--prune-text-gray-500)">
                {`${key}:`}
              </Text>

              <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                {value}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Divider my={30} />

        <Text
          fz={16}
          mb={24}
          tt="uppercase"
          c="var(--prune-text-gray-800)"
          fw={600}
        >
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

      <ModalComponent
        opened={openedCancel}
        close={closeCancel}
        title="Cancel Request?"
        text="You are about to cancel this debit request. This action cannot be undone."
        icon={<IconX color="#D92D20" />}
        color="#FEF3F2"
        processing={processing}
        customApproveMessage="Submit"
        reason={reason}
        setReason={setReason}
        addReason
        action={cancelRequest}
      />
    </Drawer>
  );
};
