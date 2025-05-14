import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Modal, Text } from "@mantine/core";

import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

import {
  PhoneNumberInput,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import useAxios from "@/lib/hooks/useAxios";

interface ConsentModalProps {
  opened: boolean;
  close: () => void;
  openConfirm: () => void;
}

export default function ConsentModal({
  opened,
  close,
  openConfirm,
}: ConsentModalProps) {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    designation: z.string().min(1, "Designation is required"),
    signature: z.string().min(1, "Signature is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    contactCountryCode: z.string().min(1, "Country code is required"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm({
    initialValues: {
      name: "",
      signature: "",
      designation: "",
      contactNumber: "+234",
      email: "",
      contactCountryCode: "+234",
    },
    validate: zodResolver(schema),
  });

  const {} = form.values;

  const { queryFn, loading } = useAxios({
    baseURL: "auth",
    endpoint: "/onboarding/consent",
    method: "POST",
    body: {
      consentDesignation: form.getValues().designation,
      consentEmail: form.getValues().email,
      consentSignature: form.getValues().signature,
      consentSignedBy: form.getValues().name,
      consentPhoneNumber: form.getValues().contactNumber,
    },
    onSuccess: () => {
      close();
      openConfirm();
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
        title="Onboarding"
        styles={{
          title: {
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--prune-primary-800)",
          },
        }}
        padding={24}
        centered
        size={498}
      >
        <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
          Confirm your consent to our Term of Use
        </Text>

        <Text my={16} c="var(--prune-text-gray-700)" fw={500} fz={16}>
          A signed copied of your consent would be sent to your email.
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
            label="Signed by"
            placeholder="Enter Name"
            w="100%"
            {...form.getInputProps("name")}
          />

          <TextInputWithInsideLabel
            label="Designation"
            placeholder="Enter Designation"
            w="100%"
            {...form.getInputProps("designation")}
          />

          <TextInputWithInsideLabel
            label="Signature"
            placeholder="Enter Signature"
            w="100%"
            {...form.getInputProps("signature")}
          />

          <PhoneNumberInput<FormValues>
            form={form}
            phoneNumberKey="contactNumber"
            countryCodeKey="contactCountryCode"
          />

          <TextInputWithInsideLabel
            label="Email"
            placeholder="Enter Email"
            w="100%"
            {...form.getInputProps("email")}
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
    </>
  );
}
