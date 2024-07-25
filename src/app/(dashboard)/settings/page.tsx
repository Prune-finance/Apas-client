"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Pagination,
  Paper,
  PasswordInput,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconBuildingSkyscraper,
  IconCurrencyEuro,
  IconDots,
  IconDownload,
  IconEye,
  IconFiles,
  IconKey,
  IconListTree,
  IconLock,
  IconPlus,
  IconPointFilled,
  IconSearch,
  IconTrash,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import EmptyImage from "@/assets/empty.png";
import { AllBusinessSkeleton } from "@/lib/static";
import { useAdmins, useUsers } from "@/lib/hooks/admins";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "./modal";
import { useForm, zodResolver } from "@mantine/form";
import {
  newAdmin,
  newUser,
  passwordChange,
  validateNewAdmin,
} from "@/lib/schema";
import axios from "axios";
import { useMemo, useState } from "react";
import Keys from "./(tabs)/keys";
import useNotification from "@/lib/hooks/notification";
import Pricing from "./(tabs)/pricing";

export default function Users() {
  const router = useRouter();
  const { loading, users, revalidate } = useUsers();
  const { handleSuccess, handleError } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [processing, setProcessing] = useState(false);

  const form = useForm({
    initialValues: newUser,
    validate: zodResolver(validateNewAdmin),
  });

  const passwordForm = useForm({
    initialValues: passwordChange,
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

  // const addAdmin = async () => {
  //   setProcessing(true);

  //   try {
  //     const { hasErrors, errors } = form.validate();
  //     if (hasErrors) {
  //       return;
  //     }

  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/new-admin`,
  //       form.values,
  //       { withCredentials: true }
  //     );

  //     revalidate();
  //     close();
  //     router.push("/admin/users");
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  const menuItems = [
    {
      text: "View",
      icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
      link: true,
      href: "/admin/businesses",
    },
    {
      text: "Delete",
      icon: <IconTrash style={{ width: rem(14), height: rem(14) }} />,
    },
  ];

  const rows = users.map((element, index) => (
    <TableTr key={index}>
      <TableTd className={styles.table__td}>
        <Checkbox />
      </TableTd>
      <TableTd className={styles.table__td}>{element.email}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}></TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          <IconPointFilled size={14} color="#12B76A" />
          <Text tt="capitalize" fz={12} c="#12B76A">
            Active
          </Text>
        </div>
      </TableTd>

      <TableTd className={`${styles.table__td}`}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDots size={17} />
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            {menuItems.map((items, index) => {
              if (items.link)
                return (
                  <Link key={index} href={`${items.href}/${element.id}`}>
                    <MenuItem
                      key={index}
                      fz={10}
                      c="#667085"
                      leftSection={items.icon}
                    >
                      {items.text}
                    </MenuItem>
                  </Link>
                );

              return (
                <MenuItem
                  key={index}
                  fz={10}
                  c="#667085"
                  leftSection={items.icon}
                >
                  {items.text}
                </MenuItem>
              );
            })}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));

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

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/dashboard" },
          { title: "Settings", href: "/settings" },
        ]}
      />

      <Paper withBorder className={styles.table__container}>
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
          defaultValue="Users"
          variant="pills"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
        >
          <TabsList mb={20}>
            <TabsTab value="Users" leftSection={<IconUsers size={14} />}>
              Users
            </TabsTab>

            <TabsTab value="Password" leftSection={<IconLock size={14} />}>
              Change Password
            </TabsTab>

            <TabsTab value="Keys" leftSection={<IconKey size={14} />}>
              API Keys and Webhooks
            </TabsTab>

            <TabsTab value="Pricing" leftSection={<IconUsersGroup size={14} />}>
              Pricing Plan
            </TabsTab>
          </TabsList>

          <TabsPanel value="Users">
            <div className={styles.container__search__filter}>
              <TextInput
                placeholder="Search here..."
                leftSectionPointerEvents="none"
                leftSection={searchIcon}
                classNames={{
                  wrapper: styles.search,
                  input: styles.input__search,
                }}
              />

              <Button
                onClick={open}
                leftSection={<IconPlus color="#344054" size={16} />}
                className={styles.login__cta}
                variant="filled"
                color="#D4F307"
                pr={30}
              >
                New User
              </Button>
            </div>

            <TableScrollContainer minWidth={500}>
              <Table className={styles.table} verticalSpacing="md">
                <TableThead>
                  <TableTr>
                    <TableTh className={styles.table__th}>
                      <Checkbox />
                    </TableTh>
                    <TableTh className={styles.table__th}>
                      Email Address
                    </TableTh>
                    <TableTh className={styles.table__th}>Date Added</TableTh>
                    <TableTh className={styles.table__th}>Last Log in</TableTh>
                    <TableTh className={styles.table__th}>Status</TableTh>
                    <TableTh className={styles.table__th}>Action</TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>{loading ? AllBusinessSkeleton : rows}</TableTbody>
              </Table>
            </TableScrollContainer>

            {!loading && !!!rows.length && (
              <Flex direction="column" align="center" mt={70}>
                <Image
                  src={EmptyImage}
                  alt="no content"
                  width={156}
                  height={120}
                />
                <Text mt={14} fz={14} c="#1D2939">
                  There are no users.
                </Text>
                <Text fz={10} c="#667085">
                  When a user is added, they will appear here
                </Text>
              </Flex>
            )}

            <div className={styles.pagination__container}>
              <Text fz={14}>Rows: {rows.length}</Text>
              <Pagination
                autoContrast
                color="#fff"
                total={1}
                classNames={{
                  control: styles.control,
                  root: styles.pagination,
                }}
              />
            </div>
          </TabsPanel>

          <TabsPanel value="Password">
            <Flex mt={30} gap={100}>
              <Stack flex={1}>
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
                  <Button
                    onClick={() => passwordForm.reset()}
                    color="#D0D5DD"
                    variant="outline"
                    className={styles.cta}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handlePasswordChange}
                    loading={processing}
                    className={styles.cta}
                    variant="filled"
                    color="#D4F307"
                  >
                    Save Changes
                  </Button>
                </Flex>
              </Stack>

              <Stack flex={1}>
                <Box>
                  <Text fz={18} fw={600} c="#97AD05" mb={0}>
                    Please Note
                  </Text>
                  <Text fz={12} className="grey-400">
                    Your new password must contain the following below.
                  </Text>
                </Box>

                <Checkbox
                  checked={checks.is8Char}
                  label="8 characters"
                  color="lime"
                />
                <Checkbox
                  checked={checks.hasSpecialChar}
                  label="1 special character"
                  color="lime"
                />
                <Checkbox
                  checked={checks.hasNumber}
                  label="1 digit"
                  color="lime"
                />
                <Checkbox
                  checked={checks.hasUpperCase}
                  label="1 uppercase letter"
                  color="lime"
                />
                <Checkbox
                  checked={checks.hasLowerCase}
                  label="1 lowercase letter"
                  color="lime"
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
        // action={addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
      />
    </main>
  );
}
