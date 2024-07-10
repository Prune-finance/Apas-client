"use client";

import Image from "next/image";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  UnstyledButton,
  rem,
  Text,
  Drawer,
  Flex,
  Box,
  Divider,
  Button,
  TextInput,
  TableScrollContainer,
  Table,
  TableTh,
  TableThead,
  TableTr,
  Pagination,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
} from "@mantine/core";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/settings.module.scss";
import {
  IconDots,
  IconEye,
  IconTrash,
  IconX,
  IconCheck,
  IconSearch,
  IconListTree,
  IconLogs,
  IconAccessible,
} from "@tabler/icons-react";
import EmptyImage from "@/assets/empty.png";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton } from "@/lib/static";
import { useBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
import Logs from "./(tabs)/logs";

export default function DebitRequests() {
  const { loading, businesses } = useBusiness();
  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const MenuComponent = (props: any) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <MenuItem
            onClick={openDrawer}
            fz={10}
            c="#667085"
            leftSection={
              <IconEye
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            View
          </MenuItem>

          <MenuItem
            onClick={open}
            fz={10}
            c="#667085"
            leftSection={
              <IconTrash
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Delete
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  const rows: any[] = [];

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Debit Requests", href: "/admin/accounts" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Settings
          </Text>
        </div>

        <Tabs
          defaultValue="Logs"
          variant="pills"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
          mt={24}
        >
          <TabsList>
            <TabsTab value="Logs" leftSection={<IconLogs size={14} />}>
              Audit Logs
            </TabsTab>
            <TabsTab
              value="Permissions"
              leftSection={<IconAccessible size={14} />}
            >
              Permissions
            </TabsTab>
          </TabsList>

          <TabsPanel value="Logs">
            <Logs />
          </TabsPanel>
        </Tabs>
      </div>
    </main>
  );
}
