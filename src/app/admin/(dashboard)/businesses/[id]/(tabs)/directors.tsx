"use client";

import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  FileButton,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  Paper,
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
import DropzoneComponent from "./dropzone";
import { useDisclosure } from "@mantine/hooks";
import { UseFormReturnType, useForm, zodResolver } from "@mantine/form";
import {
  directorEtShareholderSchema,
  removeDirectorSchema,
  removeDirectorValues,
  validateDirectors,
} from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import classes from "@/ui/styles/containedInput.module.css";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { set } from "zod";

export default function Directors({
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
    return business.directors
      .slice(0, index)
      .concat(business.directors.slice(index + 1));
  }

  function replaceItemAtIndex(index: number, newValue: Director) {
    const newArray = business.directors.slice(); // Create a copy of the array to avoid modifying the original array
    newArray[index] = newValue;
    return newArray;
  }

  const deleteDirector = async (index: number) => {
    setProcessing(true);
    try {
      const directors = removeItemAtIndex(index);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          directors,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess(
        "Business Updated",
        "You have successfully removed a director."
      );
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
      const { error } = validateDirectors.safeParse(form.values);
      if (error) {
        throw new Error(error.issues[0].message);
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          directors: [...business.directors, { ...form.values }],
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
    try {
      const directors = replaceItemAtIndex(index, directorValue);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company/${business.id}`,
        {
          ...business,
          directors,
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
      {business?.directors.map((director, index) => {
        return (
          <Fragment key={index}>
            <DirectorsForm
              deleteDirector={deleteDirector}
              updateDirector={updateDirector}
              director={director}
              index={index}
            />
          </Fragment>
        );
      })}

      {business?.directors.length < 1 && (
        <Text mt={24} fz={14} c="dimmed">
          No directors added
        </Text>
      )}

      <Button
        mt={20}
        variant="transparent"
        fz={12}
        fw={400}
        c="#000"
        onClick={open}
        leftSection={
          <ThemeIcon radius="xl" color="var(--prune-primary-500)">
            <IconPlus color="#344054" size={14} />
          </ThemeIcon>
        }
      >
        Add New
      </Button>

      <Modal
        // position="right"
        opened={opened}
        onClose={close}
        title={
          <Text fz={24} fw={600}>
            Add a Director
          </Text>
        }
        size="43%"
        centered
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
        // labelProps={{fz: }}
        flex={1}
        placeholder="Enter Director's name"
        {...form.getInputProps("name")}
      />

      <TextInput
        mt="md"
        classNames={classes}
        label="Email"
        flex={1}
        placeholder="Enter Director's Email"
        {...form.getInputProps("email")}
      />
      {/* </Flex> */}

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
            <DropzoneComponent form={form} formKey="identityFileUrl" />
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
              <DropzoneComponent form={form} formKey={`identityFileUrlBack`} />
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
        flex={1}
        data={["Utility Bill"]}
        {...form.getInputProps("proofOfAddress")}
      />

      {form.values.proofOfAddress && (
        <Box flex={1} mt="md">
          <Text fz={12} c="#344054" mb={10}>
            Upload utility Bill
          </Text>
          <DropzoneComponent form={form} formKey="proofOfAddressFileUrl" />
        </Box>
      )}

      <Flex mt={24} justify="flex-end" gap={15}>
        {/* <Button
          style={{
            width: "120px",
            fontSize: "12px",
            borderRadius: "8px",
            color: "#344054",
          }}
          onClick={() => {
            form.reset();
            close();
          }}
          color="#D0D5DD"
          variant="outline"
          className={styles.cta}
        >
          Cancel
        </Button> */}
        <SecondaryBtn
          text="Cancel"
          action={() => {
            close();
            form.reset();
          }}
          fw={600}
          w={120}
        />

        <PrimaryBtn
          text="Submit"
          action={handleBusinessUpdate}
          fw={600}
          w={120}
          loading={processing}
        />

        {/* <Button
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
        </Button> */}
      </Flex>
    </>
  );
};

interface IDirector {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}

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

  return (
    <div className={styles.top__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Director {index + 1}
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
              fz={10}
              fw={600}
            />

            <PrimaryBtn
              text="Save Changes"
              action={() => {
                setEditing(false);
                updateDirector(index, form.values);
              }}
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
          {/* <TextInput
            readOnly
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
                  <Text fw={600} fz={10} c="#475467">
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
                      <Text fw={600} fz={10} c="#475467">
                        Re-upload
                      </Text>
                    </UnstyledButton>
                  )}
                </FileButton>
              )
            }
            label="Identity Type"
            placeholder={director.identityType}
          /> */}

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

        {director.identityFileUrlBack ||
          (form.values.identityType !== "Passport" && (
            <GridCol span={4} className={styles.grid}>
              {/* <TextInput
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
                    <Text fw={600} fz={10} c="#475467">
                      View
                    </Text>
                  </UnstyledButton>
                }
                label="Identity Type Back"
                placeholder={`${director.identityType} Back`}
              /> */}

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
          ))}

        <GridCol span={4} className={styles.grid}>
          {/* <Select
            readOnly
            classNames={{
              input: styles.input,
              label: styles.label,
              section: styles.section,
            }}
            data={["Utility Bill"]}

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
                  <Text fw={600} fz={10} c="#475467">
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
                      <Text fw={600} fz={10} c="#475467">
                        Re-upload
                      </Text>
                    </UnstyledButton>
                  )}
                </FileButton>
              )
            }
            label="Proof of Address"
            placeholder={director.proofOfAddress}
          /> */}

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
      />
    </div>
  );
};

type DocumentTextInputProps = {
  editing: boolean;
  director: IDirector;
  formKey: keyof IDirector;
  documentKey: keyof IDirector;
  form: UseFormReturnType<IDirector>;
  label: string;
  title: string;
};

const DocumentTextInput = ({
  editing,
  director,
  form,
  formKey,
  documentKey,
  label,
  title,
}: DocumentTextInputProps) => {
  const [processing, setProcessing] = useState(false);
  const { handleError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);

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
    <Box>
      <Select
        // readOnly={!editing}
        readOnly
        // comboboxProps={{ withinPortal: false, zIndex: 100 }}
        data={["ID Card", "Passport", "Residence Permit"]}
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<IconFileInfo />}
        leftSectionPointerEvents="none"
        rightSectionPointerEvents="auto"
        {...form.getInputProps(formKey)}
        rightSection={
          !editing ? (
            <UnstyledButton
              onClick={() => window.open(director[formKey] || "", "_blank")}
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

      <ReUploadProofOfAddress
        opened={opened}
        close={close}
        formKey={formKey}
        form={form}
      />
      {/* <ReUploadIdentityType opened={opened} close={close} /> */}
    </Box>
  );
};

interface ReUploadProps {
  opened: boolean;
  close: () => void;
  formKey: keyof IDirector;
  form: UseFormReturnType<IDirector>;
}

const ReUploadProofOfAddress = ({
  opened,
  close,
  formKey,
  form,
}: ReUploadProps) => {
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
    </Modal>
  );
};

const ReUploadIdentityType = ({ opened, close }: ReUploadProps) => {
  const closeButtonProps = {
    pr: 32,
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
      <Text>djfjfhhffhghfgfg</Text>
    </Modal>
  );
};

const RemoveDirectorModal = ({
  opened,
  close,
  index,
  deleteDirector,
}: {
  opened: boolean;
  close: () => void;
  index: number;
  deleteDirector: (index: number) => void;
}) => {
  const form = useForm({
    initialValues: removeDirectorValues,
    validate: zodResolver(removeDirectorSchema),
  });

  return (
    <Modal opened={opened} onClose={close} centered w={400} padding={20}>
      <Stack align="center" gap={30}>
        <ThemeIcon radius="xl" color="#D92D20" size={64} variant="light">
          <IconX size={32} />
        </ThemeIcon>

        <Text fz={18} fw={600}>
          Remove This Director?
        </Text>

        <Text
          fz={12}
          fw={400}
          ta="center"
          c="var(--prune-text-gray-500)"
          w="45ch"
        >
          You are about to remove this director from the system. Please know
          that you cannot undo this action.
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
          />
        </Box>

        <Flex w="100%" gap={20}>
          <Button
            variant="outline"
            color="var(--prune-text-gray-300"
            c="var(--prune-text-gray-800"
            fz={12}
            fw={500}
            flex={1}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            color="var(--prune-primary-600)"
            fz={12}
            fw={500}
            c="var(--prune-text-gray-800"
            flex={1}
            onClick={() => deleteDirector(index)}
          >
            Proceed
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};
