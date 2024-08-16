"use client";

import Cookies from "js-cookie";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { LoginType, loginValues, validateLogin } from "@/lib/schema";
import User from "@/lib/store/user";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { LoginInput } from "@/ui/components/Inputs";
import { Box, Checkbox } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import { useState } from "react";

import styles from "@/ui/styles/auth.module.scss";

export default function LoginForm() {
  //   const searchParams = useSearchParams();
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
      if (hasErrors) {
        return;
      }

      const authUrl = "/api/auth/admin/login";
      const { data } = await axios.post(authUrl, form.values);

      Cookies.set("auth", data.meta.token);
      handleSuccess("Authentication Successful", "Welcome back Admin");
      setUser({ ...data.data });
      window.location.replace("/admin/dashboard");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };
  return (
    <Box component="form" onSubmit={form.onSubmit(() => handleLogin())}>
      <LoginInput form={form} label="email" />
      <LoginInput form={form} label="password" />

      <div className={styles.login__actions}>
        <Checkbox label="Remember me" size="xs" color="#C1DD06" />
      </div>

      <PrimaryBtn
        // action={handleLogin}
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
      />
    </Box>
  );
}
