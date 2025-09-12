import { Box, Flex, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  OnboardingDirectorValues,
  OnboardingType,
} from "@/lib/schema/onboarding";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import useNotification from "@/lib/hooks/notification";
import useAxios from "@/lib/hooks/useAxios";

interface AddDirectorsInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const AddDirectorsInfo = ({
  setActive,
  active,
  form,
}: AddDirectorsInfo) => {
  const { handleSuccess } = useNotification();

  const { queryFn, loading } = useAxios({
    baseURL: "auth",
    endpoint: "/onboarding/business-directors",
    method: "POST",
    body: {
      directors: form.getValues().directors,
    },
    onSuccess: (data) => {
      setActive(active + 1);
      handleSuccess("Business Directors", "Business directors saved");
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => queryFn())}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Add Directors
        </Text>

        <PrimaryBtn
          text="Add Directors"
          leftSection={<IconPlus size={18} />}
          fw={600}
          action={() => {
            form.insertListItem("directors", {
              ...OnboardingDirectorValues,
              id: crypto.randomUUID(),
            });
          }}
        />
      </Flex>

      {form.getValues().directors?.map((director, index) => (
        <Stack mt={30} gap={24} key={index}>
          <Flex justify="space-between" align="center" w="100%">
            <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
              Director {index + 1}
            </Text>

            {index !== 0 && (
              <ThemeIcon
                color="var(--prune-warning)"
                style={{ cursor: "pointer" }}
                variant="transparent"
                size={25}
                onClick={() => {
                  form.removeListItem("directors", index);
                }}
              >
                <IconTrash />
              </ThemeIcon>
            )}
          </Flex>
          <Flex gap={24} w="100%">
            <TextInputWithInsideLabel
              label="First Name"
              w="100%"
              key={form.key(`directors.${index}.first_name`)}
              {...form.getInputProps(`directors.${index}.first_name`)}
            />
            <TextInputWithInsideLabel
              label="Last Name"
              w="100%"
              key={form.key(`directors.${index}.last_name`)}
              {...form.getInputProps(`directors.${index}.last_name`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <TextInputWithInsideLabel
              label="Email"
              w="100%"
              key={form.key(`directors.${index}.email`)}
              {...form.getInputProps(`directors.${index}.email`)}
            />
            <DateInputWithInsideLabel
              label="Date of Birth"
              w="100%"
              minDate={new Date("1900-01-01")}
              maxDate={new Date()}
              key={form.key(`directors.${index}.date_of_birth`)}
              {...form.getInputProps(`directors.${index}.date_of_birth`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <SelectInputWithInsideLabel
              label="Identity Type"
              w="100%"
              key={form.key(`directors.${index}.identityType`)}
              data={["ID Card", "Passport", "Residence Permit"]}
              {...form.getInputProps(`directors.${index}.identityType`)}
            />
            <SelectInputWithInsideLabel
              label="Proof of Address"
              w="100%"
              data={["Utility Bill"]}
              key={form.key(`directors.${index}.proofOfAddress`)}
              {...form.getInputProps(`directors.${index}.proofOfAddress`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            {director.identityType && (
              <>
                <OnBoardingDocumentBox
                  title="Upload Identity Document"
                  formKey={`directors.${index}.identityFileUrl`}
                  form={form}
                  uploadedFileUrl={director.identityFileUrl || ""}
                  key={form.key(`directors.${index}.identityFileUrl`)}
                  {...form.getInputProps(`directors.${index}.identityFileUrl`)}
                />
                {director.identityType !== "Passport" && (
                  <OnBoardingDocumentBox
                    title="Upload Identity Document"
                    formKey={`directors.${index}.identityFileUrlBack`}
                    form={form}
                    uploadedFileUrl={director.identityFileUrlBack || ""}
                    key={form.key(`directors.${index}.identityFileUrlBack`)}
                    {...form.getInputProps(
                      `directors.${index}.identityFileUrlBack`
                    )}
                  />
                )}
              </>
            )}

            {director.proofOfAddress && (
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                formKey={`directors.${index}.proofOfAddressFileUrl`}
                form={form}
                uploadedFileUrl={director.proofOfAddressFileUrl || ""}
                key={form.key(`directors.${index}.proofOfAddressFileUrl`)}
                {...form.getInputProps(
                  `directors.${index}.proofOfAddressFileUrl`
                )}
              />
            )}
          </Flex>
        </Stack>
      ))}

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={600} />

        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={600}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn
            text="Next"
            w={126}
            fw={600}
            type="submit"
            loading={loading}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
