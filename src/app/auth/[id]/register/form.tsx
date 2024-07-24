"use client";

import {
  Button,
  Checkbox,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";

import styles from "@/ui/styles/auth.module.scss";
import { registerValues, validateRegister } from "@/lib/schema";

import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

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

      const data = await axios.post(authUrl, {
        ...form.values,
        token: params.id,
      });

      handleSuccess("Account Created", "Welcome to Prune");
      window.location.replace("/");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className={styles.text__input__container}>
        <Text fz={12} px={10} className={styles.container__label}>
          Email
        </Text>
        <TextInput
          size="xs"
          classNames={{
            input: styles.text__input,
          }}
          value={email}
          disabled
        />
      </div>

      <div className={styles.text__input__container}>
        <Text fz={12} px={10} className={styles.container__label}>
          Password
        </Text>
        <PasswordInput
          size="xs"
          classNames={{
            input: styles.text__input,
          }}
          placeholder="******************"
          {...form.getInputProps("password")}
        />
      </div>

      <div className={styles.text__input__container}>
        <Text fz={12} px={10} className={styles.container__label}>
          Confirm Password
        </Text>
        <PasswordInput
          size="xs"
          classNames={{
            input: styles.text__input,
          }}
          placeholder="******************"
          {...form.getInputProps("confirmPassword")}
        />
      </div>

      <div className={styles.login__actions}>
        <Button
          className={styles.login__cta}
          variant="filled"
          color="#C1DD06"
          onClick={handleLogin}
          loading={processing}
        >
          Sign up
        </Button>

        <Checkbox label="Remember me" size="xs" color="#C1DD06" />
      </div>
    </>
  );
}
