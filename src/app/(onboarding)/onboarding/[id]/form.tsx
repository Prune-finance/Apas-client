"use client";

import { Box, Flex, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";

import { registerValues } from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { PrimaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";
import { z } from "zod";

const passwordRules = [
  { regex: /.{10,}/, message: "Password must be at least 10 characters" },
  { regex: /[A-Z]/, message: "Password must include an uppercase letter" },
  { regex: /[a-z]/, message: "Password must include a lowercase letter" },
  { regex: /[0-9]/, message: "Password must include a number" },
  { regex: /[^A-Za-z0-9]/, message: "Password must include a special character" },
];

const onboardingRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().superRefine((val, ctx) => {
      const failed = passwordRules
        .filter(({ regex }) => !regex.test(val))
        .map(({ message }) => message);
      if (failed.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: failed.join(", ") });
      }
    }),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((v) => v.confirmPassword === v.password, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const questAxios = createAxiosInstance("questionnaire");

const fieldStyles = {
  input: {
    height: "48px",
    border: "1px solid var(--prune-text-gray-100)",
    borderRadius: "8px",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "14px",
    color: "var(--prune-text-gray-700)",
  },
};

const passwordStyles = {
  input: {
    height: "48px",
    border: "1px solid var(--prune-text-gray-100)",
    borderRadius: "8px",
  },
  innerInput: {
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "14px",
    color: "var(--prune-text-gray-700)",
    height: "100%",
  },
};

interface Props {
  email: string;
  contactName: string;
  businessName: string;
}

export default function OnboardingInviteForm({
  email,
  contactName,
  businessName,
}: Props) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const form = useForm({
    initialValues: { ...registerValues, email },
    validate: zodResolver(onboardingRegisterSchema),
  });

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    setProcessing(true);
    try {
      await questAxios.post("/business/onboarding/auth/signup", {
        reference: params.id,
        token,
        password: form.values.password,
      });

      handleSuccess(
        "Account Created",
        "Your account is ready. Please log in to continue.",
      );
      window.location.replace("/auth/onboarding/login");
    } catch (error) {
      if (isAxiosError(error)) {
        const issues = error.response?.data?.issues as
          | { field: string; message: string }[]
          | undefined;

        if (issues?.length) {
          const formErrors: Record<string, string> = {};
          issues.forEach(({ field, message }) => {
            // strip "body." prefix so "body.password" maps to "password"
            const key = field.replace(/^body\./, "");
            formErrors[key] = message;
          });
          form.setErrors(formErrors);
          return;
        }

        handleError(
          "An error occurred",
          error.response?.data?.message ?? "Something went wrong"
        );
      } else {
        handleError("An error occurred", "Something went wrong");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box component="form" mt={32} onSubmit={form.onSubmit(handleSubmit)}>
      {/* {businessName && (
        <Text fz={13} c="var(--prune-text-gray-500)" mb={16}>
          {businessName}
        </Text>
      )} */}

      <Stack gap={16}>
        <TextInput
          styles={fieldStyles}
          placeholder="Email"
          disabled
          {...form.getInputProps("email")}
        />

        <PasswordInput
          styles={passwordStyles}
          placeholder="Password"
          {...form.getInputProps("password")}
        />

        <PasswordInput
          styles={passwordStyles}
          placeholder="Confirm Password"
          {...form.getInputProps("confirmPassword")}
        />
      </Stack>
      <Text fz={13} c="var(--prune-text-gray-500)" my={16}>
        By signing up, you agree to our{" "}
        <Text
          component={Link}
          href="https://prunepayments.com/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
          inherit
          td="underline"
        >
          Terms
        </Text>{" "}
        and have read and acknowledge the{" "}
        <Text
          component={Link}
          href="https://prunepayments.com/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          inherit
          td="underline"
        >
          Privacy Policies
        </Text>
        .
      </Text>

      <PrimaryBtn
        text="Create Account"
        loading={processing}
        type="submit"
        fullWidth
        h={48}
        radius={4}
        fz={16}
        fw={500}
      />

      <Flex justify="center" align="center" gap={4} mt={24}>
        <Text fz={14} c="var(--prune-text-gray-400)">
          Have an account?
        </Text>
        <PrimaryBtn
          text="Log in"
          variant="transparent"
          fz={14}
          fw={700}
          p={0}
          c="var(--prune-primary-800)"
          link="/auth/onboarding/login"
        />
      </Flex>
    </Box>
  );
}
