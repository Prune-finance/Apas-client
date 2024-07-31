import Image from "next/image";
import {
  Text,
  Flex,
  Button,
  TextInput,
  TableScrollContainer,
  Table,
  TableTh,
  TableThead,
  TableTr,
  Pagination,
  TableTbody,
  Checkbox,
  TableTd,
  Group,
  Select,
} from "@mantine/core";
import styles from "@/ui/styles/settings.module.scss";
import {
  IconCalendar,
  IconCircleArrowDown,
  IconListTree,
  IconPointFilled,
  IconSearch,
} from "@tabler/icons-react";
import EmptyImage from "@/assets/empty.png";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton, DynamicSkeleton2 } from "@/lib/static";
import { useBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
import { Fragment, Suspense, useState } from "react";
import { useLogs } from "@/lib/hooks/logs";
import dayjs from "dayjs";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";
import { logFilterSchema, LogFilterType, logFilterValues } from "../schema";
import { useSearchParams } from "next/navigation";
import { filteredSearch } from "@/lib/search";
import { table } from "console";
import { TableComponent } from "@/ui/components/Table";
import { DateInput } from "@mantine/dates";

function Logs() {
  const searchParams = useSearchParams();

  const {
    rows: limit = "10",
    createdAt,
    sort,
  } = Object.fromEntries(searchParams.entries());

  const { loading, logs } = useLogs({
    ...(isNaN(Number(limit)) ? { limit: 10 } : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(sort && { sort: sort.toLowerCase() }),
  });
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [opened, { toggle }] = useDisclosure(false);

  const rows = filteredSearch(
    logs,
    ["admin.lastName", "admin.firstName", "admin.email", "activity", "ip"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr key={index}>
      <TableTd
        className={styles.table__td}
      >{`${element.admin.firstName} ${element.admin.lastName}`}</TableTd>
      <TableTd className={styles.table__td}>{element.admin.email}</TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY. hh:mm a")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>{element.activity}</TableTd>
      <TableTd className={`${styles.table__td}`}>{element.ip}</TableTd>
    </TableTr>
  ));

  const form = useForm<LogFilterType>({
    initialValues: logFilterValues,
    validate: zodResolver(logFilterSchema),
  });

  return (
    <Fragment>
      <Group
        justify="space-between"
        mt={30}
        className={` ${switzer.className}`}
      >
        <TextInput
          placeholder="Search here..."
          leftSectionPointerEvents="none"
          leftSection={searchIcon}
          // classNames={{ wrapper: styles.search, input: styles.input__search }}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={324}
          styles={{ input: { border: "1px solid #F5F5F5" } }}
        />

        <Group>
          <DateInput
            placeholder="Date"
            rightSection={<IconCalendar size={14} />}
            {...form.getInputProps("createdAt")}
            clearable
            // w={324}
            styles={{ input: { border: "1px solid #F5F5F5" } }}
          />

          <Button
            fz={12}
            fw={500}
            // w={99}
            onClick={toggle}
            variant="outline"
            color="var(--prune-text-gray-200)"
            c="var(--prune-text-gray-800)"
            leftSection={<IconCircleArrowDown size={14} />}
          >
            Download Log
          </Button>
        </Group>
      </Group>

      {/* <Filter opened={opened} toggle={toggle} form={form} isStatus /> */}

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      {!loading && !!!rows.length && (
        <Flex direction="column" align="center" mt={70}>
          <Image src={EmptyImage} alt="no content" width={156} height={120} />
          <Text mt={14} fz={14} c="#1D2939">
            There are no audit logs.
          </Text>
          <Text fz={10} c="#667085">
            When an entry is recorded, it will appear here
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
    </Fragment>
  );
}

export default function LogsSuspense() {
  return (
    <Suspense>
      <Logs />
    </Suspense>
  );
}

const tableHeaders = ["User", "Email", "Date & Time", "Activity", "IP Address"];
