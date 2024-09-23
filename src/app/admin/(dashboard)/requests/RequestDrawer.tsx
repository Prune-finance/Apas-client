import { IUserRequest } from "@/lib/hooks/requests";
import {
  Box,
  Divider,
  Drawer,
  Flex,
  Modal,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { IconCheck, IconFileTypePdf, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import styles from "@/ui/styles/accounts.module.scss";
// import styles from "@/ui/styles/singlebusiness.module.scss";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";

import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "../businesses/[id]/(tabs)/utils";

import useNotification from "@/lib/hooks/notification";

import FileDisplay from "@/ui/components/DocumentViewer";

type Props = {
  opened: boolean;
  close: () => void;
  selectedRequest: IUserRequest | null;
  type: string;
  rejectFunc: () => void;
  approveFunc: () => void;
  processing: boolean;
};

export default function RequestDrawer({
  opened,
  close,
  selectedRequest,
  type,
  rejectFunc,
  approveFunc,
  processing,
}: Props) {
  const [openedDeny, { close: closeDeny, open: openDeny }] =
    useDisclosure(false);
  const [openedApprove, { close: closeApprove, open: openApprove }] =
    useDisclosure(false);

  // const [processing, setProcessing] = useState(false);

  const { handleError, handleSuccess, handleInfo } = useNotification();

  const accountDetails = {
    "Business Name": selectedRequest?.Company.name,
    "Account Name": selectedRequest?.Account?.accountName ?? "N/A",
    IBAN: selectedRequest?.Account?.accountNumber ?? "N/A",
    "User Type":
      selectedRequest?.Account?.type === "CORPORATE"
        ? "Corporate"
        : "Individual",
  };

  const otherDetails = {
    "Date Created": dayjs(selectedRequest?.createdAt).format("Do MMMM, YYYY"),
    Status: <BadgeComponent status={selectedRequest?.status || ""} />,
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      padding={0}
      size="30%"
      title={
        <Text fz={18} fw={600} c="#1D2939" ml={28} tt="capitalize">
          {type} Request Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
    >
      <Divider mb={18} />

      <Box px={28} pb={28}>
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

              <Text
                fz={14}
                fw={600}
                c="var(--prune-text-gray-600)"
                tt="capitalize"
              >
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
          Other Details
        </Text>

        <Stack>
          {Object.entries(otherDetails).map(([title, value]) => (
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

        {selectedRequest?.adminSupportingDocumentName ||
          (selectedRequest?.supportingDocumentName && (
            <Text
              fz={16}
              fw={600}
              c="var(--prune-text-gray-800)"
              tt="uppercase"
              mb={24}
              mt={30}
            >
              Supporting Document:
            </Text>
          ))}

        <Stack mt={20}>
          {selectedRequest?.adminSupportingDocumentUrl && (
            <DocumentInput
              url={selectedRequest.adminSupportingDocumentUrl}
              placeholder={`${selectedRequest.Account.accountName} - Admin Supporting Document`}
              label="Admin Supporting Document"
            />
          )}

          {selectedRequest?.supportingDocumentUrl && (
            <DocumentInput
              url={selectedRequest.supportingDocumentUrl}
              placeholder={`${selectedRequest.Account.accountName} - Supporting Document`}
              label="Supporting Document"
            />
          )}
        </Stack>

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
        action={rejectFunc}
        processing={processing}
        title={`Deny This ${type} Request?`}
        text={`This means you are rejecting the ${type} request of this business.`}
        customApproveMessage="Yes, Deny It"
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={openedApprove}
        close={closeApprove}
        action={approveFunc}
        processing={processing}
        title={`Approve This ${type} Request?`}
        text={`This means you are accepting the ${type} request of this business`}
        customApproveMessage="Yes, Approve It"
      />
    </Drawer>
  );
}

interface DocumentInputProps {
  url: string | null;
  label: string;
  placeholder: string;
}

const DocumentInput = ({ url, label, placeholder }: DocumentInputProps) => {
  const { handleInfo } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <TextInput
        readOnly
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<IconFileTypePdf />}
        leftSectionPointerEvents="none"
        rightSectionPointerEvents="auto"
        rightSectionWidth={70}
        rightSection={
          <UnstyledButton
            // onClick={() => {
            //   notifications.clean();
            //   if (!url) return handleInfo("No supporting document found", "");

            //   window.open(url || "", "_blank");
            // }}
            onClick={open}
            className={styles.input__right__section}
          >
            <Text fw={600} fz={10} c="#475467">
              View
            </Text>
          </UnstyledButton>
        }
        label={label}
        placeholder={placeholder}
      />

      <Modal
        opened={opened}
        onClose={close}
        size={800}
        centered
        title={
          <Text fz={14} fw={500}>
            Document Preview
          </Text>
        }
      >
        <Box>
          <FileDisplay fileUrl={(url as string) || ""} />
        </Box>
      </Modal>
    </>
  );
};
