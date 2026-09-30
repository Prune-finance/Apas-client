"use client";

import { Box, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";

import { registerValues, validateRegister } from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { PrimaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";

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

export default function OnboardingForm({ email, contactName, businessName }: Props) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const form = useForm({
    initialValues: { ...registerValues, email },
    validate: zodResolver(validateRegister),
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

      handleSuccess("Account Created", "Your account is ready. Please log in to continue.");
      window.location.replace("/auth/onboarding/login");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box component="form" mt={32} onSubmit={form.onSubmit(handleSubmit)}>
      {businessName && (
        <Text fz={13} c="var(--prune-text-gray-500)" mb={4}>
          {businessName}
        </Text>
      )}

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

      <PrimaryBtn
        text="Create Account"
        loading={processing}
        type="submit"
        fullWidth
        h={48}
        radius={4}
        fz={16}
        fw={500}
        mt={24}
      />
    </Box>
  );
}
