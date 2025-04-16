"use client";

import {
  Divider,
  TextInput,
  Text,
  Indicator,
  Avatar,
  Stack,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Group,
  Paper,
  Box,
  Center,
  Loader,
  Switch,
  Tooltip,
  Button,
} from "@mantine/core";
import { IconSearch, IconBell, IconChecks } from "@tabler/icons-react";
import localFont from "next/font/local";
import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";

const switzer = localFont({
  src: "../../../assets/fonts/Switzer-Regular.woff2",
});

import AdminAvatar from "@/assets/avatar.png";
import styles from "./styles.module.scss";
import User from "@/lib/store/user";
import { checkToken, clearSession } from "@/lib/actions/checkToken";
import axios from "axios";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { NotificationRow } from "../NotificationRow";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import {
  useAdminNotifications,
  useUserNotifications,
} from "@/lib/hooks/notifications";
import io from "socket.io-client";

import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import EmptyTable from "../EmptyTable";
import { NotificationStore } from "@/lib/store/notification";
import { usePathname, useRouter } from "next/navigation";
import { useUserBusinessServices } from "@/lib/hooks/businesses";

export default function Header() {
  const { user, setUser } = User();
  const [opened, setOpened] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { setMeta } = NotificationStore();

  const _stage =
    typeof window !== "undefined"
      ? window.localStorage.getItem("stage")
      : "TEST";
  const [stage, setStage] = useState(_stage ?? "TEST");

  const { loading, notifications, meta, revalidate } = useAdminNotifications({
    status: "unread",
    limit: 4,
  });

  useEffect(() => {
    setMeta(meta);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const { handleInfoForNotification, handleSuccess, handleError } =
    useNotification();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_AUTH_BASE_URL);

    socket.on(`admin-channel`, (data) => {
      // console.log("I ran here");
      revalidate(4);

      handleInfoForNotification(data.title, data.description);
    });

    return () => {
      socket.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAllNotificationAsRead = async () => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/notifications/mark-all-as-read`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess(
        "Mark All Notifications",
        "All notifications marked as read successfully"
      );
      revalidate();
    } catch (error) {
      handleError(
        "An error occurred while marking all notifications as read",
        parseError(error)
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSetUser = async () => {
    const { user, success } = await checkToken(true);
    if (success) {
      setUser(user);
    }
  };

  useEffect(() => {
    if (!user) {
      handleSetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  return (
    <header className={styles.header}>
      <div className={`${styles.search} ${switzer.className}`}>
        <TextInput
          placeholder="Search here for businesses, payments, accounts, etc"
          leftSectionPointerEvents="none"
          leftSection={searchIcon}
          classNames={{ wrapper: styles.search__input, input: styles.input }}
        />
      </div>

      <Switch
        color="green"
        c={stage === "LIVE" ? "green" : "dimmed"}
        fz={14}
        fw={500}
        labelPosition="left"
        checked={stage === "LIVE"}
        // defaultChecked={stage === "LIVE"}
        size="xs"
        tt="capitalize"
        label={`${(stage ?? "test").toLowerCase()} Mode`}
        styles={{ label: { fontSize: 14 } }}
        onChange={(event) => {
          const newStage = event.currentTarget.checked ? "LIVE" : "TEST";

          setStage(newStage);
          localStorage.setItem("stage", newStage);
          window.location.reload();
        }}
      />

      <div className={styles.notification}>
        <Divider orientation="vertical" h={26} />

        <Popover
          width={456}
          position="bottom"
          withArrow
          shadow="md"
          styles={{ dropdown: { padding: 0 } }}
          opened={opened}
          onChange={setOpened}
        >
          <PopoverTarget>
            <Indicator
              inline
              processing={!!meta?.total}
              color={!!meta?.total ? "red" : "transparent"}
              size={15}
              onClick={() => setOpened((o) => !o)}
            >
              <IconBell color="#475467" stroke={1.5} />
            </Indicator>
          </PopoverTarget>

          <PopoverDropdown>
            <Group gap={8} mt={20} px={28}>
              <Text fz={14} fw={600} c="var(--prune-text-gray-700)">
                Notifications
              </Text>

              <Avatar
                color="var(--prune-primary-600)"
                radius="50%"
                variant="filled"
                size={25}
                styles={{
                  placeholder: { color: "var(--prune-text-gray-800)" },
                }}
              >
                {`${meta?.total ?? 0}`}
              </Avatar>
            </Group>
            <Divider color="var(--prune-text-gray-100)" mt={20} />

            {loading ? (
              <Center h={215}>
                <Loader size={50} color="var(--prune-primary-600)" />
              </Center>
            ) : (
              <Fragment>
                {notifications.length > 0 ? (
                  <Fragment>
                    {notifications.map((notification, index, arr) => (
                      <Box px={28} key={index}>
                        <NotificationRow
                          {...notification}
                          lastRow={arr.length - 1 === index}
                          revalidate={revalidate}
                        />
                      </Box>
                    ))}
                  </Fragment>
                ) : (
                  <Box mb={20} mt={-40}>
                    <EmptyTable
                      rows={notifications}
                      title="No unread notification yet"
                      text="When there is an unread notification, it will appear here"
                      loading={loading}
                    />
                  </Box>
                )}
              </Fragment>
            )}

            <Paper py={15} bg="#f9f9f9">
              <Group px={28} justify="space-between" gap={24} wrap="nowrap">
                <SecondaryBtn
                  text="Mark all as read"
                  icon={IconChecks}
                  fullWidth
                  action={() => {
                    markAllNotificationAsRead();
                    // setOpened(false)
                  }}
                  loading={processing}
                />

                <PrimaryBtn
                  text="View All Notifications"
                  fullWidth
                  link="/admin/notifications"
                  action={() => setOpened(false)}
                />
              </Group>
            </Paper>
          </PopoverDropdown>
        </Popover>
        <Divider orientation="vertical" h={26} />
      </div>

      <div className={styles.profile}>
        <Avatar size="md" src={AdminAvatar.src} alt="admin avatar" />
        <Text
          fz={14}
          fw={600}
          className={styles.profile__text}
          component={Link}
          href={"/admin/settings"}
        >
          {user?.firstName} {user?.lastName}
        </Text>
      </div>
    </header>
  );
}

export function UserHeader() {
  const { user, setUser } = User();
  const [opened, setOpened] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { setMeta } = NotificationStore();

  const _stage =
    typeof window !== "undefined"
      ? window.localStorage.getItem("stage")
      : "TEST";
  const [stage, setStage] = useState(_stage ?? "TEST");

  const { loading, notifications, meta, revalidate } = useUserNotifications({
    status: "unread",
    limit: 4,
  });
  const { services } = useUserBusinessServices();
  const liveModeService = services.find(
    (s) => s.serviceIdentifier === "LIVE_MODE_SERVICE"
  )?.active;

  useEffect(() => {
    setMeta(meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const { handleInfoForNotification, handleSuccess, handleError, handleInfo } =
    useNotification();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_AUTH_BASE_URL);

    socket.on(`company-${user?.companyId}`, (data) => {
      // console.log("I ran here");
      revalidate(4);

      handleInfoForNotification(data.title, data.description);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAllNotificationAsRead = async () => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/mark-all-as-read`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess(
        "Mark All Notifications",
        "All notifications marked as read successfully"
      );
      revalidate();
    } catch (error) {
      handleError(
        "An error occurred while marking all notifications as read",
        parseError(error)
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSetUser = async () => {
    const { user, success } = await checkToken();
    if (success) {
      setUser(user);
    }
  };

  useEffect(() => {
    if (!user || (user && !user.permissions)) {
      handleSetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  return (
    <header className={styles.header}>
      <div className={`${styles.search} ${switzer.className}`}>
        <TextInput
          placeholder="Search here for businesses, payments, accounts, etc"
          leftSectionPointerEvents="none"
          leftSection={searchIcon}
          classNames={{ wrapper: styles.search__input, input: styles.input }}
        />
      </div>

      <Switch
        color="green"
        c={stage === "LIVE" ? "green" : "dimmed"}
        fz={14}
        fw={500}
        labelPosition="left"
        checked={stage === "LIVE"}
        // defaultChecked={stage === "LIVE"}
        size="xs"
        tt="capitalize"
        label={`${(stage ?? "test").toLowerCase()} Mode`}
        styles={{ label: { fontSize: 14 } }}
        onChange={(event) => {
          if (!liveModeService && event.currentTarget.checked) {
            handleInfo(
              "Contact Admin",
              "You cannot toggle to LIVE mode because your Live Mode Service is not enabled. Please contact admin to enable it."
            );
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          const newStage = event.currentTarget.checked ? "LIVE" : "TEST";

          setStage(newStage);
          localStorage.setItem("stage", newStage);
          window.location.reload();
          // router.refresh();
          // router.push(pathname);
          // window.history.replaceState(null, "", pathname);
        }}
      />

      <div className={styles.notification}>
        <Divider orientation="vertical" h={26} />
        {/* <Indicator inline processing color="red" size={15}>
          <IconBell color="#475467" stroke={1.5} />
        </Indicator> */}

        <Popover
          width={456}
          position="bottom"
          withArrow
          shadow="md"
          styles={{ dropdown: { padding: 0 } }}
          opened={opened}
          onChange={setOpened}
        >
          <PopoverTarget>
            <Indicator
              inline
              processing={!!meta?.total}
              color={!!meta?.total ? "red" : "transparent"}
              size={15}
              onClick={() => setOpened((o) => !o)}
            >
              <IconBell color="#475467" stroke={1.5} />
            </Indicator>
          </PopoverTarget>

          <PopoverDropdown>
            <Group gap={8} mt={20} px={28}>
              <Text fz={14} fw={600} c="var(--prune-text-gray-700)">
                Notifications
              </Text>

              <Avatar
                color="var(--prune-primary-600)"
                radius="50%"
                variant="filled"
                size={25}
                styles={{
                  placeholder: { color: "var(--prune-text-gray-800)" },
                }}
              >
                {`${meta?.total ?? 0}`}
              </Avatar>
            </Group>
            <Divider color="var(--prune-text-gray-100)" mt={20} />

            {loading ? (
              <Center h={215}>
                <Loader size={50} color="var(--prune-primary-600)" />
              </Center>
            ) : (
              <Fragment>
                {notifications.length > 0 ? (
                  <Fragment>
                    {notifications.map((notification, index, arr) => (
                      <Box px={28} key={index}>
                        <NotificationRow
                          {...notification}
                          lastRow={arr.length - 1 === index}
                          revalidate={revalidate}
                          business
                        />
                      </Box>
                    ))}
                  </Fragment>
                ) : (
                  <Box mb={20} mt={-40}>
                    <EmptyTable
                      rows={notifications}
                      title="No unread notification yet"
                      text="When there is an unread notification, it will appear here"
                      loading={loading}
                    />
                  </Box>
                )}
              </Fragment>
            )}

            <Paper py={15} bg="#f9f9f9">
              <Group px={28} justify="space-between" gap={24} wrap="nowrap">
                <SecondaryBtn
                  text="Mark all as read"
                  icon={IconChecks}
                  fullWidth
                  action={() => {
                    markAllNotificationAsRead();
                    // setOpened(false);
                  }}
                  loading={processing}
                />

                <PrimaryBtn
                  text="View All Notifications"
                  fullWidth
                  link="/notifications"
                  action={() => setOpened(false)}
                />
              </Group>
            </Paper>
          </PopoverDropdown>
        </Popover>

        <Divider orientation="vertical" h={26} />
      </div>

      <div className={styles.profile}>
        <Avatar
          size="md"
          // src={AdminAvatar.src}
          alt="admin avatar"
        >
          {getInitials(user?.company?.name ?? "")}
        </Avatar>
        <Stack gap={0}>
          <Text
            fz={14}
            fw={600}
            c="var(--prune-text-gray-600)"
            component={Link}
            href={"/settings"}
          >
            {user?.company?.name}
          </Text>
          <Text fz={10} fw={400} c="var(--prune-text-gray-600)">
            {user?.email}
          </Text>
        </Stack>
      </div>
    </header>
  );
}
