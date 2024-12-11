"use client";

import {
  ActionIcon,
  Box,
  FileButton,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconFileTypePdf,
  IconPencilMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData, OtherDocuments } from "@/lib/hooks/businesses";
import { useState } from "react";
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
import FileDisplay from "@/ui/components/DocumentViewer";
import createAxiosInstance from "@/lib/axios";

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
  const axios = createAxiosInstance("auth");

  const initialValues = {
    cacCertificate: business.cacCertificate,
    mermat: business.mermat,
    directorParticular: business.directorParticular,
    shareholderParticular: business.shareholderParticular,
    amlCompliance: business.amlCompliance,
    operationalLicense: business.operationalLicense,
    companyPOAUrl: business.companyPOAUrl,
    // otherDocuments: business.otherDocuments,
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

  const otherDocsForm = useForm<{ documents: OtherDocuments[] }>({
    initialValues: { documents: business.documents },
  });

  const handleBusinessUpdate = async (documents?: OtherDocuments[]) => {
    const { contactEmail, name, contactNumber, domain } = business;

    setProcessing(true);
    try {
      await axios.patch(`/admin/company/${business.id}`, {
        contactEmail,
        name,
        domain,
        contactNumber,
        ...form.values,
        ...(documents && { documents }),
      });

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
              label="Certificate of Incorporation Document"
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
              title="Company POA"
              label="Corporate Proof of Address (Electricity or Water Bill)"
              form={form}
              formKey="companyPOAUrl"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="Shareholders"
              label="Shareholders POA"
              form={form}
              formKey="shareholderParticular"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="Directors"
              label="Directors POA"
              form={form}
              formKey="directorParticular"
              editing={editing}
              business={business}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              title="License"
              label="Operational License (Optional)"
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

        <NewDocumentModal
          opened={opened}
          close={close}
          handleBusinessUpdate={handleBusinessUpdate}
          business={business}
        />
      </div>

      {business.documents.some((doc) => Object.keys(doc).length > 0) && (
        <div className={styles.top__container} style={{ marginTop: "32px" }}>
          <Flex justify="space-between" align="center">
            <Text fz={12} fw={600} tt="uppercase">
              Other Documents
            </Text>

            {!editingDoc ? (
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
                    handleBusinessUpdate(otherDocsForm.values.documents);
                  }}
                />
              </Group>
            )}
          </Flex>

          <Grid mt={20} className={styles.grid__container}>
            {business.documents
              .filter((obj) => Object.keys(obj).length > 0)
              .map((value, index) => {
                return (
                  <GridCol span={4} className={styles.grid} key={index}>
                    <OtherDocumentTextInput
                      title={`${value.title}`}
                      label={value.title}
                      form={otherDocsForm}
                      editing={editingDoc}
                      business={business}
                      url={value.documentURL}
                      index={index}
                    />
                  </GridCol>
                );
              })}
          </Grid>
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
  companyPOAUrl: string | null;
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
  const [opened, { open, close }] = useDisclosure(false);
  const axios = createAxiosInstance("auth");

  const handleUpload = async (file: File | null, formKey: string) => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(`/admin/upload`, formData);

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
    <>
      <TextInput
        readOnly={!editing}
        classNames={{
          input: styles.input,
          label: styles.label,
        }}
        leftSection={<IconFileTypePdf color="var(--prune-text-gray-700)" />}
        leftSectionPointerEvents="none"
        rightSection={
          !editing ? (
            <UnstyledButton
              // onClick={() => {
              //   if (url) {
              //     return window.open(url || "", "_blank");
              //   }

              //   if (!business[formKey]) {
              //     return handleInfo("No documents here", "");
              //   }

              //   if (typeof business[formKey] === "string") {
              //     window.open(business[formKey] || "", "_blank");
              //   }
              // }}
              onClick={open}
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
                  <Text fw={600} fz={10} c="#475467">
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
          <FileDisplay fileUrl={url || (business[formKey] as string) || ""} />
        </Box>
      </Modal>
    </>
  );
};

interface OtherDocumentTextInputProps
  extends Omit<DocumentTextInputProps, "formKey" | "form"> {
  index: number;
  form: UseFormReturnType<{ documents: OtherDocuments[] }>;
}

const OtherDocumentTextInput = ({
  editing,
  business,
  index,
  label,
  title,
  url,
  form,
}: OtherDocumentTextInputProps) => {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleInfo } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const axios = createAxiosInstance("auth");

  const handleUpload = async (file: File | null) => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data: res } = await axios.post(`/admin/upload`, formData);

      form.setFieldValue(`documents.${index}.documentURL`, res.data.url);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };
  return (
    <>
      <TextInput
        readOnly={!editing}
        classNames={{
          input: styles.input,
          label: styles.label,
        }}
        {...form.getInputProps(`documents.${index}.title`)}
        leftSection={<IconFileTypePdf color="var(--prune-text-gray-700)" />}
        leftSectionPointerEvents="none"
        rightSection={
          !editing ? (
            <UnstyledButton
              // onClick={() => {
              //   if (!url) return handleInfo("No documents here", "");
              //   return window.open(url, "_blank");
              // }}
              onClick={open}
              className={styles.input__right__section}
            >
              <Text fw={600} fz={10} c="#475467">
                View
              </Text>
            </UnstyledButton>
          ) : (
            <FileButton
              disabled={processing}
              onChange={(file) => handleUpload(file)}
              accept="image/png, image/jpeg, application/pdf"
            >
              {(props) => (
                <UnstyledButton
                  w={"100%"}
                  className={styles.input__right__section}
                  {...props}
                >
                  <Text fw={600} fz={10} c="#475467">
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

      <Modal
        opened={opened}
        onClose={close}
        size={"lg"}
        centered
        title={
          <Text fz={14} fw={500}>
            Document Preview
          </Text>
        }
      >
        <Box mah={500}>
          <FileDisplay fileUrl={url || ""} />
        </Box>
      </Modal>
    </>
  );
};

interface NewBizProps {
  opened: boolean;
  close: () => void;
  handleBusinessUpdate: (documents: OtherDocuments[]) => Promise<void>;
  business: BusinessData;
}

const NewDocumentModal = ({
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
        business.documents && business.documents.length > 0
          ? [...business.documents, { title: name, documentURL: url }]
          : [{ title: name, documentURL: url }]
      );
      close();
      form.reset();
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
