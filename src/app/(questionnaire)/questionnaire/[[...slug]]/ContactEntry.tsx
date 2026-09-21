"use client";

import {
  Box,
  Collapse,
  Flex,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import {
  IconBriefcase,
  IconMail,
  IconMailCheck,
  IconUser,
} from "@tabler/icons-react";
import {
  TextInputWithInsideLabel,
  PhoneNumberInput,
} from "@/ui/components/InputWithLabel/QuestInputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

const questAxios = createAxiosInstance("questionnaire");
const RESEND_COOLDOWN = 120; // seconds

const EmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(50, "Email cannot exceed 50 characters")
    .email("Enter a valid email address")
    .refine((v) => !v.includes(" "), "Email cannot contain spaces"),
});

const ContactSchema = z.object({
  email: z.string().email(),
  contactName: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .refine((v) => v.trim().length > 0, "Name cannot be only spaces"),
  contactDesignation: z
    .string()
    .min(1, "Designation is required")
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation cannot exceed 50 characters")
    .refine((v) => v.trim().length > 0, "Designation cannot be only spaces"),
  contactPhoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(7, "Phone number is too short")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain digits only"),
  contactCountryCode: z.string().min(1, "Country code is required"),
});

type ContactFormType = z.infer<typeof ContactSchema>;
type Phase = "email" | "contact" | "returning";

interface Props {
  onComplete: (data: {
    email: string;
    name: string;
    designation: string;
    phone: string;
  }) => void;
  onReturning: (resumeStep: number) => void;
}

export default function ContactEntry({ onComplete, onReturning }: Props) {
  const [phase, setPhase] = useState<Phase>("email");
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { handleError } = useNotification();

  const form = useForm<ContactFormType>({
    mode: "controlled",
    initialValues: {
      email: "",
      contactName: "",
      contactDesignation: "",
      contactPhoneNumber: "",
      contactCountryCode: "+234",
    },
    validate: (values) => {
      if (phase === "email") return zodResolver(EmailSchema)(values);
      if (phase === "contact") return zodResolver(ContactSchema)(values);
      return {};
    },
  });

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatCooldown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleEmailContinue = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    setChecking(true);
    try {
      const { data: res } = await questAxios.post(
        "/business/questionnaire/check",
        { email: form.values.email }
      );

      if (res.data?.returning) {
        // Existing customer — email link already sent by the API
        setPhase("returning");
        startCooldown();
      } else {
        // New customer — show contact fields
        setPhase("contact");
      }
    } catch (err) {
      handleError("Check failed", parseError(err));
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await questAxios.post("/business/questionnaire/resume-link", {
        email: form.values.email,
      });
      startCooldown();
    } catch (err) {
      handleError("Resend failed", parseError(err));
    } finally {
      setResending(false);
    }
  };

  const handleContactContinue = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    // contactCountryCode is "234-NG" after a selection, or "+234" at initial value
    const cc = form.values.contactCountryCode;
    const contactPhoneCountryCode = cc.includes("-") ? `+${cc.split("-")[0]}` : cc;

    setChecking(true);
    try {
      const { data: res } = await questAxios.post("/business/questionnaire", {
        contactEmail: form.values.email,
        contactName: form.values.contactName,
        contactDesignation: form.values.contactDesignation,
        contactPhoneCountryCode,
        contactPhoneNumber: String(form.values.contactPhoneNumber).replace(/\D/g, ""),
      });

      // Persist so subsequent steps can use them without URL params
      try {
        if (res.data?.reference) sessionStorage.setItem("quest_reference", res.data.reference);
        if (res.data?.resumeToken) sessionStorage.setItem("quest_token", res.data.resumeToken);
      } catch {}

      onComplete({
        email: form.values.email,
        name: form.values.contactName,
        designation: form.values.contactDesignation,
        phone: form.values.contactPhoneNumber,
      });
    } catch (err) {
      handleError("Submission failed", parseError(err));
    } finally {
      setChecking(false);
    }
  };

  const isContact = phase === "contact";
  const isReturning = phase === "returning";

  return (
    <Box
      maw={560}
      mx="auto"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Stack gap={20}>
        {/* Welcome header */}
        <Stack align="center" gap={8} mb={8}>
          <Title order={2} c="var(--prune-text-gray-700)" lh={1.2} ta="center">
            Welcome to Prune Onboarding
          </Title>
          <Text fz={14} fw={400} c="var(--prune-text-gray-600)" ta="center">
            Enter your email to get started or continue where you left off.
          </Text>
        </Stack>

        {/* Email — always visible; read-only once past email phase */}
        <TextInputWithInsideLabel
          label="Email address"
          leftSection={<IconMail size={16} />}
          readOnly={isContact || isReturning}
          styles={
            isContact || isReturning
              ? { input: { background: "#F9FAFB", color: "#667085", cursor: "default" } }
              : {}
          }
          {...form.getInputProps("email")}
          key={form.key("email")}
          onKeyDown={(e) => {
            if (phase === "email" && e.key === "Enter") handleEmailContinue();
          }}
        />

        {/* Returning user — email sent notice */}
        <Collapse in={isReturning} transitionDuration={380} transitionTimingFunction="ease">
          <Stack gap={16}>
            <Alert
              icon={
                <ThemeIcon
                  variant="transparent"
                  color="var(--prune-primary-600)"
                  size={20}
                >
                  <IconMailCheck size={20} />
                </ThemeIcon>
              }
              color="var(--prune-primary-600)"
              variant="light"
              radius={8}
            >
              <Text fz={14} fw={500} c="var(--prune-text-gray-700)">
                A link has been sent to your email
              </Text>
              <Text fz={13} c="#667085" mt={4}>
                Check your inbox and click the link to continue filling your
                questionnaire from where you left off.
              </Text>
            </Alert>

            <Flex justify="flex-end" gap={12} align="center">
              {cooldown > 0 ? (
                <Text fz={13} c="#98a2b3">
                  Resend in {formatCooldown(cooldown)}
                </Text>
              ) : null}
              <SecondaryBtn
                text="Resend email"
                h={40}
                fz={14}
                fw={500}
                radius={6}
                loading={resending}
                disabled={cooldown > 0}
                action={handleResend}
              />
            </Flex>
          </Stack>
        </Collapse>

        {/* New customer — contact fields */}
        <Collapse in={isContact} transitionDuration={420} transitionTimingFunction="ease">
          <Stack gap={20}>
            <Stack gap={6} mt={4}>
              <Title order={4} c="var(--prune-text-gray-700)">
                Who is filling this form?
              </Title>
              <Text fz={14} c="#667085">
                Tell us a bit about yourself.
              </Text>
            </Stack>

            <TextInputWithInsideLabel
              label="Full Name"
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

        {/* Buttons */}
        {!isReturning && (
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
        )}

        {/* Returning: only a "Use a different email" back option */}
        {isReturning && (
          <Flex justify="center" mt={4}>
            <SecondaryBtn
              text="Use a different email"
              h={40}
              fz={14}
              fw={500}
              radius={6}
              action={() => {
                setPhase("email");
                form.setFieldValue("email", "");
                setCooldown(0);
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
              }}
            />
          </Flex>
        )}
      </Stack>
    </Box>
  );
}
