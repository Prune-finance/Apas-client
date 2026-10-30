"use client";

import Cookies from "js-cookie";
import { Box, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";

import { registerValues, validateRegister } from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { PrimaryBtn } from "@/ui/components/Buttons";

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

export default function FormComponent({ email }: { email: string }) {
  const params = useParams<{ id: string }>();
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const form = useForm({
    initialValues: { ...registerValues, email },
    validate: zodResolver(validateRegister),
  });

  const handleLogin = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = form.validate();
      if (hasErrors) return;

      const { data } = await axios.post("/api/auth/register", {
        ...form.values,
        token: params.id,
      });

      Cookies.set("auth", data.meta.token);
      handleSuccess("Account Created", "Welcome to Prune");
      window.location.replace("/");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box component="form" mt={32} onSubmit={form.onSubmit(() => handleLogin())}>
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
        text="Sign Up"
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
