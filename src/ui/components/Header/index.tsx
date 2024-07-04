import {
  Divider,
  TextInput,
  Text,
  Indicator,
  Avatar,
  Switch,
} from "@mantine/core";
import { IconSearch, IconBell } from "@tabler/icons-react";
import localFont from "next/font/local";
import { useState } from "react";

const switzer = localFont({
  src: "../../../assets/fonts/Switzer-Regular.woff2",
});

import AdminAvatar from "@/assets/avatar.png";
import styles from "./styles.module.scss";

export default function Header() {
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
        <Text fz={14} fw={600} className={styles.profile__text}>
          Abayomi Daniella
        </Text>
        <Avatar size="md" src={AdminAvatar.src} alt="admin avatar" />
      </div>
    </header>
  );
}

export function UserHeader() {
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

      <div className={styles.stage__trigger}>
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
      </div>

      <div className={styles.notification}>
        <Divider orientation="vertical" h={26} />
        <Indicator inline processing color="red" size={15}>
          <IconBell color="#475467" stroke={1.5} />
        </Indicator>
        <Divider orientation="vertical" h={26} />
      </div>

      <div className={styles.profile}>
        <Text fz={14} fw={600} className={styles.profile__text}>
          Ebube Anyiam
        </Text>
        <Avatar size="md" src={AdminAvatar.src} alt="admin avatar" />
      </div>
    </header>
  );
}
