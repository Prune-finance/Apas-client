"use client";

import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Center, Flex, Image, Modal, Stack, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { isAxiosError } from "axios";
import { z } from "zod";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { useState } from "react";
import CompleteIcon from "@/assets/CompleteOnboardingIcon.png";

const questAxios = createAxiosInstance("questionnaire");

const schema = z.object({
  signedBy: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  signature: z.string().min(1, "Signature is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type FormValues = z.infer<typeof schema>;

interface SubmitOnboardingModalProps {
  opened: boolean;
  close: () => void;
  adminReference?: string;
  onSuccess?: () => void;
}

export default function SubmitOnboardingModal({
  opened,
  close,
  adminReference,
  onSuccess,
}: SubmitOnboardingModalProps) {
  const { handleError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [successOpened, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: {
      signedBy: "",
      designation: "",
      signature: "",
      email: "",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const endpoint = adminReference
        ? `/business/onboarding/admin/${adminReference}/submit`
        : `/business/onboarding/submit`;

      await questAxios.post(endpoint, {
        acceptTerms: true,
        signedBy: values.signedBy,
        designation: values.designation,
        signature: values.signature,
        email: values.email,
      });

      form.reset();
      close();
      openSuccess();
    } catch (error) {
      if (isAxiosError(error)) {
        const msg =
          error.response?.data?.message ??
          "An error occurred while submitting";
        handleError("Submission failed", msg);
      } else {
        handleError("Submission failed", "An error occurred while submitting");
      }
    } finally {
      setLoading(false);
    }
  };

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
          Confirm your consent to our Terms of Use
        </Text>

        <Text my={16} c="var(--prune-text-gray-700)" fw={500} fz={16}>
          A signed copy of your consent will be sent to your email.
        </Text>

        <Box
          display="flex"
          style={{ flexDirection: "column", gap: 24 }}
          component="form"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInputWithInsideLabel
            label="Signed by"
            placeholder="Enter Name"
            w="100%"
            {...form.getInputProps("signedBy")}
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

          <TextInputWithInsideLabel
            label="Email"
            placeholder="Enter Email"
            w="100%"
            {...form.getInputProps("email")}
          />

          <Flex justify="end" gap={12}>
            <SecondaryBtn
              text="Cancel"
              fw={600}
              action={() => {
                form.reset();
                close();
              }}
            />
            <PrimaryBtn
              text="I Consent"
              fw={600}
              type="submit"
              loading={loading}
            />
          </Flex>
        </Box>
      </Modal>

      <Modal
        opened={successOpened}
        onClose={() => {
          closeSuccess();
          onSuccess?.();
        }}
        withCloseButton={false}
        padding={24}
        centered
      >
        <Stack gap={24}>
          <Center>
            <Image src={CompleteIcon.src} alt="Complete" w={278} h={156} />
          </Center>
          <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
            We have received your company details
          </Text>
          <Text fz={16} fw={400} c="var(--prune-text-gray-700)">
            We will be in touch regarding your application.
          </Text>
          <Flex justify="end">
            <PrimaryBtn
              text="Okay"
              fw={600}
              action={() => {
                closeSuccess();
                onSuccess?.();
              }}
            />
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
