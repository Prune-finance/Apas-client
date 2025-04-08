"use client";

import { Group, Skeleton, TableTd, TableTr, Text } from "@mantine/core";
import {
  IconListTree,
  IconPlus,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

import styles from "@/ui/styles/business.module.scss";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { filteredSearch } from "@/lib/search";

import { TableComponent } from "@/ui/components/Table";

import PaginationComponent from "@/ui/components/Pagination";
import {
  FilterSchema,
  FilterType,
  FilterValues,
  newAdmin,
  validateNewAdmin,
} from "@/lib/schema";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { BadgeComponent } from "@/ui/components/Badge";
import { useBusinessUsers } from "@/lib/hooks/admins";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import EmptyTable from "@/ui/components/EmptyTable";

import useNotification from "@/lib/hooks/notification";
import createAxiosInstance from "@/lib/axios";
import { parseError } from "@/lib/actions/auth";
import ModalComponent from "@/app/(dashboard)/users/modal";
import { calculateTotalPages, sanitizeURL } from "@/lib/utils";
import AddUserModal from "./AddUserModal";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";

export default function AllBusinessUsers() {
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const axios = createAxiosInstance("auth");

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [processing, setProcessing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, date, endDate, name, email } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    status: status
      ? status.toUpperCase() === "PENDING"
        ? "INVITE_PENDING"
        : status.toUpperCase()
      : "",
    email,
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedSearch,
  };

  const { loading, users, meta, revalidate } = useBusinessUsers(
    queryParams,
    id
  );

  const { business, loading: loadingBiz } = useSingleBusiness(id);

  const [opened, { toggle }] = useDisclosure(false);
  const [openedModal, { open, close }] = useDisclosure(false);

  const { push } = useRouter();
  const { handleError, handleSuccess } = useNotification();
  usePaginationReset({ queryParams, setActive });

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const new_form = useForm<typeof newAdmin>({
    initialValues: newAdmin,
    validate: zodResolver(validateNewAdmin),
  });

  const addBusinessUser = async () => {
    setProcessing(true);

    try {
      const { hasErrors, errors } = form.validate();
      if (hasErrors) {
        return;
      }

      const { email } = new_form.values;

      await axios.post(`/admin/company/${id}/users/add`, { email });

      revalidate();
      close();
      handleSuccess(
        `Successful! User Added`,
        `User added to ${business?.name} successfully`
      );
      // router.push("/admin/users");
      new_form.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleRowClick = (userId: string) => {
    push(`/admin/users/${id}/business/${userId}`);
  };

  const rows = users.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="lowercase" style={{ wordBreak: "break-word" }} w="20%">
        {element.email}
      </TableTd>

      <TableTd>{"User"}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd>
        {element.lastLogin ? dayjs(element.lastLogin).fromNow() : "Nil"}
      </TableTd>

      <TableTd>
        <BadgeComponent
          status={
            element.status === "INVITE_PENDING" ? "PENDING" : element.status
          }
          active
        />
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "User Management", href: "/admin/users?tab=Business Users" },

          {
            title: `${business?.name}`,
            href: `/admin/users/${id}/business`,
            loading: loadingBiz,
          },
        ]}
      />

      <Group gap={8} mt={25}>
        {business?.kycTrusted && (
          <IconRosetteDiscountCheckFilled
            size={25}
            color="var(--prune-primary-700)"
          />
        )}
        {business ? (
          <Text fz={18} fw={600}>
            {business.name}
          </Text>
        ) : (
          <Skeleton h={10} w={100} />
        )}

        {business ? (
          <BadgeComponent status={business.companyStatus} active />
        ) : (
          <Skeleton h={10} w={100} />
        )}
      </Group>

      <Group justify="space-between" mt={32} className={switzer.className}>
        <SearchInput search={search} setSearch={setSearch} />

        <Group>
          <SecondaryBtn
            text="Filter"
            icon={IconListTree}
            action={toggle}
            fw={600}
          />

          <PrimaryBtn
            text="Add New User"
            fw={600}
            icon={IconPlus}
            action={open}
          />
        </Group>
      </Group>

      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        customStatusOption={["Active", "Inactive", "Pending"]}
      >
        {/* <TextBox placeholder="Business" {...form.getInputProps("name")} /> */}

        <TextBox placeholder="Email" {...form.getInputProps("email")} />
      </Filter>

      <TableComponent
        head={tableHeaders}
        rows={rows}
        loading={loading}
        // layout="auto"
      />

      <EmptyTable
        title="There are no users for this business."
        text="When a user is added, it will appear here"
        loading={loading}
        rows={rows}
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total)}
      />

      <AddUserModal
        action={addBusinessUser}
        processing={processing}
        opened={openedModal}
        close={close}
        form={new_form}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        text={`Invite user to collaborate with ${business?.name}`}
      />
    </main>
  );
}

const tableHeaders = [
  "Email",
  "Role",
  "Date Created",
  "Last Active",
  "Status",
  // "Action",
];
