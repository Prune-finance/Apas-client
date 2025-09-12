import EmptyTable from "@/ui/components/EmptyTable";
import {
  Box,
  Center,
  Flex,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

import React, { ReactNode } from "react";
import PaperContainer from "../PaperContainer";
import OnBoardingDocumentBox from "@/app/(onboarding)/onboarding/onBoardingDocumentBox";
import form from "@/app/auth/login/form";
import {
  TextInputWithInsideLabel,
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { IconTrash } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { DirectorType, OnboardingDirectorValues } from "@/lib/schema/";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { z } from "zod";

interface EmptyProfileTabProps {
  title: string;
  rows: any[];
  loading: boolean;
  text?: string;
}
const EmptyProfileTab = ({
  title,
  rows,
  loading,
  text,
}: EmptyProfileTabProps) => {
  if (loading)
    return (
      <PaperContainer title={title} h="calc(100vh - 300px)">
        <SimpleGrid cols={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} h={40} w="100%" color="#fcfcfd" />
          ))}
        </SimpleGrid>
      </PaperContainer>
    );

  if (!loading && rows.length > 0) return null;

  return (
    <PaperContainer title={title} h="calc(100vh - 300px)">
      {!loading && rows.length === 0 && (
        <Center h="calc(100% - 140px)">
          <EmptyTable
            rows={rows}
            loading={loading}
            title=""
            text={text ? text : "There is no data here for now"}
          />
        </Center>
      )}
    </PaperContainer>
  );
};

interface PanelWrapperProps {
  loading: boolean;
  rows: any[];
  panelName: string;
  children?: ReactNode;
}

export const PanelWrapper = ({
  loading,
  rows,
  panelName,
  children,
}: PanelWrapperProps) => {
  return (
    <Box>
      {/* For empty documents */}
      <EmptyProfileTab loading={loading} rows={rows} title={panelName} />

      {/* For filled out documents from onboarding flow */}
      {!loading && !!rows.length && <>{children}</>}
    </Box>
  );
};

interface NewDirectorOrShareholderModalProps {
  opened: boolean;
  close: () => void;
  title: string;
  onSubmit: (values: DirectorType) => void;
  loading?: boolean;
}

export const NewDirectorOrShareholderModal = ({
  opened,
  close,
  title,
  onSubmit,
  loading,
}: NewDirectorOrShareholderModalProps) => {
  const Director = z.object({
    id: z.string().uuid(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    date_of_birth: z
      .union([
        z.date({ required_error: "Date of birth is required" }),
        z.string().nullable(),
      ])
      .refine((val) => val, {
        message: "Date of birth is required",
      }),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    identityType: z.string().nullable(),
    proofOfAddress: z.string().nullable(),
    identityFileUrl: z.string().nullable(),
    identityFileUrlBack: z.string().nullable(),
    proofOfAddressFileUrl: z.string().nullable(),
  });

  const form = useForm<DirectorType>({
    initialValues: { ...OnboardingDirectorValues, id: crypto.randomUUID() },
    validate: zodResolver(Director),
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        form.reset();
      }}
      title={title}
      styles={{
        title: {
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--prune-primary-800)",
        },
      }}
      padding={24}
      centered
      // size={498}
      size="xl"
    >
      <Box
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
        component="form"
        onSubmit={form.onSubmit((values) => onSubmit(values))}
        mt={30}
      >
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            key={form.key(`first_name`)}
            {...form.getInputProps(`first_name`)}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            key={form.key(`last_name`)}
            {...form.getInputProps(`last_name`)}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            key={form.key(`email`)}
            {...form.getInputProps(`email`)}
          />
          <DateInputWithInsideLabel
            label="Date of Birth"
            w="100%"
            key={form.key(`date_of_birth`)}
            {...form.getInputProps(`date_of_birth`)}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            w="100%"
            key={form.key(`identityType`)}
            data={["ID Card", "Passport", "Residence Permit"]}
            {...form.getInputProps(`identityType`)}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            data={["Utility Bill"]}
            key={form.key(`proofOfAddress`)}
            {...form.getInputProps(`proofOfAddress`)}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {form.values.identityType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                formKey={`identityFileUrl`}
                form={form}
                uploadedFileUrl={form.values.identityFileUrl || ""}
                key={form.key(`identityFileUrl`)}
                {...form.getInputProps(`identityFileUrl`)}
                isAdmin
              />
              {form.values.identityType !== "Passport" && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  formKey={`identityFileUrlBack`}
                  form={form}
                  uploadedFileUrl={form.values.identityFileUrlBack || ""}
                  key={form.key(`identityFileUrlBack`)}
                  {...form.getInputProps(`identityFileUrlBack`)}
                  isAdmin
                />
              )}
            </>
          )}

          {form.values.proofOfAddress && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
              formKey={`proofOfAddressFileUrl`}
              form={form}
              uploadedFileUrl={form.values.proofOfAddressFileUrl || ""}
              key={form.key(`proofOfAddressFileUrl`)}
              {...form.getInputProps(`proofOfAddressFileUrl`)}
              isAdmin
            />
          )}
        </Flex>

        <Flex justify="end" align="center" gap={12}>
          <SecondaryBtn
            text="Cancel"
            action={() => {
              close();
              form.reset();
            }}
            fw={600}
          />
          <PrimaryBtn text="Save" type="submit" fw={600} loading={loading} />
        </Flex>
      </Box>
    </Modal>
  );
};
