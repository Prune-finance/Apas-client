import { Button, TextInput, TableTr, TableTd, Group } from "@mantine/core";
import styles from "@/ui/styles/settings.module.scss";
import {
  IconCalendar,
  IconCircleArrowDown,
  IconSearch,
} from "@tabler/icons-react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Fragment, Suspense, useState } from "react";
import { LogData, useLogs } from "@/lib/hooks/logs";
import dayjs from "dayjs";
import { useForm, zodResolver } from "@mantine/form";
import { logFilterSchema, LogFilterType, logFilterValues } from "../schema";
import { useSearchParams } from "next/navigation";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import { DateInput } from "@mantine/dates";
import PaginationComponent from "@/ui/components/Pagination";
import EmptyTable from "@/ui/components/EmptyTable";
import Cookies from "js-cookie";
import axios from "axios";
import * as XLSX from "xlsx";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { switzer } from "@/ui/fonts";

function Logs() {
  const searchParams = useSearchParams();

  const {
    rows: _limit = "10",
    createdAt,
    sort,
  } = Object.fromEntries(searchParams.entries());

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [processingCSV, setProcessingCSV] = useState(false);

  const { handleError } = useNotification();

  const { loading, logs, meta } = useLogs({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
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

  const fetchLogs = async (limit: number) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/logs/all?limit=${limit}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const handleExportCsv = async () => {
    setProcessingCSV(true);
    // fetch data
    try {
      const response = await fetchLogs(meta?.total ?? 0);

      const data = response.map((log: LogData) => ({
        User: `${log.admin.firstName} ${log.admin.lastName}`,
        Email: log.admin.email,
        "Date & Time": dayjs(log.createdAt).format("ddd DD MMM YYYY"),
        Activity: log.activity,
        "IP Address": log.ip,
      }));

      //convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      //convert worksheet to CSV
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      //download CSV
      const downloadCSV = async (csvData: string) => {
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `audit-logs-${Math.floor(Date.now() / 1000)
            .toString(36)
            .substring(2, 15)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      await downloadCSV(csv);
    } catch (err) {
      handleError("An error occurred", parseError(err));
    } finally {
      setProcessingCSV(false);
    }
  };

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

          {/* <Button
            fz={12}
            fw={500}
            // w={99}
            onClick={toggle}
            variant="outline"
            color="var(--prune-text-gray-200)"
            c="var(--prune-text-gray-800)"
            leftSection={<IconCircleArrowDown size={14} />}
            loading={processingCSV}
          >
            Download Log
          </Button> */}
          <SecondaryBtn
            action={handleExportCsv}
            loading={processingCSV}
            icon={IconCircleArrowDown}
            fw={600}
            text="Download Log"
          />
        </Group>
      </Group>

      {/* <Filter opened={opened} toggle={toggle} form={form} isStatus /> */}

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no audit logs"
        text="When an entry is recorded, it will appear here."
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil((meta?.total ?? 1) / parseInt(limit ?? "10", 10))}
      />
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
