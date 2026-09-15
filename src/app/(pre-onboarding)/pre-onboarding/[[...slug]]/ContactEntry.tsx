"use client";

import { Box, Collapse, Flex, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useState } from "react";
import { IconMail, IconUser, IconBriefcase } from "@tabler/icons-react";
import { TextInputWithInsideLabel } from "./TextInputWithInsideLabel";
import { PhoneNumberInput } from "@/ui/components/InputWithLabel";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

const EmailSchema = z.object({
  email: z.string().email("Enter a valid email address").min(1, "Email is required"),
});

const ContactSchema = z.object({
  email: z.string().email(),
  contactName: z.string().min(1, "Name is required"),
  contactDesignation: z.string().min(1, "Designation is required"),
  contactPhoneNumber: z.string().min(1, "Phone number is required"),
  contactCountryCode: z.string().min(1, "Country code is required"),
});

type ContactFormType = z.infer<typeof ContactSchema>;

interface Props {
  onComplete: (data: { email: string; name: string; designation: string; phone: string }) => void;
  onReturning: (resumeStep: number) => void;
}

export default function ContactEntry({ onComplete, onReturning }: Props) {
  const [phase, setPhase] = useState<"email" | "contact">("email");
  const [checking, setChecking] = useState(false);

  const form = useForm<ContactFormType>({
    initialValues: {
      email: "",
      contactName: "",
      contactDesignation: "",
      contactPhoneNumber: "+234",
      contactCountryCode: "+234",
    },
    validate: (values) => {
      if (phase === "email") return zodResolver(EmailSchema)(values);
      return zodResolver(ContactSchema)(values);
    },
  });

  const handleEmailContinue = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    setChecking(true);
    try {
      // API not ready yet — treat every submission as a new customer.
      // When ready: call the check-email endpoint here and invoke
      // onReturning(res.data.resumeStep) for existing customers.
      setPhase("contact");
    } finally {
      setChecking(false);
    }
  };

  const handleContactContinue = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;
    onComplete({
      email: form.values.email,
      name: form.values.contactName,
      designation: form.values.contactDesignation,
      phone: form.values.contactPhoneNumber,
    });
  };

  const isContact = phase === "contact";

  return (
    <Box maw={560} mx="auto">
      {/* Spacer that collapses when contact fields appear — the whole block
          (heading + email + button) slides up together */}
      <Box
        style={{
          height: isContact ? 0 : "22vh",
          transition: "height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      />

      <Stack gap={20}>
        {/* Welcome header — inside the content group so it moves with email */}
        <Stack align="center" gap={8} mb={8}>
          <Text fz={28} fw={700} c="var(--prune-text-gray-700)" ta="center">
            Welcome to Prune
          </Text>
          <Text fz={15} fw={400} c="#667085" ta="center">
            Enter your email to get started or continue where you left off.
          </Text>
        </Stack>
        {/* Email — always present; becomes read-only in contact phase */}
        <TextInput
          label="Email address"
          placeholder="you@company.com"
          leftSection={<IconMail size={16} />}
          size="md"
          readOnly={isContact}
          styles={
            isContact
              ? { input: { background: "#F9FAFB", color: "#667085", cursor: "default" } }
              : {}
          }
          {...form.getInputProps("email")}
          key={form.key("email")}
          onKeyDown={(e) => {
            if (!isContact && e.key === "Enter") handleEmailContinue();
          }}
        />

        {/* Contact fields — animated in with Collapse */}
        <Collapse in={isContact} transitionDuration={420} transitionTimingFunction="ease">
          <Stack gap={20}>
            <Stack gap={6} mt={4}>
              <Text fz={18} fw={600} c="var(--prune-text-gray-700)">
                Who is filling this form?
              </Text>
              <Text fz={14} c="#667085">
                Tell us a bit about yourself.
              </Text>
            </Stack>

            <TextInputWithInsideLabel
              label="Name"
              w="100%"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps("contactName")}
              key={form.key("contactName")}
              withAsterisk
            />

            <TextInputWithInsideLabel
              label="Designation"
              w="100%"
              leftSection={<IconBriefcase size={16} />}
              {...form.getInputProps("contactDesignation")}
              key={form.key("contactDesignation")}
              withAsterisk
            />

            <Box>
              <PhoneNumberInput<ContactFormType>
                form={form}
                countryCodeKey="contactCountryCode"
                phoneNumberKey="contactPhoneNumber"
              />
            </Box>
          </Stack>
        </Collapse>

        {/* Buttons — Continue only in email phase; Back + Continue in contact phase */}
        <Flex gap={12} justify={isContact ? "flex-end" : "stretch"} mt={4}>
          {isContact && (
            <SecondaryBtn
              text="Back"
              h={48}
              radius={4}
              fz={16}
              fw={500}
              action={() => setPhase("email")}
            />
          )}
          <PrimaryBtn
            text="Continue"
            fullWidth={!isContact}
            h={48}
            radius={4}
            fz={16}
            fw={500}
            loading={checking}
            action={isContact ? handleContactContinue : handleEmailContinue}
          />
        </Flex>
      </Stack>
    </Box>
  );
}
