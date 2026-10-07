"use client";

import Cookies from "js-cookie";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { LoginType, loginValues, validateLogin } from "@/lib/schema/auth";
import User from "@/lib/store/user";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Checkbox, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import createAxiosInstance from "@/lib/axios";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const authAxios = createAxiosInstance("auth");

const COOLDOWN_SECONDS = 3 * 60;

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

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `Retry in ${m}:${String(s).padStart(2, "0")}`;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [processing, setProcessing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setUser } = User();
  const { handleSuccess, handleError } = useNotification();

  const form = useForm<LoginType>({
    initialValues: loginValues,
    validate: zodResolver(validateLogin),
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
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

  const handleLogin = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = form.validate();
      if (hasErrors) return;

      const { data } = await axios.post("/api/auth/login", form.values);
      Cookies.set("auth", data.meta.token, { expires: 0.25 });
      handleSuccess("Authentication Successful", "Welcome back");

      if (data.meta.accountType === "ONBOARDING") {
        // Fetch full onboarding profile and store it
        try {
          const meRes = await authAxios.get("/business/onboarding/auth/me");
          setUser(meRes.data?.data ?? data.data);
        } catch {
          setUser(data.data);
        }
        window.location.replace("/onboarding");
        return;
      }

      // Fully onboarded user — use login response data
      setUser(data.data);
      window.location.replace(redirect ? redirect : "/");
    } catch (error: any) {
      const status = error?.response?.status ?? error?.response?.data?.code;
      if (status === 429) {
        startCooldown();
        handleError("Too many attempts", "Please wait 3 minutes before trying again.");
      } else {
        handleError("An error occurred", parseError(error));
      }
    } finally {
      setProcessing(false);
    }
  };

  const isCoolingDown = cooldown > 0;

  return (
    <Box component="form" mt={32} onSubmit={form.onSubmit(() => handleLogin())}>
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
          disabled={isCoolingDown}
          fullWidth
          text={isCoolingDown ? formatCountdown(cooldown) : "Log In"}
          type="submit"
          h={48}
          radius={4}
          fz={16}
          fw={500}
        />

        {isCoolingDown && (
          <Text fz={12} c="var(--prune-text-gray-500)" ta="center">
            Too many login attempts. Please wait before trying again.
          </Text>
        )}
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
