"use client";

import {
  Button,
  FileButton,
  Flex,
  Grid,
  GridCol,
  Group,
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
} from "@tabler/icons-react";
import Cookies from "js-cookie";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState } from "react";
import axios from "axios";
import { useForm, UseFormReturnType } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { SecondaryBtn, PrimaryBtn } from "@/ui/components/Buttons";

export default function Documents({
  business,
  revalidate,
}: {
  business: BusinessData;
  revalidate: () => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const initialValues = {
    cacCertificate: business.cacCertificate,
    mermat: business.mermat,
    directorParticular: business.directorParticular,
    shareholderParticular: business.shareholderParticular,
    amlCompliance: business.amlCompliance,
    operationalLicense: business.operationalLicense,
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

  const handleBusinessUpdate = async () => {
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
    }
  };

  return (
    <div className={styles.document__tab}>
      <Group justify="space-between" mb={20}>
        <Text fz={12} fw={600} tt="capitalize">
          All Documents
        </Text>

        <PrimaryBtn text="New Document" icon={IconPlus} fz={12} fw={600} />
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
      </div>

      <Button
        // mt={20}
        variant="transparent"
        fz={12}
        fw={400}
        c="#000"
        // onClick={open}
        leftSection={
          <ThemeIcon radius="xl" color="var(--prune-primary-500)">
            <IconPlus color="#344054" size={14} />
          </ThemeIcon>
        }
      >
        Add New
      </Button>
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
}

type DocumentTextInputProps = {
  editing: boolean;
  business: BusinessData;
  formKey: keyof FormValues;
  form: UseFormReturnType<FormValues>;
  label: string;
  title: string;
};

const DocumentTextInput = ({
  editing,
  business,
  form,
  formKey,
  label,
  title,
}: DocumentTextInputProps) => {
  const [processing, setProcessing] = useState(false);
  const { handleError } = useNotification();

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
            onClick={() => window.open(business[formKey] || "", "_blank")}
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
