"use client";

import Cookies from "js-cookie";

import {
  Avatar,
  Badge,
  Flex,
  Group,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconBook, IconLogout } from "@tabler/icons-react";

import {
  AdminMainLinks,
  AdminOtherLinks,
  UserMainLinks,
  UserOtherLinks,
} from "@/lib/static";

import PruneLogo from "@/assets/logo.png";
import PruneTintLogo from "@/assets/logo-tint.png";
import styles from "./styles.module.scss";
import { useDisclosure, useIdle } from "@mantine/hooks";
import ModalComponent from "../Modal";
// import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { NotificationStore } from "@/lib/store/notification";
import {
  NotificationType,
  useAdminNotifications,
  useUserNotifications,
} from "@/lib/hooks/notifications";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

const axios = createAxiosInstance("auth");

export default function Navbar() {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const { meta, setMeta } = NotificationStore();
  const { handleError } = useNotification();

  const { meta: adminMeta, revalidate } = useAdminNotifications({
    status: "unread",
  });

  const [processing, setProcessing] = useState(false);

  const handleAdminLogout = async (redirect?: string) => {
    setProcessing(true);
    try {
      await fetch("/api/auth/admin/logout", { method: "GET" });

      // await clearSession();

      Cookies.remove("auth");
      window.location.replace(
        `/auth/admin/login${redirect ? `?redirect=${redirect}` : ""}`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const idle = useIdle(1000 * 60 * 30, { initialState: false });
  useEffect(() => {
    if (idle) {
      handleAdminLogout(pathname);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle]);

  const { accountReq, requests, payouts, transactions } = useMemo(() => {
    const accountReq = meta?.countByGroup.find(
      (m) => m.type === "ACCOUNT_REQUESTS"
    )?.count;

    const requests = meta?.countByGroup
      .filter(
        (grp) => grp.type === "DEBIT_REQUEST" || grp.type === "DEBIT_REQUETS"
      )
      .reduce((sum, item) => sum + (item.count ?? 0), 0);

    const payouts = meta?.countByGroup.find((m) => m.type === "PAYOUTS")?.count;

    const transactions = meta?.countByGroup.find(
      (m) => m.type === "TRANSACTIONS"
    )?.count;

    return {
      accountReq,
      requests,
      payouts,
      transactions,
    };
  }, [meta]);

  const Type = [
    "Transactions",
    "Payouts",
    "Requests",
    "Account Creation",
  ] as const;

  type Type = (typeof Type)[number];

  const countSwitch = (type: Type) => {
    switch (type) {
      case "Account Creation":
        return accountReq;
      case "Requests":
        return requests;
      case "Payouts":
        return payouts;
      case "Transactions":
        return transactions;
      default:
        return null;
    }
  };

  const matchType = (type: Type): NotificationType => {
    switch (type) {
      case "Transactions":
        return "TRANSACTIONS";
      case "Payouts":
        return "PAYOUTS";
      case "Requests":
        return "DEBIT_REQUEST";
      case "Account Creation":
        return "ACCOUNT_REQUESTS";
      default:
        return null;
    }
  };

  const markAllNotificationByType = async (type: NotificationType) => {
    try {
      await axios.patch(`/admin/notifications/${type}/mark-all-as-read`);
      await revalidate();

      setMeta(adminMeta);
    } catch (error) {
      handleError(
        "An error occurred while marking all notifications as read",
        parseError(error)
      );
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo__container}>
        <Image src={PruneLogo} width={95} height={30} alt="prune logo" />
      </div>

      <div className={styles.menu__container}>
        <div className={styles.container}>
          <Text fz={10} className={styles.container__header}>
            MAIN MENU
          </Text>

          {/* <div className={styles.links}> */}
          <Stack gap={12} mt={32}>
            {AdminMainLinks.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  leftSection={item.icon}
                  component={Link}
                  onClick={() =>
                    countSwitch(item.text as Type) &&
                    matchType(item.text as Type)
                      ? markAllNotificationByType(matchType(item.text as Type))
                      : {}
                  }
                  label={
                    <NavLinkLabel
                      text={item.text}
                      count={countSwitch(item.text as Type)}
                      textArray={[
                        "Transactions",
                        "Payouts",
                        "Requests",
                        "Account Creation",
                      ]}
                    />
                  }
                  href={item.link}
                  active={pathname.startsWith(item.link)}
                  fz={8}
                  color="var(--prune-primary-900, #596603)"
                  styles={{ label: { fontSize: 12 } }}
                  classNames={{ root: styles.root }}
                />
              );
            })}
          </Stack>
          {/* </div> */}
        </div>

        <div className={styles.container}>
          <Text fz={10} className={styles.container__header}>
            OTHERS
          </Text>

          <Stack gap={12} mt={32}>
            {AdminOtherLinks.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  leftSection={item.icon}
                  component={Link}
                  label={item.text}
                  href={item.link}
                  active={pathname.startsWith(item.link)}
                  fz={8}
                  color="var(--prune-primary-900, #596603)"
                  styles={{ label: { fontSize: 12 } }}
                  classNames={{ root: styles.root }}
                />
              );
            })}
          </Stack>
        </div>
      </div>

      <UnstyledButton onClick={open} className={styles.nav__cta__container}>
        <Text fz={12}>Log out</Text>

        <div className={styles.nav__cta}>
          <IconLogout size={16} />
        </div>
      </UnstyledButton>

      <ModalComponent
        action={handleAdminLogout}
        processing={processing}
        opened={opened}
        close={close}
        title="Confirm Logout"
        text="All unsaved changes will be lost"
        customApproveMessage="Yes, log me out"
        icon={<IconLogout />}
        color="#fafafa"
      />
    </nav>
  );
}

export function UserNavbar() {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const { meta, setMeta } = NotificationStore();

  const { revalidate, meta: userMeta } = useUserNotifications({
    status: "unread",
  });
  const { handleError } = useNotification();

  const [processing, setProcessing] = useState(false);

  const handleUserLogout = async (redirect?: string) => {
    setProcessing(true);
    try {
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      // await clearSession();

      Cookies.remove("auth");
      window.location.replace(
        `/auth/login${redirect ? `?redirect=${redirect}` : ""}`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const idle = useIdle(1000 * 60 * 30, { initialState: false });
  useEffect(() => {
    if (idle) {
      handleUserLogout(pathname);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle]);

  const isActive = (link: string): boolean => {
    return (
      (pathname === "/" && link === "/") ||
      (pathname.startsWith(link) && link !== "/")
    );
  };

  const { accountReq, debitReq, payouts, transactions } = useMemo(() => {
    const accountReq = meta?.countByGroup.find(
      (m) => m.type === "ACCOUNT_REQUESTS"
    )?.count;
    const debitReq = meta?.countByGroup.find(
      (m) => m.type === "DEBIT_REQUEST"
    )?.count;
    const payouts = meta?.countByGroup.find((m) => m.type === "PAYOUTS")?.count;
    const transactions = meta?.countByGroup.find(
      (m) => m.type === "TRANSACTIONS"
    )?.count;

    return {
      accountReq,
      debitReq,
      payouts,
      transactions,
    };
  }, [meta]);

  const Type = [
    "Transactions",
    "Payouts",
    "Debit Requests",
    "Account Requests",
  ] as const;

  type Type = (typeof Type)[number];

  const countSwitch = (type: Type) => {
    switch (type) {
      case "Account Requests":
        return accountReq;
      case "Debit Requests":
        return debitReq;
      case "Payouts":
        return payouts;
      case "Transactions":
        return transactions;
      default:
        return null;
    }
  };

  const matchType = (type: Type): NotificationType => {
    switch (type) {
      case "Transactions":
        return "TRANSACTIONS";
      case "Payouts":
        return "PAYOUTS";
      case "Debit Requests":
        return "DEBIT_REQUEST";
      case "Account Requests":
        return "ACCOUNT_REQUESTS";
      default:
        return null;
    }
  };

  const markAllNotificationByType = async (type: NotificationType) => {
    try {
      await axios.patch(`/notifications/${type}/mark-all-as-read`);
      await revalidate();

      setMeta(userMeta);
    } catch (error) {
      handleError(
        "An error occurred while marking all notifications as read",
        parseError(error)
      );
    }
  };

  return (
    <nav className={`${styles.user__nav}`}>
      <div className={styles.logo__container}>
        <Image src={PruneTintLogo} width={105} height={30} alt="prune logo" />
      </div>

      <div className={styles.menu__container}>
        <div className={styles.container}>
          <Text fz={10} className={styles.container__header} pl={10}>
            MAIN MENU
          </Text>

          <Stack gap={12} mt={32}>
            {UserMainLinks.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  leftSection={item.icon}
                  component={Link}
                  onClick={() =>
                    countSwitch(item.text as Type) &&
                    matchType(item.text as Type)
                      ? markAllNotificationByType(matchType(item.text as Type))
                      : {}
                  }
                  label={
                    <NavLinkLabel
                      text={item.text}
                      count={countSwitch(item.text as Type)}
                      textArray={[
                        "Transactions",
                        "Payouts",
                        "Debit Requests",
                        "Account Requests",
                      ]}
                    />
                  }
                  href={item.link}
                  active={isActive(item.link)}
                  fz={8}
                  color="var(--prune-primary-900, #596603)"
                  styles={{ label: { fontSize: 12 } }}
                  classNames={{ root: styles.root }}
                  style={{
                    borderRight: isActive(item.link)
                      ? "3px solid var(--prune-primary-900, #596603)"
                      : "none",
                  }}
                />
              );
            })}
          </Stack>
        </div>

        <div className={styles.container} style={{ marginTop: 20 }}>
          <Text fz={10} className={styles.container__header} pl={10}>
            OTHERS
          </Text>
          <Stack gap={12} mt={32}>
            {UserOtherLinks.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  leftSection={item.icon}
                  component={Link}
                  label={item.text}
                  href={item.link}
                  active={isActive(item.link)}
                  fz={8}
                  color="var(--prune-primary-900, #596603)"
                  styles={{ label: { fontSize: 12 } }}
                  classNames={{ root: styles.root }}
                  style={{
                    borderRight: isActive(item.link)
                      ? "3px solid var(--prune-primary-900, #596603)"
                      : "none",
                  }}
                />
              );
            })}
          </Stack>
        </div>
      </div>

      <UnstyledButton
        component={Link}
        href="https://docs.prunepayments.net/"
        target="_blank"
        className={styles.nav__cta__container}
      >
        <Text fz={12}>API Documentation</Text>

        <div className={styles.nav__cta}>
          <IconBook size={16} />
        </div>
      </UnstyledButton>

      <UnstyledButton onClick={open} className={styles.nav__cta__container}>
        <Text fz={12}>Log out</Text>

        <div className={styles.nav__cta}>
          <IconLogout size={16} />
        </div>
      </UnstyledButton>

      <ModalComponent
        action={handleUserLogout}
        processing={processing}
        opened={opened}
        close={close}
        title="Confirm Logout"
        text="All unsaved changes will be lost"
        customApproveMessage="Yes, log me out"
        icon={<IconLogout />}
        color="#fafafa"
      />
    </nav>
  );
}

const NavLinkLabel = ({
  text,
  count,
  textArray,
}: {
  text: string;
  count: number | null | undefined;
  textArray: string[];
}) => {
  return count && textArray.includes(text) ? (
    <Flex fz={12} wrap="nowrap" justify="space-between">
      <Text fz={12}>{text}</Text>
      <Badge
        h={17}
        fz={10}
        variant="filled"
        radius={16}
        color="#B42318"
        c="#fff"
      >{`${count}`}</Badge>
    </Flex>
  ) : (
    text
  );
};
