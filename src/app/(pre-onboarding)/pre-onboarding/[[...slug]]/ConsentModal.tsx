import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Modal, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "./ConfirmationModal";
import {
  PhoneNumberInput,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import useAxios from "@/lib/hooks/useAxios";

interface ConsentModalProps {
  opened: boolean;
  close: () => void;
}

export default function ConsentModal({ opened, close }: ConsentModalProps) {
  const [openedConfirm, { open, close: closeConfirm }] = useDisclosure(false);

  const questionnaireForm = useQuestionnaireFormContext();
  const { countryCode, isRegulated, ...restOfQuestionnaire } =
    questionnaireForm.values;

  const schema = z.object({
    contactPersonName: z.string().min(1, "Name is required"),
    contactPersonDesignation: z.string().min(1, "Designation is required"),
    contactPersonPhoneNumber: z.string().min(1, "Contact number is required"),
    contactPersonEmail: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    contactCountryCode: z.string().min(1, "Country code is required"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    initialValues: {
      contactPersonName: "",
      contactPersonDesignation: "",
      contactPersonPhoneNumber: "",
      contactPersonEmail: "",
      contactCountryCode: "+234",
    },
    validate: zodResolver(schema),
  });

  const { contactCountryCode, ...rest } = form.values;

  const { loading, queryFn } = useAxios({
    baseURL: "auth",
    endpoint: "/onboarding/questionnaire/create",
    method: "POST",
    body: {
      ...restOfQuestionnaire,
      isRegulated: isRegulated === "yes",
      ...rest,
    },
    onSuccess: () => {
      close();
      form.reset();
      questionnaireForm.reset();
      open();
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title="Company Profile"
        styles={{
          title: {
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--prune-primary-800)",
          },
        }}
        padding={24}
        centered
      >
        <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
          Contact Person
        </Text>

        <Text my={16} c="var(--prune-text-gray-700)" fw={500} fz={16}>
          Who is filling this form?
        </Text>

        <Box
          display="flex"
          style={{
            flexDirection: "column",
            gap: 24,
          }}
          component="form"
          onSubmit={form.onSubmit((values) => queryFn())}
        >
          <TextInputWithInsideLabel
            label="Name"
            w="100%"
            {...form.getInputProps("contactPersonName")}
          />

          <TextInputWithInsideLabel
            label="Designation"
            w="100%"
            {...form.getInputProps("contactPersonDesignation")}
          />

          <PhoneNumberInput<FormValues>
            form={form}
            phoneNumberKey="contactPersonPhoneNumber"
            countryCodeKey="contactCountryCode"
          />

          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            {...form.getInputProps("contactPersonEmail")}
          />

          <Flex justify="end">
            <PrimaryBtn
              text="I Consent"
              fw={600}
              disabled={!form.isDirty()}
              type="submit"
              loading={loading}
            />
          </Flex>
        </Box>
      </Modal>

      <ConfirmationModal opened={openedConfirm} close={closeConfirm} />
    </>
  );
}
