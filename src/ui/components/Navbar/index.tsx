"use client";

import Cookies from "js-cookie";

import { NavLink, Stack, Text, UnstyledButton } from "@mantine/core";
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
import axios from "axios";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);

  const [processing, setProcessing] = useState(false);

  const handleAdminLogout = async (redirect?: string) => {
    setProcessing(true);
    try {
      await axios.get(`/api/auth/admin/logout`);

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
  }, [idle]);

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
                // <Link key={index} href={item.link}>
                //   <div
                //     className={`${styles.link} ${
                //       pathname.startsWith(item.link) ? styles.link__active : ""
                //     }`}
                //   >
                //     <div>
                //       <Text fz={12} className={styles.link__text}>
                //         {item.text}
                //       </Text>
                //     </div>
                //     {item.icon}
                //   </div>
                // </Link>

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

  const [processing, setProcessing] = useState(false);

  const handleUserLogout = async (redirect?: string) => {
    setProcessing(true);
    try {
      await axios.get(`/api/auth/logout`, {
        withCredentials: true,
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
  }, [idle]);

  const isActive = (link: string): boolean => {
    return (
      (pathname === "/" && link === "/") ||
      (pathname.startsWith(link) && link !== "/")
    );
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
