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
} from "@mantine/core";
import styles from "@/ui/styles/settings.module.scss";
import { IconListTree, IconPointFilled, IconSearch } from "@tabler/icons-react";
import EmptyImage from "@/assets/empty.png";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton } from "@/lib/static";
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
      <TableTd className={styles.table__td}>
        <Checkbox />
      </TableTd>
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
      <div
        className={`${styles.container__search__filter} ${switzer.className}`}
      >
        <TextInput
          placeholder="Search here..."
          leftSectionPointerEvents="none"
          leftSection={searchIcon}
          classNames={{ wrapper: styles.search, input: styles.input__search }}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Button
          className={styles.filter__cta}
          rightSection={<IconListTree size={14} />}
          fz={12}
          fw={500}
          onClick={toggle}
        >
          Filter
        </Button>
      </div>

      <Filter opened={opened} toggle={toggle} form={form} isStatus />

      <TableScrollContainer minWidth={500}>
        <Table className={styles.table} verticalSpacing="md">
          <TableThead>
            <TableTr>
              <TableTh className={styles.table__th}>
                <Checkbox />
              </TableTh>
              <TableTh className={styles.table__th}>User</TableTh>
              <TableTh className={styles.table__th}>Email</TableTh>
              <TableTh className={styles.table__th}>Date & Time</TableTh>
              <TableTh className={styles.table__th}>Activity</TableTh>
              <TableTh className={styles.table__th}>IP Address</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{loading ? AllBusinessSkeleton : rows}</TableTbody>
        </Table>
      </TableScrollContainer>

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
        <Text fz={14}>Rows: {logs.length}</Text>
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
