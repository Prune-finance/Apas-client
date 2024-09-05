"use client";

import {
  Box,
  Button,
  Drawer,
  FileButton,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  IconFileInfo,
  IconPencilMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
import Cookies from "js-cookie";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData, Director } from "@/lib/hooks/businesses";
import useNotification from "@/lib/hooks/notification";
import {
  directorEtShareholderSchema,
  removeDirectorSchema,
  removeDirectorValues,
  validateShareholder,
} from "@/lib/schema";
import { UseFormReturnType, useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import classes from "@/ui/styles/containedInput.module.scss";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  closeButtonProps,
  DocumentTextInput,
  RemoveDirectorModal,
} from "./utils";
import DropzoneComponent from "@/ui/components/Dropzone";

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
    const { contactEmail, name, domain, contactNumber } = business;
    try {
      const shareholders = removeItemAtIndex(index);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          contactEmail,
          name,
          domain,
          contactNumber,
          shareholders,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
    const { contactEmail, name, domain, contactNumber } = business;
    try {
      const { error } = validateShareholder.safeParse(form.values);
      if (error) {
        throw new Error(error.issues[0].message);
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          contactEmail,
          name,
          domain,
          contactNumber,
          shareholders: [...business.shareholders, { ...form.values }],
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
    const { contactEmail, name, domain, contactNumber } = business;
    try {
      const shareholders = replaceItemAtIndex(index, directorValue);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          contactEmail,
          name,
          domain,
          contactNumber,
          shareholders,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
      <Group justify="space-between" mb={20}>
        <Text fz={12} fw={600} tt="capitalize">
          All Key Shareholders
        </Text>

        <PrimaryBtn
          text="New Shareholder"
          icon={IconPlus}
          fz={12}
          fw={600}
          action={open}
        />
      </Group>
      {business?.shareholders.map((shareholder, index) => {
        return (
          <Stack gap={20} key={index}>
            <DirectorsForm
              updateDirector={updateDirector}
              deleteDirector={deleteDirector}
              director={shareholder}
              index={index}
            />
          </Stack>
        );
      })}

      {business?.shareholders.length < 1 && (
        <Text mt={24} fz={14} c="dimmed">
          No shareholders added
        </Text>
      )}

      <Modal
        // position="right"
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title={
          <Text fz={24} fw={600}>
            Add a Shareholder
          </Text>
        }
        size="40%"
        centered
        closeButtonProps={closeButtonProps}
      >
        <Box>
          <DirectorForm
            form={form}
            handleBusinessUpdate={handleBusinessUpdate}
            processing={processing}
            close={close}
          />
        </Box>
      </Modal>
    </div>
  );
}

const DirectorForm = ({
  form,
  handleBusinessUpdate,
  processing,
  close,
}: {
  form: UseFormReturnType<typeof directorEtShareholderSchema>;
  handleBusinessUpdate: () => void;
  close: () => void;
  processing: boolean;
}) => {
  return (
    <>
      <TextInput
        classNames={classes}
        label="Name"
        flex={1}
        placeholder="Enter Shareholder's name"
        {...form.getInputProps("name")}
      />
      <TextInput
        mt="md"
        classNames={classes}
        label="Email"
        flex={1}
        placeholder="Enter Shareholder's Email"
        {...form.getInputProps("email")}
      />

      <Select
        mt="md"
        comboboxProps={{ withinPortal: true }}
        classNames={classes}
        placeholder="Select Identity Type"
        label="Identity Type"
        flex={1}
        data={["ID Card", "Passport", "Residence Permit"]}
        {...form.getInputProps("identityType")}
      />

      {form.values.identityType && (
        <Flex mt={24} gap={20}>
          <Box flex={1}>
            <Text fz={12} c="#344054" mb={10}>
              {`Upload ${
                form.values.identityType
                  ? form.values.identityType
                  : "Identity Card"
              } ${form.values.identityType !== "Passport" ? "(Front)" : ""}`}
            </Text>
            <DropzoneComponent
              DirectorForm={form}
              formKey="identityFileUrl"
              uploadedFileUrl={form.values.identityFileUrl}
            />
          </Box>

          {form.values.identityType !== "Passport" && (
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                {`Upload ${
                  form.values.identityType
                    ? form.values.identityType
                    : "Identity Card"
                } (Back)`}
              </Text>
              <DropzoneComponent
                DirectorForm={form}
                formKey={`identityFileUrlBack`}
                uploadedFileUrl={form.values.identityFileUrlBack}
              />
            </Box>
          )}
        </Flex>
      )}

      <Select
        mt="md"
        comboboxProps={{ withinPortal: true }}
        classNames={classes}
        label="Proof of Address"
        placeholder="Select Proof of Address"
        // classNames={{ input: styles.input }}
        flex={1}
        data={["Utility Bill"]}
        {...form.getInputProps("proofOfAddress")}
      />

      {form.values.proofOfAddress && (
        <Box flex={1} mt="md">
          <Text fz={12} c="#344054" mb={10}>
            Upload utility Bill
          </Text>
          <DropzoneComponent
            DirectorForm={form}
            formKey="proofOfAddressFileUrl"
            uploadedFileUrl={form.values.proofOfAddressFileUrl}
          />
        </Box>
      )}

      <Flex mt={24} justify="flex-end" gap={15}>
        <Button
          style={{
            width: "120px",
            fontSize: "12px",
            borderRadius: "8px",
            color: "#344054",
          }}
          disabled={processing}
          onClick={() => {
            form.reset();
            close();
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
          color="var(--prune-primary-600)"
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
  deleteDirector: (index: number) => Promise<void>;
  updateDirector: (index: number, director: Director) => Promise<void>;
  director: Director;
  index: number;
}) => {
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

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
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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

  const handleUpdate = async () => {
    setProcessing(true);

    try {
      await updateDirector(index, form.values);
    } finally {
      setProcessing(false);
      setEditing(false);
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
            <SecondaryBtn
              text="Edit"
              action={() => setEditing(true)}
              icon={IconPencilMinus}
              variant="light"
              color="var(--prune-text-gray-400)"
              fz={10}
              fw={600}
            />
            <SecondaryBtn
              text="Remove"
              action={open}
              icon={IconTrash}
              variant="light"
              color="var(--prune-text-gray-400)"
              fz={10}
              fw={600}
            />
          </Flex>
        ) : (
          <Flex gap={10}>
            <SecondaryBtn
              text="Cancel"
              action={() => setEditing(false)}
              disabled={processing}
              fz={10}
              fw={600}
            />

            <PrimaryBtn
              text="Save Changes"
              action={() => {
                handleUpdate();
              }}
              loading={processing}
              fz={10}
              fw={600}
            />
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
          <DocumentTextInput
            editing={editing}
            form={form}
            formKey="identityType"
            documentKey="identityFileUrl"
            label="Identity Type"
            title={director.identityType}
            director={director}
          />
        </GridCol>

        {form.values.identityType !== "Passport" && (
          <GridCol span={4} className={styles.grid}>
            <DocumentTextInput
              editing={editing}
              form={form}
              formKey="identityType"
              documentKey="identityFileUrlBack"
              label="Identity Type (Back)"
              title={director.identityType}
              director={director}
            />
          </GridCol>
        )}

        <GridCol span={4} className={styles.grid}>
          <DocumentTextInput
            editing={editing}
            form={form}
            formKey="proofOfAddress"
            documentKey="proofOfAddressFileUrl"
            label="Proof of Addresses"
            title={director.proofOfAddress}
            director={director}
          />
        </GridCol>
      </Grid>

      <RemoveDirectorModal
        opened={opened}
        close={close}
        index={index}
        deleteDirector={deleteDirector}
        type="shareholder"
      />
    </div>
  );
};
