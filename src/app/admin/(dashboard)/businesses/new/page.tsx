"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMail, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import Cookies from "js-cookie";

import {
  Flex,
  Paper,
  ThemeIcon,
  Text,
  Box,
  Group,
  Stepper,
  Divider,
  Checkbox,
  Modal,
  Image,
} from "@mantine/core";
import { TextInput, Select, Button } from "@mantine/core";
import { UseFormReturnType, useForm, zodResolver } from "@mantine/form";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import DropzoneComponent from "@/ui/components/Dropzone";
import {
  directorEtShareholderSchema,
  NewBusinessType,
  newBusiness,
  validateNewBusiness,
  basicInfoSchema,
  documentSchema,
  directorsSchema,
  shareholdersSchema,
} from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import BasicInfo from "./BasicInfo";
import Documents from "./Documents";
import { BackBtn, PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import SuccessModalImage from "@/assets/success-modal-image.png";
import SuccessModal from "@/ui/components/SuccessModal";

interface DirectorEtShareholder
  extends Omit<
    typeof directorEtShareholderSchema,
    "identityType" | "proofOfAddress"
  > {
  identityType: string | null;
  proofOfAddress: string | null;
}

export default function NewBusiness() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const { handleSuccess, handleError, handleInfo } = useNotification();

  const [active, setActive] = useState(0);

  const form = useForm<NewBusinessType>({
    initialValues: newBusiness,
    // validate: zodResolver(validateNewBusiness),
    validate: (values) => {
      if (active === 0) return zodResolver(basicInfoSchema)(values);
      if (active === 1) return zodResolver(documentSchema)(values);
      if (active === 2) return zodResolver(directorsSchema)(values);
      if (active === 3) return zodResolver(shareholdersSchema)(values);
      return {};
    },
  });

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = () => {
    const { hasErrors, errors } = form.validate();
    if (hasErrors) return;

    setActive((current) => {
      // if (form.validate().hasErrors) return current;
      const { hasErrors } = form.validate();
      if (hasErrors) return current;

      return current < 3 ? current + 1 : current;
    });
  };

  const handleCreate = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = form.validate();
      const {
        directors,
        shareholders,
        pricingPlan,
        contactCountryCode,
        ...rest
      } = form.values;

      const initialDir = directors && directors[0];
      const initialShr = shareholders && shareholders[0];

      const initialDirEmpty = Object.values(initialDir ?? {}).every(
        (val) => !val
      );
      const initialShrEmpty = Object.values(initialShr ?? {}).every(
        (val) => !val
      );

      if (hasErrors) {
        throw new Error("Please fill all required fields");
      }

      // For pricing plan, the key will be "pricingPlanId"

      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/company`,
        {
          ...rest,
          pricingPlanId: pricingPlan,
          ...(initialDirEmpty ? { directors: [] } : { directors }),
          ...(initialShrEmpty ? { shareholders: [] } : { shareholders }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      // handleSuccess(
      //   "Business Created",
      //   `${form.values.name} has been added to your list of business`
      // );
      // router.push("/admin/businesses");
      openSuccess();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  function isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (typeof value === "number" && value === 0) return true;
    if (typeof value === "boolean" && value === false) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0)
      return true;
    return false;
  }

  // const makeDirectorAShareholder = (director: DirectorEtShareholder) => {
  //   form.values.shareholders &&
  //     form.values.shareholders.map((item, index) => {
  //       const data = Object.values(item).every(isEmpty);

  //       if (data) form.removeListItem("shareholders", index);
  //     });

  //   form.insertListItem("shareholders", director);
  // };

  const makeDirectorAShareholder = (director: DirectorEtShareholder) => {
    // Remove empty shareholders
    form.values.shareholders &&
      form.values.shareholders.forEach((item, index) => {
        const data = Object.values(item).every(isEmpty);

        if (data) form.removeListItem("shareholders", index);
      });

    // Check if the director already exists as a shareholder
    const exists =
      form.values.shareholders &&
      form.values.shareholders.some((shareholder) => {
        return Object.keys(director).every((key) => {
          return (
            director[key as keyof DirectorEtShareholder] ===
            shareholder[key as keyof DirectorEtShareholder]
          );
        });
      });

    notifications.clean();

    // If the director exists, return the handleInfo function to display a toast
    if (exists) {
      handleInfo("Director already exists as a shareholder", "");
      return;
    }

    // If the director doesn't exist, add them as a shareholder
    form.insertListItem("shareholders", director);
  };

  const removeShareholder = (director: DirectorEtShareholder) => {
    // Find the index of the shareholder to remove using director object
    const index =
      form.values.shareholders &&
      form.values.shareholders.findIndex((item) => {
        return Object.keys(item).every(
          (key) =>
            item[key as keyof DirectorEtShareholder] ===
            director[key as keyof DirectorEtShareholder]
        );
      });
    // Remove the shareholder from the form
    if (index && index !== -1) form.removeListItem("shareholders", index);
  };

  const isShareholderADirector = (director: DirectorEtShareholder) => {
    // return false if the director's value is empty
    if (Object.values(director).every(isEmpty)) return false;

    return (
      form.values.shareholders &&
      form.values.shareholders.some((shareholder) => {
        return Object.keys(director).every((key) => {
          return (
            director[key as keyof DirectorEtShareholder] ===
            shareholder[key as keyof DirectorEtShareholder]
          );
        });
      })
    );
  };

  // const updateShareholders = (
  //   directors: DirectorEtShareholder[],
  //   shareholders: DirectorEtShareholder[]
  // ) => {
  //   directors.forEach((director) => {
  //     const exists = shareholders.some(
  //       (shareholder) => shareholder.id === director.id
  //     );

  //     if (exists) {
  //       const index = shareholders.findIndex(
  //         (shareholder) => shareholder.id === director.id
  //       );

  //       if (form.values?.shareholders) {
  //         form.values.shareholders[index] = {
  //           ...form.values.shareholders[index],
  //           ...director,
  //         };
  //       }
  //     } else {
  //       form.insertListItem("shareholders", director);
  //     }
  //   });
  // };

  const handleCloseSuccessModal = () => {
    router.push("/admin/businesses");
    closeSuccess();
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },
          { title: "Create New Business", href: "/admin/businesses/new" },
        ]}
      />

      <Paper py={32} px={28} mt={20}>
        <BackBtn />

        <Text fz={24} fw={600} c="var(--prune-text-gray-700)" mt={28}>
          Create New Business
        </Text>

        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={form.errors ? false : true}
          color="var(--prune-primary-700)"
          classNames={{
            stepWrapper: styles.stepWrapper,
            stepLabel: styles.stepLabel,
            stepBody: styles.stepBody,
            steps: styles.steps,
            separator: styles.separator,
            stepIcon: styles.stepIcon,
            step: styles.step,
          }}
          mt={32}
        >
          <Stepper.Step label="Basic Information">
            <BasicInfo form={form} />
          </Stepper.Step>
          <Stepper.Step label="Documents">
            <Documents form={form} />
          </Stepper.Step>
          <Stepper.Step label="Directors">
            <Group justify="space-between" mb={30}>
              <Text fz={16} fw={600} c="var(--prune-text-gray-700)">
                Directors
              </Text>

              <PrimaryBtn
                text="Add Director"
                icon={IconPlus}
                action={() =>
                  form.insertListItem("directors", directorEtShareholderSchema)
                }
                fw={600}
                h={28}
              />
            </Group>
            <Box>
              {form.values.directors &&
                form.values.directors.map((director, index, arr) => (
                  <Box key={index}>
                    <Group justify="space-between" mb={5}>
                      <Button
                        variant="transparent"
                        fz={12}
                        fw={500}
                        p={0}
                        m={0}
                        size="xs"
                        color="var(--prune-text-gray-700)"
                      >{`Director ${index + 1}`}</Button>

                      {index !== 0 && (
                        <ThemeIcon
                          variant="light"
                          radius="xl"
                          color="var(--prune-warning)"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            form.removeListItem("directors", index)
                          }
                        >
                          <IconTrash size={14} />
                        </ThemeIcon>
                      )}
                    </Group>

                    <DirectorForm count={index} form={form} />

                    <Checkbox
                      label="Make this director a shareholder"
                      mt={20}
                      fz={8}
                      styles={{ label: { fontSize: "12px", fontWeight: 500 } }}
                      color="var(--prune-primary-600)"
                      checked={isShareholderADirector(director)}
                      onChange={(e) => {
                        e.target.checked
                          ? makeDirectorAShareholder(director)
                          : removeShareholder(director);
                      }}
                    />

                    {arr.length !== index + 1 && <Divider my={20} />}
                  </Box>
                ))}
            </Box>
          </Stepper.Step>
          <Stepper.Step label="Shareholders">
            <Group justify="space-between" mb={30}>
              <Text fz={16} fw={600} c="var(--prune-text-gray-700)">
                Shareholders
              </Text>
              {/* <Button
                variant="transparent"
                fz={14}
                color="var(--prune-text-gray-700)"
                leftSection={
                  <ThemeIcon
                    color="var(--prune-primary-600)"
                    radius="xl"
                    size={24}
                  >
                    <IconPlus size={16} color="var(--prune-text-gray-700)" />
                  </ThemeIcon>
                }
                onClick={() =>
                  form.insertListItem(
                    "shareholders",
                    directorEtShareholderSchema
                  )
                }
              >
                Add New Shareholder
              </Button> */}
              <PrimaryBtn
                text="Add Shareholder"
                icon={IconPlus}
                action={() =>
                  form.insertListItem(
                    "shareholders",
                    directorEtShareholderSchema
                  )
                }
                fw={600}
                h={28}
              />
            </Group>
            <Box>
              {form.values.shareholders &&
                form.values.shareholders.map((shareholder, index, arr) => (
                  <Box key={index}>
                    <Group justify="space-between" mb={5}>
                      <Button
                        variant="transparent"
                        fz={12}
                        fw={500}
                        p={0}
                        m={0}
                        size="xs"
                        color="var(--prune-text-gray-700)"
                      >{`Shareholder ${index + 1}`}</Button>

                      {index !== 0 && (
                        <ThemeIcon
                          variant="light"
                          radius="xl"
                          color="var(--prune-warning)"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            form.removeListItem("shareholders", index)
                          }
                        >
                          <IconTrash size={14} />
                        </ThemeIcon>
                      )}
                    </Group>

                    <ShareholderForm count={index} form={form} />
                    {/* <Checkbox
                      label="Make this shareholder a director"
                      mt={20}
                      fz={8}
                      onChange={(e) => {
                        e.target.checked
                          ? form.insertListItem("directors", shareholder)
                          : {};
                      }}
                      styles={{ label: { fontSize: "12px", fontWeight: 500 } }}
                      color="var(--prune-primary-600)"
                    /> */}
                    {arr.length !== index + 1 && <Divider my={20} />}
                  </Box>
                ))}
            </Box>
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Divider my={20} />

        <Group justify="space-between">
          <SecondaryBtn text="Clear Form" action={open} w={126} />

          <Group justify="flex-end">
            <SecondaryBtn text="Previous" action={prevStep} w={126} />
            <PrimaryBtn
              text={active < 3 ? "Next" : "Submit"}
              w={126}
              action={active < 3 ? nextStep : handleCreate}
              loading={processing}
            />
          </Group>
        </Group>
      </Paper>

      <ModalComponent
        opened={opened}
        close={close}
        icon={<IconX color="var(--prune-warning)" />}
        title="Clear Form?"
        text="Are you sure you want to clear this form? All entered data will be permanently lost."
        action={() => {
          form.reset();
          close();
        }}
        color="hsl(from var(--prune-warning) h s l / .1)"
      />

      <SuccessModal
        openedSuccess={openedSuccess}
        handleCloseSuccessModal={handleCloseSuccessModal}
        image={SuccessModalImage.src}
      />
    </main>
  );
}

const DirectorForm = ({
  count,
  form,
}: {
  count: number;
  form: UseFormReturnType<NewBusinessType>;
}) => {
  return (
    <>
      <Flex
        // mt={26}
        gap={20}
      >
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
          type="email"
          {...form.getInputProps(`directors.${count}.email`)}
          rightSection={<IconMail size={14} />}
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
        {form.values.directors && form.values.directors[count].identityType && (
          <>
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                {`Upload ${form.values.directors[count].identityType} ${
                  form.values.directors[count].identityType !== "Passport"
                    ? "(Front)"
                    : ""
                }`}
              </Text>
              <DropzoneComponent
                form={form}
                formKey={`directors.${count}.identityFileUrl`}
                uploadedFileUrl={form.values.directors[count].identityFileUrl}
              />
            </Box>

            <>
              {form.values.directors[count].identityType !== "Passport" && (
                <Box flex={1}>
                  <Text fz={12} c="#344054" mb={10}>
                    {`Upload
                ${form.values.directors[count].identityType}  (Back)`}
                  </Text>
                  <DropzoneComponent
                    form={form}
                    formKey={`directors.${count}.identityFileUrlBack`}
                    uploadedFileUrl={
                      form.values.directors[count].identityFileUrlBack
                    }
                  />
                </Box>
              )}
            </>
          </>
        )}

        {form.values.directors &&
          form.values.directors[count].proofOfAddress && (
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                Upload Utility Bill
              </Text>
              <DropzoneComponent
                form={form}
                formKey={`directors.${count}.proofOfAddressFileUrl`}
                uploadedFileUrl={
                  form.values.directors[count].proofOfAddressFileUrl
                }
              />
            </Box>
          )}
      </Flex>
    </>
  );
};

const ShareholderForm = ({
  count,
  form,
}: {
  count: number;
  form: UseFormReturnType<NewBusinessType>;
}) => {
  return (
    <>
      <Flex gap={20}>
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          placeholder="Enter Shareholder's name"
          {...form.getInputProps(`shareholders.${count}.name`)}
        />
        <TextInput
          classNames={{ input: styles.input }}
          flex={1}
          type="email"
          placeholder="Enter Shareholder's Email"
          {...form.getInputProps(`shareholders.${count}.email`)}
          rightSection={<IconMail size={14} />}
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

      {form.values.shareholders &&
        form.values.shareholders[count].identityType && (
          <Flex mt={24} gap={20}>
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                {` Upload
                ${
                  form.values.shareholders &&
                  form.values.shareholders[count].identityType
                } ${
                  form.values.shareholders[count].identityType !== "Passport"
                    ? "(Front)"
                    : ""
                }`}
              </Text>
              <DropzoneComponent
                form={form}
                formKey={`shareholders.${count}.identityFileUrl`}
                uploadedFileUrl={
                  form.values.shareholders[count].identityFileUrl
                }
              />
            </Box>

            {form.values.shareholders &&
              form.values.shareholders[count].identityType !== "Passport" && (
                <Box flex={1}>
                  <Text fz={12} c="#344054" mb={10}>
                    {` Upload
                    ${
                      form.values.shareholders &&
                      form.values.shareholders[count].identityType
                    }
                    (Back)`}
                  </Text>
                  <DropzoneComponent
                    form={form}
                    formKey={`shareholders.${count}.identityFileUrlBack`}
                    uploadedFileUrl={
                      form.values.shareholders[count].identityFileUrlBack
                    }
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
                uploadedFileUrl={
                  form.values.shareholders[count].proofOfAddressFileUrl
                }
              />
            </Box>
          </Flex>
        )}
    </>
  );
};
