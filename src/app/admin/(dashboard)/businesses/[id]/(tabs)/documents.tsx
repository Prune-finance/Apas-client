"use client";

import {
  ActionIcon,
  Box,
  Button,
  FileButton,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  IconJpg,
  IconPdf,
  IconPencilMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import Cookies from "js-cookie";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState } from "react";
import axios from "axios";
import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { SecondaryBtn, PrimaryBtn } from "@/ui/components/Buttons";
import { useDisclosure } from "@mantine/hooks";
import DropzoneComponent from "./dropzone";
import {
  otherDocumentSchema,
  OtherDocumentType,
  otherDocumentValues,
} from "@/lib/schema";

export default function Documents({
  business,
  revalidate,
}: {
  business: BusinessData;
  revalidate: () => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  const [editing, setEditing] = useState(false);
  const [editingDoc, setEditingDoc] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const initialValues = {
    cacCertificate: business.cacCertificate,
    mermat: business.mermat,
    directorParticular: business.directorParticular,
    shareholderParticular: business.shareholderParticular,
    amlCompliance: business.amlCompliance,
    operationalLicense: business.operationalLicense,
    otherDocuments: business.otherDocuments,
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

  const handleBusinessUpdate = async (
    otherDocuments?: Record<string, string>
  ) => {
    const { contactEmail, name, contactNumber, domain } = business;

    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          contactEmail,
          name,
          domain,
          contactNumber,
          ...form.values,
          ...(otherDocuments && { otherDocuments }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess("Business Updated", "");
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
      setEditing(false);
      setEditingDoc(false);
    }
  };

  return (
    <div className={styles.document__tab}>
      <Group justify="space-between" mb={20}>
        <Text fz={12} fw={600} tt="capitalize">
          All Documents
        </Text>

        <PrimaryBtn
          text="New Document"
          icon={IconPlus}
          fz={12}
          fw={600}
          action={open}
        />
      </Group>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Documents
          </Text>
          {!editing ? (
            <SecondaryBtn
              text="Edit"
              icon={IconPencilMinus}
              action={() => setEditing(true)}
            />
          ) : (
            <Group>
              <SecondaryBtn
                text="Cancel"
                action={() => setEditing(false)}
                fz={10}
                fw={600}
              />

              <PrimaryBtn
                fz={10}
                fw={600}
                text="Save Changes"
                loading={processing}
                action={() => {
                  handleBusinessUpdate();
                }}
              />
            </Group>
          )}
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="CAC"
              label="CAC Document"
              form={form}
              formKey="cacCertificate"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="Memart"
              label="Memart"
              form={form}
              formKey="mermat"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="Shareholders"
              label="POS(Particulars of Shareholders)"
              form={form}
              formKey="shareholderParticular"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="Directors"
              label="POS(Particulars of Directors)"
              form={form}
              formKey="directorParticular"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="License"
              label="Operational License( Optional )"
              form={form}
              formKey="operationalLicense"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="AML"
              label="AML Compliance Framework"
              form={form}
              formKey="amlCompliance"
              editing={editing}
              business={business}
            />
          </GridCol>
        </Grid>

        <NewBusinessModal
          opened={opened}
          close={close}
          handleBusinessUpdate={handleBusinessUpdate}
          business={business}
        />
      </div>

      {Object.keys(business.otherDocuments).length > 0 && (
        <div className={styles.top__container} style={{ marginTop: "32px" }}>
          <Flex justify="space-between" align="center">
            <Text fz={12} fw={600} tt="uppercase">
              Other Documents
            </Text>

            {/* {!editingDoc ? (
              <SecondaryBtn
                text="Edit"
                icon={IconPencilMinus}
                action={() => setEditingDoc(true)}
              />
            ) : (
              <Group>
                <SecondaryBtn
                  text="Cancel"
                  action={() => setEditingDoc(false)}
                  fz={10}
                  fw={600}
                />

                <PrimaryBtn
                  fz={10}
                  fw={600}
                  text="Save Changes"
                  loading={processing}
                  action={() => {
                    handleBusinessUpdate();
                  }}
                />
              </Group>
            )} */}
          </Flex>

          <Grid mt={20} className={styles.grid__container}>
            {Object.entries(business.otherDocuments).map(
              ([entry, value], index) => {
                return (
                  <GridCol span={4} className={styles.grid}>
                    <DocumentTextInput
                      title={`${entry}`}
                      label={entry}
                      form={form}
                      formKey={`otherDocuments`}
                      editing={editing}
                      business={business}
                      url={value}
                    />
                  </GridCol>
                );
              }
            )}
          </Grid>

          <NewBusinessModal
            opened={opened}
            close={close}
            handleBusinessUpdate={handleBusinessUpdate}
            business={business}
          />
        </div>
      )}
    </div>
  );
}

interface FormValues {
  cacCertificate: string;
  mermat: string;
  directorParticular: string | null;
  shareholderParticular: string | null;
  amlCompliance: string | null;
  operationalLicense: string | null;
  otherDocuments: Record<string, string>;
}

type DocumentTextInputProps = {
  editing: boolean;
  business: BusinessData;
  formKey: keyof FormValues;
  form: UseFormReturnType<FormValues>;
  label: string;
  title: string;
  url?: string;
};

const DocumentTextInput = ({
  editing,
  business,
  form,
  formKey,
  label,
  title,
  url,
}: DocumentTextInputProps) => {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleInfo } = useNotification();

  const handleUpload = async (file: File | null, formKey: string) => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/upload`,
        formData,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      if (formKey) {
        form.setFieldValue(formKey, data.data.url);
      }
      // setUploaded(true);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };
  return (
    <TextInput
      readOnly={!editing}
      classNames={{
        input: styles.input,
        label: styles.label,
      }}
      leftSection={<IconPdf />}
      leftSectionPointerEvents="none"
      rightSection={
        !editing ? (
          <UnstyledButton
            onClick={() => {
              if (url) {
                return window.open(url || "", "_blank");
              }

              if (!business[formKey]) {
                return handleInfo("No documents here", "");
              }

              if (typeof business[formKey] === "string") {
                window.open(business[formKey] || "", "_blank");
              }
            }}
            className={styles.input__right__section}
          >
            <Text fw={600} fz={10} c="#475467">
              View
            </Text>
          </UnstyledButton>
        ) : (
          <FileButton
            disabled={processing}
            onChange={(file) => handleUpload(file, formKey)}
            accept="image/png, image/jpeg, application/pdf"
          >
            {(props) => (
              <UnstyledButton
                w={"100%"}
                className={styles.input__right__section}
                {...props}
              >
                <Text fw={600} fz={10} c="##475467">
                  Re-upload
                </Text>
              </UnstyledButton>
            )}
          </FileButton>
        )
      }
      label={label}
      placeholder={`${title}-${business.name}`}
    />
  );
};

interface NewBizProps {
  opened: boolean;
  close: () => void;
  handleBusinessUpdate: (
    otherDocuments?: Record<string, string>
  ) => Promise<void>;
  business: BusinessData;
}

const NewBusinessModal = ({
  opened,
  close,
  handleBusinessUpdate,
  business,
}: NewBizProps) => {
  const [processing, setProcessing] = useState(false);

  const { handleError, handleSuccess } = useNotification();

  const form = useForm<OtherDocumentType>({
    initialValues: otherDocumentValues,
    validate: zodResolver(otherDocumentSchema),
  });

  const handleUpload = async () => {
    setProcessing(true);

    const { name, url } = form.values;
    try {
      await handleBusinessUpdate(
        business.otherDocuments
          ? { ...business.otherDocuments, [name]: url }
          : { [name]: url }
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const closeButtonProps = {
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

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        form.reset();
      }}
      closeButtonProps={closeButtonProps}
      title={
        <Text fz={20} fw={600}>
          New Document
        </Text>
      }
      padding={32}
      centered
    >
      <Box
        component="form"
        onSubmit={form.onSubmit(() => handleUpload())}
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <TextInput
          placeholder="Enter Document Name"
          {...form.getInputProps("name")}
          size="lg"
          radius={4}
          errorProps={{ fz: 12 }}
        />

        <Box>
          <DropzoneComponent otherDocumentForm={form} formKey="url" />
          {form.errors.url && (
            <Text c="var(--prune-warning)" fz={12} mt={0} p={0}>
              {form.errors.url}
            </Text>
          )}
        </Box>

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
            text="Submit"
            type="submit"
            loading={processing}
            fw={600}
          />
        </Flex>
      </Box>
    </Modal>
  );
};
