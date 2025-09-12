import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { OnboardingType } from "@/lib/schema/onboarding";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";

interface CEOInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const CEOInfo = ({ setActive, active, form }: CEOInfo) => {
  const { handleSuccess } = useNotification();
  const { ceoIdType, ceoPOAType } = form.getValues();
  const [IdCheck, setIdCheck] = useState({
    isCeoIdType: Boolean(ceoIdType) || false,
    isCeoPOAType: Boolean(ceoPOAType) || false,
    isPassport: ceoIdType === "Passport" ? true : false,
  });

  form.watch("ceoIdType", ({ value }) => {
    if (value) {
      setIdCheck({
        ...IdCheck,
        isCeoIdType: true,
        isPassport: false,
      });

      if (value === "Passport") {
        setIdCheck({
          ...IdCheck,
          isCeoIdType: true,
          isPassport: true,
        });
      }

      return;
    }

    if (!value) {
      setIdCheck({
        ...IdCheck,
        isCeoIdType: false,
        isPassport: false,
      });
    }
  });

  form.watch("ceoPOAType", ({ value }) => {
    if (value) return setIdCheck({ ...IdCheck, isCeoPOAType: true });

    setIdCheck({
      ...IdCheck,
      isCeoPOAType: false,
    });
  });

  const { queryFn, loading } = useAxios({
    baseURL: "auth",
    endpoint: "/onboarding/business-ceo",
    method: "POST",
    body: {
      ceoFirstName: form.getValues().ceoFirstName,
      ceoLastName: form.getValues().ceoLastName,
      ceoEmail: form.getValues().ceoEmail,
      ceoDOB: form.getValues().ceoDOB,
      ceoPOAType: form.getValues().ceoPOAType,
      ceoPOAUrl: form.getValues().ceoPOAUrl,
      ceoIdType: form.getValues().ceoIdType,
      ceoIdUrl: form.getValues().ceoIdUrl,
    },
    onSuccess: (data) => {
      setActive(active + 1);
      handleSuccess("CEO Details", "CEO Details saved");
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(() => queryFn())}>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        CEO Details
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            {...form.getInputProps("ceoFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            {...form.getInputProps("ceoLastName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            {...form.getInputProps("ceoEmail")}
          />
          <DateInputWithInsideLabel
            label="Date of Birth"
            w="100%"
            {...form.getInputProps("ceoDOB")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            w="100%"
            data={["ID Card", "Passport", "Residence Permit"]}
            {...form.getInputProps("ceoIdType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            data={["Utility Bill"]}
            {...form.getInputProps("ceoPOAType")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {form.values.ceoIdType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                form={form}
                formKey="ceoIdUrl"
                uploadedFileUrl={form.values.ceoIdUrl}
                {...form.getInputProps("ceoIdUrl")}
              />
              {form.values.ceoIdType !== "Passport" && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  form={form}
                  formKey="ceoIdUrlBack"
                  uploadedFileUrl={form.values.ceoIdUrlBack}
                  {...form.getInputProps("ceoIdUrlBack")}
                />
              )}
            </>
          )}
          {form.values.ceoPOAType && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
              formKey="ceoPOAUrl"
              form={form}
              uploadedFileUrl={form.values.ceoPOAUrl}
              {...form.getInputProps("ceoPOAUrl")}
            />
          )}
        </Flex>
      </Stack>

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
