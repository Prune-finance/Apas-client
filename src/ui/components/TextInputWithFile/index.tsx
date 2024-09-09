import { TextInput, UnstyledButton, Text } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { notifications } from "@mantine/notifications";
import useNotification from "@/lib/hooks/notification";

dayjs.extend(advancedFormat);
import styles from "./styles.module.scss";

interface TextInputWithFileProps {
  label: string;
  placeholder: string;
  url: string;
}

export const TextInputWithFile = ({
  label,
  url,
  placeholder,
}: TextInputWithFileProps) => {
  const { handleInfo } = useNotification();
  return (
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
          onClick={() => {
            notifications.clean();
            if (!url) return handleInfo("No file provided", "");
            return window.open(url, "_blank");
          }}
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
  );
};
