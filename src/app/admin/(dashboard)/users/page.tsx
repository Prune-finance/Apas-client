"use client";
import Cookies from "js-cookie";

import {
  Badge,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
  TableTr,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconListTree,
  IconPlus,
  IconSearch,
  IconUserEdit,
  IconUsers,
  IconUserX,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import { useRouter, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import stylesTab from "@/ui/styles/settings.module.scss";

import EmptyImage from "@/assets/empty.png";
import { useAdmins } from "@/lib/hooks/admins";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import ModalComponent from "./modal";
import { useForm, zodResolver } from "@mantine/form";
import {
  FilterSchema,
  FilterType,
  FilterValues,
  newAdmin,
  validateNewAdmin,
} from "@/lib/schema";
import axios from "axios";
import { Suspense, useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import {
  businessFilterSchema,
  BusinessFilterType,
  businessFilterValues,
} from "../businesses/schema";
import Filter from "@/ui/components/Filter";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import TabsComponent from "@/ui/components/Tabs";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { BadgeComponent } from "@/ui/components/Badge";

function Users() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const { handleError, handleSuccess } = useNotification();
  const [tab, setTab] = useState<string | null>("Users");

  const { email, name, status, date, endDate } = Object.fromEntries(
    searchParams.entries()
  );

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const router = useRouter();
  const { loading, users, revalidate, meta } = useAdmins({
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(email && { email }),
    ...(name && { name }),
    page: active,
    limit: parseInt(limit ?? "10", 10),
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [processing, setProcessing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const form = useForm({
    initialValues: newAdmin,
    validate: zodResolver(validateNewAdmin),
  });

  const filterForm = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const addAdmin = async () => {
    setProcessing(true);

    try {
      const { hasErrors, errors } = form.validate();
      if (hasErrors) {
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/new-admin`,
        form.values,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      close();
      handleSuccess("Successful! Admin Added", "Admin added successfully");
      router.push("/admin/users");
      form.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const editAdmin = async (id: string) => {
    setProcessing(true);

    try {
      const { hasErrors, errors } = form.validate();
      if (hasErrors) {
        return;
      }
      const { password, ...rest } = form.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admin/${id}`,
        { ...rest },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      close();
      handleSuccess(
        "Successful! Admin Updated",
        "Admin details updated successfully"
      );

      router.push("/admin/users");
      form.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const menuItems = [
    // {
    //   text: "View",
    //   icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
    //   link: true,
    //   href: "/admin/businesses",
    // },
    {
      text: "Update Details",
      icon: <IconUserEdit style={{ width: rem(14), height: rem(14) }} />,
    },
    // {
    //   text: "Deactivate",
    //   icon: <IconUserX style={{ width: rem(14), height: rem(14) }} />,
    // },
  ];

  const handleRowClick = (id: string) => {
    push(`/admin/users/${id}`);
  };

  const handleEdit = (data: typeof newAdmin, id: string) => {
    form.setValues(data);
    open();
    setIsEdit(true);
    setId(id);
  };

  const rows = filteredSearch(
    users,
    ["email", "firstName", "lastName", "role"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd
        className={styles.table__td}
        tt="lowercase"
        style={{ wordBreak: "break-word" }}
        w="20%"
      >
        {element.email}
      </TableTd>
      <TableTd
        className={styles.table__td}
      >{`${element.firstName} ${element.lastName}`}</TableTd>
      <TableTd className={styles.table__td}>{element.role}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.lastLogIn).fromNow()}
        {/* {dayjs(element.lastLogIn).format("ddd DD MMM YYYY")} */}
      </TableTd>
      {/* <TableTd className={styles.table__td}></TableTd> */}
      <TableTd className={styles.table__td}>
        <BadgeComponent status="ACTIVE" active />
      </TableTd>

      <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            {menuItems.map((items, index) => {
              // if (items.link)
              //   return (
              //     <Link key={index} href={`${items.href}/${element.id}`}>
              //       <MenuItem
              //         key={index}
              //         fz={10}
              //         c="#667085"
              //         leftSection={items.icon}
              //       >
              //         {items.text}
              //       </MenuItem>
              //     </Link>
              //   );

              return (
                <MenuItem
                  key={index}
                  fz={10}
                  c="#667085"
                  leftSection={items.icon}
                  onClick={() => {
                    if (items.text === "Update Details")
                      return handleEdit(
                        {
                          email: element.email,
                          firstName: element.firstName,
                          lastName: element.lastName,
                          role: element.role,
                          password: "",
                        },
                        element.id
                      );
                  }}
                >
                  {items.text}
                </MenuItem>
              );
            })}
          </MenuDropdown>

          {/* <ModalComponent
            action={isEdit ? () => editAdmin(element.id) : addAdmin}
            processing={processing}
            opened={opened}
            close={close}
            form={form}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          /> */}
        </Menu>
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs items={[{ title: "Users", href: "/admin/users" }]} /> */}
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            User Management
          </Text>
        </div>
        <>
          <TabsComponent tabs={tabs} tt="capitalize" mt={32}>
            <TabsPanel value={tabs[0].value}>
              <Group justify="space-between" mt={28}>
                <SearchInput search={search} setSearch={setSearch} />

                <Group gap={12}>
                  <SecondaryBtn
                    text="Filter"
                    action={toggle}
                    icon={IconListTree}
                    fw={600}
                  />
                  <PrimaryBtn
                    text="Invite New User"
                    action={() => {
                      open();
                      setIsEdit(false);
                    }}
                    icon={IconPlus}
                  />
                </Group>
              </Group>

              <Filter<FilterType>
                opened={openedFilter}
                toggle={toggle}
                form={filterForm}
                customStatusOption={["Active", "Inactive"]}
              >
                <TextBox
                  placeholder="Email"
                  {...filterForm.getInputProps("email")}
                />
                <TextBox
                  placeholder="Name"
                  {...filterForm.getInputProps("name")}
                />
              </Filter>

              <TableComponent
                head={tableHeaders}
                rows={rows}
                loading={loading}
                layout="auto"
              />
              <EmptyTable
                loading={loading}
                rows={rows}
                title="There are no users"
                text="When a user is added, they will appear here."
              />
              <PaginationComponent
                active={active}
                setActive={setActive}
                setLimit={setLimit}
                limit={limit}
                total={Math.ceil(
                  (meta?.total ?? 1) / parseInt(limit ?? "10", 10)
                )}
              />
            </TabsPanel>

            <TabsPanel value={tabs[1].value}>
              <EmptyTable
                loading={loading}
                rows={[]}
                title="There are no business users"
                text="When a business user is added, they will appear here."
              />
            </TabsPanel>
          </TabsComponent>
        </>
      </div>
      {/* <ModalComponent
        action={isEdit ? editAdmin : addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
        isEdit={isEdit}
      /> */}

      <ModalComponent
        action={isEdit ? () => editAdmin(id) : addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
    </main>
  );
}

export default function UsersSuspense() {
  return (
    <Suspense>
      <Users />
    </Suspense>
  );
}

const tableHeaders = [
  "Email",
  "Name",
  "Role",
  "Date Created",
  "Last Active",
  "Status",
  "Action",
];

const tabs = [
  { title: "Own Users", value: "Users", icon: <IconUsers size={14} /> },
  {
    title: "Business Users",
    value: "Business Users",
    icon: <IconUsers size={14} />,
  },
];

// <Tabs
//   // defaultValue="Logs"
//   value={tab}
//   onChange={setTab}
//   variant="pills"
//   classNames={{
//     root: stylesTab.tabs,
//     list: stylesTab.tabs__list,
//     tab: stylesTab.tab,
//   }}
//   mt={24}
// >
//   <TabsList>
//     {tabs.map((tab) => (
//       <TabsTab
//         key={tab.title}
//         value={tab.value || tab.title}
//         leftSection={tab.icon}
//       >
//         {tab.title}
//       </TabsTab>
//     ))}
//   </TabsList>

//   <TabsPanel value="Logs">
//     <main className={styles.main}>
//       {/* <Breadcrumbs items={[{ title: "Users", href: "/admin/users" }]} /> */}

//       <div className={styles.table__container}>
//         <div className={styles.container__header}>
//           <Text fz={18} fw={600}>
//             User Management
//           </Text>
//         </div>

//         <Group justify="space-between" mt={28}>
//           <TextInput
//             placeholder="Search here..."
//             leftSectionPointerEvents="none"
//             leftSection={searchIcon}
//             w={324}
//             styles={{ input: { border: "1px solid #F5F5F5" } }}
//             // classNames={{ wrapper: styles.search, input: styles.input__search }}
//             value={search}
//             onChange={(e) => setSearch(e.currentTarget.value)}
//           />

//           <Group gap={12}>
//             <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
//             <PrimaryBtn
//               text="Invite New User"
//               action={() => {
//                 open();
//                 setIsEdit(false);
//               }}
//               icon={IconPlus}
//             />
//           </Group>
//         </Group>

//         <Filter<BusinessFilterType>
//           opened={openedFilter}
//           toggle={toggle}
//           form={filterForm}
//         />

//         <TableComponent head={tableHeaders} rows={rows} loading={loading} />

//         <EmptyTable
//           loading={loading}
//           rows={rows}
//           title="There are no users"
//           text="When a user is added, they will appear here."
//         />

//         <PaginationComponent
//           active={active}
//           setActive={setActive}
//           setLimit={setLimit}
//           limit={limit}
//           total={Math.ceil((meta?.total ?? 1) / parseInt(limit ?? "10", 10))}
//         />
//       </div>

//       {/* <ModalComponent
//       action={isEdit ? editAdmin : addAdmin}
//       processing={processing}
//       opened={opened}
//       close={close}
//       form={form}
//       isEdit={isEdit}
//     /> */}
//     </main>
//   </TabsPanel>
//   <TabsPanel value="Notifications">
//     <Text>Hello world</Text>
//   </TabsPanel>
// </Tabs>;
