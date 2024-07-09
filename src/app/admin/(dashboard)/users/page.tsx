"use client";

import {
  Button,
  Checkbox,
  Flex,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Pagination,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconDots,
  IconDownload,
  IconEye,
  IconListTree,
  IconPlus,
  IconPointFilled,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import EmptyImage from "@/assets/empty.png";
import { AllBusinessSkeleton } from "@/lib/static";
import { useAdmins } from "@/lib/hooks/admins";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "./modal";
import { useForm, zodResolver } from "@mantine/form";
import { newAdmin, validateNewAdmin } from "@/lib/schema";
import axios from "axios";
import { useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

export default function Users() {
  const router = useRouter();
  const { loading, users, revalidate } = useAdmins();
  const [opened, { open, close }] = useDisclosure(false);
  const { handleError } = useNotification();
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [processing, setProcessing] = useState(false);

  const form = useForm({
    initialValues: newAdmin,
    validate: zodResolver(validateNewAdmin),
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
        { withCredentials: true }
      );

      revalidate();
      close();
      router.push("/admin/users");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const menuItems = [
    {
      text: "View",
      icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
      link: true,
      href: "/admin/businesses",
    },
    {
      text: "Delete",
      icon: <IconTrash style={{ width: rem(14), height: rem(14) }} />,
    },
  ];

  const rows = users.map((element, index) => (
    <TableTr key={index}>
      <TableTd className={styles.table__td}>
        <Checkbox />
      </TableTd>
      <TableTd className={styles.table__td}>{element.email}</TableTd>
      <TableTd
        className={styles.table__td}
      >{`${element.firstName} ${element.lastName}`}</TableTd>
      <TableTd className={styles.table__td}>{element.role}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}></TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          <IconPointFilled size={14} color="#12B76A" />
          <Text tt="capitalize" fz={12} c="#12B76A">
            Active
          </Text>
        </div>
      </TableTd>

      <TableTd className={`${styles.table__td}`}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDots size={17} />
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            {menuItems.map((items, index) => {
              if (items.link)
                return (
                  <Link key={index} href={`${items.href}/${element.id}`}>
                    <MenuItem
                      key={index}
                      fz={10}
                      c="#667085"
                      leftSection={items.icon}
                    >
                      {items.text}
                    </MenuItem>
                  </Link>
                );

              return (
                <MenuItem
                  key={index}
                  fz={10}
                  c="#667085"
                  leftSection={items.icon}
                >
                  {items.text}
                </MenuItem>
              );
            })}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Users", href: "/admin/users" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            All Users
          </Text>

          <Button
            onClick={open}
            leftSection={<IconPlus color="#344054" size={16} />}
            className={styles.login__cta}
            variant="filled"
            color="#D4F307"
          >
            Add New User
          </Button>
        </div>

        <div className={styles.container__search__filter}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            classNames={{ wrapper: styles.search, input: styles.input__search }}
          />

          <Button
            className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
          >
            <Text fz={12} fw={500}>
              Filter
            </Text>
          </Button>
        </div>

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>
                  <Checkbox />
                </TableTh>
                <TableTh className={styles.table__th}>Email Address</TableTh>
                <TableTh className={styles.table__th}>Name</TableTh>
                <TableTh className={styles.table__th}>Role</TableTh>
                <TableTh className={styles.table__th}>Date Added</TableTh>
                <TableTh className={styles.table__th}>Last Log in</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                <TableTh className={styles.table__th}>Action</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? AllBusinessSkeleton : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no users.
            </Text>
            <Text fz={10} c="#667085">
              When a user is added, they will appear here
            </Text>
          </Flex>
        )}

        <div className={styles.pagination__container}>
          <Text fz={14}>Rows: {rows.length}</Text>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>
      </div>

      <ModalComponent
        action={addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
      />
    </main>
  );
}
