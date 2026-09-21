"use client";

import Cookies from "js-cookie";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { LoginType, loginValues, validateLogin } from "@/lib/schema/auth";
import User from "@/lib/store/user";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Checkbox, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

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

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [processing, setProcessing] = useState(false);
  const { setUser } = User();
  const { handleSuccess, handleError } = useNotification();

  const form = useForm<LoginType>({
    initialValues: loginValues,
    validate: zodResolver(validateLogin),
  });

  const handleLogin = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = form.validate();
      if (hasErrors) return;

      const { data } = await axios.post("/api/auth/login", form.values);
      setUser({ ...data.data });
      Cookies.set("auth", data.meta.token, { expires: 0.25 });
      handleSuccess("Authentication Successful", "Welcome back");
      window.location.replace(redirect ? redirect : "/");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box component="form" mt={32} onSubmit={form.onSubmit(() => handleLogin())}>
      {/* Email + Password — 16px gap */}
      <Stack gap={16}>
        <TextInput
          styles={fieldStyles}
          placeholder="Email"
          {...form.getInputProps("email")}
        />

        <PasswordInput
          styles={passwordStyles}
          placeholder="Password"
          {...form.getInputProps("password")}
        />
      </Stack>

      {/* Remember me + Log In — 16px gap, 24px below fields */}
      <Stack gap={16} mt={24}>
        <Checkbox
          label="Remember me"
          size="sm"
          color="var(--prune-primary-600)"
          styles={{
            label: { fontSize: "14px", color: "var(--prune-text-gray-700)" },
            input: { borderRadius: "4px" },
          }}
        />

        <PrimaryBtn
          loading={processing}
          fullWidth
          text="Log In"
          type="submit"
          h={48}
          radius={4}
          fz={16}
          fw={500}
        />
      </Stack>

      <PrimaryBtn
        text="Forgot Password?"
        variant="transparent"
        fz={14}
        fw={600}
        mt={16}
        p={0}
        c="var(--prune-primary-800)"
        link="/auth/forgot-password"
        fullWidth
        style={{ textAlign: "center" }}
      />
    </Box>
  );
}

export default function LoginFormSuspense() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
