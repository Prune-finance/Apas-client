import { useDisclosure } from "@mantine/hooks";
import styles from "./documentPreview.module.scss";
import {
  Box,
  Select,
  UnstyledButton,
  Modal,
  Text,
  Image,
  FileButton,
  Flex,
  ThemeIcon,
  ActionIcon,
} from "@mantine/core";
import useNotification from "@/lib/hooks/notification";
import FileDisplay from "@/ui/components/DocumentViewer";
import PDFICON from "@/assets/pdf-icon.png";
import { PrimaryBtn } from "@/ui/components/Buttons";

import { useState } from "react";
import createAxiosInstance from "@/lib/axios";
import { parseError } from "@/lib/actions/auth";
import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";

const axios = createAxiosInstance("auth");

type FormKey =
  | "cacCertificate"
  | "amlCompliance"
  | "mermat"
  | "operationalLicense"
  | (string & {});
interface DocumentPreview {
  label: string;
  title: string;
  value?: string;
  type?: string | null;
  editing?: boolean;
  setValue?: (value: string) => void;
  setType?: (value: string | null) => void;
  isUser?: boolean;
  isOnboarding?: boolean;
  showActions?: boolean;
  formKey?: FormKey;
  handleDocumentApproval?: (
    type: "approve" | "reject",
    formKey: FormKey
  ) => void;
}

export const DocumentPreview = ({
  label,
  title,
  value,
  editing = false,
  setValue,
  isUser = false,
  isOnboarding = false,
  type,
  setType,
  showActions = false,
  formKey,
  handleDocumentApproval,
}: DocumentPreview) => {
  const [openedFile, { open: openFile, close: closeFile }] =
    useDisclosure(false);
  const { handleError } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File | null) => {
    // formKey: string;
    setLoading(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const entity = isUser ? "auth" : isOnboarding ? "onboarding" : "admin";
      const { data: res } = await axios.post(`/${entity}/upload`, formData);

      setValue && setValue(res.data.url);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1}>
      <Select
        readOnly={!editing}
        className="Switzer"
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<Image src={PDFICON.src} alt="pdf-icon" h={16} w={16} />}
        leftSectionPointerEvents="none"
        rightSectionPointerEvents="auto"
        rightSectionWidth={100}
        rightSection={
          editing ? (
            <FileButton
              disabled={loading}
              onChange={(file) => handleUpload(file)}
              accept="image/png, image/jpeg, application/pdf"
            >
              {(props) => (
                <PrimaryBtn
                  text="Re-upload"
                  fw={600}
                  // w={200}
                  // w="100%"
                  // fullWidth
                  action={props.onClick}
                  loading={loading}
                  loaderProps={{ type: "dots" }}
                  {...props}
                />
              )}
            </FileButton>
          ) : (
            <UnstyledButton
              onClick={openFile}
              className={styles.input__right__section}
              bg="#D0D5DD"
              py={4}
              px={8}
              mr={20}
              style={{ borderRadius: 4 }}
            >
              <Text fw={600} fz={10} c="#667085">
                View
              </Text>
            </UnstyledButton>
          )
        }
        label={label}
        placeholder={title}
        data={
          label.includes("Identity Document")
            ? ["ID Card", "Passport", "Residence Permit"]
            : ["Utility Bill"]
        }
        value={type}
        onChange={(value) => setType && setType(value)}
      />

      <Modal
        opened={openedFile}
        onClose={closeFile}
        size={800}
        centered
        title={
          <Text fz={14} fw={500}>
            Document Preview
          </Text>
        }
      >
        <Box>
          <FileDisplay fileUrl={value || ""} download={!showActions} />
          {showActions && (
            <Flex justify="end" align="center" my={16} gap={20}>
              {value && (
                <ActionIcon
                  color="var(--prune-text-gray-700)"
                  variant="light"
                  radius="md"
                  size={40}
                  component={Link}
                  href={value}
                  download
                >
                  <IconDownload />
                </ActionIcon>
              )}
              <PrimaryBtn
                text="Reject"
                color="var(--prune-warning)"
                fw={600}
                c="#fff"
                action={() => {
                  handleDocumentApproval &&
                    formKey &&
                    handleDocumentApproval("reject", formKey);
                }}
              />
              <PrimaryBtn
                text="Approve Document"
                fw={600}
                action={() => {
                  handleDocumentApproval &&
                    formKey &&
                    handleDocumentApproval("approve", formKey);
                }}
              />
            </Flex>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
