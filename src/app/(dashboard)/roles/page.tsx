"use client";

import { Suspense, useState } from "react";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Modal,
  rem,
  Select,
  TableTd,
  TableTr,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconBriefcase,
  IconDotsVertical,
  IconEdit,
  IconHomeCancel,
  IconKey,
  IconLock,
  IconMail,
  IconPlus,
  IconUser,
  IconUserCheck,
  IconUserX,
  IconX,
} from "@tabler/icons-react";
import { SearchInput } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { filteredSearch } from "@/lib/search";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import RolesDrawer from "./drawer";
import { useForm } from "@mantine/form";
import TabsComponent from "@/ui/components/Tabs";
import ActiveRoles from "./(tabs)/active";
import DeactivatedRoles from "./(tabs)/deactivated";

dayjs.extend(relativeTime);

const newRoles = {
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  password: "",
};

function Roles() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const [opened, { open, close }] = useDisclosure(false);
  const [openedInvite, { open: openInvite, close: closeInvite }] =
    useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: newRoles,
    //   validate: zodResolver(validateNewAdmin),
  });

  const handleRowClick = () => {
    openDrawer();
  };

  return (
    <main className={styles.main}>
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Roles & Permissions
          </Text>

          <Text fz={14} fw={400} c="#667085">
            Create Roles and permissions that will be assigned to users that are
            invited.
          </Text>
        </div>

        <TabsComponent
          tabs={tabs}
          mt={32}
          tt="capitalize"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
          keepMounted={false}
        >
          <TabsPanel value={tabs[0].value}>
            <ActiveRoles />
          </TabsPanel>

          <TabsPanel value={tabs[1].value}>
            <DeactivatedRoles />
          </TabsPanel>
        </TabsComponent>

        {/* <Tabs
          mt={32}
          defaultValue={
            tabs.find((t) => t.value === tab)?.value ?? tabs[0].value
          }
          variant="pills"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
        >
          <TabsList mb={20}>
            {tabs.map((tab, index) => (
              <TabsTab key={index} value={tab.value} leftSection={tab.icon}>
                {tab.title}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanel value="Roles">
            <Group justify="space-between" mt={28}>
              <SearchInput search={search} setSearch={setSearch} />

              <Group gap={12}>
                <PrimaryBtn
                  text="New Role"
                  action={() => router.push("/roles/new")}
                  icon={IconPlus}
                />
              </Group>
            </Group>

            <TableComponent
              head={tableHeaders}
              rows={rows}
              loading={false}
              layout="auto"
            />
          </TabsPanel>

          <TabsPanel value="De-activated">
            <Group justify="space-between" mt={28}>
              <SearchInput search={search} setSearch={setSearch} />
            </Group>

            <TableComponent
              head={tableHeaderDeactivated}
              rows={rowsDeactivate}
              loading={false}
              layout="auto"
            />
          </TabsPanel>
        </Tabs> */}
      </div>

      <RolesDrawer opened={openedDrawer} close={closeDrawer} user={null} />

      <Modal
        opened={opened}
        onClose={close}
        centered
        // withCloseButton={false}
        closeButtonProps={{
          icon: (
            <ActionIcon
              variant="light"
              color="var(--prune-text-gray-400)"
              radius="xl"
            >
              <IconX color="var(--prune-text-gray-600)" size={20} />
            </ActionIcon>
          ),
        }}
        size={370}
        padding={24}
        title=""
      >
        <Flex align="center" justify="center" direction="column" gap={8}>
          <Text fz={18} fw={600} c="#000">
            De-activate Role
          </Text>

          <Text fz={12} fw={400} c="#667085" ta="center">
            You are about to deactivate this role from the system, All users
            (Aside the primary account owner) associated with this account will
            be logged out and denied access. click Yes, De-activate to continue.
          </Text>

          <Box bg="#FBFEE6" p={8} style={{ border: "1px solid #C1DD06" }}>
            <Text fz={12} fw={500} c="#667085" ta="center">
              For users to regain access to this account again, go to <br />
              <span style={{ color: "#97AD05", textDecoration: "underline" }}>
                Deactivated Roles
              </span>{" "}
              to re-assign users to a new role.
            </Text>
          </Box>
        </Flex>

        <Flex mb={16} mt={30} justify="center" align="center" w="100%" gap={15}>
          <SecondaryBtn text="Cancel" action={() => {}} fw={600} fullWidth />

          <PrimaryBtn
            text={"Yes Deactivate"}
            loading={false}
            type="submit"
            fw={600}
            fullWidth
          />
        </Flex>
      </Modal>

      <Modal
        opened={openedInvite}
        onClose={closeInvite}
        centered
        closeButtonProps={{
          icon: (
            <ActionIcon
              variant="light"
              color="var(--prune-text-gray-400)"
              radius="xl"
            >
              <IconX color="var(--prune-text-gray-600)" size={20} />
            </ActionIcon>
          ),
        }}
        size={570}
        padding={40}
        title={
          <Flex direction="column">
            <Text fz={24} fw={600}>
              Invite a New User
            </Text>
            <Text fz={14} c="#98A2B3" fw={400}>
              Invite a user to collaborate with you.
            </Text>
          </Flex>
        }
      >
        <Flex gap={20}>
          <TextInput
            label=""
            classNames={{ input: styles.input, label: styles.label }}
            placeholder="First Name"
            size="lg"
            flex={1}
            {...form.getInputProps("firstName")}
          />

          <TextInput
            classNames={{ input: styles.input, label: styles.label }}
            label=""
            placeholder="Last Name"
            flex={1}
            size="lg"
            {...form.getInputProps("lastName")}
          />
        </Flex>

        <Flex mt={24}>
          <TextInput
            classNames={{ input: styles.input, label: styles.label }}
            label=""
            placeholder="Email"
            flex={1}
            size="lg"
            {...form.getInputProps("email")}
            rightSection={<IconMail color="#667085" size={14} />}
          />
        </Flex>

        <Flex mt={24}>
          <Select
            placeholder="Role"
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            label=""
            size="lg"
            data={["Admin", "Superadmin"]}
            {...form.getInputProps("role")}
          />
        </Flex>

        <Flex mb={16} mt={30} justify="flex-end" w="100%" gap={15}>
          <SecondaryBtn
            text="Cancel"
            action={() => {}}
            fw={600}
            h={40}
            w={106}
          />

          <PrimaryBtn
            text={"Submit"}
            loading={false}
            type="submit"
            fw={600}
            h={40}
            w={122}
          />
        </Flex>
      </Modal>
    </main>
  );
}

export default function RolesSuspense() {
  return (
    <Suspense>
      <Roles />
    </Suspense>
  );
}

const tabs = [
  { title: "Roles", value: "Roles", icon: <IconBriefcase size={14} /> },
  {
    title: "Deactivated Roles",
    value: "Deactivated",
    icon: <IconUserX size={14} />,
  },
];
