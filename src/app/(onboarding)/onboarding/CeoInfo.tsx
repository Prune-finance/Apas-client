import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

interface CEOInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const CEOInfo = ({ setActive, active, form }: CEOInfo) => {
  const [IdCheck, setIdCheck] = useState({
    isCeoIdType: false,
    isCeoPOAType: false,
    isPassport: true,
  });

  form.watch("ceoIdType", ({ value }) => {
    if (value) {
      setIdCheck({
        ...IdCheck,
        isCeoIdType: true,
        isPassport: true,
      });

      if (value === "Passport") {
        setIdCheck({
          ...IdCheck,
          isPassport: false,
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

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        setActive(active + 1);
      })}
    >
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
          {IdCheck.isCeoIdType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                {...form.getInputProps("ceoIdUrl")}
              />
              {IdCheck.isPassport && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  {...form.getInputProps("ceoIdUrlBack")}
                />
              )}
            </>
          )}
          {IdCheck.isCeoPOAType && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
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
            // action={() => setActive(active + 1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
