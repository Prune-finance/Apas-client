"use client";

import Cookies from "js-cookie";
import { Box, Checkbox, PasswordInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";

import styles from "@/ui/styles/auth.module.scss";
import classes from "@/ui/styles/containedInput.module.scss";
import { registerValues, validateRegister } from "@/lib/schema";

import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { RegisterInput } from "@/ui/components/Inputs";
import { PrimaryBtn } from "@/ui/components/Buttons";

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
      if (hasErrors) {
        return console.log(errors);
      }

      const authUrl = "/api/auth/register";

      const { data } = await axios.post(authUrl, {
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
    <Box component="form" onSubmit={form.onSubmit(() => handleLogin())}>
      <TextInput
        mt="md"
        classNames={classes}
        label="Email"
        size="xs"
        flex={1}
        disabled
        placeholder="Enter Email"
        {...form.getInputProps("email")}
      />

      <PasswordInput
        mt="md"
        classNames={classes}
        styles={{
          input: {
            border: "1px solid var(--prune-text-gray-300)",
            "&:focus": { border: "none", outline: "none" },
            "&:active": { border: "none", outline: "none" },
          },

          innerInput: {
            border: "none",
            outline: "none",
            paddingTop: "18px",
            height: "100%",
          },
        }}
        label="Password"
        flex={1}
        placeholder="Enter Password"
        size="xs"
        {...form.getInputProps("password")}
        color="#C1DD06"
      />

      <PasswordInput
        mt="md"
        classNames={classes}
        styles={{
          input: {
            border: "1px solid var(--prune-text-gray-300)",
            "&:focus": { border: "none", outline: "none" },
            "&:active": { border: "none", outline: "none" },
          },

          innerInput: {
            border: "none",
            outline: "none",
            paddingTop: "18px",
            height: "100%",
          },
        }}
        label="Confirm Password"
        flex={1}
        placeholder="Enter Password"
        size="xs"
        {...form.getInputProps("confirmPassword")}
        color="#C1DD06"
      />
      {/* <RegisterInput form={form} label="email" disabled />
      <RegisterInput form={form} label="password" />
      <RegisterInput form={form} label="confirmPassword" /> */}

      <div className={styles.login__actions}>
        <PrimaryBtn
          text="Sign Up"
          loading={processing}
          type="submit"
          fullWidth
          fw={600}
          fz={14}
        />

        {/* <Checkbox label="Remember me" size="xs" color="#C1DD06" /> */}
      </div>
    </Box>
  );
}
