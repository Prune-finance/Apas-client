"use client";

import {
  Box,
  Button,
  Drawer,
  FileButton,
  Flex,
  Grid,
  GridCol,
  Select,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconFileInfo,
  IconPencilMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData, Director } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import { directorEtShareholderSchema, validateShareholder } from "@/lib/schema";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import DropzoneComponent from "./dropzone";
import { parseError } from "@/lib/actions/auth";

export default function Shareholders({
  business,
  revalidate,
}: {
  business: BusinessData;
  revalidate: () => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);

  const [processing, setProcessing] = useState(false);

  const form = useForm({
    initialValues: directorEtShareholderSchema,
  });

  function removeItemAtIndex(index: number) {
    return business.shareholders
      .slice(0, index)
      .concat(business.shareholders.slice(index + 1));
  }

  function replaceItemAtIndex(index: number, newValue: Director) {
    const newArray = business.shareholders.slice(); // Create a copy of the array to avoid modifying the original array
    newArray[index] = newValue;
    return newArray;
  }

  const deleteDirector = async (index: number) => {
    setProcessing(true);
    try {
      const shareholders = removeItemAtIndex(index);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          shareholders,
        },
        { withCredentials: true }
      );

      handleSuccess("Business Updated", "");
      revalidate();
      form.reset();
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleBusinessUpdate = async () => {
    setProcessing(true);
    try {
      const { error } = validateShareholder.safeParse(form.values);
      if (error) {
        throw new Error(error.issues[0].message);
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          shareholders: [...business.shareholders, { ...form.values }],
        },
        { withCredentials: true }
      );

      handleSuccess("Business Updated", "");
      revalidate();
      form.reset();
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const updateDirector = async (index: number, directorValue: Director) => {
    setProcessing(true);
    try {
      const shareholders = replaceItemAtIndex(index, directorValue);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          shareholders,
        },
        { withCredentials: true }
      );

      handleSuccess("Business Updated", "");
      revalidate();
      form.reset();
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.business__tab}>
      {business?.shareholders.map((shareholder, index) => {
        return (
          <Fragment key={index}>
            <DirectorsForm
              updateDirector={updateDirector}
              deleteDirector={deleteDirector}
              director={shareholder}
              index={index}
            />
          </Fragment>
        );
      })}

      {business?.shareholders.length < 1 && (
        <Text mt={24} fz={14} c="dimmed">
          No shareholders added
        </Text>
      )}

      <UnstyledButton onClick={open} mt={20}>
        <Flex align="center">
          <div className={styles.add__new__container}>
            <IconPlus color="#344054" size={14} />
          </div>
          <Text ml={8} fz={12}>
            Add New
          </Text>
        </Flex>
      </UnstyledButton>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Add a Shareholder"
        size="40%"
      >
        <Box mt={40}>
          <DirectorForm
            form={form}
            handleBusinessUpdate={handleBusinessUpdate}
            processing={processing}
          />
        </Box>
      </Drawer>
    </div>
  );
}

const DirectorForm = ({
  form,
  handleBusinessUpdate,
  processing,
}: {
  form: UseFormReturnType<typeof directorEtShareholderSchema>;
  handleBusinessUpdate: () => void;
  processing: boolean;
}) => {
  return (
    <>
      <Flex mt={26} gap={20}>
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Shareholder's name"
          {...form.getInputProps("name")}
        />
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Shareholder's Email"
          {...form.getInputProps("email")}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Select
          placeholder="Select Identity Type"
          classNames={{ input: styles.input }}
          flex={1}
          data={["ID Card", "Passport", "Residence Permit"]}
          {...form.getInputProps("identityType")}
        />

        <Select
          placeholder="Select Proof of Address"
          classNames={{ input: styles.input }}
          flex={1}
          data={["Utility Bill"]}
          {...form.getInputProps("proofOfAddress")}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Upload{" "}
            {form.values.identityType
              ? form.values.identityType
              : "Identity Card"}
          </Text>
          <DropzoneComponent form={form} formKey="identityFileUrl" />
        </Box>

        {form.values.identityType !== "Passport" && (
          <Box flex={1}>
            <Text fz={12} c="#344054" mb={10}>
              Upload{" "}
              {form.values.identityType
                ? form.values.identityType
                : "Identity Card"}{" "}
              back
            </Text>
            <DropzoneComponent form={form} formKey={`identityFileUrlBack`} />
          </Box>
        )}

        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Upload utility Bill
          </Text>
          <DropzoneComponent form={form} formKey="proofOfAddressFileUrl" />
        </Box>
      </Flex>

      <Flex mt={24} justify="flex-end" gap={15}>
        <Button
          style={{
            width: "120px",
            fontSize: "12px",
            borderRadius: "8px",
            color: "#344054",
          }}
          onClick={() => {
            form.reset();
          }}
          color="#D0D5DD"
          variant="outline"
          className={styles.cta}
        >
          Cancel
        </Button>

        <Button
          style={{
            width: "120px",
            fontSize: "12px",
            borderRadius: "8px",
            color: "#344054",
          }}
          onClick={handleBusinessUpdate}
          loading={processing}
          className={styles.cta}
          variant="filled"
          color="#D4F307"
        >
          Submit
        </Button>
      </Flex>
    </>
  );
};

const DirectorsForm = ({
  deleteDirector,
  updateDirector,
  director,
  index,
}: {
  deleteDirector: (index: number) => void;
  updateDirector: (index: number, director: Director) => void;
  director: Director;
  index: number;
}) => {
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const initialValues = {
    name: director.name,
    email: director.email,
    identityType: director.identityType,
    proofOfAddress: director.proofOfAddress,
    identityFileUrl: director.identityFileUrl,
    identityFileUrlBack: director.identityFileUrlBack,
    proofOfAddressFileUrl: director.proofOfAddressFileUrl,
  };

  const form = useForm({
    initialValues,
    // validate: zodResolver(validateNewBusiness),
  });

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
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.top__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Shareholder {index + 1}
        </Text>
        {!editing ? (
          <Flex gap={10}>
            <Button
              onClick={() => setEditing(true)}
              leftSection={<IconPencilMinus color="#475467" size={14} />}
              className={styles.edit}
            >
              Edit
            </Button>
            <Button
              onClick={() => deleteDirector(index)}
              leftSection={<IconTrash color="#475467" size={14} />}
              className={styles.edit}
            >
              Delete
            </Button>
          </Flex>
        ) : (
          <Flex gap={10}>
            <Button
              onClick={() => {
                updateDirector(index, form.values);
                setEditing(false);
              }}
              // className={styles.edit}
              variant="filled"
              color="#D4F307"
              style={{ fontSize: "10px", color: "#475467" }}
            >
              Save Changes
            </Button>
          </Flex>
        )}
      </Flex>

      <Grid mt={20} className={styles.grid__container}>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            label="Name"
            placeholder={director.name}
            {...form.getInputProps("name")}
          />
        </GridCol>

        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            label="Email"
            placeholder={director.email}
            {...form.getInputProps("email")}
          />
        </GridCol>

        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{
              input: styles.input,
              label: styles.label,
              section: styles.section,
            }}
            leftSection={<IconFileInfo />}
            leftSectionPointerEvents="none"
            rightSection={
              !editing ? (
                <UnstyledButton
                  onClick={() =>
                    window.open(director.identityFileUrl || "", "_blank")
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
                  onChange={(file) => handleUpload(file, "identityFileUrl")}
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
            label="Identity Type"
            placeholder={director.identityType}
          />
        </GridCol>

        {director.identityFileUrlBack && (
          <GridCol span={4} className={styles.grid}>
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
                  onClick={() =>
                    window.open(director.identityFileUrlBack || "", "_blank")
                  }
                  className={styles.input__right__section}
                >
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Identity Type Back"
              placeholder={`${director.identityType} Back`}
            />
          </GridCol>
        )}

        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly={!editing}
            classNames={{
              input: styles.input,
              label: styles.label,
              section: styles.section,
            }}
            leftSection={<IconFileInfo />}
            leftSectionPointerEvents="none"
            rightSection={
              !editing ? (
                <UnstyledButton
                  onClick={() =>
                    window.open(director.proofOfAddressFileUrl || "", "_blank")
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
                  onChange={(file) =>
                    handleUpload(file, "proofOfAddressFileUrl")
                  }
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
            label="Proof of Address"
            placeholder={director.proofOfAddress}
          />
        </GridCol>
      </Grid>
    </div>
  );
};
