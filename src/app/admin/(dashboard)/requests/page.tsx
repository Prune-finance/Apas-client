"use client";

import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";

import localFont from "next/font/local";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";

import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTbody,
  TableTd,
} from "@mantine/core";
import { Flex, Box, Divider, Button, TextInput } from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { Table, TableTh, TableThead } from "@mantine/core";
import { TableTr, Pagination, TableScrollContainer } from "@mantine/core";

import { IconDots, IconEye, IconTrash } from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconPointFilled, IconFiles, IconKey } from "@tabler/icons-react";
import { IconBuildingSkyscraper, IconCurrencyEuro } from "@tabler/icons-react";
import { IconListTree, IconUsers, IconUsersGroup } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";

import EmptyImage from "@/assets/empty.png";

import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton } from "@/lib/static";
import { DebitRequest, useDebitRequests } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import TabsContainer from "./tabs";

const switzer = localFont({
  src: "../../../../assets/fonts/Switzer-Regular.woff2",
});

export default function DebitRequests() {
  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Requests", href: "/admin/requests" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            All Requests
          </Text>
        </div>

        <TabsContainer />
      </div>
    </main>
  );
}
