import { Box, Flex, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { OnboardingShareholderValues, OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import useAxios from "@/lib/hooks/useAxios";

interface AddShareholdersInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
  shareholders: OnboardingType["shareholders"];
}

export const AddShareholdersInfo = ({
  setActive,
  active,
  form,
  shareholders,
}: AddShareholdersInfo) => {
  const { handleSuccess } = useNotification();

  const { queryFn, loading } = useAxios({
    baseURL: "auth",
    endpoint: "/onboarding/business-shared-holders",
    method: "POST",
    body: {
      shareholders: form.getValues().shareholders,
    },
    onSuccess: (data) => {
      setActive(active + 1);
      handleSuccess("Business Shareholders", "Business shareholders saved");
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(() => queryFn())}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Add Shareholder
        </Text>

        <PrimaryBtn
          text=" Add Shareholder"
          leftSection={<IconPlus size={18} />}
          fw={600}
          action={() => {
            form.insertListItem("shareholders", {
              ...OnboardingShareholderValues,
              id: crypto.randomUUID(),
            });
          }}
        />
      </Flex>

      {form.getValues().shareholders?.map((shareholder, index) => (
        <Stack mt={30} gap={24} key={shareholder.id}>
          <Flex justify="space-between" align="center" w="100%">
            <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
              Shareholder {index + 1}
            </Text>
            {index !== 0 && (
              <ThemeIcon
                color="var(--prune-warning)"
                style={{ cursor: "pointer" }}
                variant="transparent"
                size={25}
                onClick={() => {
                  form.removeListItem("shareholders", index);
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
              key={form.key(`shareholders.${index}.firstName`)}
              {...form.getInputProps(`shareholders.${index}.first_name`)}
            />
            <TextInputWithInsideLabel
              label="Last Name"
              w="100%"
              key={form.key(`shareholders.${index}.lastName`)}
              {...form.getInputProps(`shareholders.${index}.last_name`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <TextInputWithInsideLabel
              label="Email"
              w="100%"
              key={form.key(`shareholders.${index}.email`)}
              {...form.getInputProps(`shareholders.${index}.email`)}
            />
            <DateInputWithInsideLabel
              label="Date of Birth"
              w="100%"
              minDate={new Date("1900-01-01")}
              maxDate={new Date()}
              key={form.key(`shareholders.${index}.dob`)}
              {...form.getInputProps(`shareholders.${index}.date_of_birth`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <SelectInputWithInsideLabel
              label="Identity Type"
              w="100%"
              data={["ID Card", "Passport", "Residence Permit"]}
              key={form.key(`shareholders.${index}.identityType`)}
              {...form.getInputProps(`shareholders.${index}.identityType`)}
            />
            <SelectInputWithInsideLabel
              label="Proof of Address"
              w="100%"
              data={["Utility Bill"]}
              key={form.key(`shareholders.${index}.proofOfAddress`)}
              {...form.getInputProps(`shareholders.${index}.proofOfAddress`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            {shareholder.identityType && (
              <>
                <OnBoardingDocumentBox
                  title="Upload Identity Document"
                  key={form.key(`shareholders.${index}.identityFileUrl`)}
                  uploadedFileUrl={shareholder.identityFileUrl || ""}
                  formKey={`shareholders.${index}.identityFileUrl`}
                  form={form}
                  {...form.getInputProps(
                    `shareholders.${index}.identityFileUrl`
                  )}
                />
                {shareholder.identityType !== "Passport" && (
                  <OnBoardingDocumentBox
                    title="Upload Identity Document (Back)"
                    key={form.key(`shareholders.${index}.identityFileUrlBack`)}
                    uploadedFileUrl={shareholder.identityFileUrlBack || ""}
                    formKey={`shareholders.${index}.identityFileUrlBack`}
                    form={form}
                    {...form.getInputProps(
                      `shareholders.${index}.identityFileUrlBack`
                    )}
                  />
                )}
              </>
            )}
            {shareholder.proofOfAddress && (
              <OnBoardingDocumentBox
                title="Upload Proof of Address"
                key={form.key(`shareholders.${index}.proofOfAddressFileUrl`)}
                uploadedFileUrl={shareholder.proofOfAddressFileUrl || ""}
                formKey={`shareholders.${index}.proofOfAddressFileUrl`}
                form={form}
                {...form.getInputProps(
                  `shareholders.${index}.proofOfAddressFileUrl`
                )}
              />
            )}
          </Flex>
        </Stack>
      ))}
      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={500} />

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
