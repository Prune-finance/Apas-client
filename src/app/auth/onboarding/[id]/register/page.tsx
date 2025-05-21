"use client";

import { Box, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import classes from "@/ui/styles/containedInput.module.scss";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { useState } from "react";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { RegisterType, registerValues, validateRegister } from "@/lib/schema";
import createAxiosInstance from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import useAxios from "@/lib/hooks/useAxios";
import { Onboarding, OnboardingBusiness } from "@/lib/interface";
import OnboardingStore from "@/lib/store/onboarding";

export default function OnboardingRegister() {
  const axios = createAxiosInstance("auth");
  const { push } = useRouter();
  const { id } = useParams<{ id: string }>();
  const { handleSuccess, handleError } = useNotification();
  // const { setUser } = User();
  const { setData } = OnboardingStore();

  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterType>({
    mode: "uncontrolled",
    initialValues: registerValues,
    validate: zodResolver(validateRegister),
  });

  const { data } = useAxios<OnboardingBusiness>({
    baseURL: "auth",
    endpoint: `/onboarding/questionnaire/${id}`,
    dependencies: [id],
    enabled: !!!id,
    method: "GET",
    onSuccess: (data) => {
      setData(data);
      form.initialize({
        email: data.businessEmail || "",
        // email: data.contactPersonEmail || "",  // TODO: Return contactPersonEmail
        password: "",
        confirmPassword: "",
      });
    },
  });

  const handleSubmit = async (values: RegisterType) => {
    setLoading(true);

    try {
      const { data } = await axios.post("/onboarding/create", {
        password: values.password,
        businessEmail: values.email,
      });

      Cookies.set("auth", data.meta.token, { expires: 0.25 });
      handleSuccess("Profile Created", "Please complete your profile");

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
      <Title order={2}>Create Account</Title>

      <Text c="var(--prune-text-gray-600)" fz={14} fw={400}>
        Enter your details below to have create yor account
      </Text>

      <TextInput
        mt="md"
        classNames={classes}
        label="Email"
        size="xs"
        flex={1}
        placeholder="Enter Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
        disabled={!!data?.businessEmail}
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
        key={form.key("password")}
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
        key={form.key("confirmPassword")}
        color="#C1DD06"
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
        text="Sign up"
        fw={600}
        mt="md"
        loading={loading}
        type="submit"
      />

      <Text fz={14} c="var(--prune-text-gray-400)" fw={400} ta="center" mt={40}>
        Have an account?{" "}
        <Text
          inherit
          span
          fw={700}
          c="var(--prune-primary-800)"
          component={Link}
          href={"/auth/onboarding/login"}
        >
          Log in
        </Text>
      </Text>
    </Box>
  );
}
