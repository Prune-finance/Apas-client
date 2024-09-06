import { Group, Text, TextInput, UnstyledButton } from "@mantine/core";
import React, { Fragment } from "react";
import styles from "./(tabs)/styles.module.scss";
import { IconFileInfo } from "@tabler/icons-react";
import useNotification from "@/lib/hooks/notification";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { notifications } from "@mantine/notifications";

interface Props {
  url: string;
  label: string;
  placeholder: string;
}

export const FileTextInput = ({ url, label, placeholder }: Props) => {
  const { handleInfo } = useNotification();
  return (
    <Fragment>
      <TextInput
        readOnly
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<IconFileInfo />}
        leftSectionPointerEvents="none"
        rightSection={
          <UnstyledButton
            onClick={() => {
              if (!url) {
                notifications.clean();
                return handleInfo("No document was provided", "");
              }
              window.open(url || "", "_blank");
            }}
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

      <Group mt={16}>
        <PrimaryBtn
          text="Approve"
          color="#039855"
          c="#039855"
          variant="light"
          h={22}
          radius={8}
        />
        <PrimaryBtn
          text="Reject"
          color="#D92D20"
          c="#D92D20"
          variant="light"
          h={22}
          radius={8}
        />
      </Group>
    </Fragment>
  );
};
