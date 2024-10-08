import {
  Divider,
  TextInput,
  Text,
  Indicator,
  Avatar,
  Switch,
  Stack,
} from "@mantine/core";
import { IconSearch, IconBell } from "@tabler/icons-react";
import localFont from "next/font/local";
import { useEffect, useState } from "react";

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

export default function Header() {
  const { user, setUser } = User();

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

      <div className={styles.notification}>
        <Divider orientation="vertical" h={26} />
        <Indicator inline processing color="red" size={15}>
          <IconBell color="#475467" stroke={1.5} />
        </Indicator>
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

  const handleSetUser = async () => {
    const { user, success } = await checkToken();
    if (success) {
      setUser(user);
    }
  };

  useEffect(() => {
    if (!user) {
      handleSetUser();
    }
  }, [user]);

  const [stage, setStage] = useState("live");

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

      {/* <div className={styles.stage__trigger}>
        <Text
          fz={14}
          fw={500}
          tt="capitalize"
          c={stage === "live" ? "green" : "dimmed"}
        >
          {stage} Mode
        </Text>
        <Switch
          color="green"
          labelPosition="left"
          defaultChecked={stage === "live"}
          size="xs"
          onChange={(event) =>
            setStage(event.currentTarget.checked ? "live" : "test")
          }
        />
      </div> */}

      <div className={styles.notification}>
        <Divider orientation="vertical" h={26} />
        <Indicator inline processing color="red" size={15}>
          <IconBell color="#475467" stroke={1.5} />
        </Indicator>
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
