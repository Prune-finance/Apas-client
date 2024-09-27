import { TextInput, UnstyledButton, Text, Modal, Box } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { notifications } from "@mantine/notifications";
import useNotification from "@/lib/hooks/notification";

dayjs.extend(advancedFormat);
import styles from "./styles.module.scss";
import { useDisclosure } from "@mantine/hooks";
import FileDisplay from "../DocumentViewer";

interface TextInputWithFileProps {
  label: string;
  placeholder: string;
  url: string;
  admin?: boolean;
}

export const TextInputWithFile = ({
  label,
  url,
  placeholder,
  admin,
}: TextInputWithFileProps) => {
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
          root: styles.input__root2,
        }}
        leftSection={<IconFileTypePdf color="#475467" />}
        leftSectionPointerEvents="none"
        rightSection={
          <UnstyledButton
            // onClick={() => {
            //   notifications.clean();
            //   if (!url) return handleInfo("No file provided", "");
            //   return window.open(url, "_blank");
            // }}
            onClick={open}
            className={styles.input__right__section}
            mr={20}
          >
            <Text fw={600} fz={10} c="#475467">
              View
            </Text>
          </UnstyledButton>
        }
        label={
          <Text fz={12} mb={2}>
            {label}
          </Text>
        }
        placeholder={`${placeholder}`}
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
          <FileDisplay fileUrl={url} download={admin} />
        </Box>
      </Modal>
    </>
  );
};
