import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

import styles from "@/ui/styles/singlebusiness.module.scss";
import {
  directorEtShareholderSchema,
  removeDirectorSchema,
  removeDirectorValues,
} from "@/lib/schema";
import { SecondaryBtn, PrimaryBtn } from "@/ui/components/Buttons";
import {
  Box,
  Select,
  UnstyledButton,
  ActionIcon,
  Modal,
  Flex,
  Text,
  Button,
  Stack,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import { IconFileInfo, IconFileTypePdf, IconX } from "@tabler/icons-react";
import DropzoneComponent from "@/ui/components/Dropzone";
import { useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { notifications } from "@mantine/notifications";

interface IDirector {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}

type DocumentTextInputProps = {
  editing: boolean;
  director: IDirector;
  formKey: keyof IDirector;
  documentKey: keyof IDirector;
  form: UseFormReturnType<IDirector>;
  label: string;
  title: string;
};

export const closeButtonProps = {
  mr: 10,

  children: (
    <ActionIcon
      radius="xl"
      variant="filled"
      color="var(--prune-text-gray-100)"
      size={32}
    >
      <IconX color="var(--prune-text-gray-500)" stroke={1.5} />
    </ActionIcon>
  ),
};

export const DocumentTextInput = ({
  editing,
  director,
  form,
  formKey,
  documentKey,
  label,
  title,
}: DocumentTextInputProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { handleInfo } = useNotification();

  return (
    <Box>
      <Select
        readOnly
        data={
          formKey === "identityType"
            ? ["ID Card", "Passport", "Residence Permit"]
            : ["Utility Bill"]
        }
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<IconFileTypePdf color="var(--prune-text-gray-700)" />}
        leftSectionPointerEvents="none"
        rightSectionPointerEvents="auto"
        {...form.getInputProps(formKey)}
        rightSection={
          !editing ? (
            <UnstyledButton
              onClick={() => {
                notifications.clean();
                if (!director[documentKey])
                  return handleInfo("Please upload the document first", "");

                window.open(director[documentKey] || "", "_blank");
              }}
              className={styles.input__right__section}
            >
              <Text fw={600} fz={10} c="#475467">
                View
              </Text>
            </UnstyledButton>
          ) : (
            <UnstyledButton
              onClick={open}
              className={styles.input__right__section}
              w="100%"
            >
              <Text fw={600} fz={10} c="#475467">
                Re-upload
              </Text>
            </UnstyledButton>
          )
        }
        label={label}
        placeholder={title}
      />

      <ReUploadDocsModal
        opened={opened}
        close={close}
        formKey={formKey}
        form={form}
        documentKey={documentKey}
      />
    </Box>
  );
};

interface ReUploadProps {
  opened: boolean;
  close: () => void;
  formKey: keyof IDirector;
  form: UseFormReturnType<IDirector>;
  documentKey: keyof IDirector;
}

export const ReUploadDocsModal = ({
  opened,
  close,
  formKey,
  form,
  documentKey,
}: ReUploadProps) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      closeButtonProps={closeButtonProps}
      title={
        <Text fz={20} fw={600}>
          Re-upload Document
        </Text>
      }
      padding={32}
      centered
    >
      <Box
        component="form"
        onSubmit={form.onSubmit(() => {})}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Select
          comboboxProps={{ withinPortal: true }}
          data={
            formKey === "identityType"
              ? ["ID Card", "Passport", "Residence Permit"]
              : ["Utility Bill"]
          }
          placeholder={
            formKey === "identityType"
              ? "Select Identity Type"
              : "Select Proof of Address"
          }
          {...form.getInputProps(formKey)}
          size="lg"
          radius={4}
        />

        <DropzoneComponent
          DirectorForm={
            form as unknown as UseFormReturnType<
              typeof directorEtShareholderSchema
            >
          }
          formKey={documentKey}
          uploadedFileUrl={form.values[documentKey]}
        />

        <Flex gap={16}>
          <SecondaryBtn
            fullWidth
            text="Cancel"
            action={() => {
              close();
              form.reset();
            }}
            fw={600}
          />
          <PrimaryBtn
            fullWidth
            text="Proceed"
            type="submit"
            action={close}
            // loading={processing}
            fw={600}
          />
        </Flex>
      </Box>
    </Modal>
  );
};

export const RemoveDirectorModal = ({
  opened,
  close,
  index,
  deleteDirector,
  type,
}: {
  opened: boolean;
  close: () => void;
  index: number;
  deleteDirector: (index: number) => Promise<void>;
  type: "director" | "shareholder";
}) => {
  const [processing, setProcessing] = useState(false);
  const form = useForm({
    initialValues: removeDirectorValues,
    validate: zodResolver(removeDirectorSchema),
  });

  const handleDelete = async () => {
    if (form.validate().hasErrors) return;
    setProcessing(true);
    try {
      await deleteDirector(index);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      opened={opened}
      closeButtonProps={closeButtonProps}
      onClose={() => {
        close();
        form.reset();
      }}
      centered
      w={400}
      padding={20}
    >
      <Stack align="center" gap={30}>
        <ThemeIcon radius="xl" color="#D92D20" size={64} variant="light">
          <IconX size={32} />
        </ThemeIcon>

        <Text fz={18} fw={600} tt="capitalize">
          {`Remove This ${type}?`}
        </Text>

        <Text
          fz={12}
          fw={400}
          ta="center"
          c="var(--prune-text-gray-500)"
          w="45ch"
        >
          {`You are about to remove this ${type} from the system. Please know
          that you cannot undo this action.`}
        </Text>

        <Textarea
          placeholder="Give reason here..."
          minRows={5}
          w="100%"
          {...form.getInputProps("reason")}
        />

        <Select
          placeholder="Select Supporting Document (optional)"
          data={["ID Card", "Passport", "Residence Permit"]}
          w="100%"
          {...form.getInputProps("supportingDoc")}
        />

        <Box w="100%">
          <DropzoneComponent
            removeDirectorForm={form}
            formKey={`supportingDocUrl`}
            uploadedFileUrl={form.values.supportingDocUrl}
          />
        </Box>

        <Flex w="100%" gap={20}>
          <SecondaryBtn
            text="Cancel"
            action={() => {
              close();
              form.reset();
            }}
            fw={600}
            fullWidth
            disabled={processing}
          />

          <PrimaryBtn
            text="Proceed"
            action={handleDelete}
            loading={processing}
            fw={600}
            fullWidth
          />
        </Flex>
      </Stack>
    </Modal>
  );
};
