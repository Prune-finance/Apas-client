import { AgGridReact } from "ag-grid-react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import {
  Text,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  UnstyledButton,
  rem,
  Flex,
  Box,
  Paper,
} from "@mantine/core";
import {
  IconBrandLinktree,
  IconDots,
  IconEye,
  IconPointFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import localFont from "next/font/local";
import axios from "axios";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState, useEffect, useMemo } from "react";
import { AccountData } from "@/lib/hooks/accounts";
import { CardOne } from "@/ui/components/Cards";
import { formatNumber } from "@/lib/utils";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

const switzer = localFont({
  src: "../../../../../../assets/fonts/Switzer-Regular.woff2",
});

export default function Accounts({
  business,
}: {
  business: BusinessData | null;
}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const { handleError } = useNotification();

  const CustomButtonComponent = (props: any) => {
    return (
      <div className={styles.table__td__container}>
        <div className={styles.table__td__status}>
          <IconPointFilled size={14} color="#12B76A" />
          <Text tt="capitalize" fz={12} c="#12B76A">
            {props.value}
          </Text>
        </div>
      </div>
    );
  };

  const MenuComponent = (props: any) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <Link
            href={`/admin/businesses/accounts/${props.data["ACCOUNT NUMBER"]}`}
          >
            <MenuItem
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
          </Link>

          <MenuItem
            fz={10}
            c="#667085"
            leftSection={
              <IconBrandLinktree
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Freeze
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  const rowData = useMemo(() => {
    return accounts.map((account) => {
      return {
        "ACCOUNT NAME": account.accountName.toUpperCase(),
        "ACCOUNT NUMBER": account.accountNumber,
        "ACCOUNT BALANCE": account.accountBalance,
        TYPE: account.type.toUpperCase(),
        BUSINESS: account.Company.name.toUpperCase(),
        "DATE CREATED": account.createdAt,
        STATUS: "Active",
        ACTION: "",
      };
    });
  }, [accounts]);

  const colDefs = [
    {
      field: "ACCOUNT NAME",
      filter: true,
      floatingFilter: true,
      checkboxSelection: true,
    },
    {
      field: "ACCOUNT NUMBER",
      filter: true,
      floatingFilter: true,
      cellStyle: { color: "#667085" },
    },
    { field: "ACCOUNT BALANCE", filter: true, floatingFilter: true },
    { field: "TYPE", filter: true, floatingFilter: true },
    {
      field: "BUSINESS",
      filter: true,
      floatingFilter: true,
      cellStyle: { color: "#667085" },
    },
    {
      field: "DATE CREATED",
      filter: true,
      floatingFilter: true,
      cellStyle: { color: "#667085" },
    },
    {
      field: "STATUS",
      cellRenderer: CustomButtonComponent,
    },
    {
      field: "ACTION",
      cellRenderer: MenuComponent,
    },
  ];

  const fetchCompanyAccounts = async () => {
    if (!business) return;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/company/${business?.id}/accounts`,
        { withCredentials: true }
      );

      setAccounts(data.data);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  useEffect(() => {
    fetchCompanyAccounts();
  }, [business]);

  return (
    <Box>
      <Flex gap={20} my={24}>
        <CardOne
          flex={1}
          title="Total Balance"
          stat={0}
          formatted
          colored
          withBorder
          text={
            <Text fz={10}>
              This shows the total balance of all the accounts under this
              business
            </Text>
          }
        />

        <CardOne
          flex={1}
          title="Total Inflow"
          stat={0}
          formatted
          withBorder
          text={
            <Text fz={10}>
              This shows the total inflow amount of all the accounts under this
              business.
            </Text>
          }
        />

        <CardOne
          flex={1}
          title="Total Outflow"
          stat={0}
          formatted
          withBorder
          text={
            <Text fz={10}>
              This shows the total outflow amount of all the accounts under this
              business.
            </Text>
          }
        />
      </Flex>

      <Paper withBorder>
        <div
          className={`${switzer.className} ${styles.accounts___container} ag-theme-quartz`}
          style={{ height: 500 }}
        >
          <Text fz={14} fw={500} mx={20} mb={24}>
            All Accounts
          </Text>

          <AgGridReact
            rowData={rowData}
            // @ts-ignore
            columnDefs={colDefs}
          />
        </div>
      </Paper>
    </Box>
  );
}
