"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  rem,
} from "@mantine/core";
import {
  IconCheck,
  IconEye,
  IconKey,
  IconLock,
  IconSearch,
  IconTags,
  IconTrash,
} from "@tabler/icons-react";

import { useRouter } from "next/navigation";

import styles from "./styles.module.scss";

import { useUsers } from "@/lib/hooks/admins";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "./modal";
import { useForm, zodResolver } from "@mantine/form";
import {
  newUser,
  passwordChange,
  PasswordChangeType,
  validateNewUser,
  validatePasswordChange,
} from "@/lib/schema";
import axios from "axios";
import { useMemo, useState } from "react";
import Keys from "./(tabs)/keys";
import useNotification from "@/lib/hooks/notification";
import Pricing from "./(tabs)/pricing";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

export default function Users() {
  const router = useRouter();

  const { revalidate } = useUsers();
  const { handleSuccess, handleError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [processing, setProcessing] = useState(false);

  const form = useForm({
    initialValues: newUser,
    validate: zodResolver(validateNewUser),
  });

  const passwordForm = useForm<PasswordChangeType>({
    initialValues: passwordChange,
    validate: zodResolver(validatePasswordChange),
  });

  const checks = useMemo(() => {
    const { newPassword } = passwordForm.values;

    const is8Char = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    return { is8Char, hasUpperCase, hasNumber, hasSpecialChar, hasLowerCase };
  }, [passwordForm]);

  const addAdmin = async () => {
    setProcessing(true);

    try {
      const { hasErrors, errors } = form.validate();
      if (hasErrors) {
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users/add`,
        { email: form.values.email },
        { withCredentials: true }
      );

      revalidate();
      close();
      router.push("/users");
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePasswordChange = async () => {
    setProcessing(true);
    try {
      const { errors, hasErrors } = passwordForm.validate();
      if (hasErrors) {
        return console.log(errors);
      }

      const { newPassword, confirmPassword } = passwordForm.values;
      if (newPassword !== confirmPassword) {
        handleError(
          "Action Failed",
          "New password must match confirm password"
        );
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/change-password`,
        passwordForm.values,
        { withCredentials: true }
      );

      handleSuccess("Action Successful", "Your password has been updated");
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const tabs = [
    { title: "Change Password", value: "Password", icon: IconLock },
    { title: "API Keys & Webhooks", value: "Keys", icon: IconKey },
    { title: "Pricing Plan", value: "Pricing", icon: IconTags },
  ];

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs items={[{ title: "Settings", href: "/settings" }]} /> */}

      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Settings
          </Text>

          {/* <Button
            onClick={open}
            leftSection={<IconPlus color="#344054" size={16} />}
            className={styles.login__cta}
            variant="filled"
            color="#D4F307"
          >
            Add New User
          </Button> */}
        </div>

        <Tabs
          mt={32}
          defaultValue={tabs[0].value}
          variant="pills"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
        >
          <TabsList mb={20}>
            {tabs.map((tab, index) => (
              <TabsTab
                key={index}
                value={tab.value}
                leftSection={<tab.icon size={14} />}
              >
                {tab.title}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanel value="Password">
            <Flex mt={30} gap={100}>
              <Box
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
                flex={1}
                component="form"
                onSubmit={passwordForm.onSubmit(() => handlePasswordChange())}
              >
                <PasswordInput
                  classNames={{ input: styles.input, label: styles.label }}
                  placeholder="Current Password"
                  {...passwordForm.getInputProps("oldPassword")}
                />
                <PasswordInput
                  classNames={{ input: styles.input, label: styles.label }}
                  placeholder="New Password"
                  {...passwordForm.getInputProps("newPassword")}
                />
                <PasswordInput
                  classNames={{ input: styles.input, label: styles.label }}
                  placeholder="Confirm new Password"
                  {...passwordForm.getInputProps("confirmPassword")}
                />

                <Flex mb={20} mt={40} justify="flex-end" gap={15}>
                  <SecondaryBtn text="Cancel" action={passwordForm.reset} />

                  <PrimaryBtn text="Save Changes" type="submit" />
                </Flex>
              </Box>

              <Stack flex={1}>
                <Box>
                  <Text fz={18} fw={600} c="var(--prune-text-gray-800)" mb={0}>
                    Please Note
                  </Text>
                  <Text fz={12} className="grey-400">
                    Your new password must contain the following below.
                  </Text>
                </Box>

                <Checkbox
                  checked={checks.is8Char}
                  label="8 characters"
                  color="var(--prune-primary-700)"
                />
                <Checkbox
                  checked={checks.hasSpecialChar}
                  label="1 special character"
                  color="var(--prune-primary-700)"
                />
                <Checkbox
                  checked={checks.hasNumber}
                  label="1 digit"
                  color="var(--prune-primary-700)"
                />
                <Checkbox
                  checked={checks.hasUpperCase}
                  label="1 uppercase letter"
                  color="var(--prune-primary-700)"
                />
                <Checkbox
                  checked={checks.hasLowerCase}
                  label="1 lowercase letter"
                  color="var(--prune-primary-700)"
                />
              </Stack>
            </Flex>
          </TabsPanel>

          <TabsPanel value="Keys">
            <Keys />
          </TabsPanel>

          <TabsPanel value="Pricing">
            <Pricing />
          </TabsPanel>

          {/* 


            <TabsPanel value="Shareholders">
              {business && (
                <Shareholders business={business} revalidate={revalidate} />
              )}
            </TabsPanel>

            <TabsPanel value="Accounts">
              <Accounts business={business} />
            </TabsPanel>

            <TabsPanel value="Keys">
              <Keys business={business} />
            </TabsPanel> */}
        </Tabs>
      </Paper>

      <ModalComponent
        action={addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
      />
    </main>
  );
}
