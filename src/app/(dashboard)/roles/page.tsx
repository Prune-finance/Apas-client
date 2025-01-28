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
import { useSearchParams } from "next/navigation";
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
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const [opened, { open, close }] = useDisclosure(false);
  const [openedInvite, { open: openInvite, close: closeInvite }] =
    useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const tabs = [
    { title: "Roles", value: "Roles", icon: IconBriefcase },
    { title: "De-activated Roles", value: "De-activated", icon: IconUserX },
  ];

  const form = useForm({
    initialValues: newRoles,
    //   validate: zodResolver(validateNewAdmin),
  });

  const handleRowClick = () => {
    openDrawer();
  };

  const rows = filteredSearch(
    roleDemoData,
    ["name", "date"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick()}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize">{element?.name}</TableTd>
      <TableTd>{dayjs(element?.date).format("ddd DD MMM YYYY")}</TableTd>

      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem leftSection={<IconEdit size={14} />} onClick={() => {}}>
              <Text fz={12}>Edit Role</Text>
            </MenuItem>
            <MenuItem leftSection={<IconUserX size={14} />} onClick={open}>
              <Text fz={12}>De-activate</Text>
            </MenuItem>
            <MenuItem leftSection={<IconUser size={14} />} onClick={openInvite}>
              <Text fz={12}>Assign User</Text>
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));

  const rowsDeactivate = filteredSearch(
    roleDemoData2,
    ["name", "date"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick()}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize">{element?.name}</TableTd>
      <TableTd>{dayjs(element?.date).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd>
        {dayjs(element?.dateDeactivated).format("ddd DD MMM YYYY")}
      </TableTd>

      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem leftSection={<IconUserX size={14} />} onClick={() => {}}>
              <Text fz={12}>Delete Role</Text>
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));

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

        <Tabs
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
              <TabsTab
                key={index}
                value={tab.value}
                leftSection={<tab.icon size={14} />}
              >
                {tab.title}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanel value="Roles">
            <Group justify="space-between" mt={28}>
              <SearchInput search={search} setSearch={setSearch} />

              <Group gap={12}>
                <PrimaryBtn text="New Role" action={() => {}} icon={IconPlus} />
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
        </Tabs>

        <EmptyTable
          rows={rowsDeactivate}
          loading={false}
          title="There are no users"
          text="When a user is added, they will appear here."
        />
      </div>

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        //   total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        total={1}
      />

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
                De-Activated Roles
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

const tableHeaders = ["Role Name", "Date Created", "Action"];
const tableHeaderDeactivated = [
  "Role Name",
  "Date Created",
  "Date De-activated",
  "Action",
];

const roleDemoData = [
  {
    name: "Admin",
    date: "12-12-2002",
  },
  {
    name: "Super Admin",
    date: "01-15-2005",
  },
  {
    name: "Owner",
    date: "03-22-2010",
  },
  {
    name: "Marketer",
    date: "07-30-2018",
  },
  {
    name: "Developer",
    date: "11-05-2021",
  },
];

const roleDemoData2 = [
  {
    name: "Sales",
    date: "12-12-2002",
    dateDeactivated: "12-12-2002",
  },
  {
    name: "Support",
    date: "01-15-2005",
    dateDeactivated: "12-12-2002",
  },
  {
    name: "Customer Service",
    date: "03-22-2010",
    dateDeactivated: "12-12-2002",
  },
];

export default function RolesSuspense() {
  return (
    <Suspense>
      <Roles />
    </Suspense>
  );
}
