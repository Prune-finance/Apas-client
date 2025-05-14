import { useDisclosure } from "@mantine/hooks";
import styles from "./documentPreview.module.scss";
import {
  Box,
  Select,
  UnstyledButton,
  Modal,
  Flex,
  Text,
  Image,
} from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import useNotification from "@/lib/hooks/notification";
import FileDisplay from "@/ui/components/DocumentViewer";
import PDFICON from "@/assets/pdf-icon.png";

interface DocumentPreview {
  label: string;
  title: string;
  value?: string;
}

export const DocumentPreview = ({ label, title, value }: DocumentPreview) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedFile, { open: openFile, close: closeFile }] =
    useDisclosure(false);
  const { handleInfo } = useNotification();

  return (
    <Box flex={1}>
      <Select
        readOnly
        className="Switzer"
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<Image src={PDFICON.src} alt="pdf-icon" h={16} w={16} />}
        leftSectionPointerEvents="none"
        rightSectionPointerEvents="auto"
        rightSection={
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
        }
        label={label}
        placeholder={title}
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
          <FileDisplay fileUrl={value || ""} />
        </Box>
      </Modal>
    </Box>
  );
};
