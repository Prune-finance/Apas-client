"use client";

import {
  Button,
  FileButton,
  Flex,
  Grid,
  GridCol,
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

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

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
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

  const handleBusinessUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          ...form.values,
        },
        { withCredentials: true }
      );

      handleSuccess("Business Updated", "");
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  const handleUpload = async (file: File | null, formKey: string) => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/upload`,
        formData,
        { withCredentials: true }
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
    <div className={styles.document__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Documents
          </Text>
          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              leftSection={<IconPencilMinus color="#475467" size={14} />}
              className={styles.edit}
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleBusinessUpdate();
                setEditing(false);
              }}
              // className={styles.edit}
              variant="filled"
              color="#D4F307"
              style={{ fontSize: "10px", color: "#475467" }}
            >
              Save Changes
            </Button>
          )}
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editing}
              classNames={{
                input: styles.input,
                label: styles.label,
                section: styles.section,
                root: styles.input__root2,
              }}
              leftSection={<IconPdf />}
              leftSectionPointerEvents="none"
              rightSection={
                !editing ? (
                  <UnstyledButton
                    onClick={() =>
                      window.open(business?.cacCertificate || "", "_blank")
                    }
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="##475467">
                      View
                    </Text>
                  </UnstyledButton>
                ) : (
                  <FileButton
                    disabled={processing}
                    onChange={(file) => handleUpload(file, "cacCertificate")}
                    accept="image/png,image/jpeg"
                  >
                    {(props) => (
                      <UnstyledButton
                        disabled={processing}
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
              label="CAC Document"
              placeholder={`CAC-${business.name}`}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
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
                    onClick={() =>
                      window.open(business?.mermat || "", "_blank")
                    }
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="##475467">
                      View
                    </Text>
                  </UnstyledButton>
                ) : (
                  <FileButton
                    disabled={processing}
                    onChange={(file) => handleUpload(file, "mermat")}
                    accept="image/png,image/jpeg"
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
              label="MerMat Document"
              placeholder={`Mermat-${business.name}`}
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
