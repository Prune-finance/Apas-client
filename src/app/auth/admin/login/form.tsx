"use client";

import Cookies from "js-cookie";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { LoginType, loginValues, validateLogin } from "@/lib/schema";
import User from "@/lib/store/user";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Checkbox, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import createAxiosInstance from "@/lib/axios";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import TwoFactorModals, {
  type TwoFactorStep,
} from "../../login/TwoFactorModals";

const authAxios = createAxiosInstance("auth");

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

  // 2FA state
  const [challengeToken, setChallengeToken] = useState("");
  const [twoFactorStep, setTwoFactorStep] = useState<TwoFactorStep | null>(
    null,
  );

  const form = useForm<LoginType>({
    initialValues: loginValues,
    validate: zodResolver(validateLogin),
  });

  const completeLogin = async (token: string, userData: any) => {
    Cookies.set("auth", token, { expires: 0.25 });

    // Fetch full admin profile
    try {
      const meRes = await authAxios.get("/admin/me");
      setUser(meRes.data?.data ?? userData);
    } catch {
      setUser(userData);
    }

    handleSuccess("Authentication Successful", "Welcome back Admin");
    window.location.replace(redirect ? redirect : "/admin/dashboard");
  };

  const handleLogin = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = form.validate();
      if (hasErrors) return;

      const { data } = await axios.post("/api/auth/admin/login", form.values);
      const {
        token,
        challengeToken: ct,
        twoFactorSetupRequired,
        twoFactorRequired,
      } = data.meta ?? {};

      // If server returns a token directly (no 2FA enforced yet), proceed normally
      if (token && !ct) {
        await completeLogin(token, data.data);
        return;
      }

      // 2FA challenge — show the appropriate modal
      setChallengeToken(ct ?? "");
      if (twoFactorSetupRequired) {
        setTwoFactorStep("protect");
      } else if (twoFactorRequired) {
        setTwoFactorStep("enter");
      }
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={form.onSubmit(() => handleLogin())}>
        <Stack gap={16} mt={24}>
          <TextInput
            styles={fieldStyles}
            placeholder="Email"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            styles={passwordStyles}
            placeholder="Enter Password"
            {...form.getInputProps("password")}
          />
        </Stack>

        <div style={{ marginTop: 16 }}>
          <Checkbox label="Remember me" size="xs" color="#C1DD06" />
        </div>

        <PrimaryBtn
          loading={processing}
          fullWidth
          text="Log In"
          type="submit"
          fz={14}
          fw={600}
          mt={32}
        />

        <PrimaryBtn
          text="Forgot Password?"
          variant="transparent"
          fz={14}
          fw={600}
          mt={32}
          w="15ch"
          p={0}
          c="var(--prune-primary-800)"
          td="underline"
          link="/auth/admin/forgot-password"
        />
      </Box>

      <TwoFactorModals
        step={twoFactorStep}
        challengeToken={challengeToken}
        onStepChange={setTwoFactorStep}
        onComplete={completeLogin}
        apiBase="/api/auth/admin/2fa"
      />
    </>
  );
}

export default function LoginFormSuspense() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
