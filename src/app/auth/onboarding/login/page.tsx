"use client";

import { Box, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { useState } from "react";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { LoginType, loginValues, validateLogin } from "@/lib/schema";
import createAxiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import Onboarding from "@/lib/store/onboarding";

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

export default function OnboardingLogin() {
  const questAxios = createAxiosInstance("questionnaire");
  const { push } = useRouter();
  const { handleSuccess, handleError } = useNotification();
  const { setBusiness } = Onboarding();

  const [loading, setLoading] = useState(false);
  const form = useForm<LoginType>({
    mode: "uncontrolled",
    initialValues: loginValues,
    validate: zodResolver(validateLogin),
  });

  const handleSubmit = async (values: LoginType) => {
    setLoading(true);

    try {
      const { data: res } = await questAxios.post("/business/onboarding/auth/login", {
        email: values.email,
        password: values.password,
      });

      Cookies.set("auth", res.data?.accessToken ?? res.meta?.token, { expires: 0.25 });
      handleSuccess("Authentication Successful", "Welcome back");
      if (res.data?.business) setBusiness({ ...res.data.business });
      push("/onboarding");
    } catch (error) {
      if (isAxiosError(error))
        return handleError("An error occurred", error.response?.data?.message);

      handleError("An error occurred", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      component="form"
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
    >
      <Title order={2}>Log in</Title>

      <Text c="var(--prune-text-gray-600)" fz={14} fw={400}>
        Enter your details below to have access to your account
      </Text>

      <TextInput
        mt="md"
        styles={fieldStyles}
        placeholder="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      <PasswordInput
        mt="md"
        styles={passwordStyles}
        placeholder="Password"
        {...form.getInputProps("password")}
        key={form.key("password")}
      />

      <Text fz={14} fw={400} mt="md" c="var(--prune-text-gray-700)">
        By signing up, you agree to our{" "}
        <Text inherit span component={Link} href={"/"} td="underline">
          Terms
        </Text>{" "}
        and have read and acknowledge the our{" "}
        <Text inherit span component={Link} href={"/"} td="underline">
          Privacy Policies
        </Text>
        .
      </Text>

      <PrimaryBtn
        fullWidth
        text="Log In"
        fw={600}
        mt="md"
        loading={loading}
        type="submit"
      />

      <Text fz={14} c="var(--prune-text-gray-400)" fw={400} ta="center" mt={40}>
        Have a business account?{" "}
        <Text
          inherit
          span
          fw={700}
          c="var(--prune-primary-800)"
          component={Link}
          href={"/auth/login"}
        >
          Log in
        </Text>
      </Text>
    </Box>
  );
}
