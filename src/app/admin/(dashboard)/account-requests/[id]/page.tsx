"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.scss";
import {
  Button,
  Flex,
  Group,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
  Image,
  Badge,
  TableTd,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  rem,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconListTree,
  IconSearch,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import Filter from "@/ui/components/Filter";
import { useRequests } from "@/lib/hooks/requests";
import { Suspense, useState } from "react";
import dayjs from "dayjs";
import { DynamicSkeleton, DynamicSkeleton2 } from "@/lib/static";
import { filteredSearch } from "@/lib/search";
import { approvedBadgeColor } from "@/lib/utils";
import EmptyImage from "@/assets/empty.png";
import { TableComponent } from "@/ui/components/Table";
import { approveRequest, rejectRequest } from "@/lib/actions/account-requests";
import useNotification from "@/lib/hooks/notification";

function BusinessAccountRequests() {
  const params = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const {
    rows: limit = "10",
    status,
    createdAt,
    sort,
    type,
  } = Object.fromEntries(searchParams.entries());

  const { loading, requests } = useRequests({
    ...(isNaN(Number(limit)) ? { limit: 10 } : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type.toLowerCase() }),
  });

  const { back, push } = useRouter();

  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const handleRowClick = (id: string) => {
    push(`/admin/account-requests/${params.id}/${id}`);
  };

  const rows = filteredSearch(
    requests,
    ["firstName", "lastName", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd
        className={styles.table__td}
      >{`${element.firstName} ${element.lastName}`}</TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {element.accountType.toLowerCase()}
      </TableTd>
      {/* <TableTd className={styles.table__td}>{element.Company.country}</TableTd> */}
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={approvedBadgeColor(element.status)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>

      <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuComponent id={element.id} />
      </TableTd>
    </TableTr>
  ));

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Account Requests", href: "/admin/account-requests" },
          {
            title: "Business Name",
            href: `/admin/account-requests/${params.id}`,
          },
        ]}
      />

      <Paper p={28} className={styles.grid__container}>
        <Button
          fz={14}
          c="var(--prune-text-gray-500)"
          fw={400}
          px={0}
          variant="transparent"
          onClick={back}
          leftSection={
            <IconArrowLeft
              color="#1D2939"
              style={{ width: "70%", height: "70%" }}
            />
          }
          //   style={{ pointerEvents: !account ? "none" : "auto" }}
        >
          Back
        </Button>

        {/* {account?.accountName ? ( */}
        <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
          Tech Nova
          {/* {account?.accountName} */}
        </Text>
        {/* ) : (
          <Skeleton h={10} w={100} />
        )} */}

        <Group
          justify="space-between"
          align="center"
          mt={24}
          // className={styles.container__search__filter}
        >
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={<IconSearch style={{ width: 20, height: 20 }} />}
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            // value={search}
            // onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <Button
            variant="default"
            color="var(--prune-text-gray-500)"
            leftSection={<IconListTree size={14} />}
            fz={12}
            fw={500}
            onClick={toggle}
          >
            Filter
          </Button>
        </Group>

        <Filter<FilterType> opened={opened} form={form} toggle={toggle} />

        <TableComponent head={tableHeaders} rows={rows} loading={loading} />

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage.src} alt="no content" w={156} h={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no account requests.
            </Text>
            <Text fz={10} c="#667085">
              When a request is created, it will appear here
            </Text>
          </Flex>
        )}

        <div className={styles.pagination__container}>
          <Group gap={9}>
            <Text fz={14}>Showing:</Text>

            <Select
              data={["10", "20", "50", "100"]}
              defaultValue={"10"}
              w={60}
              // h={24}
              size="xs"
              withCheckIcon={false}
            />
          </Group>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>
      </Paper>
    </main>
  );
}

const tableHeaders = [
  "Account Name",
  "Type",
  // "Country",
  "Date Created",
  "Status",
  "Action",
];

export default function BusinessAccountRequestsSuspense() {
  return (
    <Suspense>
      <BusinessAccountRequests />
    </Suspense>
  );
}

const MenuComponent = ({ id }: { id: string }) => {
  const { handleError, handleSuccess } = useNotification();

  const handleApproval = async () => {
    const { success, message } = await approveRequest(id);

    if (success) return handleSuccess("Successful! Request Approved", message);
    return handleError("Error! Request Approval Failed", message);
  };

  const handleRejection = async () => {
    const { success, message } = await rejectRequest(id);

    if (success) return handleSuccess("Successful! Request Denied", message);
    return handleError("Error! Request Denials Failed", message);
  };

  return (
    <Menu shadow="md" width={150}>
      <MenuTarget>
        <UnstyledButton onClick={(e) => e.stopPropagation()}>
          <IconDotsVertical size={17} />
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          fz={10}
          c="#667085"
          leftSection={
            <IconUserCheck style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={handleApproval}
        >
          Approve
        </MenuItem>

        <MenuItem
          fz={10}
          c="#667085"
          leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}
          onClick={handleRejection}
        >
          Deny
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};
