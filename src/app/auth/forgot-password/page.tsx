"use client";

import { Box, Paper, Text, TextInput } from "@mantine/core";
import Image from "next/image";
import PruneIcon from "@/assets/icon.png";
import styles from "./style.module.scss";
import { inter } from "@/ui/fonts";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

export default function UserForgotPassword() {
  const schema = z.object({
    email: z.string().email("Invalid Email").min(1, "Email is required"),
  });
  const form = useForm({
    initialValues: { email: "" },
    validate: zodResolver(schema),
  });

  return (
    <div className={styles.container}>
      <Paper w={476} className={styles.paper}>
        <Image width={29} height={29} src={PruneIcon} alt="prune icon" />
        <Text c="var(--prune-text-gray-900)" fz={24} fw={600} mt={27} mb={0}>
          Forgot Password
        </Text>
        <Text
          fz={14}
          fw={400}
          m={0}
          p={0}
          c="var(--prune-text-gray-600)"
          style={{ fontFamily: inter.style.fontFamily }}
        >
          Do not worry, we would help you reset it.
        </Text>

        <Box component="form" onSubmit={form.onSubmit(() => {})} w="100%">
          <TextInput
            mt={42}
            placeholder="Enter Email"
            {...form.getInputProps("email")}
            classNames={{ input: styles.input }}
          />

          <PrimaryBtn
            text="Send Reset Link"
            fullWidth
            mt={39}
            fw={600}
            type="submit"
          />
        </Box>

        <PrimaryBtn
          text="Go back to Login"
          link="/auth/login"
          mt={10}
          td="underline"
          variant="transparent"
          c="var(--prune-primary-700)"
          fz={14}
          fw={600}
        />
      </Paper>
    </div>
  );
}
