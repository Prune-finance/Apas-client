"use client";
import axios from "axios";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";

import { Flex, Paper, ThemeIcon, Text, Box } from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { UseFormReturnType, useForm, zodResolver } from "@mantine/form";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import DropzoneComponent from "@/ui/components/Dropzone";
import {
  directorEtShareholderSchema,
  newBusiness,
  validateNewBusiness,
} from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

export default function NewBusiness() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const [directorsCount, setDirectorsCount] = useState(0);
  const [shareholderCount, setShareholderCount] = useState(0);

  const { handleSuccess, handleError } = useNotification();

  const form = useForm({
    initialValues: newBusiness,
    validate: zodResolver(validateNewBusiness),
  });

  const handleCreate = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = form.validate();
      const { directors, shareholders } = form.values;

      const initialDir = directors[0];
      const initialShr = shareholders[0];

      const initialDirEmpty = Object.values(initialDir).every((val) => !val);
      const initialShrEmpty = Object.values(initialShr).every((val) => !val);

      if (hasErrors) {
        throw new Error("Please fill all required fields");
      }

      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company`,
        {
          ...form.values,
          ...(initialDirEmpty && { directors: [] }),
          ...(initialShrEmpty && { shareholders: [] }),
        },
        { withCredentials: true }
      );

      handleSuccess(
        "Business Created",
        `${form.values.name} has been added to your list of business`
      );
      router.push("/admin/businesses");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Businesses", href: "/admin/businesses" },
          { title: "New Business", href: "/admin/businesses/new" },
        ]}
      />

      <Paper className={styles.form__container}>
        <Flex gap={10} align="center">
          <UnstyledButton onClick={() => router.back()}>
            <ThemeIcon color="rgba(212, 243, 7)" radius="lg">
              <IconArrowLeft
                color="#1D2939"
                style={{ width: "70%", height: "70%" }}
              />
            </ThemeIcon>
          </UnstyledButton>

          <Text className={styles.form__container__hdrText}>
            Create New Business
          </Text>
        </Flex>

        <Box mt={32}>
          <Flex gap={20}>
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Business Name"
              placeholder="Enter business name"
              {...form.getInputProps("name")}
              withAsterisk
            />
            <Select
              placeholder="Select Country"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Country"
              data={["Nigeria", "Ghana", "Kenya"]}
              {...form.getInputProps("country")}
            />
          </Flex>

          <Flex gap={20} mt={24}>
            <Select
              placeholder="Select Legal Entity"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Legal Entity"
              data={["Corporate"]}
              {...form.getInputProps("legalEntity")}
            />

            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              withAsterisk
              label="Business domain"
              placeholder="Enter domain"
              {...form.getInputProps("domain")}
            />
          </Flex>

          <Flex gap={20} mt={24}>
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              withAsterisk
              label="Contact phone number"
              placeholder="Enter number"
              {...form.getInputProps("contactNumber")}
            />
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              withAsterisk
              label="Contact email"
              placeholder="Enter email"
              {...form.getInputProps("contactEmail")}
            />
          </Flex>

          <Flex gap={20} mt={24}>
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Business Address"
              placeholder="Enter business address"
            />
            <Select
              placeholder="Enter Pricing Plan"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Pricing plan"
              data={["Free", "Basic", "Premium"]}
            />
          </Flex>
        </Box>

        <Box mt={40}>
          <Text fz={16} c="#97AD05">
            Documents:
          </Text>

          <Flex mt={24} gap={20}>
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                CAC Certificate
              </Text>
              <DropzoneComponent form={form} formKey="cacCertificate" />
            </Box>

            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                Mermat
              </Text>
              <DropzoneComponent form={form} formKey="mermat" />
            </Box>
          </Flex>

          {/* <Flex mt={24} gap={20}>
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                CAC Certificate
              </Text>
              <DropzoneComponent />
            </Box>

            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                Mermat
              </Text>
              <DropzoneComponent />
            </Box>
          </Flex> */}
        </Box>

        <Box mt={40}>
          <Text fz={16} c="#97AD05">
            Directors:
          </Text>

          <DirectorForm count={0} form={form} />

          {Array(directorsCount)
            .fill("")
            .map((_, index) => {
              return (
                <Fragment key={index}>
                  <DirectorForm count={index + 1} form={form} />
                </Fragment>
              );
            })}

          <UnstyledButton
            mt={20}
            onClick={() => {
              form.insertListItem("directors", directorEtShareholderSchema);
              setDirectorsCount(directorsCount + 1);
            }}
          >
            <Flex align="center">
              <div className={styles.add__new__container}>
                <IconPlus color="#344054" size={14} />
              </div>
              <Text ml={8} fz={12}>
                Add New
              </Text>
            </Flex>
          </UnstyledButton>
        </Box>

        <Box mt={40}>
          <Text fz={16} c="#97AD05">
            Shareholders:
          </Text>

          <ShareholderForm count={0} form={form} />

          {Array(shareholderCount)
            .fill("")
            .map((_, index) => {
              return (
                <Fragment key={index}>
                  <ShareholderForm count={index + 1} form={form} />
                </Fragment>
              );
            })}

          <UnstyledButton
            mt={20}
            onClick={() => {
              form.insertListItem("shareholders", directorEtShareholderSchema);
              setShareholderCount(shareholderCount + 1);
            }}
          >
            <Flex align="center">
              <div className={styles.add__new__container}>
                <IconPlus color="#344054" size={14} />
              </div>
              <Text ml={8} fz={12}>
                Add New
              </Text>
            </Flex>
          </UnstyledButton>
        </Box>

        <Flex mt={24} justify="flex-end" gap={15}>
          <Button
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
            onClick={handleCreate}
            loading={processing}
            className={styles.cta}
            variant="filled"
            color="#D4F307"
          >
            Submit
          </Button>
        </Flex>
      </Paper>
    </main>
  );
}

const DirectorForm = ({
  count,
  form,
}: {
  count: number;
  form: UseFormReturnType<typeof newBusiness>;
}) => {
  return (
    <>
      <Flex mt={26} gap={20}>
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Director's name"
          {...form.getInputProps(`directors.${count}.name`)}
        />
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Director's Email"
          {...form.getInputProps(`directors.${count}.email`)}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Select
          placeholder="Select Identity Type"
          classNames={{ input: styles.input }}
          flex={1}
          data={["ID Card", "Passport", "Residence Permit"]}
          {...form.getInputProps(`directors.${count}.identityType`)}
        />

        <Select
          placeholder="Select Proof of Address"
          classNames={{ input: styles.input }}
          flex={1}
          data={["Utility Bill"]}
          {...form.getInputProps(`directors.${count}.proofOfAddress`)}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Upload {form.values.directors[count].identityType}
          </Text>
          <DropzoneComponent
            form={form}
            formKey={`directors.${count}.identityFileUrl`}
          />
        </Box>

        {form.values.directors[count].identityType !== "Passport" && (
          <Box flex={1}>
            <Text fz={12} c="#344054" mb={10}>
              Upload {form.values.directors[count].identityType} back
            </Text>
            <DropzoneComponent
              form={form}
              formKey={`directors.${count}.identityFileUrlBack`}
            />
          </Box>
        )}

        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Upload utility Bill
          </Text>
          <DropzoneComponent
            form={form}
            formKey={`directors.${count}.proofOfAddressFileUrl`}
          />
        </Box>
      </Flex>
    </>
  );
};

const ShareholderForm = ({
  count,
  form,
}: {
  count: number;
  form: UseFormReturnType<typeof newBusiness>;
}) => {
  return (
    <>
      <Flex mt={26} gap={20}>
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Shareholder's name"
          {...form.getInputProps(`shareholders.${count}.name`)}
        />
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Shareholder's Email"
          {...form.getInputProps(`shareholders.${count}.email`)}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Select
          placeholder="Select Identity Type"
          classNames={{ input: styles.input }}
          flex={1}
          data={["ID Card", "Passport", "Residence Permit"]}
          {...form.getInputProps(`shareholders.${count}.identityType`)}
        />

        <Select
          placeholder="Select Proof of Address"
          classNames={{ input: styles.input }}
          flex={1}
          data={["Utility Bill"]}
          {...form.getInputProps(`shareholders.${count}.proofOfAddress`)}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Upload {form.values.shareholders[count].identityType}
          </Text>
          <DropzoneComponent
            form={form}
            formKey={`shareholders.${count}.identityFileUrl`}
          />
        </Box>

        {form.values.shareholders[count].identityType !== "Passport" && (
          <Box flex={1}>
            <Text fz={12} c="#344054" mb={10}>
              Upload {form.values.shareholders[count].identityType} back
            </Text>
            <DropzoneComponent
              form={form}
              formKey={`shareholders.${count}.identityFileUrlBack`}
            />
          </Box>
        )}

        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Upload utility Bill
          </Text>
          <DropzoneComponent
            form={form}
            formKey={`shareholders.${count}.proofOfAddressFileUrl`}
          />
        </Box>
      </Flex>
    </>
  );
};

// SHHxNW6WkTAxhp8#
