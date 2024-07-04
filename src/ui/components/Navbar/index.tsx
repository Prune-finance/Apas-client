"use client";

import { Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconLogout } from "@tabler/icons-react";

import { AdminMainLinks, AdminOtherLinks, UserMainLinks } from "@/lib/static";

import PruneLogo from "@/assets/logo.png";
import PruneTintLogo from "@/assets/logo-tint.png";
import styles from "./styles.module.scss";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "../Modal";
import axios from "axios";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);

  const [processing, setProcessing] = useState(false);

  const handleAdminLogout = async () => {
    setProcessing(true);
    try {
      await axios.get(`/api/auth/admin/logout`, {
        withCredentials: true,
      });

      router.push("/auth/login?rdr-action=admin");
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
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

          <div className={styles.links}>
            {AdminMainLinks.map((item, index) => {
              return (
                <Link key={index} href={item.link}>
                  <div
                    className={`${styles.link} ${
                      pathname.startsWith(item.link) ? styles.link__active : ""
                    }`}
                  >
                    <div>
                      <Text fz={12} className={styles.link__text}>
                        {item.text}
                      </Text>
                    </div>
                    {item.icon}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className={styles.container}>
          <Text fz={10} className={styles.container__header}>
            OTHERS
          </Text>

          <div className={styles.links}>
            {AdminOtherLinks.map((item, index) => {
              return (
                <Link key={index} href={item.link}>
                  <div
                    className={`${styles.link} ${
                      pathname.startsWith(item.link) ? styles.link__active : ""
                    }`}
                  >
                    <div>
                      <Text fz={12} className={styles.link__text}>
                        {item.text}
                      </Text>
                    </div>
                    {item.icon}
                  </div>
                </Link>
              );
            })}
          </div>
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
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);

  const [processing, setProcessing] = useState(false);

  const handleUserLogout = async () => {
    setProcessing(true);
    try {
      await axios.get(`/api/auth/logout`, {
        withCredentials: true,
      });

      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <nav className={`${styles.user__nav}`}>
      <div className={styles.logo__container}>
        <Image src={PruneTintLogo} width={95} height={30} alt="prune logo" />
      </div>

      <div className={styles.menu__container}>
        <div className={styles.container}>
          <div className={styles.links}>
            {UserMainLinks.map((item, index) => {
              return (
                <Link key={index} href={item.link}>
                  <div
                    className={`${styles.link} ${
                      pathname === "/" &&
                      item.link === "/" &&
                      styles.link__active
                    } ${
                      pathname.startsWith(item.link) && item.link !== "/"
                        ? styles.link__active
                        : ""
                    }`}
                  >
                    <div>
                      <Text fz={12} className={styles.link__text}>
                        {item.text}
                      </Text>
                    </div>
                    {item.icon}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

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
